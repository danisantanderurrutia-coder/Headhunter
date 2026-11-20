"""
Base Connector and Shared Domain Utilities for Empleo Master.
============================================================
Provides common HTTP fetching, profile-matching keywords,
canonical URL verification, and schema normalization for all
job ingestion connectors (Category 1 direct scrapers and Category 2 ATS APIs).
"""

import html
import json
import re
import sys
import urllib.error
import urllib.request
from datetime import datetime
from urllib.parse import urlparse

DEFAULT_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,application/json,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,de;q=0.8,es;q=0.7",
}

GENERIC_PATHS = {
    "", "/", "/careers", "/careers/", "/careers.html",
    "/empleo", "/empleo/", "/jobs", "/jobs/",
    "/openings", "/openings/", "/vacancies", "/vacancies/"
}

# 1. Mandatory Core Domain Anchors: at least one MUST be present
CORE_DOMAIN_TERMS = [
    # A. Clima, Suelos, Carbono, Turberas y Edafología
    r"\bclimate\b", r"\bclima\b", r"\bklima\b", r"\bklimaschutz\b", r"\bklimawandel\b",
    r"\bsoil\b", r"\bsuelos?\b", r"\bboden\b", r"\bbodenkunde\b", r"\bbodenschutz\b",
    r"\bcarbon\b", r"\bcarbono\b", r"\bkohlenstoff\b",
    r"\bghg\b", r"\bgei\b", r"\btreibhausgas\b",
    r"\beddy\s+covariance\b", r"\bpeatlands?\b", r"\bturberas?\b", r"\bmoore?\b", r"\bmoorschutz\b",
    r"\bwatershed\b", r"\bcuencas?\b", r"\bhydrolog\w*\b", r"\bhidrolog\w*\b",
    r"\bedafolog\w*\b", r"\bland\s+use\b", r"\buso\s+del\s+suelo\b",
    r"\becosystem\s+services\b", r"\bservicios\s+ecosist[eé]micos\b",
    r"\benvironmental\s+(data|policy|governance|science|management|risk|monitoring|research|assessment|protection|modelling|modeling|studies)\b",
    r"\bmedio\s+ambiente\b", r"\bmedioambiental\w*\b",
    r"\bumwelt\w*\b", r"\becolog\w*\b", r"\bforest\w*\b", r"\bwald\w*\b",
    r"\bagro\w*\b", r"\bagrar\w*\b",
    
    # B. Soluciones Basadas en la Naturaleza & Restauración de Cuencas
    r"\bblue[‑\-\s]*green\b", r"\bblau[‑\-\s]*grün\w*\b", r"\binfraestructura\s+verde\b",
    r"\becological\s+restoration\b", r"\brestauraci[oó]n\s+ecol[oó]gica\b", r"\brenaturierung\b",
    r"\bwetted\b", r"\brewetted\b",
    r"\bnature[‑\-\s]*based\s+solutions?\b", r"\bsoluciones\s+basadas\s+en\s+la\s+naturaleza\b", r"\bnbs\b",

    # C. Geospatial Data Science & Remote Sensing ML (Climate-Tech & MRV)
    r"\bremote\s+sensing\b", r"\bteledetecci\w*\b", r"\bfernerkundung\b",
    r"\bgeospatial\b", r"\bgeodaten\b", r"\bgeodata\b",
    r"\bearth\s+observation\b", r"\bmrv\b",
    r"\bcarbon\s+accounting\b", r"\bcarbon\s+audit\w*\b", r"\bauditoría\s+de\s+carbono\b",

    # D. Gemelos Digitales (Digital Twins) & Earth System AI (Centros Tecnológicos)
    r"\bearth\s+system\b", r"\berdsystem\b",
    r"\bdigital\s+twins?\b", r"\bgemelos?\s+digital\w*\b", r"\bdigitale[nr]?\s+zwilling\w*\b",
    r"\bdestination\s+earth\b", r"\bdestine\b",
    r"\bpinns?\b", r"\bphysics[‑\-\s]*informed\b",

    # E. Catastrophe Risk & Physical Climate Risk (Finanzas, Seguros & Resiliencia)
    r"\bcatastrophe\s+risk\b", r"\bcat\s+model\w*\b", r"\bclimate\s+risk\b",
    r"\bphysical\s+(climate\s+)?risk\b", r"\briesgo\s+clim[aá]tico\b", r"\bnatural\s+hazards?\b",

    # F. Incidencia Legislativa, Think Tanks, Ecología Política & Decrecimiento
    r"\benvironmental\s+policy\b", r"\bpolítica\s+ambiental\b", r"\benvironmental\s+governance\b",
    r"\bgobernanza\s+ambiental\b", r"\bpolitical\s+ecology\b", r"\becología\s+política\b",
    r"\bdegrowth\b", r"\bdecrecimiento\b", r"\becological\s+economics\b", r"\beconomía\s+ecológica\b",
    r"\bjust\s+transition\b", r"\btransición\s+justa\b", r"\bpost[‑\-\s]*extractivis\w*\b",
    r"\b(environmental|climate|policy)\s+advocacy\b", r"\bincidencia\s+(legislativa|ambiental|política)\b",
    r"\bthink\s+tank\b", r"\bdirectivas?\s+europeas?\b", r"\beu\s+directives?\b", r"\bred\s+iii\b"
]

