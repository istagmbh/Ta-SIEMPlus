---
# Metadata - Fill these values before using this template
change_ticket: "UNSET"
operator: "UNSET"        # "David Dutler" | "Ivan Stricker"
customer: "UNSET"
infrastructure: "UNSET"
window_start: "UNSET"    # Europe/Zurich (format: YYYY-MM-DD HH:MM)
window_end: "UNSET"      # Europe/Zurich (format: YYYY-MM-DD HH:MM)
current_version: "UNSET"
target_version: "UNSET"
snapshot_id: "UNSET"
status: "planned"        # planned|in_progress|done|rolled_back
---

<!-- T-Alpha GmbH Corporate Header -->
<div style="background: linear-gradient(135deg, #3b3e90, #2d3070); color: white; padding: 20px 28px; border-radius: 6px; margin-bottom: 20px; font-family: Inter, Segoe UI, sans-serif;">
  <h2 style="margin: 0 0 4px 0; color: white; font-size: 1.3em;">Change-Notiz – Wazuh Upgrade</h2>
  <p style="margin: 0; opacity: 0.85; font-size: 0.85em;">T-Alpha GmbH &middot; IT Security &middot; www.t-alpha.ch</p>
</div>

# Change-Notiz – Wazuh Upgrade (Central Components)

**Purpose:** This template standardizes change documentation for Wazuh upgrades.  
**Usage:** Copy this template, fill in the metadata above, and complete each section during the change.  
**Audience:** Customer notification and internal change records.

## Kontext
- Kunde: `{{customer}}`
- Infrastruktur: `{{infrastructure}}`
- Operator: `{{operator}}`
- Wartungsfenster: `{{window_start}}` – `{{window_end}}` (Europe/Zurich)
- Ist-/Zielversion: `{{current_version}}` → `{{target_version}}`
- Snapshot/Backup-ID: `{{snapshot_id}}`

## Durchführung (Kurz)
- Runbook: `runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md`
- Checkliste: `checklists/CHECKLIST_WAZUH_UPGRADE_AIO.md`

## Pre-Health Snapshot (Auszug / Link)
- (paste output oder referenziere Attachment)

## Findings / Abweichungen
- (falls nichts: „keine“)

## Post-Health Snapshot (Auszug / Link)
- (paste output oder referenziere Attachment)

## Abnahme
- Dashboard erreichbar: ja/nein
- Login OK: ja/nein
- Datenfluss OK: ja/nein
- Offene Punkte: (falls keine: „keine“)

## Rollback / Incident
- Rollback durchgeführt: ja/nein
- Wenn ja: Methode (Snapshot/Downgrade) + Begründung
- Incident/Problem Record: Referenz
