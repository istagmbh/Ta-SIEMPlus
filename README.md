# 📋 Managed SIEM – Runbooks & Checklisten (Wazuh)

> **Operative documentation system** für standardisierte Wazuh SIEM Wartungsabläufe.  
> Fokus: reproduzierbar, auditierbar, operator-freundlich.  
> **Hauptzugriff über Web-Formulare (HTML)**

---

## 🌐 WEB-FORMULARE - Hauptzugriff

**NEU: Alle Werkzeuge sind über Web-Formulare zugänglich!**

→ **[Öffne Web-Tools](webforms/index.html)** ← **STARTE HIER**

Die Web-Formulare bieten:
- ✅ Interaktive Formulare für alle Prozesse
- ✅ Automatische Befehlsgenerierung
- ✅ Copy-Paste freundlich
- ✅ Keine Installation notwendig
- ✅ PDF-Export für Dokumentation

**Verfügbare Web-Tools:**
- 📚 **[Kundenkatalog](webforms/catalog.html)** - Kunden und Infrastrukturen verwalten
- 🔧 **[Wartungsformular](webforms/maintenance-form.html)** - Wartungsplanung mit PDF-Export
- 📖 **[Runbook](webforms/runbook.html)** - Interaktives Runbook mit Befehlen
- ✅ **[Checkliste](webforms/checklist.html)** - Upgrade-Checkliste digital
- 👥 **[Agentengruppen](webforms/agent-groups.html)** - Agent-Gruppen verwalten (NEU!)
- ⚡ **[Schnell-Referenz](webforms/reference.html)** - Alle wichtigen Befehle

---

## 🎉 GUTE NACHRICHTEN! Repo wurde neu strukturiert! 

**Dieses Projekt wurde am 30. Januar 2026 komplett reorganisiert für bessere Benutzerfreundlichkeit:**

✅ 5 neue Einstiegsdateien (GETTING_STARTED, QUICK_REFERENCE, etc.)  
✅ Schritt-für-Schritt Anleitungen für alle Szenarien  
✅ Copy-Paste freundliche Befehls-Lookups  
✅ Visuelle Navigationskarte durch alle Dateien  
✅ Deutsch statt English/Deutsch Gemisch  

→ **[📊 Siehe Zusammenfassung der Änderungen](RESTRUCTURING_SUMMARY.md)**

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
├── 🌐 webforms/                        ← WEB-FORMULARE (HAUPTZUGRIFF!)
│   ├── index.html                      ← Zentrale Übersichtsseite
│   ├── catalog.html                    ← Kundenkatalog-Verwaltung
│   ├── maintenance-form.html           ← Wartungsformular mit PDF-Export
│   ├── runbook.html                    ← Interaktives Runbook
│   ├── checklist.html                  ← Digitale Checkliste
│   ├── agent-groups.html               ← Agentengruppen-Verwaltung (NEU!)
│   └── reference.html                  ← Schnell-Referenz
│
├── 📘 README.md                        ← Projekt-Überblick (DU BIST HIER)
├── 🚀 GETTING_STARTED.md               ← Erste Schritte & Workflows
├── ⚡ QUICK_REFERENCE.md               ← Schnelle Befehls-Lookups
├── 📝 CONTRIBUTING.md                  ← Governance & Änderungen
│
├── 📂 runbooks/                        ← Detaillierte Schritt-für-Schritt Anleitungen
│   ├── RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md
│   ├── RUNBOOK_WAZUH_AGENT_GROUP_MANAGEMENT.md  ← NEU: Agentengruppen
│   └── RUNBOOK-TEMPLATE.md
│
├── 📂 checklists/                      ← Ticket-/Change-Checklisten (zur Ticket-Dokumentation)
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
├── 📂 docs/                            ← Legacy-Dokumentation (deprecated, nutze webforms/)
│
└── 📄 LICENSE                          ← MIT License
```

---

## 🎬 Standardprozess (Typischer Workflow)

```
1️⃣ PLANUNG
   ├─ Web-Formular öffnen: webforms/index.html
   ├─ Change-Ticket eröffnen (Ticket-Nummer notieren)
   ├─ Kundendaten aus Katalog abrufen (webforms/catalog.html)
   └─ Wartungsfenster mit Kunden absprechen

2️⃣ VORBEREITUNG  
   ├─ Wartungsformular nutzen: webforms/maintenance-form.html
   ├─ Metadaten ausfüllen (Operator, Customer, Versions, Ticket, Snapshot-ID)
   └─ Pre-Go Gates prüfen (No-Go Bedingungen überprüfen!)

3️⃣ DURCHFÜHRUNG
   ├─ Runbook konsultieren: webforms/runbook.html ODER runbooks/*.md
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
