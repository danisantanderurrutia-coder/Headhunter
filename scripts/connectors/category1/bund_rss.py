"""
German Federal Public Service RSS Feed Connector (Category 1).
============================================================
Direct XML RSS parser for service.bund.de / interamt.de:
https://www.service.bund.de/Content/Globals/Functions/RSSFeed/RSSGenerator_Stellen.xml
Integrates national research and environmental authorities in Germany:
- Johann Heinrich von Thünen-Institut (Agrarklimaschutz, Waldökosysteme)
- Umweltbundesamt (UBA - Dessau, Berlin, Leipzig)
- Bundesamt für Naturschutz (BfN)
- Julius Kühn-Institut (JKI)
- Helmholtz & Leibniz centers with federal job announcements (GFZ, PIK, etc.)
"""

import re
import xml.etree.ElementTree as ET
from ..base import BaseConnector, is_canonical_url, matches_profile_strictly, clean_html, is_deadline_expired

HIGH_PRIORITY_EMPLOYERS = [
    "thünen", "thuenen", "umweltbundesamt", "uba", "bundesamt für naturschutz", "bfn",
    "julius kühn", "agrarklimaschutz", "helmholtz", "leibniz", "geoforschungszentrum",
    "pik", "potsdam-institut", "bgr", "dwd"
]


def extract_field_from_desc(desc: str, label: str) -> str:
    """Extract structured fields like 'Arbeitgeber:', 'Ort:', 'Bewerbungsfrist:'."""
    pattern = rf"{label}\s*:\s*<strong>([^<]+)</strong>"
    m = re.search(pattern, desc, re.IGNORECASE)
    if m:
        return m.group(1).strip()
    return ""


class BundRssConnector(BaseConnector):
    name = "German Federal Sector (service.bund.de)"
    category = "Category 1 - RSS XML"
    URL = "https://www.service.bund.de/Content/Globals/Functions/RSSFeed/RSSGenerator_Stellen.xml"

    def scrape(self) -> list:
        offers = []
        try:
            xml_data = self.fetch_url(self.URL)
            root = ET.fromstring(xml_data)
            items = root.findall(".//item")

            for item in items:
                title = (item.find("title").text or "").strip()
                desc = (item.find("description").text or "").strip()
                link = (item.find("link").text or "").strip()
                pub_date = (item.find("pubDate").text or "").strip()

                if not is_canonical_url(link) or len(title) < 5:
                    continue

                employer = extract_field_from_desc(desc, "Arbeitgeber")
                location = extract_field_from_desc(desc, "Ort")
                deadline = extract_field_from_desc(desc, "Bewerbungsfrist")

                # Discard offers with expired application deadline
                if deadline and is_deadline_expired(deadline):
                    continue

                full_text = f"{title} {desc} {employer} {location}"
                is_high_pri = any(emp in full_text.lower() for emp in HIGH_PRIORITY_EMPLOYERS)

                is_match, matched_kws = matches_profile_strictly(title, full_text)
                if not (is_match or is_high_pri):
                    continue

                # Parse publication date if possible
                clean_pub_date = pub_date[:16] if pub_date else ""

                # Extract id from link or title
                job_id_match = re.search(r"id=(\d+)", link) or re.search(r"/stelle/(\d+)", link)
                id_slug = job_id_match.group(1) if job_id_match else str(hash(link))

                company_name = employer or "Sector Público Federal / Investigación Alemania"

                offers.append(self.build_job_dict(
                    job_id=f"bund-{id_slug}",
                    title=title,
                    company=company_name,
                    location=location or "Alemania",
                    country="Alemania",
                    url=link,
                    source_id="src-bund-rss",
                    source_name="service.bund.de (Sector Público Alemán)",
                    published_date=clean_pub_date,
                    raw_description=clean_html(desc),
                    matched_keywords=matched_kws or ["bund-priority-agency"],
                    requirements=["Tarifvertrag des öffentlichen Dienstes (TVöD Bund / TV-L)", "Bewerbung über interamt.de / service.bund.de"],
                    salary="TVöD Bund / TV-L (E13 / E14)",
                    deadline=deadline or "Consultar bases de la convocatoria"
                ))

        except Exception as e:
            print(f"[!] Error parsing service.bund.de RSS: {e}")

        return offers
