"""
Workable Public Widget API Connector (Category 2 - ATS API).
===========================================================
Retrieves active postings from Workable's public widget API:
https://apply.workable.com/api/v1/widget/accounts/{company}
Delivers structured jobs with department, city, and shortcode.
Configured for:
- Mitiga Solutions ('mitiga-solutions')
"""

import sys
from ..base import BaseConnector, is_canonical_url, matches_profile_strictly, clean_html

WORKABLE_COMPANIES = [
    {
        "account": "mitiga-solutions",
        "company_name": "Mitiga Solutions",
        "default_country": "España (Barcelona) / Remoto",
        "source_id": "src-mitiga-workable"
    }
]


class WorkableConnector(BaseConnector):
    name = "Workable ATS API"
    category = "Category 2 - ATS API"

    def scrape(self) -> list:
        offers = []

        for comp in WORKABLE_COMPANIES:
            account = comp["account"]
            company = comp["company_name"]
            url = f"https://apply.workable.com/api/v1/widget/accounts/{account}"

            try:
                data = self.fetch_json(url)
                jobs = data.get("jobs", [])

                for j in jobs:
                    title = j.get("title", "")
                    shortcode = j.get("shortcode", "")
                    job_url = j.get("url") or f"https://apply.workable.com/{account}/j/{shortcode}/"

                    if not is_canonical_url(job_url):
                        continue

                    city = j.get("city", "")
                    country = j.get("country", "")
                    dept = j.get("department", "")
                    desc_html = j.get("description", "")
                    clean_desc = clean_html(desc_html)

                    location_name = f"{city}, {country}".strip(", ") or comp["default_country"]
                    tags = [dept] if dept else []

                    is_match, matched_kws = matches_profile_strictly(title, clean_desc, tags)
                    if not is_match:
                        continue

                    is_remote = bool(j.get("telecommuting")) or ("remote" in location_name.lower())

                    offers.append(self.build_job_dict(
                        job_id=f"workable-{account}-{shortcode}",
                        title=title,
                        company=company,
                        location=location_name,
                        country="España" if "spain" in country.lower() or "barcelona" in location_name.lower() else comp["default_country"],
                        url=job_url,
                        source_id=comp["source_id"],
                        source_name=f"{company} (Workable API)",
                        published_date="",
                        raw_description=clean_desc,
                        matched_keywords=matched_kws,
                        requirements=tags,
                        is_remote=is_remote
                    ))

            except Exception as e:
                print(f"[!] Workable API error for {company} ({account}): {e}", file=sys.stderr)

        return offers
