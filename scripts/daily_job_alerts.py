#!/usr/bin/env python3
"""
Job Search OS (Empleo) - Daily Job Alerts & Digest Engine
=========================================================
Runs automatically every morning at 09:00 AM (07:00 UTC) via GitHub Actions or local cron/launchd.
Aggregates authentic opportunities across all integrated sources:
 1. Convocatorias prioritarias en Alemania: Thünen-Institut & Umweltbundesamt (UBA / Interamt)
 2. Sector Público Federal Alemán: service.bund.de (RSS con 500+ convocatorias activas)
 3. Centros de I+D y Entidades en Euskadi & España: BC3, Tecnalia, Neiker, IHOBE, IDOM
 4. Plataformas Internacionales & Remotas: Arbeitnow (DACH/Europa), Remotive, Jobicy

Filters by environmental, soil, climate, AI and geophysical keywords tailored to Daniel Santander's profile.
Generates an HTML email digest and dispatches it via Resend API or SMTP (Gmail).
"""

import os
import sys
import argparse
import json
import re
import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from connectors.base import is_deadline_expired, parse_deadline, EXCLUDED_ROLE_PATTERNS

DEFAULT_RECIPIENT = "danisantander.urrutia@gmail.com"
DEFAULT_KEYWORDS = [
    "boden", "bodenkunde", "klima", "klimaschutz", "agrar", "wald",
    "umwelt", "umweltbundesamt", "thünen", "thuenen", "ki", "künstliche intelligenz",
    "machine learning", "geophysik", "eddy", "turbera", "hydrolog",
    "remote sensing", "gis", "datenanalyse", "carbon", "soil"
]

HIGH_PRIORITY_EMPLOYERS = [
    "thünen", "thuenen", "umweltbundesamt", "uba", "bundesamt für naturschutz", "bfn",
    "julius kühn", "institut für agrarklimaschutz", "helmholtz", "leibniz", "geoforschungszentrum"
]

BUND_RSS_URL = "https://www.service.bund.de/Content/Globals/Functions/RSSFeed/RSSGenerator_Stellen.xml"
JOBS_DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "public", "data", "jobs.json")


EXPIRED_TEXT_PATTERNS = [
    "nicht mehr verfügbar", "abgelaufen", "ausschreibung ist beendet",
    "position has been filled", "this job is no longer available", "closed"
]


def is_url_live(url: str, timeout: int = 4) -> bool:
    """Pre-flight check: ensure the offer URL is genuinely reachable, not redirected to home/search, and not soft-expired."""
    if not url or not url.startswith("http"):
        return False
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)"
    }
    try:
        # Use GET with byte limit so we can inspect redirect location and body
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            if resp.status >= 400:
                return False

            final_url = resp.geturl()
            # Detect Interamt / Bund redirect trap to generic search home
            if "interamt.de" in url and final_url.rstrip("/").endswith("/koop/app"):
                return False
            if final_url.rstrip("/").endswith(("/careers", "/jobs", "/search", "/login")):
                return False

            # Inspect first 2KB for soft-404 markers
            chunk = resp.read(2048).decode("utf-8", errors="ignore").lower()
            if any(p in chunk for p in EXPIRED_TEXT_PATTERNS):
                return False

            return True
    except Exception:
        return False


def clean_html(raw_html: str) -> str:
    """Strip HTML tags and condense whitespace."""
    if not raw_html:
        return ""
    clean = re.sub(r"<[^>]+>", " ", raw_html)
    return " ".join(clean.split())


def extract_field_from_desc(desc: str, label: str) -> str:
    """Extract fields like 'Arbeitgeber:', 'Ort:', 'Bewerbungsfrist:' from RSS descriptions."""
    pattern = rf"{label}\s*:\s*<strong>([^<]+)</strong>"
    m = re.search(pattern, desc, re.IGNORECASE)
    if m:
        return m.group(1).strip()
    return ""


