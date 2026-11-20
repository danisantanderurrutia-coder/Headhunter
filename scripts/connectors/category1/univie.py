"""
Universität Wien (University of Vienna) Job Portal Connector (Category 1).
========================================================================
Direct HTTP parser for Universität Wien SuccessFactors portal:
https://jobs.univie.ac.at/go/Praedoc/8877001/25/
Targeting Praedoc and Postdoc opportunities in Geosciences, Geography,
Climate Dynamics (VISESS, TiCCA4Danu, ENGAGE) and Environmental Policy.
"""

import re
from urllib.parse import urljoin
from bs4 import BeautifulSoup
from ..base import BaseConnector, is_canonical_url, matches_profile_strictly


class UnivieConnector(BaseConnector):
    name = "Universität Wien"
    category = "Category 1 - Direct HTTP"
    URL = "https://jobs.univie.ac.at/go/Praedoc/8877001/25/?q=&sortColumn=referencedate&sortDirection=desc"

    def scrape(self) -> list:
        offers = []
        try:
            html = self.fetch_url(self.URL)
            soup = BeautifulSoup(html, "html.parser")

            rows = soup.find_all("tr", class_=lambda c: c and "data-row" in c)
            if not rows:
                rows = soup.find_all("tr")

            for row in rows:
                links = row.find_all("a", href=True)
                if not links:
                    continue

                link_el = links[0]
                href = link_el["href"].strip()
                title = link_el.get_text(strip=True)

                if "/job/" not in href or len(title) < 8:
                    continue

                full_url = urljoin(self.URL, href)
                if not is_canonical_url(full_url):
                    continue

                row_text = row.get_text(separator=" ", strip=True)

                # Extract date if present
                date_match = re.search(r"\b(\d{1,2}\.\d{1,2}\.\d{4})\b", row_text)
                pub_date = date_match.group(1) if date_match else ""

                # Extract job ID from URL
                id_match = re.search(r"/(\d+)/?$", href)
                job_id_num = id_match.group(1) if id_match else str(hash(href))

                is_match, matched_kws = matches_profile_strictly(title, row_text)
                if not is_match:
                    continue

                offers.append(self.build_job_dict(
                    job_id=f"univie-{job_id_num}",
                    title=title,
                    company="Universität Wien",
                    location="Viena, Austria",
                    country="Austria",
                    url=full_url,
                    source_id="src-univie-praedoc",
                    source_name="Universität Wien Job Portal",
                    published_date=pub_date,
                    raw_description=f"Convocatoria académica Universität Wien: {title}. Detalles: {row_text}",
                    matched_keywords=matched_kws,
                    requirements=["Master / PhD Degree", "Research proposal / scientific background"],
                    salary="Kollektivvertrag für die Universitäten (TV-UG § 26 / B1 Praedoc ca. 3.578 €/mes)",
                    deadline="Ver detalles en convocatoria"
                ))

        except Exception as e:
            print(f"[!] Error scraping Universität Wien: {e}")

        return offers
