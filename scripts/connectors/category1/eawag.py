"""
Eawag (Swiss Federal Institute of Aquatic Science and Technology) Connector (Category 1).
========================================================================================
Direct HTTP parser for Eawag's Refline job board:
https://apply.refline.ch/673277/search.html?form.buttons.listAll=1&target=overview
Extracts positions in Hydrology, Catchment Modeling, Aquatic Biogeochemistry,
Stream Phenology, and Environmental Data Science within the ETH Domain.
"""

import re
from urllib.parse import urljoin
from bs4 import BeautifulSoup
from ..base import BaseConnector, is_canonical_url, matches_profile_strictly


class EawagConnector(BaseConnector):
    name = "Eawag (ETH Domain)"
    category = "Category 1 - Direct HTTP"
    URL = "https://apply.refline.ch/673277/search.html?form.buttons.listAll=1&target=overview"

    def scrape(self) -> list:
        offers = []
        try:
            html = self.fetch_url(self.URL)
            soup = BeautifulSoup(html, "html.parser")

            # Links matching pattern /673277/{id}/pub/{version}/index.html
            links = soup.find_all("a", href=lambda h: h and re.search(r"/673277/\d+/pub/", h))

            seen_urls = set()
            for a in links:
                href = a["href"].strip()
                title = a.get_text(strip=True)

                if len(title) < 10:
                    continue

                full_url = urljoin(self.URL, href)
                if full_url in seen_urls or not is_canonical_url(full_url):
                    continue
                seen_urls.add(full_url)

                parent = a.find_parent(["tr", "li", "div"])
                context_text = parent.get_text(separator=" ", strip=True) if parent else title

                is_match, matched_kws = matches_profile_strictly(title, context_text)
                if not is_match:
                    continue

                pos_id_match = re.search(r"/673277/(\d+)/", href)
                pos_id = pos_id_match.group(1) if pos_id_match else str(hash(href))

                offers.append(self.build_job_dict(
                    job_id=f"eawag-{pos_id}",
                    title=title,
                    company="Eawag - Swiss Federal Institute of Aquatic Science and Technology",
                    location="Dübendorf / Kastanienbaum (Zürich / Luzern), Suiza",
                    country="Suiza",
                    url=full_url,
                    source_id="src-eawag-swiss",
                    source_name="Eawag Job Portal (ETH Domain)",
                    published_date="",
                    raw_description=f"Convocatoria Eawag (Dominio ETH): {title}. {context_text}",
                    matched_keywords=matched_kws,
                    requirements=["Master / PhD in Hydrology, Limnology, Environmental Sciences or Biogeochemistry", "ETH Domain Employment Terms"],
                    salary="ETH Domain Salary Scale (80.000 - 110.000 CHF según grado)",
                    deadline="Ver detalles en portal oficial"
                ))

        except Exception as e:
            print(f"[!] Error scraping Eawag: {e}")

        return offers