def load_all_scraped_sources():
    """Load categorized opportunities from public/data/jobs.json."""
    basque_offers = []
    academic_dach_offers = []
    climate_tech_offers = []
    intl_offers = []

    if not os.path.exists(JOBS_DATA_PATH):
        return basque_offers, academic_dach_offers, climate_tech_offers, intl_offers

    try:
        with open(JOBS_DATA_PATH, "r", encoding="utf-8") as f:
            all_jobs = json.load(f)

        for j in all_jobs:
            src = j.get("sourceId", "").lower()
            title = j.get("title", "")
            company = j.get("company", "")
            desc = j.get("rawDescription", "")
            matched = j.get("matchedKeywords", [])
            deadline = j.get("deadline", "Consultar convocatoria")
            salary = j.get("salary", "")

            # Excluir ofertas caducadas
            if deadline and is_deadline_expired(deadline):
                continue

            # 1. Basque / Spanish Institutions
            if any(k in src for k in ["bc3", "tecnalia", "neiker", "ihobe", "idom"]):
                basque_offers.append({
                    "title": title,
                    "company": company,
                    "location": j.get("location", "Euskadi / España"),
                    "url": j.get("url", ""),
                    "deadline": deadline or "Convocatoria activa",
                    "salary": salary or "Escala I+D+i / Convenio entidad",
                    "score": 92,
                    "snippet": desc[:240] + "..."
                })

            # 2. Category 1: DACH Academic & Research Centers
            elif any(k in src for k in ["ethz", "eawag", "freiburg", "univie", "boku", "juelich"]):
                academic_dach_offers.append({
                    "title": title,
                    "company": company,
                    "location": j.get("location", "Suiza / Alemania / Austria"),
                    "url": j.get("url", ""),
                    "deadline": deadline,
                    "salary": salary or "Escala Académica Oficial (TV-L / TVöD / ETH)",
                    "score": 90,
                    "snippet": desc[:240] + "..."
                })

            # 3. Category 2: Climate Tech & Earth Observation Startups (ATS APIs)
            elif any(k in src for k in ["planet", "constellr", "sylvera", "ororatech", "mitiga", "pachama"]):
                climate_tech_offers.append({
                    "title": title,
                    "company": company,
                    "location": j.get("location", "Europa / Remoto"),
                    "url": j.get("url", ""),
                    "deadline": "Vacante activa en ATS",
                    "salary": salary or "Compensación Startup / Scale-up",
                    "score": 88,
                    "snippet": desc[:240] + "..."
                })

            # 4. Global aggregators & remote
            elif any(k in src for k in ["arbeitnow", "remotive", "jobicy"]):
                if len(matched) >= 2 or any(w in (title + " " + desc).lower() for w in ["climate", "carbon", "soil", "eddy", "remote sensing", "gis"]):
                    score = min(90, 65 + (len(matched) * 7))
                    intl_offers.append({
                        "title": title,
                        "company": company,
                        "location": j.get("location", "Remoto / Europa"),
                        "url": j.get("url", ""),
                        "deadline": "Consultar web",
                        "salary": "Salario según mercado",
                        "score": score,
                        "snippet": desc[:200] + "..."
                    })

        # Sort lists by match score
        academic_dach_offers.sort(key=lambda x: x["score"], reverse=True)
        climate_tech_offers.sort(key=lambda x: x["score"], reverse=True)
        intl_offers.sort(key=lambda x: x["score"], reverse=True)

    except Exception as e:
        print(f"[!] Aviso al leer jobs.json: {e}")

    return basque_offers, academic_dach_offers, climate_tech_offers, intl_offers


