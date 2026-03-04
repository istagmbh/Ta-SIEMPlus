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

# Change Note – Wazuh Upgrade (Central Components)

**Purpose:** This template standardizes change documentation for Wazuh upgrades.
**Usage:** Copy this template, fill in the metadata above, and complete each section during the change.
**Audience:** Customer notification and internal change records.

## Context
- Customer: `{{customer}}`
- Infrastructure: `{{infrastructure}}`
- Operator: `{{operator}}`
- Maintenance window: `{{window_start}}` – `{{window_end}}` (Europe/Zurich)
- Current/target version: `{{current_version}}` → `{{target_version}}`
- Snapshot/backup ID: `{{snapshot_id}}`

## Execution (Summary)
- Runbook: `runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md`
- Checklist: `checklists/CHECKLIST_WAZUH_UPGRADE_AIO.md`

## Pre-Health Snapshot (Excerpt / Link)
- (paste output or reference attachment)

## Findings / Deviations
- (if none: "none")

## Post-Health Snapshot (Excerpt / Link)
- (paste output or reference attachment)

## Acceptance
- Dashboard accessible: yes/no
- Login OK: yes/no
- Data flow OK: yes/no
- Open items: (if none: "none")

## Rollback / Incident
- Rollback performed: yes/no
- If yes: method (snapshot/downgrade) + reason
- Incident/problem record: reference
