# 🚀 GETTING STARTED – Dein Einstieg in Ta-SIEMPlus

**Willkommen!** Dieses Dokument führt dich Schritt für Schritt durch die wichtigsten Szenarien.

---

## 🌐 Hauptzugriff: Web-Formulare (NEU!)

**✨ Alle Werkzeuge sind jetzt über interaktive Web-Formulare zugänglich!**

### Schnellstart (2 Minuten)

```bash
# 1. Repository klonen (falls noch nicht geschehen)
git clone https://github.com/istagmbh/Ta-SIEMPlus.git
cd Ta-SIEMPlus

# 2. Web-Formulare öffnen
open webforms/index.html  # Mac
xdg-open webforms/index.html  # Linux
start webforms\index.html  # Windows
```

### Verfügbare Web-Tools

- 🔄 **[Upgrade-Formular](webforms/upgrade-form.html)** - Wazuh AIO Upgrades mit PDF-Export
- ✅ **[Checklisten-Generator](webforms/checklist-generator.html)** - Individuelle Checklisten
- 👥 **[Agent-Verwaltung](webforms/agent-management.html)** - Befehls-Generator für Agenten
- 📋 **[Wartungsprotokoll](webforms/maintenance-protocol.html)** - Strukturierte Dokumentation

**Vorteile der Web-Formulare:**
- ✅ Keine Installation oder Setup notwendig
- ✅ Funktioniert offline im Browser
- ✅ Automatische Befehlsgenerierung
- ✅ PDF-Export für Dokumentation
- ✅ Copy-Paste freundliche Kommandos
- ✅ Persistente Datenspeicherung (LocalStorage)

---

## 📦 Neu hier? Installationsanleitung

Falls du Ta-SIEMPlus zum ersten Mal einrichtest:

→ **[📦 Siehe INSTALLATION.md](INSTALLATION.md)** für eine komplette Setup-Anleitung

---

## ❓ Was Brauchst Du?

Klicke auf dein Szenario, um die richtige Anleitung zu finden:

### 1️⃣ **Ich führe ein Wazuh-Upgrade durch** → [👉 Upgrade-Prozess](#upgrade-durchführen)

### 2️⃣ **Ich verwalte Agentengruppen** → [👉 Agentengruppen](#agentengruppen-verwalten)

### 3️⃣ **Ich registriere einen neuen Kunden** → [👉 Kundeneintrag erstellen](#neuer-kunde)

### 4️⃣ **Ich habe ein Problem beim Upgrade** → [👉 Troubleshooting](#troubleshooting)

### 5️⃣ **Ich möchte ein Runbook/eine Checkliste ändern** → [👉 Beitragen](#contribution)

### 6️⃣ **Ich bin neu und will das Projekt verstehen** → [👉 Überblick](#überblick)

---

## 🔄 UPGRADE-PROZESS

### Schritt 1: Wähle deinen Ansatz

Du kannst einen Upgrade **3 Wege** dokumentieren:

#### **Weg A: Web-Formular (Empfohlen - Schnell & Modern)**
- ✅ Öffne das interaktive Formular: **[webforms/upgrade-form.html](webforms/upgrade-form.html)**
- ✅ Fülle Felder aus, generiere Befehle automatisch
- ✅ Exportiere als PDF für Dokumentation
- ✅ Keine Installation nötig, funktioniert offline
- ✅ Persistente Speicherung im Browser

**Workflow:**
1. Öffne `webforms/upgrade-form.html` im Browser
2. Fülle Metadaten aus (Kunde, Infrastruktur, Versionen, etc.)
3. Folge den 5 Schritten mit automatischer Befehlsgenerierung
4. Führe Health Checks durch
5. Exportiere PDF für Ticket-Dokumentation

#### **Weg B: Markdown Checkliste (Für Ticket-Systeme)**
- Kopiere die Checkliste direkt ins Change-Ticket
- Arbeite Schritt-für-Schritt ab mit Runbook-Referenzen
- Versionskontrolle via Git
- **Datei:** [checklists/CHECKLIST_WAZUH_UPGRADE_AIO.md](checklists/CHECKLIST_WAZUH_UPGRADE_AIO.md)

#### **Weg C: MkDocs Dokumentation (Für Teams)**
- Vollständige, durchsuchbare Dokumentation
- Docker-basiertes Deployment
- Versionierung und Navigation
- **Start:** `docker-compose up -d` → http://localhost:8080

→ **Wir empfehlen: Weg A** (Web-Formular) für neue Nutzer und schnelle Erfassung.

---

### Schritt 2: Metadaten vorbereiten