def fetch_bund_rss_jobs(keywords: list):
    """Fetch and parse service.bund.de RSS feed, filtering by keywords."""
    print(f"[*] Conectando con {BUND_RSS_URL}...")
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)"
    }
    req = urllib.request.Request(BUND_RSS_URL, headers=headers)
    matched = []

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = resp.read()
            root = ET.fromstring(data)
            items = root.findall(".//item")
            print(f"[*] Analizando {len(items)} ofertas publicadas en service.bund.de...")

            for item in items:
                title = (item.find("title").text or "").strip()
                desc = (item.find("description").text or "").strip()
                link = (item.find("link").text or "").strip()
                pub_date = (item.find("pubDate").text or "").strip()

                employer = extract_field_from_desc(desc, "Arbeitgeber")
                location = extract_field_from_desc(desc, "Ort")
                deadline = extract_field_from_desc(desc, "Bewerbungsfrist")

                # 1. Filtro estricto de caducidad: descartar ofertas cuyo plazo ya venció
                if deadline and is_deadline_expired(deadline):
                    continue

                # 2. Exclusión de roles no científicos ni alineados con el perfil (educación infantil, ventas, etc.)
                title_lower = title.lower()
                if any(re.search(exc, title_lower) for exc in EXCLUDED_ROLE_PATTERNS):
                    continue

                full_text = f"{title} {desc} {employer} {location}".lower()

                match_count = sum(1 for kw in keywords if kw.lower() in full_text)
                is_high_priority = any(emp in full_text for emp in HIGH_PRIORITY_EMPLOYERS)

                if match_count > 0 or is_high_priority:
                    # Detectar si el cierre es inminente (plazo en <= 7 días)
                    parsed_dl = parse_deadline(deadline)
                    is_urgent = False
                    if parsed_dl:
                        days_left = (parsed_dl - datetime.utcnow().date()).days
                        is_urgent = 0 <= days_left <= 7

                    score = min(95, 60 + (match_count * 8) + (15 if is_high_priority else 0))
                    matched.append({
                        "title": title,
                        "company": employer or "Administración Pública Federal",
                        "location": location or "Alemania",
                        "url": link,
                        "deadline": deadline or "Consultar convocatoria",
                        "salary": "TVöD Bund / TV-L (según convocatoria)",
                        "pub_date": pub_date,
                        "score": score,
                        "urgent": is_urgent,
                        "snippet": clean_html(desc)[:220] + "..."
                    })

    except Exception as e:
        print(f"[!] Aviso al consultar RSS de bund.de: {e}")

    matched.sort(key=lambda x: x["score"], reverse=True)
    return matched


def get_verified_live_slice(offers: list, limit: int = 6) -> list:
    """Select up to `limit` offers ensuring each link is active, stopping early to avoid delays."""
    verified = []
    for o in offers:
        url = o.get("url")
        if url and is_url_live(url, timeout=3):
            verified.append(o)
            if len(verified) >= limit:
                break
    return verified


