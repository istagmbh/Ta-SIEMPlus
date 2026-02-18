# 🗺️ Projekt-Navigations-Guide

Eine visuelle Karte durch Ta-SIEMPlus – für alle Fälle.

---

## 🌐 HAUPTZUGRIFF: Web-Formulare (NEU!)

> **Alle Werkzeuge sind jetzt über interaktive Web-Formulare zugänglich!**

### 🚀 Start hier: [webforms/index.html](webforms/index.html)

**Verfügbare Tools:**
- 🔄 **[upgrade-form.html](webforms/upgrade-form.html)** - Wazuh Upgrade Wizard mit 5-Schritt-Prozess
- ✅ **[checklist-generator.html](webforms/checklist-generator.html)** - Dynamischer Checklisten-Generator
- 👥 **[agent-management.html](webforms/agent-management.html)** - Agentengruppen-Verwaltung mit Befehlsgenerator
- 📋 **[maintenance-protocol.html](webforms/maintenance-protocol.html)** - Wartungsdokumentation mit Timer
- 📚 **[README.md](webforms/README.md)** - Webforms-Dokumentation

**Vorteile:**
- ✅ Keine Installation notwendig
- ✅ Funktioniert offline im Browser
- ✅ Automatische Befehlsgenerierung
- ✅ PDF-Export für Dokumentation
- ✅ LocalStorage Persistenz
- ✅ Mobile-responsive Design

---

## 🎯 WAS BRAUCHST DU? (Entscheider)

```
┌─────────────────────────────────────┐
│   Was willst du tun?                │
└─────────────────────────────────────┘
         ↓
    WÄHLE DEIN SZENARIO:
```

### 1️⃣ **ICH BIN VÖLLIG NEU HIER**
   → Installation: [**INSTALLATION.md**](INSTALLATION.md) (NEU!)
   → Erste Schritte: [**GETTING_STARTED.md**](GETTING_STARTED.md)
   - ✓ Komplette Setup-Anleitung
   - ✓ 3 Installations-Optionen
   - ✓ Alle Haupt-Szenarien erklärt
   - ✓ Für absolute Anfänger geeignet

### 2️⃣ **ICH MUSS EIN WAZUH-UPGRADE DURCHFÜHREN**
   → Web-Tool: [**webforms/upgrade-form.html**](webforms/upgrade-form.html) (NEU!)
   → Oder Anleitung: [**CHECKLIST_HOWTO.md**](CHECKLIST_HOWTO.md)
   - ✓ Interaktiver 5-Schritt-Wizard
   - ✓ Automatische Befehlsgenerierung
   - ✓ PDF-Export für Dokumentation
   - ✓ Oder: Markdown-Checkliste für Tickets
   - Dann: [**CHECKLIST_WAZUH_UPGRADE_AIO.md**](checklists/CHECKLIST_WAZUH_UPGRADE_AIO.md)

### 3️⃣ **ICH VERWALTE AGENTENGRUPPEN**
   → Web-Tool: [**webforms/agent-management.html**](webforms/agent-management.html) (NEU!)
   → Runbook: [**runbooks/RUNBOOK_WAZUH_AGENT_GROUP_MANAGEMENT.md**](runbooks/RUNBOOK_WAZUH_AGENT_GROUP_MANAGEMENT.md)
   - ✓ Befehls-Generator für 7 Operationen
   - ✓ 7 vordefinierte Beispiele
   - ✓ merged.mg und ar.conf erklärt
   - ✓ agent_groups CLI Befehle
   - ✓ Best Practices

### 4️⃣ **ICH BRAUCHE SCHNELLE BEFEHLE**
   → Datei: [**QUICK_REFERENCE.md**](QUICK_REFERENCE.md)
   - ✓ Alle wichtigen Commands zum Copy-Paste
   - ✓ Health Checks
   - ✓ Troubleshooting
   - ✓ Pro-Tips