# 2. Secondary Skills / Contextual Terms (require either a core term or at least 2 secondary terms)
SECONDARY_TERMS = [
    r"\bsustainability\b", r"\bnachhaltig\w*\b",
    r"\bqgis\b", r"\barcgis\b", r"\bgis\b", r"\bsig\b", r"\bgoogle\s+earth\s+engine\b",
    r"\bpython\b", r"\br\b", r"\bmodeling\b", r"\bmodelaci[oó]n\b", r"\bmodellierung\b",
    r"\bgeodata\b", r"\bgeodaten\b", r"\bearth\s+observation\b",
    r"\bearth\s+ai\b", r"\bgeocomputation\b", r"\bgeocomputaci[oó]n\b"
]

# 3. Roles completely excluded from profile
EXCLUDED_ROLE_PATTERNS = [
    # Academic senior roles requiring existing PhD
    r"\bpostdoc\w*\b", r"\bpostdoctoral\b", r"\bpost[‑\-_\s]*doc\w*\b",
    r"\bprofessur\b", r"\bprofessor\b", r"\btenure\s+track\b", r"\bhabilit\w*\b",
    # Executive & high-management seniority
    r"\bdirector\b", r"\bhead\s+of\b", r"\bvp\b", r"\bvice\s+president\b",
    r"\bmanaging\s+director\b", r"\bchief\b", r"\bc-level\b",
    # Pre-Master / Student / Non-graduate internships
    r"\binternship\b", r"\bintern\b", r"\bpraktik\w*\b", r"\bworking\s+student\b",
    r"\bwerkstudent\w*\b", r"\bstudentische\s+hilfskraft\b", r"\bstudents\s*&\s*interns\b",
    # Generic speculative talent pools
    r"\bwork\s+with\s+us\b", r"\bspontanbewerbung\b", r"\binitiativbewerbung\b",
    # Administrative, Secretarial, Office Management
    r"\bexecutive\s+assistant\b", r"\bassistant\b", r"\bassistent\w*\b",
    r"\boffice\s+manager\b", r"\breceptionist\b", r"\bsekretär\w*\b", r"\bsekretariat\b",
    # Corporate Operations, Procurement, Legal & HR
    r"\bprocurement\b", r"\beinkauf\b", r"\bexport\s+control\b", r"\bgovernment\s+relations\b",
    r"\blegal\b", r"\bjurist\w*\b", r"\bcompliance\b", r"\btrade\s+compliance\b",
    r"\bhuman\s+resources\b", r"\bpeople\s+partner\b", r"\brecruiter\b", r"\brecruiting\b",
    # PR, Social Media, Communications, Copywriting & Design
    r"\bsocial\s+media\b", r"\bpressesprecher\w*\b", r"\bpr\s+manager\b",
    r"\bdesigner\b", r"\bcontent\s+designer\b", r"\bux\b", r"\bui[‑\-\s]*ux\b",
    r"\bcopy\b", r"\bcopywriter\b",
    # Healthcare & Clinical Roles
    r"\bpatient\b", r"\bclinical\b",
    # Sales, Account Exec, Business Development, Product & Finance
    r"\baccount\s+executive\b", r"\bsales\b", r"\bventas\b", r"\bvertrieb\b",
    r"\bcustomer\s+success\b", r"\bbusiness\s+development\b", r"\baccount\s+manager\b",
    r"\bpartnerships?\s+lead\b", r"\bmarketing\b", r"\btax\b", r"\bpresales\b", r"\bpre-sales\b",
    r"\bcorporate\s+finance\b", r"\bfinancial\b", r"\bfinance\b", r"\bcompensation\b",
    r"\bcustomer\s+support\b", r"\bcall\s+center\b",
    # Exclude standard insurance sales / underwriting while preserving Catastrophe Risk Modeling
    r"\bactuary\b", r"\baktuar\b", r"\bunderwriter\b",
    r"\binsurance\s+(sales|agent|broker|adjuster|clerk)\b",
    r"\bversicherungs\s*(kaufmann|kauffrau|makler|vertreter)\b",
    # Hardware, Avionics, Industrial Trades & Facilities
    r"\belectrical\s+engineer\b", r"\bmanufacturing\b", r"\binventory\b", r"\bfacilities\b",
    r"\bpcb\b", r"\bharness\b", r"\brevenue\b", r"\binternal\s+audit\b",
    r"\bopto[‑\-\s]*mechanical\b", r"\bcamera\s+systems\b", r"\bspacecraft\b",
    r"\bpayload\s+flight\b", r"\bsatellite\s+platform\b", r"\bground\s+segment\b",
    r"\bmechatronik\w*\b", r"\belektriker\w*\b", r"\bmechanik\w*\b", r"\btechniker\b",
    r"\bautomatisierungstechniker\w*\b", r"\bhandwerklich\w*\b",
    r"\bsps[‑\-\s]*entwickler\w*\b", r"\bmaschinensteuerung\b",
    # IT Infrastructure & DevOps (outside Environmental / GIS modeling)
    r"\bsre\b", r"\bsite\s+reliability\b", r"\bdevops\b", r"\bfrontend\b", r"\bfullstack\b",
    r"\bbackend\b", r"\b\.net\b", r"\bstorage\s+infrastructure\b",
    r"\bplatform\s+engineer\b", r"\bcloud\s+architect\b", r"\bsecurity\s+compliance\b",
    r"\bit[‑\-\s]*administration\b", r"\bsystemadministrator\w*\b", r"\bserveradministration\b",
    r"\bit[‑\-\s]*spezialist\w*\b", r"\benterprise\s+architect\b", r"\bsolutions\s+architect\b",
    # Non-environmental public administration, real estate & social services
    r"\bhaushalt\b", r"\bliegenschaft\w*\b", r"\bqualitätsmanagement\w*\b",
    r"\bkindertagesstätte\b", r"\bkita\b", r"\bhort\b", r"\bpädagog\w*\b", r"\berzieher\w*\b", r"\bschulweg\w*\b",
    r"\btherapie\b", r"\bpflege\b", r"\bklinik\b", r"\bneurolog\w*\b", r"\barzt\b", r"\bärzt\w*\b", r"\bmedizin\w*\b",
    r"\bhauswart\b", r"\bgardener\b", r"\bgärtner\b", r"\blehrstelle\b",
    r"\bwerkfeuerwehr\b", r"\bkoch\b", r"\bküche\b", r"\breinigungs\w*\b"
]


