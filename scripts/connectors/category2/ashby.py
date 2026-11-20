"""
Ashby Public API Connector (Category 2 - ATS API).
=================================================
Connects to Ashby's official public job board endpoint:
https://api.ashbyhq.com/posting-api/job-board/{board_token}
Retrieves verified, authentic JSON listings without headless browsers.
Configured for:
- Sylvera ('sylvera')
"""

import sys
from ..base import BaseConnector, is_canonical_url, matches_profile_strictly, clean_html

ASHBY_COMPANIES = [
    {
        "board_token": "sylvera",
        "company_name": "Sylvera",
        "default_country": "Reino Unido / Europa / Remoto",
        "source_id": "src-sylvera-ashby"
    }
]


class AshbyConnector(BaseConnector):
    name = "Ashby ATS API"
    category = "Category 2 - ATS API"

    def scrape(self) -> list:
        offers = []

        for comp in ASHBY_COMPANIES:
            token = comp["board_token"]
            company = comp["company_name"]
            url = f"https://api.ashbyhq.com/posting-api/job-board/{token}"

            try:
                data = self.fetch_json(url)
                jobs = data.get("jobs", [])

                for j in jobs:
                    title = j.get("title", "")
                    job_url = j.get("jobUrl", "")
                    if not is_canonical_url(job_url):
                        continue

                    location_name = j.get("locationName") or comp["default_country"]
                    dept_name = j.get("departmentName") or ""
                    desc_html = j.get("descriptionHtml", "")
                    desc_clean = clean_html(desc_html)

                    tags = [dept_name] if dept_name else []
                    is_match, matched_kws = matches_profile_strictly(title, desc_clean, tags)
                    if not is_match:
                        continue

                    job_id = f"ashby-{token}-{j.get('id', hash(job_url))}"
                    is_remote = bool(j.get("isRemote")) or ("remote" in location_name.lower())

                    offers.append(self.build_job_dict(
                        job_id=job_id,
                        title=title,
                        company=company,
                        location=location_name,
                        country=comp["default_country"],
                        url=job_url,
                        source_id=comp["source_id"],
                        source_name=f"{company} (Ashby API)",
                        published_date=(j.get("publishedAt") or "").split("T")[0],
                        raw_description=desc_clean,
                        matched_keywords=matched_kws,
                        requirements=tags,
                        is_remote=is_remote
                    ))

            except Exception as e:
                print(f"[!] Ashby API error for {company} ({token}): {e}", file=sys.stderr)

        return offers