### 5️⃣ **ICH REGISTRIERE EINEN NEUEN KUNDEN**
   → Anleitung: [**CATALOG_HOWTO.md**](CATALOG_HOWTO.md)
   → Katalog: [**Catalog/CUSTOMERS.md**](Catalog/CUSTOMERS.md)
   - ✓ Daten sammeln
   - ✓ YAML-Eintrag erstellen
   - ✓ Pull Request einreichen

### 6️⃣ **ICH MÖCHTE EIN WARTUNGSPROTOKOLL ERSTELLEN**
   → Web-Tool: [**webforms/maintenance-protocol.html**](webforms/maintenance-protocol.html) (NEU!)
   - ✓ Strukturierte Erfassung
   - ✓ Integrierter Timer
   - ✓ Problem-Tracking
   - ✓ PDF-Export

### 7️⃣ **ICH MÖCHTE DAS PROJEKT ÄNDERN / BEITRAGEN**
   → Datei: [**CONTRIBUTING.md**](CONTRIBUTING.md)
   - ✓ Pull Request Prozess
   - ✓ Richtlinien für Runbooks/Checklisten
   - ✓ Git Workflow
   - ✓ Review Standards

### 7️⃣ **ICH BRAUCHE DETAILLIERTE BEFEHLE / TROUBLESHOOTING**
   → Datei: [**RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md**](runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md)
   - ✓ Alle Befehle mit Erklärungen
   - ✓ Voraussetzungen & No-Go Gates
   - ✓ Troubleshooting-Abschnitt
   - ✓ Rollback-Verfahren

---

## 📊 DATENFLUSS-DIAGRAMM

```
WORKFLOW:

START
  │
  ├─→ [1] CHECKLIST_HOWTO.md
  │       "Wie fülle ich eine Checkliste aus?"
  │       ↓
  ├─→ [2] Catalog/CUSTOMERS.md
  │       "Kundendaten nachschlagen"
  │       ↓
  ├─→ [3] CHECKLIST_WAZUH_UPGRADE_AIO.md
  │       "Checkliste ins Ticket kopieren"
  │       ↓
  ├─→ [4] RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md
  │       "Befehle für jeden Schritt"
  │       ↓
  ├─→ [5] QUICK_REFERENCE.md
  │       "Health Snapshots, Diagnostik"
  │       ↓
  └─→ [6] CHANGE_NOTE_TEMPLATE.md
          "Abschluss-Dokumentation"
            ↓
          FERTIG ✅

ALTERNATIVE (Experten):

  ├─→ QUICK_REFERENCE.md
  │    "Schnell alle Commands"
  │       ↓
  └─→ RUNBOOK... "Nur bei Problemen"
```

---

## 📁 DATEI-ÜBERSICHT

### 🟢 NEUE DATEIEN (für bessere UX)
| Datei | Zweck | Für wen |
|-------|-------|---------|
| [INSTALLATION.md](INSTALLATION.md) | Setup-Anleitung (3 Optionen) | Neue Benutzer |
| [GETTING_STARTED.md](GETTING_STARTED.md) | Einstieg in Hauptszenarien | Anfänger + Neue User |
| [QUICK_REFERENCE.md](QUICK_REFERENCE.md) | Schnelle Befehls-Lookups | Erfahrene Operatoren |
| [CHECKLIST_HOWTO.md](CHECKLIST_HOWTO.md) | Checkliste richtig ausfüllen | Alle Operatoren |
| [CATALOG_HOWTO.md](CATALOG_HOWTO.md) | Kunde hinzufügen | Admin + DevOps |
| [PROJECT_COMPLETION.md](PROJECT_COMPLETION.md) | Projekt-Finalisierung Status | Contributors |
| [webforms/](webforms/) | 🆕 Interaktive Web-Tools | Alle (Web-Nutzer) |
| **README.md** (überarbeitet) | Projekt-Überblick | Alle |

