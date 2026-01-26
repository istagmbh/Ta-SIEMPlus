---
checklist_id: "CHG-WAZUH-UPG-AIO"
title: "Wazuh Upgrade Checkliste (Ubuntu AIO, Central Components)"
operator: "UNSET"        # Werte: "David Dutler" | "Ivan Stricker"
customer: "UNSET"        # z.B. "DeepCloud AG"
infrastructure: "UNSET"  # z.B. "DeepInfra" | "DeepPay" | "SingleNode-PROD-01"
change_ticket: "UNSET"   # z.B. "CHG-2026-00123"
maintenance_window_start: "UNSET"  # Europe/Zurich
maintenance_window_end: "UNSET"    # Europe/Zurich
target_version: "UNSET"  # z.B. "4.12.0"
current_version: "UNSET" # optional
snapshot_id: "UNSET"     # Snapshot/Backup Referenz
system: "Ubuntu AIO (APT)"
runbook_ref: "../runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md"
guide_ref: "https://documentation.wazuh.com/current/upgrade-guide/upgrading-central-components.html"
notes: ""
---

# Wazuh Upgrade Checkliste – Ubuntu AIO (Central Components)

**Zweck:** 1:1 Checkliste für Change-Tickets bei Wazuh Upgrades.  
**Verwendung:** Diese Checkliste ist direkt in Change-Tickets zu kopieren und Schritt für Schritt abzuarbeiten.  
**Detaillierte Befehle:** Siehe referenziertes Runbook: `{{runbook_ref}}`

> **WICHTIG:** Fülle zuerst die Metadaten oben aus, bevor du mit der Checkliste beginnst!

## Anleitung

1. **Vor Beginn:** Trage alle Stammdaten im Metadaten-Block (oben) ein
2. **Während der Durchführung:** Hake jeden Punkt ab (`[x]`) sobald erledigt
3. **Befehle:** Verwende das Runbook für genaue Befehle - diese Checkliste ist zur Nachverfolgung, nicht für Copy/Paste von Commands
4. **Dokumentation:** Füge Pre- und Post-Health Snapshots dem Change-Ticket bei
5. **Bei Problemen:** Siehe Abschnitt E für Rollback-Entscheidungen

> Diese Checkliste ist 1:1 für Change/Ticket gedacht.  
> Commands stehen im Runbook: `{{runbook_ref}}`

## A) Stammdaten (vorab ausfüllen)

**Operator (genau 1 auswählen):**
- [ ] David Dutler
- [ ] Ivan Stricker

**Kunde:** `{{customer}}`  
**Infrastruktur:** `{{infrastructure}}`  
**Change/Ticket:** `{{change_ticket}}`  
**Wartungsfenster:** `{{maintenance_window_start}}` – `{{maintenance_window_end}}` (Europe/Zurich)  
**Ist-/Zielversion:** `{{current_version}}` → `{{target_version}}`  
**Snapshot/Backup-ID:** `{{snapshot_id}}`  
**Guide:** `{{guide_ref}}`

---

## B) Pre-Go (No-Go Gates)

- [ ] Change freigegeben (approved)
- [ ] Kunde informiert (Downtime/Impact kommuniziert)
- [ ] Guide gelesen (Breaking Changes / besondere Schritte)
- [ ] Candidate-Versionen sind **identisch** (Indexer/Manager/Dashboard inkl. Patchlevel)
- [ ] Disk OK (Richtwert < 85%, **No-Go > 90%**)
- [ ] Snapshot/Backup erstellt und dokumentiert (`snapshot_id`)
- [ ] **Health Snapshot (Runbook 0)** durchgeführt und im Ticket abgelegt

---

## C) Ausführung (Guide-aligned)

### C1) Controlled Stop
- [ ] `filebeat` gestoppt
- [ ] `wazuh-dashboard` gestoppt

### C2) Indexer Pre-Actions
- [ ] Security-Konfig Backup ausgeführt
- [ ] Shard Allocation = `primaries`
- [ ] Flush ausgeführt
- [ ] `wazuh-manager` gestoppt (insb. single-node indexer cluster)

### C3) Indexer Upgrade
- [ ] `wazuh-indexer` gestoppt
- [ ] `jvm.options` gesichert (`.old`)
- [ ] Paket `wazuh-indexer` aktualisiert
- [ ] `wazuh-indexer` gestartet und Status OK

### C4) Indexer Post-Actions
- [ ] `indexer-security-init.sh` ausgeführt (Security re-apply)
- [ ] `_cat/nodes` OK
- [ ] Shard Allocation = `all`

### C5) Manager Upgrade
- [ ] Paket `wazuh-manager` aktualisiert
- [ ] `wazuh-manager` gestartet und Status OK
- [ ] `ossec.log` auf Errors geprüft (quick)

### C6) Filebeat Update/Setup
- [ ] Wazuh Filebeat Module aktualisiert
- [ ] `wazuh-template.json` zur Zielversion aktualisiert
- [ ] Filebeat Paket aktualisiert
- [ ] Pipelines geladen (`filebeat setup --pipelines`)
- [ ] Index-Management geladen (`filebeat setup --index-management ...`)
- [ ] `filebeat` läuft (Status OK)

### C7) Dashboard Upgrade
- [ ] Dashboard Config gesichert (`opensearch_dashboards.yml.old`)
- [ ] Paket `wazuh-dashboard` aktualisiert
- [ ] `wazuh-dashboard` läuft (Status OK)

---

## D) Post-Go (Abnahme)

- [ ] **Health Snapshot (Runbook 0)** erneut ausgeführt und im Ticket abgelegt
- [ ] Dashboard erreichbar (HTTPS)
- [ ] Login erfolgreich
- [ ] Datenfluss plausibel (neue Events kommen an / Testevent verifiziert)
- [ ] Keine kritischen Errors in `journalctl` (Indexer/Manager/Dashboard/Filebeat)
- [ ] Abschlussmeldung an Kunde gesendet (Versionen + kurzer Health-Status)
- [ ] Change/Ticket sauber dokumentiert (Start/Ende, Findings, Abweichungen)

---

## E) Störung / Rollback Entscheidung

**Trigger für Rollback (Beispiele):**
- [ ] Indexer nicht stabil (Crash/Red-Cluster)
- [ ] Auth/TLS/Index Security nicht funktionsfähig
- [ ] Datenfluss bricht nachhaltig (keine Events, Filebeat Errors)
- [ ] Dashboard nicht erreichbar / keine Anmeldung möglich

**Rollback durchgeführt via:**
- [ ] Snapshot Restore (Standard)
- [ ] Alternativ: Paket-Downgrade (nur wenn Snapshot nicht möglich, Risiko dokumentiert)

**Incident/Problem Record:**
- [ ] Erstellt (Root Cause / Prevention / Lessons Learned)
- [ ] Follow-up Tasks erfasst (Hardening, Monitoring, Automatisierung)
