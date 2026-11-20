"""
ETH Zürich Official Job Board Connector (Category 1).
===================================================
Direct HTTP parser for ETH Zürich vacancies portal:
https://jobs.ethz.ch/site/index
Extracts open positions across Earth Sciences (D-EAPS), Environmental Systems
Science (D-USYS), Civil/Environmental Engineering (D-BAUG) and Data Science.
"""

import re
from urllib.parse import urljoin
from bs4 import BeautifulSoup
from ..base import BaseConnector, is_canonical_url, matches_profile_strictly


class EthzConnector(BaseConnector):
    name = "ETH Zürich"
    category = "Category 1 - Direct HTTP"
    URL = "https://jobs.ethz.ch/site/index"

    def scrape(self) -> list:
        offers = []
        try:
            html = self.fetch_url(self.URL)
            soup = BeautifulSoup(html, "html.parser")

            links = soup.find_all("a", href=lambda h: h and "/job/view/" in h)

            for a in links:
                href = a["href"].strip()
                full_text = a.get_text(separator=" | ", strip=True)

                full_url = urljoin(self.URL, href)
                if not is_canonical_url(full_url):
                    continue

                # The link text usually has: Title | % workload | Location | Deadline | Department
                parts = [p.strip() for p in full_text.split("|") if p.strip()]
                title = parts[0] if parts else a.get_text(strip=True)

                # Clean up title if percentage or location is concatenated
                clean_title = re.split(r"\d{2,3}%", title)[0].strip() or title

                job_id_match = re.search(r"JOPG_ethz_([A-Za-z0-9]+)", href)
                job_id_str = job_id_match.group(1) if job_id_match else str(hash(href))

                # Check date
                date_match = re.search(r"\b(\d{1,2}\.\d{1,2}\.\d{4})\b", full_text)
                deadline = date_match.group(1) if date_match else "Consultar web"

                is_match, matched_kws = matches_profile_strictly(clean_title, full_text)
                if not is_match:
                    continue

                offers.append(self.build_job_dict(
                    job_id=f"ethz-{job_id_str}",
                    title=clean_title,
                    company="ETH Zürich",
                    location="Zürich / Basel, Suiza",
                    country="Suiza",
                    url=full_url,
                    source_id="src-ethz-jobs",
                    source_name="ETH Zürich Job Board",
                    published_date="",
                    raw_description=f"ETH Zürich Vacancy: {clean_title}. {full_text}",
                    matched_keywords=matched_kws,
                    requirements=["Doctorate / Master Degree in Environmental or Earth Sciences", "ETH Domain Standards"],
                    salary="ETH Scale (Predoc ca. 60.000 - 85.000 CHF / Postdoc ca. 85.000 - 115.000 CHF)",
                    deadline=deadline
                ))

        except Exception as e:
            print(f"[!] Error scraping ETH Zürich: {e}")

        return offers