GERMAN_MONTHS = {
    "januar": 1, "februar": 2, "märz": 3, "maerz": 3, "april": 4,
    "mai": 5, "juni": 6, "juli": 7, "august": 8, "september": 9,
    "oktober": 10, "november": 11, "dezember": 12
}


def parse_deadline(d_str: str):
    """Parse German, ISO, and numerical deadlines into a date object."""
    if not d_str:
        return None
    d_clean = d_str.strip().lower()

    # 1. DD.MM.YYYY
    m1 = re.search(r"(\d{1,2})\.(\d{1,2})\.(\d{4})", d_clean)
    if m1:
        try:
            return datetime(int(m1.group(3)), int(m1.group(2)), int(m1.group(1))).date()
        except Exception:
            pass

    # 2. YYYY-MM-DD
    m2 = re.search(r"(\d{4})-(\d{1,2})-(\d{1,2})", d_clean)
    if m2:
        try:
            return datetime(int(m2.group(1)), int(m2.group(2)), int(m2.group(3))).date()
        except Exception:
            pass

    # 3. D. MMMM YYYY
    m3 = re.search(r"(\d{1,2})\.\s*([a-zäöü]+)\s*(\d{4})", d_clean)
    if m3:
        day = int(m3.group(1))
        month_name = m3.group(2)
        year = int(m3.group(3))
        month = GERMAN_MONTHS.get(month_name)
        if month:
            try:
                return datetime(year, month, day).date()
            except Exception:
                pass
    return None


