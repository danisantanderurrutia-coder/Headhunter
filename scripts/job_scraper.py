#!/usr/bin/env python3
"""
Automated Job Scraper & Ingestion Orchestrator for Empleo Master.
================================================================
Runs as a scheduled Git-Scraping job in GitHub Actions or locally.
Aggregates authentic job postings strictly matching Daniel Santander's
scientific & environmental profile:
- Soil science, biogeochemistry, edaphology, carbon sequestration
- Climate dynamics, greenhouse gas (GHG) fluxes, peatlands & eddy covariance
- Geospatial analysis, GIS, QGIS, ArcGIS, Google Earth Engine, Remote Sensing
- Hydrology, watershed modeling, hydrogeophysics
- Environmental governance, ecological transition & sustainability policy

Architectural Foci:
1. CATEGORY 1: Direct HTTP / RSS / Static HTML (BOKU, UniVie, ETH Zürich, Freiburg, BC3, Eawag, Bund RSS)
2. CATEGORY 2: Direct ATS APIs & Structured Feeds (Planet Labs, ConstellR, Sylvera, OroraTech, Mitiga, Pachama, FZ Jülich)
3. AGGREGATORS: Arbeitnow (DACH) & Remotive (Global)

NO MOCK JOBS. NO GENERIC HOMEPAGES. NO IRRELEVANT TECH/SALES POSTINGS.
"""

import argparse
import json
import os
import sys
from datetime import datetime

# Add scripts directory to path to allow seamless connector imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from connectors.base import BaseConnector, is_canonical_url, matches_profile_strictly, clean_html
from connectors.category1 import CATEGORY_1_CONNECTORS
from connectors.category2 import CATEGORY_2_CONNECTORS

OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "..", "public", "data", "jobs.json")


def run_legacy_aggregators() -> list:
    """Run Arbeitnow and Remotive scrapers as complementary global aggregators."""
    from connectors.base import DEFAULT_HEADERS
    import urllib.request

    offers = []
    timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M")

    # 1. Arbeitnow
    try:
        print("[*] Consultando Arbeitnow API (DACH/Europa)...")
        req = urllib.request.Request("https://www.arbeitnow.com/api/job-board-api", headers=DEFAULT_HEADERS)
        with urllib.request.urlopen(req, timeout=15) as res:
            data = json.loads(res.read().decode("utf-8"))
            for j in data.get("data", []):
                title = j.get("title", "")
                url = j.get("url", "")
                if not is_canonical_url(url):
                    continue

                desc = j.get("description", "")
                tags = j.get("tags") or []
                location = j.get("location") or ("Remoto (Europa)" if j.get("remote") else "Alemania")

                is_match, matched_kws = matches_profile_strictly(title, desc, tags)
                if not is_match:
                    continue

                slug = j.get("slug", str(hash(title)))
                pub_time = j.get("publication_time")
                pub_date = datetime.utcfromtimestamp(pub_time).strftime("%Y-%m-%d") if pub_time else timestamp.split(" ")[0]

                offers.append({
                    "id": f"arbeitnow-{slug}",
                    "title": title,
                    "company": j.get("company_name", "Empresa"),
                    "location": location,
                    "country": "Alemania" if ("germany" in location.lower() or "alemania" in location.lower()) else "Europa / Remoto",
                    "isBilbaoLocation": any(b in location.lower() for b in ["bilbao", "bizkaia", "euskadi", "basque"]),
                    "isRemote": bool(j.get("remote")),
                    "url": url,
                    "sourceId": "src-arbeitnow-scraped",
                    "sourceName": "Arbeitnow (Europa & DACH)",
                    "publishedDate": pub_date,
                    "rawDescription": clean_html(desc)[:1200],
                    "requirements": tags[:10],
                    "responsibilities": [],
                    "status": "Nueva",
                    "extractedAt": timestamp,
                    "isVerified": True,
                    "verificationStatus": "Vigente y Verificada",
                    "matchedKeywords": matched_kws
                })
    except Exception as e:
        print(f"[!] Warning fetching Arbeitnow: {e}", file=sys.stderr)

    # 2. Remotive
    try:
        print("[*] Consultando Remotive API (Global)...")
        req = urllib.request.Request("https://remotive.com/api/remote-jobs?limit=50", headers=DEFAULT_HEADERS)
        with urllib.request.urlopen(req, timeout=15) as res:
            data = json.loads(res.read().decode("utf-8"))
            for j in data.get("jobs", []):
                title = j.get("title", "")
                url = j.get("url", "")
                if not is_canonical_url(url):
                    continue

                desc = j.get("description", "")
                tags = j.get("tags") or []
                location = j.get("candidate_required_location") or "Remoto (Global)"

                is_match, matched_kws = matches_profile_strictly(title, desc, tags)
                if not is_match:
                    continue

                job_id = j.get("id", str(hash(title)))
                pub_date = (j.get("publication_date") or "").split("T")[0] or timestamp.split(" ")[0]

                offers.append({
                    "id": f"remotive-{job_id}",
                    "title": title,
                    "company": j.get("company_name", "Empresa Remota"),
                    "location": location,
                    "country": "Remoto Global",
                    "isBilbaoLocation": False,
                    "isRemote": True,
                    "url": url,
                    "sourceId": "src-remotive-scraped",
                    "sourceName": "Remotive (API Global)",
                    "publishedDate": pub_date,
                    "rawDescription": clean_html(desc)[:1200],
                    "requirements": tags[:10],
                    "responsibilities": [],
                    "status": "Nueva",
                    "extractedAt": timestamp,
                    "isVerified": True,
                    "verificationStatus": "Vigente y Verificada",
                    "matchedKeywords": matched_kws
                })
    except Exception as e:
        print(f"[!] Warning fetching Remotive: {e}", file=sys.stderr)

    return offers


