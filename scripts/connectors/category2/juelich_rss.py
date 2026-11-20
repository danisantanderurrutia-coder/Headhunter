"""
Forschungszentrum Jülich RSS Connector (Category 2 - Structured Research Feed).
==============================================================================
Direct Plone CMS RSS Feed for Forschungszentrum Jülich:
https://www.fz-juelich.de/++api++/@@rss?portal_type=Joboffer&path=/Plone/de/karriere/stellenangebote
Monitors IBG-3: Agrosphere (Soil Biogeochemistry, Terrestrial Hydrology, Eddy Covariance)
and IAS/JSC (Earth System Modeling, Supercomputing).
"""

import re
import sys
import xml.etree.ElementTree as ET
from ..base import BaseConnector, is_canonical_url, matches_profile_strictly, clean_html


class JuelichRssConnector(BaseConnector):
    name = "Forschungszentrum Jülich (IBG-3 Agrosphere)"
    category = "Category 2 - Plone RSS Feed"
    URL = "https://www.fz-juelich.de/++api++/@@rss?portal_type=Joboffer&path=/Plone/de/karriere/stellenangebote"

    def scrape(self) -> list:
        offers = []
        try:
            xml_data = self.fetch_url(self.URL)
            root = ET.fromstring(xml_data)
            items = root.findall(".//item")

            for item in items:
                title = (item.findtext("title") or "").strip()
                link = (item.findtext("link") or "").strip()
                desc = (item.findtext("description") or "").strip()
                pub_date = (item.findtext("pubDate") or "").strip()

                if not is_canonical_url(link) or len(title) < 5:
                    continue

                full_text = f"{title} {desc}"
                is_match, matched_kws = matches_profile_strictly(title, full_text)
                if not is_match:
                    continue

                ref_match = re.search(r"(\d{4}[A-Za-z]?-\d+)", link)
                ref_id = ref_match.group(1) if ref_match else str(hash(link))

                offers.append(self.build_job_dict(
                    job_id=f"juelich-{ref_id}",
                    title=title,
                    company="Forschungszentrum Jülich (Helmholtz-Gemeinschaft)",
                    location="Jülich (Renania del Norte-Westfalia), Alemania",
                    country="Alemania",
                    url=link,
                    source_id="src-juelich-rss",
                    source_name="Forschungszentrum Jülich Job Feed",
                    published_date=pub_date[:16] if pub_date else "",
                    raw_description=clean_html(desc),
                    matched_keywords=matched_kws,
                    requirements=["Master / PhD in Terrestrial Systems, Soil Physics, Hydrology or Geophysics", f"Kennziffer: {ref_id}"],
                    salary="TVöD Bund E13 / E14 (100% o 75% según proyecto)",
                    deadline="Consultar en portal de empleo Jülich"
                ))

        except Exception as e:
            print(f"[!] Error parsing FZ Jülich RSS: {e}", file=sys.stderr)

        return offers
