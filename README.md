# 📋 Managed SIEM – Runbooks & Checklisten (Wazuh)

> **Operative documentation system** für standardisierte Wazuh SIEM Wartungsabläufe.  
> Fokus: reproduzierbar, auditierbar, operator-freundlich.  
> **Jetzt mit MkDocs-basierter Dokumentationsseite!**

---

## 📚 DOKUMENTATION - Hauptzugriff

**NEU: MkDocs-basierte Dokumentationsseite mit Versionierung!**

### 🚀 Schnellstart

Die Dokumentation steht in zwei Formaten zur Verfügung:

1. **MkDocs Site (Empfohlen)** - Vollständig durchsuchbare, versionierte Dokumentation
2. **Markdown-Dateien** - Direkt im Repository verfügbar

### Lokale Dokumentation starten

```bash
# Mit Docker (Empfohlen)
docker-compose up -d
# Zugriff auf http://localhost:8080

# Mit Python/MkDocs
pip install mkdocs mkdocs-material mike
mkdocs serve
# Zugriff auf http://localhost:8000
```

### 📖 Dokumentationsstruktur

Die Dokumentation ist nach folgenden Bereichen organisiert:

- 🎯 **[Overview](docs/overview/index.md)** - Architekturprinzipien und Workflows
- 📖 **[Runbooks](docs/runbooks/index.md)** - Detaillierte Schritt-für-Schritt-Anleitungen
- ✅ **[Checklists](docs/checklists/index.md)** - Ticket-Templates für Change Management
- 🔄 **[Upgrade Guides](docs/upgrade-guides/index.md)** - Versionsspezifische Upgrade-Prozeduren
- ⚡ **[Reference](docs/reference/index.md)** - Schnelle Befehls-Lookups
- 👥 **[Catalog](docs/catalog/index.md)** - Kunden- und Infrastruktur-Registry
- 📝 **[Templates](docs/templates/index.md)** - Dokumentationsvorlagen

### 🔄 Versionierung

Die Upgrade Guides werden mit **mike** versioniert:

```bash
# Version deployen
mike deploy 4.12 latest --update-aliases

# Versionen anzeigen
mike list

# Lokal testen
mike serve
```

Siehe [Deployment Guide](docs/reference/deployment.md) für Details.

---

## 🎉 GUTE NACHRICHTEN! Dokumentation wurde modernisiert! 

**Dieses Projekt wurde im Februar 2026 mit MkDocs modernisiert:**

✅ MkDocs-basierte, durchsuchbare Dokumentationsseite  
✅ Versionierung für Upgrade Guides (mike)  
✅ Docker-basiertes Deployment mit Nginx  
✅ Material Design Theme mit Dark Mode  
✅ Strukturierte Navigation durch alle Bereiche  
✅ Bestehende Runbooks und Checklists integriert  

→ **[🐳 Siehe Deployment Guide](docs/reference/deployment.md)**

---

## 🎯 Schnelleinstieg (5 Minuten)

**Bist du neu hier?** → Lese: [**GETTING_STARTED.md**](GETTING_STARTED.md)  
**Du brauchst einen Befehl?** → Siehe: [**QUICK_REFERENCE.md**](QUICK_REFERENCE.md)  
**Du willst beitragen?** → Folge: [**CONTRIBUTING.md**](CONTRIBUTING.md)

---

## 📁 Projektstruktur

```
Ta-SIEMPlus/
│
├── 📘 README.md                        ← Projekt-Überblick (DU BIST HIER)
├── 🚀 GETTING_STARTED.md               ← Erste Schritte & Workflows
├── ⚡ QUICK_REFERENCE.md               ← Schnelle Befehls-Lookups
├── 📝 CONTRIBUTING.md                  ← Governance & Änderungen
│
├── 📂 docs/                            ← MkDocs-Dokumentation (NEU!)
│   ├── index.md                        ← Dokumentations-Startseite
│   ├── overview/                       ← Architektur & Prinzipien
│   ├── runbooks/                       ← Runbook-Index
│   ├── checklists/                     ← Checklist-Index
│   ├── upgrade-guides/                 ← Versionierte Upgrade-Guides
│   │   └── 4.12/                       ← Wazuh 4.12 Upgrade Guide
│   ├── reference/                      ← Befehls-Referenzen & Deployment
│   ├── catalog/                        ← Katalog-Dokumentation
│   └── templates/                      ← Template-Dokumentation
│
├── 📂 runbooks/                        ← Detaillierte Schritt-für-Schritt Anleitungen
│   ├── RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md
│   ├── RUNBOOK_WAZUH_AGENT_GROUP_MANAGEMENT.md
│   └── RUNBOOK-TEMPLATE.md
│
├── 📂 checklists/                      ← Ticket-/Change-Checklisten
│   ├── CHECKLIST_WAZUH_UPGRADE_AIO.md
│   ├── CHECKLIST_WAZUH_UPGRADE_AIO_IMPROVED.md
│   └── CHECKLIST-TEMPLATE.md
│
├── 📂 Catalog/                         ← Kunden- & Infrastruktur-Registry (YAML)
│   └── CUSTOMERS.md
│
├── 📂 templates/                       ← Vorlagen für Dokumente
│   └── CHANGE_NOTE_TEMPLATE.md
│
├── 🐳 Dockerfile.mkdocs                ← Docker Build für Dokumentation
├── 🐳 docker-compose.yml               ← Docker Compose Setup
├── 📝 mkdocs.yml                       ← MkDocs Konfiguration
├── 🌐 nginx.conf                       ← Nginx Webserver Config
│
└── 📄 LICENSE                          ← MIT License
```