def is_deadline_expired(deadline_str: str) -> bool:
    """Return True if deadline has already passed relative to current date."""
    parsed = parse_deadline(deadline_str)
    if not parsed:
        return False
    return parsed < datetime.utcnow().date()


def clean_html(raw_html: str) -> str:
    """Strip HTML tags, unescape entities, and collapse whitespace."""
    if not raw_html:
        return ""
    unescaped = html.unescape(raw_html)
    clean = re.sub(r"<[^>]+>", " ", unescaped)
    return " ".join(clean.split()).strip()


def is_canonical_url(url_str: str) -> bool:
    """Verify that URL points to a specific job posting rather than a generic root."""
    if not url_str or not url_str.startswith("http"):
        return False
    try:
        parsed = urlparse(url_str)
        path = parsed.path.rstrip("/")
        return path not in GENERIC_PATHS and bool(path)
    except Exception:
        return False


def matches_profile_strictly(title: str, description: str, tags: list = None) -> tuple:
    """Strictly filter job postings against Daniel Santander's environmental profile."""
    tags = tags or []
    full_text = f"{title} {description} {' '.join(tags)}".lower()
    title_lower = title.lower()

    # 1. Reject if title matches excluded patterns
    for exc in EXCLUDED_ROLE_PATTERNS:
        if re.search(exc, title_lower):
            return False, []

    # 2. Must match at least ONE core domain term
    matched_core = []
    for pattern in CORE_DOMAIN_TERMS:
        if re.search(pattern, full_text):
            matched_core.append(pattern.replace(r"\b", "").replace(r"\w*", ""))

    if not matched_core:
        return False, []

    # 3. Collect secondary matched terms
    matched_secondary = []
    for pattern in SECONDARY_TERMS:
        if re.search(pattern, full_text):
            matched_secondary.append(pattern.replace(r"\b", "").replace(r"\w*", ""))

    return True, list(dict.fromkeys(matched_core + matched_secondary))


class BaseConnector:
    """Abstract base class for all job connectors."""

    name: str = "Base"
    category: str = "Generic"

    def __init__(self, timeout: int = 15):
        self.timeout = timeout
        self.headers = DEFAULT_HEADERS.copy()

    def fetch_url(self, url: str) -> str:
        """Fetch URL content as string."""
        req = urllib.request.Request(url, headers=self.headers)
        with urllib.request.urlopen(req, timeout=self.timeout) as resp:
            return resp.read().decode("utf-8", errors="ignore")

    def fetch_json(self, url: str):
        """Fetch URL and parse as JSON."""
        content = self.fetch_url(url)
        return json.loads(content)

    def scrape(self) -> list:
        """Execute scraping and return list of normalized job dicts."""
        raise NotImplementedError

    def build_job_dict(
        self,
        job_id: str,
        title: str,
        company: str,
        location: str,
        country: str,
        url: str,
        source_id: str,
        source_name: str,
        published_date: str,
        raw_description: str,
        matched_keywords: list,
        requirements: list = None,
        deadline: str = None,
        salary: str = None,
        is_remote: bool = False
    ) -> dict:
        """Standardize output matching public/data/jobs.json specification."""
        timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M")
        is_bilbao = any(b in location.lower() for b in ["bilbao", "bizkaia", "euskadi", "basque", "barakaldo", "leioa"])

        clean_desc = clean_html(raw_description)[:1500]
        title_clean = html.unescape(title).strip()
        company_clean = html.unescape(company).strip()
        location_clean = html.unescape(location).strip()

        job = {
            "id": job_id,
            "title": title_clean,
            "company": company_clean,
            "location": location_clean,
            "country": country.strip(),
            "isBilbaoLocation": is_bilbao,
            "isRemote": is_remote,
            "url": url.strip(),
            "sourceId": source_id,
            "sourceName": source_name,
            "publishedDate": published_date or timestamp.split(" ")[0],
            "rawDescription": clean_desc,
            "requirements": requirements or [],
            "responsibilities": [],
            "status": "Nueva",
            "extractedAt": timestamp,
            "isVerified": True,
            "verificationStatus": "Vigente y Verificada",
            "matchedKeywords": matched_keywords
        }
        if deadline:
            job["deadline"] = deadline.strip()
        if salary:
            job["salary"] = salary.strip()
        return job
