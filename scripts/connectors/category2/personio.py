"""
Personio Public XML Feed Connector (Category 2 - ATS API).
=========================================================
Parses official XML feeds hosted by Personio:
https://{company}.jobs.personio.de/xml
Provides structured positions with full descriptions, departments,
and direct application URLs.
Configured for:
- OroraTech ('ororatech')
"""

import sys
import xml.etree.ElementTree as ET
from ..base import BaseConnector, is_canonical_url, matches_profile_strictly, clean_html

PERSONIO_COMPANIES = [
    {
        "company_id": "ororatech",
        "company_name": "OroraTech GmbH",
        "default_country": "Alemania (Múnich)",
        "source_id": "src-ororatech-personio"
    }
]


class PersonioConnector(BaseConnector):
    name = "Personio ATS Feed"
    category = "Category 2 - ATS API"

    def scrape(self) -> list:
        offers = []

        for comp in PERSONIO_COMPANIES:
            cid = comp["company_id"]
            company = comp["company_name"]
            url = f"https://{cid}.jobs.personio.de/xml"

            try:
                xml_data = self.fetch_url(url)
                root = ET.fromstring(xml_data)
                positions = root.findall(".//position")

                for pos in positions:
                    pos_id = pos.findtext("id", "")
                    title = pos.findtext("name", "")
                    office = pos.findtext("office", "")
                    dept = pos.findtext("department", "")

                    # Description can be aggregated from jobDescriptions
                    desc_parts = []
                    for desc in pos.findall(".//jobDescription"):
                        name = desc.findtext("name", "")
                        val = desc.findtext("value", "")
                        if val:
                            desc_parts.append(f"{name}: {val}")
                    full_desc = "\n".join(desc_parts)
                    clean_desc = clean_html(full_desc)

                    job_url = f"https://{cid}.jobs.personio.de/job/{pos_id}"
                    if not is_canonical_url(job_url):
                        continue

                    location_name = office or comp["default_country"]
                    tags = [dept] if dept else []

                    is_match, matched_kws = matches_profile_strictly(title, clean_desc, tags)
                    if not is_match:
                        continue

                    is_remote = any(r in location_name.lower() for r in ["remote", "remoto", "home office"])

                    offers.append(self.build_job_dict(
                        job_id=f"personio-{cid}-{pos_id}",
                        title=title,
                        company=company,
                        location=location_name,
                        country="Alemania" if "munich" in location_name.lower() or "münchen" in location_name.lower() else comp["default_country"],
                        url=job_url,
                        source_id=comp["source_id"],
                        source_name=f"{company} (Personio XML)",
                        published_date="",
                        raw_description=clean_desc,
                        matched_keywords=matched_kws,
                        requirements=tags,
                        is_remote=is_remote
                    ))

            except Exception as e:
                print(f"[!] Personio feed error for {company} ({cid}): {e}", file=sys.stderr)

        return offers