def build_html_digest(recipient: str, academic_dach: list, climate_tech: list, basque_offers: list, bund_rss_offers: list, intl_offers: list, run_date: str) -> str:
    """Generate a multi-theater, responsive HTML email digest with 100% verified live URLs."""
    # Pre-flight verify URLs lazily with early exit
    live_academic = get_verified_live_slice(academic_dach, limit=6)
    live_climate = get_verified_live_slice(climate_tech, limit=6)
    live_bund = get_verified_live_slice(bund_rss_offers, limit=6)
    live_basque = get_verified_live_slice(basque_offers, limit=4)
    live_intl = get_verified_live_slice(intl_offers, limit=3)

    total_offers = len(live_academic) + len(live_climate) + len(live_basque) + len(live_bund) + len(live_intl)

    def render_card(off, border_color="#10b981", badge_text=None):
        badge = badge_text or f"MATCH {off.get('score', 85)}%"
        urgent_badge = """<span style="background: rgba(239, 68, 68, 0.2); color: #ef4444; font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 4px; text-transform: uppercase; margin-right: 6px;">⚠️ PLAZO INMINENTE</span>""" if off.get("urgent") else ""

        return f"""
        <div style="background: #111827; border: 1px solid #1f2937; border-left: 4px solid {border_color}; border-radius: 8px; padding: 16px; margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                <div>
                    {urgent_badge}
                    <span style="background: rgba(16, 185, 129, 0.15); color: #10b981; font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 4px; text-transform: uppercase;">
                        {badge}
                    </span>
                </div>
                <span style="color: #f59e0b; font-size: 11px; font-weight: 600;">
                    📅 {off.get('deadline', 'Activa')}
                </span>
            </div>
            <h3 style="color: #ffffff; margin: 6px 0 4px 0; font-size: 15px; line-height: 1.4;">
                <a href="{off['url']}" style="color: #38bdf8; text-decoration: none;">{off['title']}</a>
            </h3>
            <p style="color: #9ca3af; font-size: 12px; margin: 0 0 8px 0;">
                🏢 <strong>{off['company']}</strong> • 📍 {off['location']}
            </p>
            {f'''<div style="background: #0f172a; padding: 8px 10px; border-radius: 6px; font-size: 12px; color: #cbd5e1; margin-bottom: 8px;">
                💰 <strong>Convenio / Salario:</strong> {off.get('salary', 'A convenir')}{f"<br/>🔬 <strong>Área:</strong> {off.get('project')}" if off.get('project') else ''}
            </div>''' if off.get('salary') else ''}
            <p style="color: #94a3b8; font-size: 12px; margin: 0 0 10px 0; line-height: 1.5;">
                {off['snippet']}
            </p>
            <a href="{off['url']}" style="display: inline-block; background: #0284c7; color: #ffffff; text-decoration: none; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 600;">
                Abrir Convocatoria Oficial &rarr;
            </a>
        </div>
        """

    academic_cards = "".join(render_card(o, border_color="#0284c7") for o in live_academic)
    climate_tech_cards = "".join(render_card(o, border_color="#10b981") for o in live_climate)
    bund_cards = "".join(render_card(o, border_color="#8b5cf6") for o in live_bund)
    basque_cards = "".join(render_card(o, border_color="#14b8a6") for o in live_basque)
    intl_cards = "".join(render_card(o, border_color="#06b6d4") for o in live_intl)

    html = f"""
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="utf-8">
        <title>Boletín Unificado de Empleo e Investigación - 09:00 AM</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #030712; color: #f3f4f6; padding: 24px 12px; margin: 0;">
        <div style="max-width: 680px; margin: 0 auto; background: #0a0f1d; border: 1px solid #1e293b; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #065f46, #0369a1); padding: 24px; text-align: left;">
                <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #a7f3d0; font-weight: 700;">
                    Job Search OS (Empleo) • Alerta Diaria Multifuente
                </div>
                <h1 style="color: #ffffff; margin: 8px 0 4px 0; font-size: 22px;">
                    {total_offers} Convocatorias 100% Verificadas Hoy
                </h1>
                <p style="color: #e0f2fe; margin: 0; font-size: 13px;">
                    Informe matutino para <strong>{recipient}</strong> • {run_date}
                </p>
            </div>

            <!-- Content Container -->
            <div style="padding: 24px;">
                <p style="color: #94a3b8; font-size: 13px; margin-top: 0; line-height: 1.5;">
                    Rastreo automático en tiempo real: 100% de enlaces accesibles y vigentes en universidades DACH, startups climáticas y sector público federal:
                </p>

                <!-- Section 1: Centros Académicos DACH (Cat. 1) -->
                {f'''
                <div style="margin-top: 20px;">
                    <div style="font-size: 12px; font-weight: 700; color: #0284c7; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.5px;">
                        🎓 1. Universidades y Centros DACH (ETH Zürich, Eawag, Freiburg, UniVie)
                    </div>
                    {academic_cards}
                </div>
                ''' if academic_cards else ''}

                <!-- Section 2: Startups & MRV Satelital (Cat. 2 ATS APIs) -->
                {f'''
                <div style="margin-top: 26px;">
                    <div style="font-size: 12px; font-weight: 700; color: #10b981; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.5px;">
                        🛰️ 2. Startups Climáticas, Satelitales y MRV (Planet Labs, ConstellR, Sylvera)
                    </div>
                    {climate_tech_cards}
                </div>
                ''' if climate_tech_cards else ''}

                <!-- Section 3: Sector Público Federal Alemán -->
                {f'''
                <div style="margin-top: 26px;">
                    <div style="font-size: 12px; font-weight: 700; color: #a855f7; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.5px;">
                        🏛️ 3. Convocatorias Oficiales en Alemania (service.bund.de / Thünen / UBA / BfN)
                    </div>
                    {bund_cards}
                </div>
                ''' if bund_cards else ''}

                <!-- Section 4: Euskadi & España -->
                {f'''
                <div style="margin-top: 26px;">
                    <div style="font-size: 12px; font-weight: 700; color: #14b8a6; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.5px;">
                        🌿 4. Centros de I+D en Euskadi & España (BC3, Tecnalia, Neiker, IHOBE, IDOM)
                    </div>
                    {basque_cards}
                </div>
                ''' if basque_cards else ''}

                <!-- Section 5: Remoto & Global -->
                {f'''
                <div style="margin-top: 26px;">
                    <div style="font-size: 12px; font-weight: 700; color: #06b6d4; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.5px;">
                        🌍 5. Oportunidades Remotas & Internacionales (Arbeitnow, Remotive)
                    </div>
                    {intl_cards}
                </div>
                ''' if intl_cards else ''}

                <!-- Footer -->
                <div style="margin-top: 28px; padding-top: 18px; border-top: 1px solid #1e293b; text-align: center;">
                    <p style="color: #64748b; font-size: 11px; margin: 0;">
                        Generado automáticamente por Job Search OS mediante ingestión de APIs de ATS, RSS y web scraping.<br/>
                        Gestión 100% privada sin intermediarios comerciales.
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """
    return html


