# Managed SIEM – Runbooks & Checklisten (Wazuh)

Diese Sammlung standardisiert Wartungsabläufe für den Managed SIEM Service (Wazuh) und ist für den täglichen Betrieb gedacht.
Fokus: reproduzierbar, auditierbar, operator-freundlich.

## Übersicht

Dieses Repository enthält alle notwendigen Dokumente für die Wartung und das Upgrade von Wazuh SIEM-Installationen:
- **Runbooks** für detaillierte Schritt-für-Schritt-Anleitungen
- **Checklisten** für strukturierte Ticket-/Change-Verwaltung
- **Katalog** für Kunden- und Infrastruktur-Informationen
- **Templates** für standardisierte Kommunikation

## Struktur

- `runbooks/` – Schritt-für-Schritt Runbooks (Befehle / Reihenfolge / Triage)
- `checklists/` – Ticket-/Change-Checklisten (1:1 abhakbar, keine doppelten Commands)
- `Catalog/` – Kunden-/Infrastruktur-Katalog (URLs/Hosts/Referenzen)
- `templates/` – Vorlagen für Change-Notizen / Abschlussmeldungen
- `docs/` – Web-basierte Tools und ergänzende Dokumentation (z.B. Maintenance Form)

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

### Für ein Wazuh Upgrade:

1. **Vorbereitung:**
   - Öffne `checklists/CHECKLIST_WAZUH_UPGRADE_AIO.md`
   - Trage alle erforderlichen Metadaten ein: `operator`, `customer`, `infrastructure`, `change_ticket`, `maintenance_window_*`, `target_version`, `snapshot_id`
   - Lies das Runbook vorab durch, insbesondere die Voraussetzungen und No-Go-Kriterien
   
2. **Durchführung:**
   - Arbeite die Checkboxen in der Checkliste Schritt für Schritt ab
   - Für detaillierte Befehle siehe das referenzierte Runbook: `runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md`
   - Das Runbook enthält umfassende Validierungsschritte und Troubleshooting-Hilfen
   
3. **Dokumentation:**
   - Verwende `templates/CHANGE_NOTE_TEMPLATE.md` für die Abschlussmeldung
   - Dokumentiere alle Abweichungen und Findings
   - Stelle sicher, dass Pre- und Post-Health Snapshots im Ticket hinterlegt sind

4. **Bei Problemen:**
   - Konsultiere das Troubleshooting-Kapitel im Runbook (Abschnitt 11)
   - Bei kritischen Problemen: Rollback-Verfahren in Abschnitt 10 befolgen

### Für neue Kunden/Infrastruktur:

1. Öffne `Catalog/CUSTOMERS.md`
2. Kopiere das YAML-Template am Ende der Datei
3. Fülle alle Felder aus (WICHTIG: keine Secrets direkt eintragen!)
4. Committe die Änderung via Pull Request

## Wichtige Hinweise

- **Secrets-Management:** Trage NIE Passwörter oder Secrets direkt in die Dateien ein. Verwende stattdessen Referenzen zu eurem Secret-Store (z.B. `vault://...`)
- **Versionskontrolle:** Alle Änderungen müssen via Pull Request erfolgen und werden reviewed
- **No-Go Gates:** Beachte unbedingt die No-Go-Kriterien in den Checklisten - sie sind nicht verhandelbar!
