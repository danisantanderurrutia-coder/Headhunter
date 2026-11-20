"""
Greenhouse Public API Connector (Category 2 - ATS API).
======================================================
Connects directly to Greenhouse's official public board API:
https://boards-api.greenhouse.io/v1/boards/{board_token}/jobs?content=true
Retrieves structured JSON postings with zero bot blocks or DOM scraping.
Configured for:
- Planet Labs ('planetlabs')
- ConstellR ('constellrgmbh')
"""

import sys
from ..base import BaseConnector, is_canonical_url, matches_profile_strictly, clean_html

GREENHOUSE_COMPANIES = [
    {
        "board_token": "planetlabs",
        "company_name": "Planet Labs PBC",
        "default_country": "Alemania / EE.UU. / Remoto",
        "source_id": "src-planet-greenhouse"
    },
    {
        "board_token": "constellrgmbh",
        "company_name": "ConstellR GmbH",
        "default_country": "Alemania / Bélgica",
        "source_id": "src-constellr-greenhouse"
    }
]


class GreenhouseConnector(BaseConnector):
    name = "Greenhouse ATS API"
    category = "Category 2 - ATS API"

    def scrape(self) -> list:
        offers = []

        for comp in GREENHOUSE_COMPANIES:
            token = comp["board_token"]
            company = comp["company_name"]
            url = f"https://boards-api.greenhouse.io/v1/boards/{token}/jobs?content=true"

            try:
                data = self.fetch_json(url)
                jobs = data.get("jobs", [])

                for j in jobs:
                    title = j.get("title", "")
                    job_url = j.get("absolute_url", "")
                    if not is_canonical_url(job_url):
                        continue

                    location_info = j.get("location", {})
                    location_name = location_info.get("name") if isinstance(location_info, dict) else str(location_info)
                    location_name = location_name or comp["default_country"]

                    desc_html = j.get("content", "")
                    desc_clean = clean_html(desc_html)

                    # Departments and tags
                    dept_names = [d.get("name", "") for d in j.get("departments", []) if d.get("name")]

                    is_match, matched_kws = matches_profile_strictly(title, desc_clean, dept_names)
                    if not is_match:
                        continue

                    job_id = f"gh-{token}-{j.get('id', hash(job_url))}"
                    is_remote = any(r in location_name.lower() for r in ["remote", "remoto", "anywhere"])

                    offers.append(self.build_job_dict(
                        job_id=job_id,
                        title=title,
                        company=company,
                        location=location_name,
                        country="Alemania" if "germany" in location_name.lower() or "berlin" in location_name.lower() or "munich" in location_name.lower() else comp["default_country"],
                        url=job_url,
                        source_id=comp["source_id"],
                        source_name=f"{company} (Greenhouse API)",
                        published_date=(j.get("updated_at") or "").split("T")[0],
                        raw_description=desc_clean,
                        matched_keywords=matched_kws,
                        requirements=dept_names,
                        is_remote=is_remote
                    ))

            except Exception as e:
                print(f"[!] Greenhouse API error for {company} ({token}): {e}", file=sys.stderr)

        return offers