def send_via_resend(api_key: str, recipient: str, subject: str, html_content: str):
    """Deliver email using Resend HTTP API."""
    print(f"[*] Enviando digest mediante Resend API a {recipient}...")
    url = "https://api.resend.com/emails"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "User-Agent": "JobSearchOS/1.0"
    }
    payload = {
        "from": "Job Search OS <onboarding@resend.dev>",
        "to": [recipient],
        "subject": subject,
        "html": html_content
    }
    req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            res = json.loads(resp.read().decode("utf-8"))
            print(f"[✓] Email enviado con éxito vía Resend (ID: {res.get('id', 'ok')})")
            return True
    except urllib.error.HTTPError as e:
        error_msg = e.read().decode("utf-8")
        print(f"[!] Error Resend HTTP {e.code}: {error_msg}")
        return False
    except Exception as e:
        print(f"[!] Excepción en envío Resend: {e}")
        return False


def send_via_smtp(host: str, port: int, user: str, password: str, recipient: str, subject: str, html_content: str):
    """Deliver email using secure SMTP (trying SSL 465 first, then STARTTLS 587)."""
    clean_pass = password.replace(" ", "").strip()
    clean_user = user.strip()

    print(f"[*] Preparando envío SMTP hacia {recipient} desde {clean_user}...")
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"Job Search OS <{clean_user}>"
    msg["To"] = recipient

    part = MIMEText(html_content, "html")
    msg.attach(part)

    context = ssl.create_default_context()

    # Method 1: SMTP_SSL over port 465 (most reliable from cloud environments)
    try:
        print("[*] Intentando envío directo seguro SMTP_SSL (puerto 465)...")
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context, timeout=25) as server:
            server.login(clean_user, clean_pass)
            server.sendmail(clean_user, recipient, msg.as_string())
        print(f"[✓] Email enviado con éxito vía SMTP SSL (465) a {recipient}")
        return True
    except Exception as e_ssl:
        print(f"[!] Conexión SSL 465 fallida ({e_ssl}). Reintentando con STARTTLS (puerto 587)...")

    # Method 2: Fallback to STARTTLS over port 587
    try:
        with smtplib.SMTP("smtp.gmail.com", 587, timeout=25) as server:
            server.ehlo()
            server.starttls(context=context)
            server.ehlo()
            server.login(clean_user, clean_pass)
            server.sendmail(clean_user, recipient, msg.as_string())
        print(f"[✓] Email enviado con éxito vía STARTTLS (587) a {recipient}")
        return True
    except Exception as e_tls:
        print(f"[!] Error crítico en envío SMTP (587): {e_tls}")
        return False


