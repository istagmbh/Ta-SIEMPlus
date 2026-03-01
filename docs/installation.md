# 📦 Installation & Setup Guide

Dieses Dokument beschreibt die Installation und Inbetriebnahme von Ta-SIEMPlus.

---

## 📋 Überblick

Ta-SIEMPlus ist ein **dokumentationsbasiertes System** - es erfordert keine Installation im traditionellen Sinne. Allerdings gibt es verschiedene Nutzungsszenarien, für die unterschiedliche Setup-Schritte erforderlich sind.

**Wählen Sie Ihr Szenario:**
- [🌐 Option A: Web-Interface (Empfohlen)](#option-a-web-interface-empfohlen) - Für interaktive Nutzung mit Formularen
- [📝 Option B: Markdown-Only](#option-b-markdown-only) - Für direkten Zugriff auf Markdown-Dateien
- [🐳 Option C: Docker Deployment](#option-c-docker-deployment) - Für Team-/Produktiv-Nutzung

---

## 🎯 Systemvoraussetzungen

### Minimale Anforderungen (Markdown-Only)
- Git (Version 2.x oder höher)
- Texteditor (VS Code, Sublime, Vim, etc.)
- Markdown-Viewer (optional, aber empfohlen)

### Erweiterte Anforderungen (Web-Interface)
- **Option 1 - Browser-basiert:** Moderner Webbrowser (Chrome, Firefox, Safari, Edge)
- **Option 2 - HTTP-Server:** Python 3.x oder Node.js
- **Option 3 - MkDocs:** Python 3.8+, pip

### Docker Deployment
- Docker 20.x oder höher
- Docker Compose 2.x oder höher
- 512 MB freier RAM
- 1 GB freier Speicherplatz

---

## 🚀 Option A: Web-Interface (Empfohlen)

Dies ist die **einfachste und schnellste** Methode für neue Benutzer.

### Schritt 1: Repository klonen

```bash
# HTTPS (empfohlen für read-only)
git clone https://github.com/istagmbh/Ta-SIEMPlus.git

# oder SSH (für Contributors)
git clone git@github.com:istagmbh/Ta-SIEMPlus.git

# In Verzeichnis wechseln
cd Ta-SIEMPlus
```

### Schritt 2: Web-Formulare öffnen

**Variante 2.1: Direkt im Browser (keine Installation)**

```bash
# macOS
open webforms/index.html

# Linux
xdg-open webforms/index.html

# Windows
start webforms\index.html
```

✅ **Fertig!** Die Web-Formulare funktionieren sofort ohne Server.

---

**Variante 2.2: Mit lokalem HTTP-Server (optional)**

Wenn direkte Datei-URLs nicht funktionieren:

```bash
# Mit Python (empfohlen)
cd webforms
python3 -m http.server 8000

# Mit Node.js
npx http-server webforms -p 8000

# Dann öffnen: http://localhost:8000
```

### Schritt 3: Web-Interface nutzen

Nach dem Öffnen sehen Sie:
- **Übersichtsseite** mit Links zu allen Formularen
- **Upgrade-Formular** - Für Wazuh-Upgrades
- **Checklisten-Generator** - Interaktive Checklisten
- **Agent-Verwaltung** - Wazuh-Agentengruppen
- **Wartungsprotokolle** - Dokumentation von Wartungsarbeiten

**Erste Schritte:**
1. Öffnen Sie `webforms/index.html`
2. Wählen Sie das gewünschte Formular
3. Füllen Sie die Felder aus
4. Generieren Sie PDF oder exportieren Sie Markdown

📖 **Siehe auch:** [Web-Formular Dokumentation](WEB_TOOLS_INTEGRATION.md)

---

## 📝 Option B: Markdown-Only

Für Nutzer, die direkt mit Markdown-Dateien arbeiten möchten.

### Schritt 1: Repository klonen

```bash
git clone https://github.com/istagmbh/Ta-SIEMPlus.git
cd Ta-SIEMPlus
```

### Schritt 2: Editor öffnen

```bash
# VS Code (empfohlen)
code .

# Oder öffne einzelne Dateien
open README.md
```

### Schritt 3: Navigation verstehen

```
Ta-SIEMPlus/
├── README.md                 ← Projekt-Überblick (START HIER)
├── GETTING_STARTED.md        ← Erste Schritte
├── NAVIGATION.md             ← Karte aller Dateien
├── runbooks/                 ← Detaillierte Anleitungen
├── checklists/               ← Ticket-Templates
├── Catalog/                  ← Kunden-Registry
└── templates/                ← Dokumentationsvorlagen
```

### Schritt 4: Workflow starten

1. Lesen Sie [GETTING_STARTED.md](GETTING_STARTED.md)
2. Wählen Sie Ihr Szenario (Upgrade, Agent-Verwaltung, etc.)
3. Folgen Sie den Runbooks in `runbooks/`
4. Nutzen Sie Checklisten aus `checklists/`

---

## 🐳 Option C: Docker Deployment

Für Team-Nutzung oder Produktiv-Deployments mit MkDocs.

### Schritt 1: Repository klonen

```bash
git clone https://github.com/istagmbh/Ta-SIEMPlus.git
cd Ta-SIEMPlus
```

### Schritt 2: Docker Container starten

```bash
# Container bauen und starten
docker-compose up -d

# Status prüfen
docker-compose ps

# Logs anzeigen
docker-compose logs -f docs
```

### Schritt 3: Dokumentation aufrufen

Öffnen Sie im Browser:
```
http://localhost:8080
```

Sie sehen eine **vollständige, durchsuchbare MkDocs-Dokumentation** mit:
- ✅ Navigation durch alle Bereiche
- ✅ Volltextsuche
- ✅ Dark/Light Mode
- ✅ Versionierung (Upgrade Guides)
- ✅ Responsive Design

### Schritt 4: Container verwalten

```bash
# Container stoppen
docker-compose down

# Container neu starten
docker-compose restart

# Container entfernen (Daten bleiben erhalten)
docker-compose down -v

# Neu bauen nach Änderungen
docker-compose up -d --build
```

### Produktiv-Deployment

Für Produktion mit eigenem Hostnamen:

```bash
# 1. docker-compose.yml anpassen
nano docker-compose.yml

# 2. Nginx-Konfiguration anpassen
nano nginx.conf

# 3. SSL-Zertifikate hinzufügen (optional)
mkdir -p ssl/
cp /path/to/cert.pem ssl/
cp /path/to/key.pem ssl/

# 4. Container starten
docker-compose up -d
```

**Nginx Reverse Proxy Beispiel:**

```nginx
server {
    listen 443 ssl http2;
    server_name docs.example.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 🔧 MkDocs Lokal (ohne Docker)

Für Entwickler oder lokale Dokumentations-Entwicklung.

### Schritt 1: Python-Umgebung vorbereiten

```bash
# Python 3.8+ erforderlich
python3 --version

# Virtual Environment erstellen (empfohlen)
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# oder
venv\Scripts\activate  # Windows
```

### Schritt 2: Abhängigkeiten installieren

```bash
# MkDocs und Plugins installieren
pip install mkdocs mkdocs-material mike

# oder aus requirements.txt (wenn vorhanden)
pip install -r requirements.txt
```

### Schritt 3: Entwicklungsserver starten

```bash
# MkDocs Dev-Server starten
mkdocs serve

# Öffne http://localhost:8000
```

**Features des Dev-Servers:**
- ✅ Live-Reload bei Änderungen
- ✅ Sofortiges Feedback
- ✅ Perfekt für Dokumentations-Entwicklung

### Schritt 4: Statische Site bauen (optional)

```bash
# Site bauen
mkdocs build

# Ergebnis in site/ Verzeichnis
ls -l site/

# Site mit einfachem HTTP-Server testen
python3 -m http.server -d site 8000
```

---

## 📚 Versionierung (für Upgrade Guides)

Ta-SIEMPlus nutzt **mike** für versionierte Dokumentation.

### Mike Setup

```bash
# Mike ist bereits installiert (siehe Schritt 2 oben)

# Versionen anzeigen
mike list

# Neue Version deployen
mike deploy 4.12 latest --update-aliases

# Version als Default setzen
mike set-default latest

# Lokales Testen
mike serve
```

### Versionierungs-Workflow

```bash
# 1. Upgrade Guide für Version 4.13 erstellen
mkdir -p docs/upgrade-guides/4.13
nano docs/upgrade-guides/4.13/index.md

# 2. In mkdocs.yml eintragen
nano mkdocs.yml

# 3. Version deployen
mike deploy 4.13 --update-aliases

# 4. Als "latest" markieren
mike deploy 4.13 latest --update-aliases
```

📖 **Details:** Siehe [Mike Versioning Guide](docs/reference/mike-versioning.md)

---

## ✅ Validierung & Troubleshooting

### Installation überprüfen

Nach der Installation sollten folgende Tests erfolgreich sein:

```bash
# Test 1: Repository-Struktur
ls -l README.md GETTING_STARTED.md runbooks/ checklists/
# Erwartung: Alle Dateien existieren

# Test 2: Web-Formulare (Browser)
# Öffne webforms/index.html
# Erwartung: Formulare laden ohne Fehler

# Test 3: MkDocs (wenn installiert)
mkdocs serve
# Erwartung: Server startet auf http://localhost:8000

# Test 4: Docker (wenn genutzt)
docker-compose ps
# Erwartung: Container "ta-siemplus-docs" läuft
```

### Häufige Probleme

#### Problem: Git Clone schlägt fehl

**Symptom:** `Permission denied` oder `Repository not found`

**Lösung:**
```bash
# Verwende HTTPS statt SSH
git clone https://github.com/istagmbh/Ta-SIEMPlus.git

# Oder konfiguriere SSH-Key
ssh-keygen -t ed25519 -C "your_email@example.com"
# Füge Key zu GitHub hinzu: https://github.com/settings/keys
```

#### Problem: Web-Formulare laden nicht

**Symptom:** Weiße Seite oder Fehler beim Öffnen

**Lösung:**
```bash
# Option 1: HTTP-Server nutzen (siehe Option A, Variante 2.2)
python3 -m http.server 8000

# Option 2: Browser-Einstellungen prüfen
# - JavaScript aktiviert?
# - Pop-up-Blocker deaktiviert?
# - Console-Fehler (F12) prüfen
```

#### Problem: Docker Container startet nicht

**Symptom:** `docker-compose up` schlägt fehl

**Lösung:**
```bash
# Docker läuft?
docker info

# Port 8080 bereits belegt?
lsof -i :8080  # Mac/Linux
netstat -ano | findstr :8080  # Windows

# Port in docker-compose.yml ändern
nano docker-compose.yml
# Ändere "8080:80" zu "8888:80"

# Neu starten
docker-compose down
docker-compose up -d
```

#### Problem: MkDocs Build schlägt fehl

**Symptom:** `mkdocs build` gibt Fehler aus

**Lösung:**
```bash
# Python-Version prüfen (mind. 3.8)
python3 --version

# Abhängigkeiten neu installieren
pip install --upgrade mkdocs mkdocs-material mike

# Cache löschen
rm -rf site/

# Neu bauen
mkdocs build
```

#### Problem: Markdown-Links funktionieren nicht

**Symptom:** Klick auf Links führt zu 404

**Lösung:**
- Für **lokale Datei-URLs**: Relative Pfade verwenden
- Für **HTTP-Server**: Absolute Pfade ab Repository-Root
- Für **MkDocs**: Pfade relativ zu `docs/` Verzeichnis

---

## 🔄 Updates & Wartung

### Repository aktualisieren

```bash
# In Repository-Verzeichnis
cd Ta-SIEMPlus

# Aktuelle Änderungen abrufen
git fetch

# Auf neueste Version aktualisieren
git pull origin main

# Bei Docker: Container neu bauen
docker-compose up -d --build
```

### Automatische Updates (optional)

```bash
# Cron-Job für tägliche Updates (Linux/Mac)
crontab -e

# Füge hinzu:
0 2 * * * cd /path/to/Ta-SIEMPlus && git pull && docker-compose up -d --build
```

---

## 🎓 Nächste Schritte

Nach erfolgreicher Installation:

1. **📖 Erste Schritte lesen**
   ```bash
   open GETTING_STARTED.md
   ```

2. **🗺️ Navigation verstehen**
   ```bash
   open NAVIGATION.md
   ```

3. **⚡ Schnellreferenz bookmarken**
   ```bash
   open QUICK_REFERENCE.md
   ```

4. **🔧 Erstes Szenario durchführen**
   - Wähle in [GETTING_STARTED.md](GETTING_STARTED.md) dein Szenario
   - Folge der Schritt-für-Schritt-Anleitung
   - Nutze Web-Formulare oder Markdown-Checklisten

---

## 📞 Support & Hilfe

| Frage | Antwort |
|-------|---------|
| **Welche Option soll ich wählen?** | Web-Interface (Option A) für Anfänger, Markdown (Option B) für Power-User, Docker (Option C) für Teams |
| **Brauche ich Internet?** | Nur für Git Clone. Danach funktioniert alles offline (außer MkDocs-Suche) |
| **Kann ich mehrere Optionen nutzen?** | Ja! Web-Formulare + Markdown ist eine gute Kombination |
| **Wo finde ich Beispiele?** | In [GETTING_STARTED.md](GETTING_STARTED.md) unter "Workflow-Beispiel" |
| **Wie aktualisiere ich?** | `git pull` für Updates, `docker-compose up -d --build` für Docker |

**Weitere Hilfe:**
- 📖 [README.md](README.md) - Projekt-Überblick
- 🚀 [GETTING_STARTED.md](GETTING_STARTED.md) - Erste Schritte
- 🗺️ [NAVIGATION.md](NAVIGATION.md) - Dateien-Karte
- 💬 [GitHub Issues](https://github.com/istagmbh/Ta-SIEMPlus/issues) - Fragen & Probleme

---

## ✨ Zusammenfassung

**Einfachste Installation (5 Minuten):**
```bash
# 1. Klonen
git clone https://github.com/istagmbh/Ta-SIEMPlus.git
cd Ta-SIEMPlus

# 2. Web-Formulare öffnen
open webforms/index.html  # Mac
xdg-open webforms/index.html  # Linux
start webforms\index.html  # Windows

# 3. Loslegen! 🚀
```

**Für Teams (Docker):**
```bash
# 1. Klonen
git clone https://github.com/istagmbh/Ta-SIEMPlus.git
cd Ta-SIEMPlus

# 2. Docker starten
docker-compose up -d

# 3. Öffnen: http://localhost:8080
```

---

**Installation erfolgreich! Viel Erfolg mit Ta-SIEMPlus! 🎉**

Nächster Schritt → [GETTING_STARTED.md](GETTING_STARTED.md)
