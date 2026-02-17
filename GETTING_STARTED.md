# 🚀 GETTING STARTED – Dein Einstieg in Ta-SIEMPlus

**Willkommen!** Dieses Dokument führt dich Schritt für Schritt durch die wichtigsten Szenarien.

---

## 🌐 Wichtig: Web-Formulare als Hauptzugriff

**Alle Werkzeuge sind jetzt über Web-Formulare zugänglich!**

→ **[Öffne Web-Tools](webforms/index.html)** ← **STARTE HIER**

Die Web-Formulare bieten:
- ✅ Interaktive Bedienung ohne Markdown-Kenntnisse
- ✅ Automatische Befehlsgenerierung
- ✅ Copy-Paste freundliche Kommandos
- ✅ PDF-Export für Dokumentation
- ✅ Keine Installation oder Setup notwendig

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

Du kannst einen Upgrade **2 Wege** dokumentieren:

#### **Weg A: Web-Formular (Empfohlen - Schnell & Digital)**
- Öffne das interaktive Formular im Browser
- Fülle Felder aus, generiere Befehle
- Exportiere als PDF für Dokumentation
- Keine Installation nötig
- **Datei:** [webforms/maintenance-form.html](webforms/maintenance-form.html)
- **Runbook:** [webforms/runbook.html](webforms/runbook.html)

#### **Weg B: Markdown Checkliste (Für Ticket-Systeme)**
- Kopiere die Checkliste direkt ins Change-Ticket
- Arbeite Schritt-für-Schritt ab
- Versionskontrolle via Git
- **Datei:** [checklists/CHECKLIST_WAZUH_UPGRADE_AIO.md](checklists/CHECKLIST_WAZUH_UPGRADE_AIO.md)

→ **Wir empfehlen: Weg A** (Web-Formular) für schnellere Erfassung und bessere Bedienbarkeit.

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

#### 💫 **NEU: Automatisches Ausfüllen im Web-Formular**
Das Web-Formular hat jetzt einen **"Schritt 0: Basis-Konfiguration"**-Panel:
- Trage die Metadaten oben ein
- Klick auf **"✓ Speichern & Vorausfüllen"**
- Alle Felder in Schritt 1–5 werden **automatisch ausgefüllt**
- Die Daten werden im Browser gespeichert (auch bei Neuladen!)


---

### Schritt 3: Checkliste kopieren & ausfüllen (oder Web-Formular nutzen)

#### **OPTION A: Markdown Checkliste (empfohlen)**
1. Öffne die Datei:
   ```
   checklists/CHECKLIST_WAZUH_UPGRADE_AIO.md
   ```
2. **Kopiere den kompletten Inhalt** (⌘C oder Strg+C)
3. **Füge ihn in dein Change-Ticket ein**
4. Trage alle Metadaten-Felder ein (siehe Schritt 2)

#### **OPTION B: Web-Formular (schnell & digital)**
1. Öffne im Browser:
   ```
   docs/maintenance-form.html
   ```
2. Fülle das Formular aus
3. Klicke "PDF generieren"
4. PDF wird automatisch heruntergeladen
5. Füge PDF im Ticket an

**→ Welche Option passt zu dir?**
- Ticket-System mit Markdown? → **Option A** ✅
- Schnelle digitale Erfassung? → **Option B** ✅

---

### Schritt 3: Pre-Go Checken (Kritisch!)

Arbeite **Abschnitt B)** ab (No-Go Gates). Wenn auch nur EINE Box nicht ✓ ist:

⛔ **STOPP – Upgrade verschieben!**

---

### Schritt 4: Befehle ausführen

Für jeden Punkt in der Checkliste:

1. **Lies die Checklisten-Box** (z.B. "Filebeat gestoppt")
2. **Schau ins Runbook** für die genauen Befehle:
   ```
   runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md
   ```
3. **Kopiere den Befehl** (grau hinterlegtes Feld)
4. **Führe ihn auf dem Server aus**
5. **Hake die Box in der Checkliste ab** (`[x]`)

---

### Schritt 5: Health Snapshots dokumentieren

**Vor dem Upgrade (Abschnitt 1 des Runbooks):**
```bash
# Kopiere diesen Befehl:
date -Is && systemctl status wazuh-indexer wazuh-manager wazuh-dashboard filebeat && dpkg -l | grep -E 'wazuh|filebeat'
```
→ **Speichere die Ausgabe im Change-Ticket**

**Nach dem Upgrade:**
→ **Führe denselben Befehl nochmal aus** und vergleiche

---

### Schritt 6: Bei Problemen → Rollback

Wenn etwas schiefgeht:

1. Gehe zu Abschnitt **E)** der Checkliste: "Rollback (If Needed)"
2. Folge den Rollback-Anweisungen
3. **Dokumentiere was schief ging** im Change-Ticket
4. Erstelle ein Incident-Ticket

---

## 👥 AGENTENGRUPPEN-VERWALTEN

### Was sind Agentengruppen?

Wazuh Agentengruppen ermöglichen die **zentrale Verwaltung** von Agent-Konfigurationen. 
Agenten können einer oder mehreren Gruppen zugeordnet werden und erhalten automatisch 
die kombinierten Konfigurationen aller Gruppen.

### Wichtige Dateien verstehen

**merged.mg** - Die konsolidierte Konfiguration:
- Wird automatisch vom Wazuh-Manager generiert
- Enthält die zusammengeführte Konfiguration aller Gruppen eines Agents
- Bei jeder Änderung automatisch aktualisiert und an den Agent gesendet
- Über Dashboard einsehbar, aber **nicht editierbar**
- Pfad: `/var/ossec/etc/shared/<agent-id>/merged.mg`

**ar.conf** - Active Response Befehle:
- Liste von Befehlen für Wartungsaufgaben und Problembehebung
- Enthält Anweisungen für Service-Neustarts (Wazuh, OSSEC) auf verschiedenen OS
- Über Dashboard einsehbar, aber **nicht editierbar**
- Pfad: `/var/ossec/etc/shared/<group-name>/ar.conf`

### Schnellstart

**1. Web-Formular öffnen (Empfohlen):**
```
Öffne: webforms/agent-groups.html
```

Das Web-Formular bietet:
- ✅ Interaktive Befehlsgenerierung
- ✅ Copy-Paste freundliche Kommandos
- ✅ Erklärungen zu merged.mg und ar.conf
- ✅ Beispiele für alle gängigen Operationen

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
- **Web-Tool:** [webforms/agent-groups.html](webforms/agent-groups.html) - Interaktives Formular
- **Runbook:** [runbooks/RUNBOOK_WAZUH_AGENT_GROUP_MANAGEMENT.md](runbooks/RUNBOOK_WAZUH_AGENT_GROUP_MANAGEMENT.md) - Vollständige Dokumentation
- **Quick Reference:** [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Alle Befehle auf einen Blick

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