---

## 🎬 Standardprozess (Typischer Workflow)

```
1️⃣ PLANUNG
   ├─ Change-Ticket eröffnen (Ticket-Nummer notieren)
   ├─ Kundendaten aus Katalog abrufen (Catalog/CUSTOMERS.md)
   └─ Wartungsfenster mit Kunden absprechen

2️⃣ VORBEREITUNG  
   ├─ Runbook konsultieren (runbooks/*.md oder docs/runbooks/)
   ├─ Checklist auswählen (checklists/*.md)
   ├─ Metadaten ausfüllen (Operator, Customer, Versions, Ticket, Snapshot-ID)
   └─ Pre-Go Gates prüfen (No-Go Bedingungen überprüfen!)

3️⃣ DURCHFÜHRUNG
   ├─ Runbook Schritt für Schritt folgen
   ├─ Befehle aus Runbook kopieren & auf Server ausführen
   ├─ Jeden Punkt in Checkliste abhaken ([x])
   └─ Health Snapshots dokumentieren (pre & post)

4️⃣ ABNAHME & DOKUMENTATION
   ├─ Post-Go Checks durchführen
   ├─ Alle Findings dokumentieren
   ├─ Change-Notiz ausfüllen: templates/CHANGE_NOTE_TEMPLATE.md
   └─ Kunden informieren (Abschluss oder Rollback)

5️⃣ ARCHIVIERUNG
   ├─ Change-Ticket schließen
   ├─ Health Snapshots an Ticket anhängen
   └─ Feedback zum Runbook bei Bedarf
```

---

## � WICHTIGE ANLEITUNGEN (NEU!)

Du bist neu oder brauchst Hilfe? Starte hier:

| **Situation** | **Datei** | **Inhalt** |
|---|---|---|
| 🆕 **Ich bin völlig neu** | [GETTING_STARTED.md](GETTING_STARTED.md) | Schritt-für-Schritt Anleitung für 5 Haupt-Szenarien |
| ⚡ **Ich brauchte schnell einen Befehl** | [QUICK_REFERENCE.md](QUICK_REFERENCE.md) | Copy-Paste Befehle, Health Checks, Troubleshooting |
| 📋 **Ich muss eine Checkliste ausfüllen** | [CHECKLIST_HOWTO.md](CHECKLIST_HOWTO.md) | Detaillierte Anleitung mit Beispielen |
| 👤 **Ich muss einen Kunden registrieren** | [CATALOG_HOWTO.md](CATALOG_HOWTO.md) | Schritt-für-Schritt Katalog-Verwaltung |
| 🗺️ **Ich kenne mich nicht aus** | [NAVIGATION.md](NAVIGATION.md) | Visuelle Karte durch alle Dateien |
| 📝 **Ich möchte etwas ändern** | [CONTRIBUTING.md](CONTRIBUTING.md) | Pull Request Prozess + Richtlinien |

---

---

## 📋 Architektur-Prinzipien

### ✅ Workflow-Synchronisation
- **Checklisten** referenzieren Runbooks (nicht duplizieren!)
- **Runbooks** enthalten detaillierte Befehle & Troubleshooting
- Wenn du ein Runbook änderst → aktualisiere auch die Checkliste (und umgekehrt)

### 🛑 No-Go Gates (Nicht verhandelbar!)
Folgende Bedingungen sind **STOP-Kriterien**:
- Disk-Belegung > 90%
- Services nicht `active (running)`
- Keine Backup/Snapshot vorhanden
- Change nicht genehmigt
- Außerhalb Wartungsfenster

→ Siehe Abschnitt **B)** in jeder Checkliste

### 📸 Health Snapshots (Audit-Trail)
Vor und nach jeder Änderung:
- Versions-Status
- Disk & Memory
- Service-Status
- Cluster-Health
- Journal-Fehler

→ Diese **MÜSSEN** an die Change-Ticket angehängt werden!

### 🔐 Secrets Management
**NIEMALS** Passwörter direkt in Dateien eintragen!
```yaml
# ✅ Richtig:
secrets_ref:
  password: "vault://deepcloud/wazuh/admin_password"

# ❌ FALSCH (nie!):
secrets_ref:
  password: "MySecretPassword123!"
```

---

## 🚀 Governance

- **Alle Änderungen via Pull Request** (kein direktes Mergen)
- **Minimum 1 Reviewer** pro PR
- **Commit-Message mit Begründung** (Warum / Risiko / Rollback)
- **Tests in Non-Production** vor dem Commit

Siehe: [CONTRIBUTING.md](CONTRIBUTING.md) für Details