### 🔵 KERNDATE (bereits vorhanden)
| Datei | Zweck | Typ |
|-------|-------|-----|
| [CHECKLIST_WAZUH_UPGRADE_AIO.md](checklists/CHECKLIST_WAZUH_UPGRADE_AIO.md) | Upgrade-Checkliste (Markdown) | Template |
| [CHECKLIST_WAZUH_UPGRADE_AIO_IMPROVED.md](checklists/CHECKLIST_WAZUH_UPGRADE_AIO_IMPROVED.md) | Verbesserte Checkliste | Template |
| [RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md](runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md) | Detailliertes Runbook | Anleitung |
| [Catalog/CUSTOMERS.md](Catalog/CUSTOMERS.md) | Kunden-Registry | YAML |
| [CHANGE_NOTE_TEMPLATE.md](templates/CHANGE_NOTE_TEMPLATE.md) | Abschluss-Template | Template |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Governance | Regeln |

### 🟡 TOOLS & DOCS
| Datei | Zweck | Typ |
|-------|-------|-----|
| [docs/index.html](docs/index.html) | Übersichtsseite | Web |
| [docs/maintenance-form.html](docs/maintenance-form.html) | Digitales Formular | Web |
| [docs/README.md](docs/README.md) | Tool-Dokumentation | Doc |

---

## 🔍 SUCHE ICH ETWAS?

