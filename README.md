# Ta-SIEMPlus

**Operative Dokumentation & Workflow-Tools für standardisierte Wazuh SIEM Wartungsabläufe.**
Reproduzierbar · Auditierbar · Operator-freundlich

---

## Schnellstart

```bash
git clone https://github.com/istagmbh/Ta-SIEMPlus.git
cd Ta-SIEMPlus

# Option A – Web-Tools direkt öffnen (kein Server nötig)
open webforms/index.html          # macOS
xdg-open webforms/index.html      # Linux
start webforms\index.html         # Windows

# Option B – Dokumentationsseite mit Docker starten
docker-compose up -d              # http://localhost:8080

# Option C – Lokale MkDocs-Entwicklung
pip install mkdocs mkdocs-material mike
mkdocs serve                      # http://localhost:8000
```

---

## Web-Tools (`webforms/`)

| Tool | Datei | Zweck |
|---|---|---|
| Hub | `index.html` | Übersicht aller Tools |
| Upgrade-Formular | `upgrade-form.html` | 5-stufiger Upgrade-Wizard mit PDF-Export |
| Checklisten-Generator | `checklist-generator.html` | Individuelle Checklisten erstellen & exportieren |
| Agent-Verwaltung | `agent-management.html` | CLI-Befehle für Agentengruppen generieren |
| Wartungsprotokoll | `maintenance-protocol.html` | Strukturierte Wartungsdokumentation mit Timer |

---

## Dokumentation (`docs/`)

| Bereich | Inhalt |
|---|---|
| [Quickstart](docs/getting-started.md) | Erste Schritte für alle Szenarien |
| [Installation](docs/installation.md) | Setup-Anleitung (Web / Docker / Python) |
| [Quick Reference](docs/quick-reference.md) | Copy-Paste Befehle & Health Checks |
| [Runbooks](docs/runbooks/) | Detaillierte SOPs (Upgrade, Agent Groups) |
| [Checklists](docs/checklists/) | Change-Management-Checklisten |
| [Catalog](docs/catalog/) | Kunden- & Infrastruktur-Registry |
| [Templates](docs/templates/) | Dokumentationsvorlagen |
| [Guides](docs/guides/) | How-To Anleitungen (Checklisten, Katalog) |
| [Config Templates](docs/config-templates/) | Befüllbare Konfigurationsvorlagen (ossec.conf, opensearch.yml, filebeat.yml) |

---

## Projektstruktur

```
Ta-SIEMPlus/
├── README.md                   # Projektübersicht (hier)
├── CONTRIBUTING.md             # Governance & PR-Prozess
├── LICENSE                     # MIT
│
├── webforms/                   # Interaktive HTML-Tools
│   ├── index.html              # Tool-Hub
│   ├── upgrade-form.html
│   ├── checklist-generator.html
│   ├── agent-management.html
│   ├── maintenance-protocol.html
│   └── assets/                 # CSS & Logo
│
├── docs/                       # Einzige Wahrheitsquelle (Single Source of Truth)
│   ├── index.md                # Dokumentations-Startseite
│   ├── getting-started.md      # Erste Schritte
│   ├── installation.md         # Installation & Setup
│   ├── quick-reference.md      # Befehls-Referenz
│   ├── navigation.md           # Projekt-Übersichtskarte
│   ├── overview/               # Architektur & Prinzipien
│   ├── runbooks/               # Schritt-für-Schritt Anleitungen
│   ├── checklists/             # Change-Checklisten
│   ├── upgrade-guides/         # Versionsspezifische Upgrades
│   ├── guides/                 # How-To Anleitungen
│   ├── reference/              # Deployment & Versioning
│   ├── catalog/                # Kunden-Registry (YAML)
│   ├── templates/              # Dokumentvorlagen
│   ├── config-templates/       # Befüllbare Konfig-Templates (ossec.conf, etc.)
│   └── assets/                 # Bilder & Logos
│
├── docker-compose.yml          # Docker-Deployment
├── Dockerfile.mkdocs           # Multi-Stage Build
├── mkdocs.yml                  # Dokumentationskonfiguration
└── nginx.conf                  # Webserver-Config
```

---

## Architektur-Prinzipien

**No-Go Gates** – Folgende Bedingungen stoppen jeden Prozess:
- Disk-Belegung > 90%
- Services nicht `active (running)`
- Kein Backup/Snapshot vorhanden
- Change nicht genehmigt oder außerhalb Wartungsfenster

**Health Snapshots** – Vor und nach jeder Änderung dokumentieren (Versions-Status, Disk, Services, Cluster-Health).

**Secrets** – Niemals Passwörter in Dateien eintragen. Immer `vault://`-Referenzen verwenden.

---

## Beitragen

Alle Änderungen via Pull Request · Minimum 1 Reviewer · Siehe [CONTRIBUTING.md](CONTRIBUTING.md)
