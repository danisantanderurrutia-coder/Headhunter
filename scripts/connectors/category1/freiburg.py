"""
University of Freiburg Stellenangebote Connector (Category 1).
=============================================================
Direct HTTP parser for Albert-Ludwigs-Universität Freiburg vacancies:
https://uni-freiburg.de/stellenangebote/
Extracts positions in Faculty of Environment and Natural Resources,
Future Forests Cluster, and Nature Conservation & Landscape Ecology.
"""

import re
from urllib.parse import urljoin
from bs4 import BeautifulSoup
from ..base import BaseConnector, is_canonical_url, matches_profile_strictly


class FreiburgConnector(BaseConnector):
    name = "University of Freiburg"
    category = "Category 1 - Direct HTTP"
    URL = "https://uni-freiburg.de/stellenangebote/"

    def scrape(self) -> list:
        offers = []
        try:
            html = self.fetch_url(self.URL)
            soup = BeautifulSoup(html, "html.parser")

            # In Freiburg modern template, job cards are list items with grid layout
            cards = soup.find_all("li", class_=lambda c: c and "grid" in c)
            seen_urls = set()

            for card in cards:
                a = card.find("a", href=lambda h: h and "/stellenangebot/" in h)
                if not a:
                    continue

                href = a["href"].strip()
                full_url = urljoin(self.URL, href)
                if full_url in seen_urls or not is_canonical_url(full_url):
                    continue
                seen_urls.add(full_url)

                # Extract title from designated title container or fallback to prominent text
                title_div = card.find("div", class_=lambda c: c and ("title" in c or "[grid-area:title]" in c))
                title = title_div.get_text(strip=True) if title_div else ""

                card_text = card.get_text(separator=" | ", strip=True)
                if not title:
                    segments = [s.strip() for s in card_text.split("|") if s.strip()]
                    meaningful = [s for s in segments if s not in ["NEU", "Vollzeit", "Teilzeit", "mehr erfahren"] and len(s) > 10]
                    title = meaningful[0] if meaningful else f"Stellenangebot {href.rstrip('/').split('/')[-1]}"

                # Extract Kennziffer and Bewerbungsfrist
                kennziffer_match = re.search(r"Kennziffer:\s*([0-9A-Za-z]+)", card_text)
                kennziffer = kennziffer_match.group(1) if kennziffer_match else href.rstrip("/").split("/")[-1]

                deadline_match = re.search(r"Bewerbungsfrist:\s*\|?\s*([^\|]+)", card_text)
                deadline = deadline_match.group(1).strip() if deadline_match else "Consultar convocatoria"

                is_match, matched_kws = matches_profile_strictly(title, card_text)
                if not is_match:
                    continue

                offers.append(self.build_job_dict(
                    job_id=f"freiburg-{kennziffer}",
                    title=title,
                    company="Albert-Ludwigs-Universität Freiburg",
                    location="Friburgo de Brisgovia (Baden-Württemberg), Alemania",
                    country="Alemania",
                    url=full_url,
                    source_id="src-uni-freiburg",
                    source_name="University of Freiburg Stellenangebote",
                    published_date="",
                    raw_description=f"Universität Freiburg Ausschreibung: {title}. {card_text}",
                    matched_keywords=matched_kws,
                    requirements=["Master / PhD in Environmental Sciences, Forestry, Ecology, or Climate Dynamics", "Kennziffer: " + kennziffer],
                    salary="TV-L E13 (Baden-Württemberg)",
                    deadline=deadline
                ))

        except Exception as e:
            print(f"[!] Error scraping University of Freiburg: {e}")

        return offers