### "Wie führe ich einen Befehl aus?"
1. [QUICK_REFERENCE.md](QUICK_REFERENCE.md) → Suchfeld
2. Wenn nicht gefunden → [RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md](runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md)
3. Wenn immer noch nicht → [Wazuh Official Docs](https://documentation.wazuh.com/)

### "Welche Kundendaten brauche ich?"
1. [Catalog/CUSTOMERS.md](Catalog/CUSTOMERS.md) → Kunden suchen
2. Alle URLs/IPs sind dort dokumentiert
3. Falls nicht da → [CATALOG_HOWTO.md](CATALOG_HOWTO.md) → "Neuen Kunden hinzufügen"

### "Was ist die richtige Reihenfolge?"
1. [RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md](runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md) → Abschnitte 1-11
2. Oder: [CHECKLIST_HOWTO.md](CHECKLIST_HOWTO.md) → "Schritt-für-Schritt"

### "Wie trage ich eine Änderung bei?"
1. [CONTRIBUTING.md](CONTRIBUTING.md) → Prozess
2. Oder: [CATALOG_HOWTO.md](CATALOG_HOWTO.md) → "Katalog-Verwaltung"

### "Ich habe einen Fehler – was nun?"
1. [QUICK_REFERENCE.md](QUICK_REFERENCE.md) → Diagnose-Befehle
2. [RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md](runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md) → Troubleshooting (Abschnitt 11)
3. Wenn kritisch → Rollback (Abschnitt 10 des Runbooks)

---

## 🎓 LEARNING PATH (für Anfänger)

```
TAG 1: VERSTEHEN
├─ [GETTING_STARTED.md](GETTING_STARTED.md) durchlesen
├─ [README.md](README.md) durchschauen
└─ [Projekt-Überblick](NAVIGATION.md) verstehen

TAG 2: VORBEREITUNG
├─ [CHECKLIST_HOWTO.md](CHECKLIST_HOWTO.md) durcharbeiten
├─ Eine echte Checkliste durchlesen
└─ Kundendaten in [Catalog/CUSTOMERS.md](Catalog/CUSTOMERS.md) suchen

TAG 3: EXECUTION (unter Anleitung!)
├─ Mit erfahrenem Operator zusammen
├─ Erste Checkliste durcharbeiten
├─ Befehle aus [QUICK_REFERENCE.md](QUICK_REFERENCE.md) kopieren
└─ Health Snapshots dokumentieren

TAG 4: SOLO UPGRADE
├─ Eigenes Upgrade alleine durchführen
├─ [RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md](runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md) als Referenz
└─ Feedback geben

ZUSÄTZLICH: BEITRAGEN
└─ [CONTRIBUTING.md](CONTRIBUTING.md) → Erste PR einreichen
```

---

## 💡 HÄUFIGE FRAGEN

### F: Wo finde ich den Befehl zum Starten von wazuh-manager?
**A:** 
1. [QUICK_REFERENCE.md](QUICK_REFERENCE.md) → "Häufige Prozess-Schritte" → "Step 4"
2. Oder: [RUNBOOK...](runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md) → Ctrl+F "start wazuh-manager"

### F: Wie starte ich mein erstes Upgrade?
**A:** 
1. [GETTING_STARTED.md](GETTING_STARTED.md) → "UPGRADE-PROZESS"
2. Oder: [CHECKLIST_HOWTO.md](CHECKLIST_HOWTO.md) → "Komplette Anleitung"

### F: Ich weiß nicht, welche Metadaten ich brauche!
**A:** 
1. [CHECKLIST_HOWTO.md](CHECKLIST_HOWTO.md) → "SCHRITT 1: Metadaten sammeln"
2. Kundendaten nachschauen: [Catalog/CUSTOMERS.md](Catalog/CUSTOMERS.md)

### F: Muss ich die Checkliste ausfüllen?
**A:** Ja! Sie ist notwendig für:
- Audit-Trail (wer hat was gemacht?)
- Nachverfolgung (Status überprüfen)
- Rollback (wenn etwas schiefgeht)

### F: Darf ich Befehle in eine andere Reihenfolge ändern?
**A:** **NEIN!** Die Reihenfolge ist getestet. Siehe [RUNBOOK...](runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md) → Abschnitte müssen in Ordnung sein!

### F: Was passiert, wenn ich einen Fehler mache?
**A:**
1. Ruhe bewahren ✅
2. Runbook → Abschnitt 11 "Troubleshooting"
3. Diagnose-Befehle aus [QUICK_REFERENCE.md](QUICK_REFERENCE.md) ausführen
4. Wenn kritisch: Abschnitt 10 "Rollback"

---

## 🚀 QUICK LINKS (Copy-Paste)

| Datei | Öffnen |
|-------|--------|
| Getting Started | `GETTING_STARTED.md` |
| Quick Reference | `QUICK_REFERENCE.md` |
| Checklist HOWTO | `CHECKLIST_HOWTO.md` |
| Catalog HOWTO | `CATALOG_HOWTO.md` |
| Upgrade Checklist | `checklists/CHECKLIST_WAZUH_UPGRADE_AIO.md` |
| Upgrade Runbook | `runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md` |
| Customer Catalog | `Catalog/CUSTOMERS.md` |
| Contributing | `CONTRIBUTING.md` |
| Change Note Template | `templates/CHANGE_NOTE_TEMPLATE.md` |

---

## ✅ Checkliste: "Bin ich bereit?"

Bevor du ein Upgrade startest:

- [ ] Ich habe [GETTING_STARTED.md](GETTING_STARTED.md) gelesen (oder [QUICK_REFERENCE.md](QUICK_REFERENCE.md))
- [ ] Ich habe die Kundendaten in [Catalog/CUSTOMERS.md](Catalog/CUSTOMERS.md) gefunden
- [ ] Ich habe [CHECKLIST_HOWTO.md](CHECKLIST_HOWTO.md) verstanden
- [ ] Ich habe eine Checkliste vorbereitet
- [ ] Ich kenne die No-Go Gates (Abschnitt B in der Checkliste)
- [ ] Ich habe einen Backup/Snapshot erstellt
- [ ] Ich habe ein Change-Ticket

→ **Ja zu allen?** Dann los geht's! 🚀

---

**Version:** 1.0  
**Letzte Aktualisierung:** 30. Januar 2026  
**Maintain via:** [CONTRIBUTING.md](CONTRIBUTING.md)
