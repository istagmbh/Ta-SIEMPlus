# Managed SIEM – Runbooks & Checklisten (Wazuh)

Diese Sammlung standardisiert Wartungsabläufe für den Managed SIEM Service (Wazuh) und ist für den täglichen Betrieb gedacht.
Fokus: reproduzierbar, auditierbar, operator-freundlich.

## Struktur

- `runbooks/` – Schritt-für-Schritt Runbooks (Befehle / Reihenfolge / Triage)
- `checklists/` – Ticket-/Change-Checklisten (1:1 abhakbar, keine doppelten Commands)
- `catalog/` – Kunden-/Infrastruktur-Katalog (URLs/Hosts/Referenzen)
- `templates/` – Vorlagen für Change-Notizen / Abschlussmeldungen

## Standardprozess

1. Change/Ticket eröffnen und **Checkliste** ausfüllen (`checklists/…`)
2. Pre-Go Gates prüfen (No-Go Regeln)
3. Runbook ausführen (`runbooks/…`)
4. Post-Go Abnahme dokumentieren (Health Snapshot + Versionen + Datenfluss)
5. Abschlussmeldung an Kunden

## Pflege / Governance

- Änderungen nur via Pull Request
- Review erforderlich (mind. 1 Reviewer)
- Jede Änderung mit kurzer Begründung (Warum / Risiko / Rollback)

## Quickstart (Operator)

- Öffne `checklists/CHECKLIST_WAZUH_UPGRADE_AIO.md`
- Trage `operator`, `customer`, `infrastructure`, `change_ticket`, `maintenance_window_*`, `target_version`, `snapshot_id` ein
- Arbeite die Checkboxen ab und verweise für Commands auf das Runbook:
  `runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md`
