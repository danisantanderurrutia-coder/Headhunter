"""
BC3 Basque Centre for Climate Change Connector (Category 1).
===========================================================
Direct HTTP parser for BC3 official job board:
https://www.bc3research.org/en/careers/job-offers/
Focuses on predoctoral, postdoctoral and research fellow openings
in Climate Adaptation, Land Use, Forest Carbon, Ecosystem Services (ARIES).
"""

import re
from urllib.parse import urljoin
from bs4 import BeautifulSoup
from ..base import BaseConnector, is_canonical_url, matches_profile_strictly


class Bc3Connector(BaseConnector):
    name = "BC3 Basque Centre for Climate Change"
    category = "Category 1 - Direct HTTP"
    URL = "https://www.bc3research.org/en/careers/job-offers/"

    def scrape(self) -> list:
        offers = []
        try:
            html = self.fetch_url(self.URL)
            soup = BeautifulSoup(html, "html.parser")

            # Find links pointing to specific job offers
            links = soup.find_all("a", href=lambda h: h and "/job_offer/" in h)

            seen_urls = set()
            for a in links:
                href = a["href"].strip()
                full_url = urljoin(self.URL, href)
                if full_url in seen_urls or not is_canonical_url(full_url):
                    continue
                seen_urls.add(full_url)

                title = a.get_text(strip=True)
                if len(title) < 8 or title.lower() in ["read more", "more info"]:
                    continue

                parent = a.find_parent(["article", "div", "li"])
                context_text = parent.get_text(separator=" ", strip=True) if parent else title

                # If snippet doesn't clearly match, fetch individual job page for rich project description
                is_match, matched_kws = matches_profile_strictly(title, context_text)
                detail_desc = context_text

                if not is_match:
                    try:
                        detail_html = self.fetch_url(full_url)
                        detail_soup = BeautifulSoup(detail_html, "html.parser")
                        detail_main = detail_soup.find(id="content") or detail_soup.find("main") or detail_soup
                        detail_desc = detail_main.get_text(separator=" ", strip=True)
                        is_match, matched_kws = matches_profile_strictly(title, detail_desc)
                    except Exception as e:
                        pass

                if not is_match:
                    continue

                slug = href.rstrip("/").split("/")[-1]
                job_id = f"bc3-{slug}"

                offers.append(self.build_job_dict(
                    job_id=job_id,
                    title=title,
                    company="BC3 - Basque Centre for Climate Change",
                    location="Leioa / Bilbao (Bizkaia), Euskadi, España",
                    country="España (Euskadi)",
                    url=full_url,
                    source_id="src-bc3-basque",
                    source_name="BC3 Careers Portal",
                    published_date="",
                    raw_description=f"Convocatoria de Investigación BC3: {title}. {detail_desc[:1200]}",
                    matched_keywords=matched_kws,
                    requirements=["Doctorado / Máster en Ciencias Ambientales, Economía Ecológica o Modelización", "Bilingual English / Spanish or Basque"],
                    salary="Convenio I+D+i Euskadi / BERC Escala Investigadora",
                    deadline="Consultar bases en web oficial"
                ))

        except Exception as e:
            print(f"[!] Error scraping BC3: {e}")

        return offers