def main():
    parser = argparse.ArgumentParser(description="Job Search OS Daily Job Alert Pipeline")
    parser.add_argument("--to", default=os.getenv("ALERT_RECIPIENT_EMAIL", DEFAULT_RECIPIENT), help="Recipient email")
    parser.add_argument("--preview-only", action="store_true", help="Do not send, only write preview HTML file")
    parser.add_argument("--force-send", action="store_true", help="Force send even if alerts are paused")
    args = parser.parse_args()

    # 0. KILL-SWITCH PREVENTIVO: Detener envíos automáticos para prevenir alucinaciones
    is_force_enabled = args.force_send or os.getenv("ENABLE_JOB_ALERTS", "false").lower() == "true"
    if not is_force_enabled and not args.preview_only:
        print("[!] ===========================================================================")
        print("[!] ALERTAS CANCELADAS PREVENTIVAMENTE:")
        print("[!] El pipeline de alertas automáticas por correo está desactivado.")
        print("[!] Ningún correo será enviado para evitar enlaces inexistentes o no verificados.")
        print("[!] Para generar solo la vista previa local HTML use: --preview-only")
        print("[!] Para forzar un envío intencional use: --force-send")
        print("[!] ===========================================================================")
        sys.exit(0)

    recipient = args.to
    now_str = datetime.now().strftime("%d de %B de %Y a las 09:00 CEST")

    print("==================================================")
    print("🚀 Job Search OS - Pipeline de Alertas Matutinas")
    print(f"   Destinatario: {recipient}")
    print(f"   Fecha: {now_str}")
    print("==================================================")

    # 1. Load categorized opportunities from jobs.json
    basque_offers, academic_dach, climate_tech, intl_offers = load_all_scraped_sources()
    print(f"[*] Ingestadas desde jobs.json: {len(academic_dach)} académicas DACH, {len(climate_tech)} startups climáticas/ATS, {len(basque_offers)} Euskadi/España, {len(intl_offers)} internacionales.")

    # 2. Fetch service.bund.de RSS feed
    rss_matches = fetch_bund_rss_jobs(DEFAULT_KEYWORDS)
    print(f"[*] Encontradas {len(rss_matches)} ofertas coincidentes en service.bund.de")

    # 3. Build Multi-theater HTML Digest (100% verified live links)
    html_content = build_html_digest(recipient, academic_dach, climate_tech, basque_offers, rss_matches, intl_offers, now_str)
    subject = f"🎯 [Empleo 9:00 AM] Convocatorias Verificadas: DACH, Climate-Tech & Alemania"

    # 4. Save local preview
    preview_path = os.path.join(os.path.dirname(__file__), "latest_job_digest.html")
    with open(preview_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"[✓] Previsualización HTML guardada en: {preview_path}")

    if args.preview_only:
        print("[*] Modo --preview-only activado. No se realiza envío de red.")
        return

    # 5. Dispatch real email
    resend_api_key = os.getenv("RESEND_API_KEY")
    smtp_user = os.getenv("SMTP_USER") or os.getenv("ALERT_RECIPIENT_EMAIL") or DEFAULT_RECIPIENT
    smtp_pass = os.getenv("SMTP_PASS")
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))

    delivered = False
    if resend_api_key:
        delivered = send_via_resend(resend_api_key, recipient, subject, html_content)
    elif smtp_user and smtp_pass:
        delivered = send_via_smtp(smtp_host, smtp_port, smtp_user, smtp_pass, recipient, subject, html_content)
    else:
        print("[!] No se detectaron credenciales RESEND_API_KEY ni SMTP_USER/SMTP_PASS en variables de entorno.")
        print(f"    El archivo local {preview_path} contiene el correo renderizado completo.")
        return

    if delivered:
        print("[*] Pipeline finalizado con éxito. Correo entregado en destino.")
    else:
        print("[!] Error en la entrega del correo. Revisa tus credenciales SMTP o API key.")
        sys.exit(1)


if __name__ == "__main__":
    main()