Du brauchst diese Informationen für dein Change-Ticket:

```
Operator:              David Dutler / Ivan Stricker
Kunde:                 z.B. DeepCloud AG
Infrastruktur:         z.B. DeepInfra
Change-Ticket-ID:      z.B. CHG-2026-00123
Wartungsfenster:       YYYY-MM-DD HH:MM - YYYY-MM-DD HH:MM (Europe/Zurich)
Ist-Version:           z.B. 4.9.0
Ziel-Version:          z.B. 4.12.0
Snapshot/Backup-ID:    z.B. snap-0123456789abcdef0
```

💡 **Tipp:** Diese Infos findest du in `Catalog/CUSTOMERS.md`

#### 💫 **Automatisches Ausfüllen im Web-Formular**
Das Web-Formular bietet **automatische Metadaten-Verwaltung**:
- Trage die Metadaten im ersten Schritt ein
- Das Formular speichert die Daten automatisch im Browser (LocalStorage)
- Alle Schritte werden automatisch vorausgefüllt
- Die Daten bleiben auch nach Browser-Neustart erhalten
- PDF-Export enthält alle Metadaten automatisch


---

### Schritt 3: Formular ausfüllen & Befehle ausführen

#### **OPTION A: Web-Formular (empfohlen)**
1. Öffne im Browser:
   ```
   webforms/upgrade-form.html
   ```
2. Fülle das Formular Schritt für Schritt aus:
   - **Schritt 1:** Metadaten & Pre-Flight Checks
   - **Schritt 2:** Service-Stop & Backup
   - **Schritt 3:** Package-Upgrade
   - **Schritt 4:** Service-Start & Validation
   - **Schritt 5:** Post-Checks & Documentation
3. Kopiere die generierten Befehle
4. Führe sie auf dem Server aus
5. Klicke "PDF generieren" für die Dokumentation

#### **OPTION B: Markdown Checkliste**
1. Öffne die Datei:
   ```
   checklists/CHECKLIST_WAZUH_UPGRADE_AIO.md
   ```
2. **Kopiere den kompletten Inhalt** (⌘C oder Strg+C)
3. **Füge ihn in dein Change-Ticket ein**
4. Trage alle Metadaten-Felder ein (siehe Schritt 2)
5. Arbeite die Checkliste Punkt für Punkt ab

**→ Welche Option passt zu dir?**
- Web-Formular: Schnell, modern, PDF-Export ✅
- Markdown-Checkliste: Git-Versioniert, Ticket-System-freundlich ✅

---

### Schritt 4: Pre-Go Checken (Kritisch!)

Arbeite **die Pre-Flight Checks** ab (in Schritt 1 des Web-Formulars oder Abschnitt B der Checkliste). 

Wenn auch nur EINE Box nicht ✓ ist:

⛔ **STOPP – Upgrade verschieben!**

**Kritische No-Go Gates:**
- ❌ Disk-Belegung > 90%
- ❌ Services nicht `active (running)`
- ❌ Kein Backup/Snapshot vorhanden
- ❌ Change nicht genehmigt
- ❌ Außerhalb Wartungsfenster

---

### Schritt 5: Befehle ausführen

Für jeden Punkt:

1. **Lies die Anweisung** (im Web-Formular oder in der Checkliste)
2. **Kopiere den Befehl** (automatisch generiert im Web-Formular, oder aus Runbook)
3. **Führe ihn auf dem Server aus**
4. **Validiere das Ergebnis**
5. **Hake die Box ab** (im Formular oder `[x]` in Checkliste)

💡 **Tipp:** Nutze das **[Upgrade Runbook](runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md)** parallel für detaillierte Befehle und Troubleshooting.

---

### Schritt 6: Health Snapshots dokumentieren

**Vor dem Upgrade:**
- Im **Web-Formular:** Fülle "Pre-Upgrade Health Check" in Schritt 1 aus
- In **Markdown:** Führe die Befehle aus Abschnitt 1 des Runbooks aus

```bash
# Kopiere diesen Befehl:
date -Is && systemctl status wazuh-indexer wazuh-manager wazuh-dashboard filebeat && dpkg -l | grep -E 'wazuh|filebeat'
```
→ **Speichere die Ausgabe** (im Formular-Feld oder im Change-Ticket)

**Nach dem Upgrade:**
- Im **Web-Formular:** Fülle "Post-Upgrade Health Check" in Schritt 5 aus
- In **Markdown:** Führe denselben Befehl nochmal aus
→ **Vergleiche die Ausgaben**

---

### Schritt 7: Bei Problemen → Rollback

Wenn etwas schiefgeht:

1. Gehe zu **"Rollback"**-Abschnitt (im Web-Formular oder Abschnitt E der Checkliste)
2. Folge den Rollback-Anweisungen
3. **Dokumentiere was schief ging** im Change-Ticket
4. Erstelle ein Incident-Ticket

💡 **Siehe auch:** [Runbook Abschnitt 10 - Rollback](runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md#10-rollback--notfall)

---

## 👥 AGENTENGRUPPEN-VERWALTEN

### Was sind Agentengruppen?

Wazuh Agentengruppen ermöglichen die **zentrale Verwaltung** von Agent-Konfigurationen. 
Agenten können einer oder mehreren Gruppen zugeordnet werden und erhalten automatisch 
die kombinierten Konfigurationen aller Gruppen.

### Schnellstart

**1. Web-Formular öffnen (Empfohlen):**
```
Öffne: webforms/agent-management.html
```

Das Web-Formular bietet:
- ✅ Interaktive Befehlsgenerierung für alle Operationen
- ✅ 7 vordefinierte Beispiele zum Kopieren
- ✅ Erklärungen zu merged.mg und ar.conf
- ✅ Copy-Paste freundliche Kommandos
- ✅ Keine Installation nötig

**Verfügbare Operationen:**
1. Gruppe erstellen
2. Agent zu Gruppe hinzufügen
3. Agent aus Gruppe entfernen
4. Gruppen auflisten
5. Agenten einer Gruppe anzeigen
6. Multi-Gruppen Zuweisung
7. Gruppen-Konfiguration anzeigen

**2. Oder nutze die Kommandozeile direkt:**

```bash
# Gruppe erstellen
/var/ossec/bin/agent_groups -a -g linux-servers

# Agent zu Gruppe hinzufügen
/var/ossec/bin/agent_groups -a -i 001 -g linux-servers

# Alle Gruppen auflisten
/var/ossec/bin/agent_groups -l

# Agent zu mehreren Gruppen (Multi-Gruppen)
/var/ossec/bin/agent_groups -a -i 002 -g linux-servers,web-servers,prod
```

### Detaillierte Dokumentation

**Für mehr Details:**
- **🌐 Web-Tool:** [webforms/agent-management.html](webforms/agent-management.html) - Interaktives Formular (NEU!)
- **📘 Runbook:** [runbooks/RUNBOOK_WAZUH_AGENT_GROUP_MANAGEMENT.md](runbooks/RUNBOOK_WAZUH_AGENT_GROUP_MANAGEMENT.md) - Vollständige Dokumentation
- **⚡ Quick Reference:** [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Alle Befehle auf einen Blick

---

## 👤 NEUER KUNDE

### Schritt 1: Kundendaten sammeln

Du brauchst:
```
Kundenname:          z.B. DeepCloud AG
Infrastruktur-Name:  z.B. DeepInfra
Umgebung:            prod / test / dev
Wazuh-Typ:           Ubuntu AIO (APT) / Docker / etc.
Haupt-Host FQDN:     z.B. wazuh01.example.tld
Management-IP:       z.B. 10.10.10.10
Dashboard-URL:       https://wazuh01.example.tld
API-URL:             https://wazuh01.example.tld:55000
Indexer-URL:         https://wazuh01.example.tld:9200
```

---

### Schritt 2: Eintrag hinzufügen

1. Öffne: `Catalog/CUSTOMERS.md`

2. Scrolle ans **Ende der Datei**

3. Kopiere den YAML-Template-Block (dort zu finden)

4. **Ersetze alle UNSET-Werte** mit echten Daten:

```yaml
customer: "DeepCloud AG"              # ← Kundenname
infrastructure: "DeepInfra"           # ← Infrastruktur
environment: "prod"                   # ← prod/test/dev
wazuh_type: "Ubuntu AIO (APT)"        # ← Installationstyp
hosts:
  - role: "wazuh-aio"
    fqdn: "wazuh01.example.tld"       # ← Hostname
    mgmt_ip: "10.10.10.10"            # ← Management-IP
urls:
  dashboard: "https://wazuh01.example.tld"
  api: "https://wazuh01.example.tld:55000"
  indexer: "https://wazuh01.example.tld:9200"
ports_expected:
  - "1514/tcp"
  - "1515/tcp"
  - "55000/tcp"
  - "5601/tcp"
  - "9200/tcp"
secrets_ref:
  admin_user: "vault://deepcloud/wazuh/admin_user"
  admin_password: "vault://deepcloud/wazuh/admin_password"
change_policy: "Within business hours (08:00 - 17:00 CET)"
contact_email: "siem-team@deepcloud.example.tld"
```

⚠️ **WICHTIG:** Keine echten Passwörter eintragen! Nur `vault://...` Pfade!

---

### Schritt 3: Änderung einreichen

```bash
# Terminal-Befehle zum Einreichen (Copy-Paste):
git checkout -b add/customer-deepcloud
git add Catalog/CUSTOMERS.md
git commit -m "catalog: Add DeepCloud AG infrastructure entry"
git push origin add/customer-deepcloud
```

Dann: **Pull Request erstellen** und warten auf Review ✅

---

## 🔧 TROUBLESHOOTING

### Problem: Service startet nicht nach Upgrade

1. **Gehe zu Abschnitt 11 im Runbook:**
   ```
   runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md → Troubleshooting
   ```

2. **Führe die Diagnose-Befehle aus** (alle grau hinterlegt)

3. **Wenn es nicht hilft:**
   - ✅ Lies die [Wazuh offizielle Dokumentation](https://documentation.wazuh.com/)
   - ✅ Erstelle ein Incident-Ticket
   - ✅ Kontaktiere das Support-Team

### Problem: Upgrade-Abbruch (Rollback notwendig)

Folge **Abschnitt 10 des Runbooks**: "Rollback / Notfall"

---

## 💡 CONTRIBUTION (Änderungen)

### Ich möchte ein Runbook ändern

1. Öffne die Datei (z.B. `runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md`)
2. **Mache deine Änderung**
3. **Dokumentiere das Warum:**
   - Begründung?
   - Welche Risiken?
   - Wie rollback?
4. **Erstelle einen Pull Request:**
   ```bash
   git checkout -b fix/upgrade-runbook-xyz
   git add runbooks/RUNBOOK_*.md
   git commit -m "fix: Correct command for service restart (because: Wazuh 4.12 requires...)"
   git push origin fix/upgrade-runbook-xyz
   ```
5. **Warte auf Review** (min. 1 Person muss zustimmen)

👀 Siehe auch: [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 📚 ÜBERBLICK (Projektstruktur)

```
Ta-SIEMPlus/
├── README.md                          ← Projekt-Übersicht
├── GETTING_STARTED.md                 ← DU BIST HIER 👈
├── QUICK_REFERENCE.md                 ← Schnelle Lookups
│
├── runbooks/                          ← Detaillierte Anleitungen
│   ├── RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md
│   └── RUNBOOK-TEMPLATE.md
│
├── checklists/                        ← Ticket-Checklisten
│   ├── CHECKLIST_WAZUH_UPGRADE_AIO.md
│   └── CHECKLIST-TEMPLATE.md
│
├── Catalog/                           ← Kunden-Registry
│   └── CUSTOMERS.md
│
├── templates/                         ← Vorlagen
│   └── CHANGE_NOTE_TEMPLATE.md
│
├── docs/                              ← Web-Tools
│   ├── index.html                     ← Übersicht
│   ├── maintenance-form.html          ← Digitales Formular
│   └── README.md
│
└── CONTRIBUTING.md                    ← Governance
```

**Welche Datei für was?**

| Szenario | Datei |
|----------|-------|
| Upgrade durchführen | Checkliste + Runbook |
| Neuen Kunden hinzufügen | Catalog/CUSTOMERS.md |
| Befehle verstehen | Runbooks |
| Prozess dokumentieren | Templates |
| Änderung einreichen | CONTRIBUTING.md |

---

## 🆘 Schnelle Hilfe

| Frage | Antwort |
|-------|--------|
| Wie starte ich ein Upgrade? | [👆 Oben: Upgrade-Prozess](#upgrade-durchführen) |
| Wo finde ich Befehle? | `runbooks/RUNBOOK_*.md` (grau hinterlegte Felder) |
| Darf ich Passwörter eintragen? | ❌ **NEIN!** Nur `vault://...` Referenzen |
| Ich bin fertig – was nun? | Überprüfe: ✅ Alle Checkboxen? ✅ Health Snapshots dokumentiert? ✅ Kunden informiert? |
| Wer kann Änderungen genehmigen? | Mindestens 1 Reviewer (siehe [CONTRIBUTING.md](CONTRIBUTING.md)) |

---

## ✅ Nächste Schritte

→ **Suchst du einen bestimmten Workflow?** Gehe zurück nach oben und klicke auf dein Szenario.

→ **Brauchst du schnelle Befehle?** Siehe: [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

→ **Du willst beitragen?** Lese: [CONTRIBUTING.md](CONTRIBUTING.md)

---

**Fragen?** Öffne ein Issue oder kontaktiere das Team! 👋
