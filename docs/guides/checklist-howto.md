# 📋 Checklisten-Ausfüll-Anleitung (SCHRITT-FÜR-SCHRITT)

Diese Anleitung zeigt dir, wie du eine Checkliste richtig ausfüllst – mit echten Beispielen.

---

## 🎯 Ziel
Du kopierst eine Checkliste in dein Change-Ticket und füllst sie dann **während der Durchführung** aus.

---

## 📝 SCHRITT 1: Metadaten sammeln

Bevor du startest, brauchst du diese Informationen:

### Aus deinem Change-Ticket:
```
✔ Change-Ticket-ID:        CHG-2026-00456
✔ Genehmigt am:            2026-01-27 10:00
✔ Wartungsfenster:         2026-01-30 22:00 – 2026-01-31 00:30
```

### Aus Catalog/CUSTOMERS.md:
```
✔ Kundenname:              DeepCloud AG
✔ Infrastruktur:           DeepPay
✔ Umgebung:                prod
✔ Dashboard-URL:           https://wazuh-deeppay.example.tld
✔ API-URL:                 https://wazuh-deeppay.example.tld:55000
```

### Von dir selbst:
```
✔ Dein Name (Operator):    David Dutler / Ivan Stricker
✔ Ist-Version:             4.9.0   (→ `dpkg -l | grep wazuh`)
✔ Ziel-Version:            4.12.0  (→ Wazuh Release Notes)
```

### Von der Infrastruktur:
```
✔ Snapshot-ID:             snap-0987654321fedcba0
  (oder Backup-Pfad: /backups/wazuh_backup_2026-01-30.tar.gz)
```

### Aus dem Secret-Store (Pflicht!):
```
✔ Indexer Admin-Passwort:    vault://... (aus CUSTOMERS.md → secrets_ref)
✔ Wazuh API-Passwort:        vault://... (aus CUSTOMERS.md → secrets_ref)
✔ Dashboard Login:            [verifiziert ja/nein]
✔ SSH/Root-Zugang:            [getestet ja/nein]
```

> **WICHTIG:** Rufe alle Passwörter VOR Beginn des Wartungsfensters ab!
> Während der Wartung ist keine Zeit, um fehlende Credentials zu suchen.

---

## 🖊️ SCHRITT 2: Checkliste kopieren & ausfüllen

### 2a) Checkliste öffnen
Datei: `checklists/CHECKLIST_WAZUH_UPGRADE_AIO.md`  
(oder die **neue verbesserte Version**: `checklists/CHECKLIST_WAZUH_UPGRADE_AIO_IMPROVED.md`)

### 2b) Komplette Datei kopieren
1. Öffne die Checklisten-Datei
2. **Strg+A** (oder **⌘+A** auf Mac) = Alles markieren
3. **Strg+C** (oder **⌘+C**) = Kopieren

