"""
BOKU University (Vienna) Jobbörse Connector (Category 1).
=======================================================
Direct HTTP scraper for BOKU's official job postings board:
https://boku.ac.at/en/pers/interne-jobboerse
Extracts Mitteilungsblatt announcements and Euraxess postings in soil science,
biogeochemistry, forestry, hydrology and environmental research.
"""

import re
import sys
from urllib.parse import urljoin
from bs4 import BeautifulSoup
from ..base import BaseConnector, is_canonical_url, matches_profile_strictly


class BokuConnector(BaseConnector):
    name = "BOKU University (Vienna)"
    category = "Category 1 - Direct HTTP"
    URL = "https://boku.ac.at/en/pers/interne-jobboerse"

    def scrape(self) -> list:
        offers = []
        try:
            html = self.fetch_url(self.URL)
            soup = BeautifulSoup(html, "html.parser")

            seen_urls = set()
            for li in soup.find_all(["li", "tr"]):
                a_tags = li.find_all("a", href=True)
                if not a_tags:
                    continue

                full_li_text = li.get_text(separator=" | ", strip=True)
                if not any(k in full_li_text for k in ["Postdoctoral", "Postgraduate", "Career position", "Scientist", "Associate", "Tenure"]):
                    continue

                # Find candidate job url (PDF or Euraxess)
                job_url = None
                for a in a_tags:
                    href = a["href"].strip()
                    if "mitteilungsblatt-jobs" in href or "euraxess.ec.europa.eu" in href:
                        job_url = urljoin(self.URL, href)
                        break

                if not job_url or job_url in seen_urls or not is_canonical_url(job_url):
                    continue
                seen_urls.add(job_url)

                # Split title and institute
                parts = [p.strip() for p in full_li_text.split("|") if len(p.strip()) > 5]
                title = parts[0] if parts else "Academic Research Position"

                # Check profile match against title + institute/department
                is_match, matched_kws = matches_profile_strictly(title, full_li_text)
                if not is_match:
                    continue

                ref_code_match = re.search(r"Reference Code\s*([0-9A-Za-z]+)", full_li_text, re.I)
                ref_code = ref_code_match.group(1) if ref_code_match else str(hash(job_url))
                job_id = f"boku-{ref_code}"

                offers.append(self.build_job_dict(
                    job_id=job_id,
                    title=f"{title} ({full_li_text.split('|')[-1].strip()})",
                    company="BOKU University - University of Natural Resources and Life Sciences, Vienna",
                    location="Viena, Austria",
                    country="Austria",
                    url=job_url,
                    source_id="src-boku-vienna",
                    source_name="BOKU Jobbörse (Wien)",
                    published_date="",
                    raw_description=f"Convocatoria oficial BOKU: {full_li_text}",
                    matched_keywords=matched_kws,
                    requirements=["Soil Science / Forestry / Biogeochemistry / Natural Resources", "University Master / PhD degree"],
                    salary="Kollektivvertrag für die Arbeitnehmer*innen der Universitäten (B1 / TV-UG)",
                    deadline="Consultar en documento oficial"
                ))

        except Exception as e:
            print(f"[!] Error scraping BOKU University: {e}", file=sys.stderr)

        return offers
