# Ta-SIEMPlus

**Operative Dokumentation & Workflow-Tools für standardisierte Wazuh SIEM Wartungsabläufe.**
Reproduzierbar · Auditierbar · Operator-freundlich

---

## Zugriff

| | URL |
|---|---|
| **Dokumentation** | [istagmbh.github.io/Ta-SIEMPlus](https://istagmbh.github.io/Ta-SIEMPlus/) |
| **Web-Tools** | [istagmbh.github.io/Ta-SIEMPlus/latest/webforms/](https://istagmbh.github.io/Ta-SIEMPlus/latest/webforms/) |

Kein lokales Setup nötig – alles läuft direkt im Browser.

---

## Web-Tools

| Tool | Beschreibung |
|---|---|
| Upgrade-Formular | Geführter Wazuh AIO Upgrade-Workflow mit PDF-Export |
| Checklisten-Generator | Individuelle Checklisten erstellen & exportieren |
| Agent-Verwaltung | CLI-Befehle für Agentengruppen generieren |
| Wartungsprotokoll | Strukturierte Wartungsdokumentation mit Timer |

---

## Dokumentation

| Bereich | Inhalt |
|---|---|
| [Quick Reference](docs/quick-reference.md) | Copy-Paste Befehle & Health Checks |
| [Runbooks](docs/runbooks/) | Detaillierte SOPs (Upgrade, Agent Groups) |
| [Checklists](docs/checklists/) | Change-Management-Checklisten |
| [Catalog](docs/catalog/) | Kunden- & Infrastruktur-Registry |
| [Templates](docs/templates/) | Dokumentationsvorlagen |
| [Config Templates](docs/config-templates/) | Befüllbare Konfigurationsvorlagen (ossec.conf, opensearch.yml, filebeat.yml) |

---

## Projektstruktur

```
Ta-SIEMPlus/
├── README.md                   # Projektübersicht (hier)
├── CONTRIBUTING.md             # Governance & PR-Prozess
├── LICENSE                     # MIT
│
├── docs/                       # Einzige Wahrheitsquelle (Single Source of Truth)
│   ├── index.md                # Dokumentations-Startseite
│   ├── getting-started.md      # Erste Schritte
│   ├── quick-reference.md      # Befehls-Referenz
│   ├── navigation.md           # Projekt-Übersichtskarte
│   ├── webforms/               # Interaktive HTML-Tools (via GitHub Pages)
│   ├── tools/                  # Tools-Landingpage
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