### 2c) In Change-Ticket einfügen
1. Öffne dein Change-Management-System (Jira, Azure DevOps, etc.)
2. Öffne dein Change-Ticket: CHG-2026-00456
3. Klicke im **Description**/**Beschreibung** Feld
4. **Strg+V** (oder **⌘+V**) = Einfügen

---

## 📌 SCHRITT 3: Metadaten ausfüllen (YAML Block oben)

Am Anfang der Checkliste steht ein YAML-Block. Fülle ihn **jetzt** (vor Beginn!) aus:

### Beispiel: VORHER (leer)
```yaml
---
checklist_id: "CHG-WAZUH-UPG-AIO"
operator: "UNSET"
customer: "UNSET"
infrastructure: "UNSET"
change_ticket: "UNSET"
maintenance_window_start: "UNSET"
maintenance_window_end: "UNSET"
target_version: "UNSET"
current_version: "UNSET"
snapshot_id: "UNSET"
---
```

### Beispiel: NACHHER (ausgefüllt)
```yaml
---
checklist_id: "CHG-WAZUH-UPG-AIO"
operator: "David Dutler"
customer: "DeepCloud AG"
infrastructure: "DeepPay"
change_ticket: "CHG-2026-00456"
maintenance_window_start: "2026-01-30 22:00"
maintenance_window_end: "2026-01-31 00:30"
target_version: "4.12.0"
current_version: "4.9.0"
snapshot_id: "snap-0987654321fedcba0"
---
```

💡 **Tipp:** Diese Werte kopierst du überall, wo `{{variable_name}}` steht!

---

## ✅ SCHRITT 4: Pre-Go Gates prüfen (Abschnitt B)

### Was sind Pre-Go Gates?
Das sind **kritische Bedingungen**, die ALLE erfüllt sein müssen:

```
⛔ Wenn AUCH NUR EINE Box NICHT ✓ ist → UPGRADE VERSCHIEBEN!
```

### Beispiel: Pre-Go Gates

```markdown
## B) Pre-Go (No-Go Gates)

- [x] Change freigegeben (approved)
       ↑ Ja, ist genehmigt seit 2026-01-27 10:00

- [ ] Kunde informiert (Downtime/Impact kommuniziert)
       ↑ Noch nicht getan → Kundennotiz schreiben vor Start!

- [ ] Guide gelesen (Breaking Changes / besondere Schritte)
       ↑ Todo: Wazuh 4.12.0 Release Notes durchlesen

- [x] System-Ressourcen geprüft (Disk < 85%, RAM verfügbar)
       ↑ Disk 72%, RAM 24 GB frei → OK

- [ ] Snapshot/Backup erstellt
       ↑ Todo: VM-Snapshot erstellen
```

### Checklisten vor dem Start

| Gate | Aktion | Haken |
|------|--------|-------|
| ✅ Change approved | Im Ticket nachschauen | [x] |
| ⏳ Kunde informiert | Email/Call mit Downtime | [ ] |
| 📖 Guide gelesen | https://documentation.wazuh.com/...#upgrade | [ ] |
| 💾 Backup/Snapshot | VM-Snapshot oder `tar` Backup | [ ] |
| 💾 Snapshot-ID dokumentiert | snapshot_id Feld oben ausfüllen | [x] |
| 📸 Health Snapshot (pre) | Befehl ausführen + speichern | [ ] |

⛔ **STOPP:** Keine Häkchen? Upgrade NICHT starten!

---

## 🔄 SCHRITT 5: Checkliste während der Durchführung abhaken

Arbeite jetzt die Checkliste **von oben nach unten** ab.

### Ablauf für jeden Punkt:

**Z.B. Punkt C1.1:** `[ ] Stop filebeat`

1. **Lies die Checkliste-Box:** "Stop filebeat"
2. **Öffne das Runbook** parallel: `runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md`
3. **Suche die entsprechende Sektion** im Runbook (z.B. "Step 2: Stop Services")
4. **Kopiere den Befehl** (grau hinterlegt):
   ```bash
   systemctl stop filebeat
   ```
5. **Führe ihn auf dem Server aus:**
   ```bash
   $ systemctl stop filebeat
   $ systemctl status filebeat
   # Output: inactive (dead) ← OK!
   ```
6. **Hake die Box in der Checkliste ab:**
   ```markdown
   - [x] Stop filebeat        ← Ändere [ ] zu [x]
   ```

---

## 📸 SCHRITT 6: Health Snapshots dokumentieren

### Pre-Snapshot (VORHER – vor Upgrade starten)

Im Runbook, Abschnitt "Health Snapshot (Pre-Change)", gibt es einen kompletten Befehl:

```bash
# Kopiere diesen Befehl & führe ihn aus:
date -Is
echo "=== DISK ==="
df -h | grep -v tmpfs
echo "=== SERVICES ==="
systemctl status wazuh-indexer wazuh-manager wazuh-dashboard filebeat
echo "=== VERSIONS ==="
dpkg -l | grep -E 'wazuh-(indexer|manager|dashboard)|filebeat'
```

**Speichere die komplette Ausgabe:**
```
2026-01-30T22:01:00+01:00
=== DISK ===
Filesystem     Size  Used Avail Use% Mounted on
/dev/sda1      100G  62G  35G  65% /
=== SERVICES ===
...
(alle Ausgaben speichern)
```

Poste diese Ausgabe **im Change-Ticket** (z.B. in einem Kommentar oder als Attachment).

---

### Post-Snapshot (NACHHER – nach Upgrade fertig)

Nach allen Steps:
1. **Führe denselben Befehl nochmal aus**
2. **Speichere die neue Ausgabe**
3. **Vergleiche PRE vs POST:**
   - Versionen aktualisiert? ✅
   - Alle Services laufen? ✅
   - Disk OK? ✅

**In der Checkliste dokumentieren:**
```markdown
### D) Post-Checks (Acceptance Criteria)

- [x] Pre-Snapshot durchgeführt und im Ticket dokumentiert
      → https://link-to-ticket/comment/12345

- [x] Post-Snapshot durchgeführt und im Ticket dokumentiert
      → https://link-to-ticket/comment/12346

- [x] Versionen korrekt: 4.12.0 auf allen Komponenten
      wazuh-indexer: 4.12.0
      wazuh-manager: 4.12.0
      wazuh-dashboard: 4.12.0
      filebeat: 4.12.0

- [x] Alle Services running
      wazuh-indexer: active (running)
      wazuh-manager: active (running)
      wazuh-dashboard: active (running)
      filebeat: active (running)

- [x] Dashboard erreichbar (Login OK)
```

---

## 🚨 SCHRITT 7: Bei Problemen – Troubleshooting

### Problem: Service startet nicht

**Was tun:**

1. Öffne das Runbook, Abschnitt **"Troubleshooting"** (meist Abschnitt 11)
2. Führe die dort gelisteten **Diagnose-Befehle** aus:
   ```bash
   journalctl -u wazuh-manager -n 50 --no-pager -p err
   ```
3. Poste die Fehlerausgabe **im Change-Ticket**
4. Wähle eine Lösung aus dem Runbook

### Problem: Upgrade schiefgelaufen – Rollback nötig

**Was tun:**

1. Gehe zu **Abschnitt E: Rollback (If Needed)** in der Checkliste
2. Wähle die Rollback-Methode:
   - **Option 1:** VM-Snapshot zurückfahren (schnellste Methode)
   - **Option 2:** Downgrade von Packages
   - **Option 3:** Configuration-Restore
3. Dokumentiere im Ticket:
   ```markdown
   ## Rollback durchgeführt

   **Grund:** wazuh-manager startet nicht nach Upgrade (Java OOM Error)
   **Methode:** VM-Snapshot restore (snap-...)
   **Zeitpunkt:** 2026-01-30 23:45
   **Ergebnis:** ✅ Erfolgreich, System wiederhergestellt
   ```
4. Erstelle ein **Incident-Ticket** für Root-Cause-Analysis

---

## 💾 SCHRITT 8: Checkliste abschließen

Am Ende der Checkliste:

```markdown
## Sign-Off & Documentation

### Approval
- [x] Executed by (Operator): David Dutler
- [x] Approved by (Reviewer): Ivan Stricker, 2026-01-31 01:00
- [x] Customer Notified: YES (Email sent 2026-01-31 01:15)

### Final Checklist
- [x] Change ticket CLOSED (status: Completed)
- [x] Pre- and post-health snapshots ATTACHED
- [x] All deviations DOCUMENTED
- [x] Customer sign-off OBTAINED
- [x] Runbook feedback PROVIDED

```

### Finale Schritte:

1. **Kopiere die Abschluss-Notiz** in eine neue Datei:  
   `templates/CHANGE_NOTE_TEMPLATE.md`
2. **Unterschreibe digital** (Reviewer-Name + Datum)
3. **Schließe das Change-Ticket** im Change-Management-System
4. **Informiere den Kunden** → Email mit "Upgrade erfolgreich abgeschlossen"

---

## 🎯 Zusammenfassung (Quick Checklist)

```
CHECKLISTEN-WORKFLOW:

1️⃣  Metadaten sammeln (Customer, Versions, Ticket, Snapshot)
2️⃣  Checklisten-Datei kopieren → in Change-Ticket einfügen
3️⃣  YAML-Block ausfüllen (operator, customer, etc.)
4️⃣  Pre-Go Gates prüfen (alle ✅ sein!)
5️⃣  Health Snapshot (pre) ausführen → im Ticket speichern
6️⃣  Schritte von oben nach unten abarbeiten
    - Checklisten-Box lesen
    - Ins Runbook gucken
    - Befehl kopieren & ausführen
    - Box abhaken [x]
7️⃣  Health Snapshot (post) ausführen → mit pre vergleichen
8️⃣  Abschlussnote schreiben
9️⃣  Reviewer unterschreibt
🔟 Ticket schließen + Kunde informieren
```

---

## 💡 Häufige Fehler (vermeiden!)

| Fehler | Problem | Lösung |
|--------|---------|--------|
| ❌ Metadaten leer lassen | Nicht nachverfolgbar | **ALLE Felder ausfüllen!** |
| ❌ Pre-Go Gates ignorieren | Datenverlust möglich | **IMMER alle Checks prüfen** |
| ❌ Snapshot nicht erstellen | Kein Rollback möglich | **Zuerst Backup/Snapshot** |
| ❌ Health Snapshots nicht speichern | Audit-Trail fehlt | **Im Ticket dokumentieren** |
| ❌ Runbook nicht konsultieren | Falsche Reihenfolge | **Befehle aus Runbook kopieren** |
| ❌ Außerhalb Fenster durchführen | Unerlaubte Änderung | **Nur im Wartungsfenster** |

---

## 📞 Weitere Hilfe

| Frage | Antwort |
|-------|--------|
| Welche Checkliste für was? | Siehe `README.md` – Tabelle "Welche Datei für welchen Zweck?" |
| Wo finde ich die Befehle? | `runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md` |
| Ich verstehe nicht, was ein Befehl macht? | Lese die Dokumentation im Runbook oder die Wazuh Docs |
| Darf ich die Reihenfolge ändern? | **NEIN!** Die Runbooks sind für sichere Reihenfolge getestet |
| Was wenn ich die Checkliste vergesse? | Das ist OK – kopiere sie später, aber Audit-Trail wird lückenhaft |

---

✅ **Du bist bereit!** Los geht's mit deinem ersten Upgrade! 🚀