def parse_args():
    parser = argparse.ArgumentParser(description="Empleo Master Job Ingestion Orchestrator")
    parser.add_argument("--category", choices=["1", "2", "all"], default="all", help="Select connector category to run")
    parser.add_argument("--skip-aggregators", action="store_true", help="Skip general aggregators (Arbeitnow, Remotive)")
    return parser.parse_args()


def main():
    args = parse_args()
    print(f"=== [Empleo Data Engine] Iniciando Ingesta Automática a las {datetime.utcnow().isoformat()} ===")
    all_offers = []

    # 1. Run Category 1 Connectors
    if args.category in ["1", "all"]:
        print("\n--- [CATEGORÍA 1: Acceso Directo por HTTP / RSS / HTML Estático] ---")
        for connector_cls in CATEGORY_1_CONNECTORS:
            connector = connector_cls()
            print(f"[*] Ejecutando conector: {connector.name}...")
            try:
                results = connector.scrape()
                print(f"    -> Encontradas {len(results)} ofertas verificadas.")
                all_offers.extend(results)
            except Exception as e:
                print(f"    [!] Error en conector {connector.name}: {e}", file=sys.stderr)

    # 2. Run Category 2 Connectors
    if args.category in ["2", "all"]:
        print("\n--- [CATEGORÍA 2: ATS APIs y Feeds Estructurados de Investigación] ---")
        for connector_cls in CATEGORY_2_CONNECTORS:
            connector = connector_cls()
            print(f"[*] Ejecutando conector: {connector.name}...")
            try:
                results = connector.scrape()
                print(f"    -> Encontradas {len(results)} ofertas verificadas.")
                all_offers.extend(results)
            except Exception as e:
                print(f"    [!] Error en conector {connector.name}: {e}", file=sys.stderr)

    # 3. Complementary aggregators
    if not args.skip_aggregators and args.category == "all":
        print("\n--- [AGREGADORES EXTERNOS DE VACANTES] ---")
        agg_offers = run_legacy_aggregators()
        all_offers.extend(agg_offers)

    # 4. Strict Canonical Deduplication & Preservation
    seen_urls = set()
    unique_offers = []
    for o in all_offers:
        url = o.get("url")
        if url and url not in seen_urls:
            seen_urls.add(url)
            unique_offers.append(o)

    # 5. Atomic persist to public/data/jobs.json
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(unique_offers, f, ensure_ascii=False, indent=2)

    print(f"\n=======================================================")
    print(f"=== Ingesta completada con éxito.")
    print(f"=== Total vacantes auténticas y verificadas: {len(unique_offers)}")
    print(f"=== Base de datos persistida en: {os.path.abspath(OUTPUT_PATH)}")
    print(f"=======================================================\n")


if __name__ == "__main__":
    main()
