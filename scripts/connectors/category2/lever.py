"""
Lever Public API Connector (Category 2 - ATS API).
=================================================
Connects to Lever's official postings endpoint:
https://api.lever.co/v0/postings/{company}?mode=json
Retrieves JSON structured postings without requiring web scraping or headless drivers.
Configured for:
- Pachama ('pachama')
"""

import sys
from ..base import BaseConnector, is_canonical_url, matches_profile_strictly, clean_html

LEVER_COMPANIES = [
    {
        "company": "pachama",
        "company_name": "Pachama",
        "default_country": "Global / Remoto / Europa",
        "source_id": "src-pachama-lever"
    }
]


class LeverConnector(BaseConnector):
    name = "Lever ATS API"
    category = "Category 2 - ATS API"

    def scrape(self) -> list:
        offers = []

        for comp in LEVER_COMPANIES:
            cid = comp["company"]
            company = comp["company_name"]
            url = f"https://api.lever.co/v0/postings/{cid}?mode=json"

            try:
                data = self.fetch_json(url)
                if not isinstance(data, list):
                    continue

                for j in data:
                    title = j.get("text", "")
                    job_url = j.get("hostedUrl", "")
                    if not is_canonical_url(job_url):
                        continue

                    cats = j.get("categories", {})
                    location_name = cats.get("location") or comp["default_country"]
                    team = cats.get("team") or ""
                    desc_plain = j.get("descriptionPlain", "") or clean_html(j.get("description", ""))

                    tags = [team] if team else []
                    is_match, matched_kws = matches_profile_strictly(title, desc_plain, tags)
                    if not is_match:
                        continue

                    job_id = f"lever-{cid}-{j.get('id', hash(job_url))}"
                    is_remote = any(r in location_name.lower() for r in ["remote", "remoto", "anywhere"])

                    offers.append(self.build_job_dict(
                        job_id=job_id,
                        title=title,
                        company=company,
                        location=location_name,
                        country=comp["default_country"],
                        url=job_url,
                        source_id=comp["source_id"],
                        source_name=f"{company} (Lever API)",
                        published_date="",
                        raw_description=desc_plain,
                        matched_keywords=matched_kws,
                        requirements=tags,
                        is_remote=is_remote
                    ))

            except Exception as e:
                print(f"[!] Lever API error for {company} ({cid}): {e}", file=sys.stderr)

        return offers
