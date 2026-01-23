---
id: RUNBOOK-0000
title: "Short title — one line"
version: 1.0
status: draft          # draft|reviewed|published|deprecated
category: upgrade      # e.g., upgrade, incident, maintenance, onboarding
components:
  - wazuh-manager
  - wazuh-indexer
owners:
  - "@istagmbh"
related_checklist: CHECK-0000
last_reviewed: 2026-01-01
tags: ["wazuh","upgrade","aio"]
---
# {{title}}

Purpose / Scope
- Kurz: was dieses Runbook abdeckt.

Prerequisites
- snapshot_id required
- maintenance_window
- credentials in Vault: `vault://...`

Pre-Checks (No-Go gates)
1. Manager-Version >= Agent-Version
2. Snapshot exists
3. All services in healthy state

Runbook Steps
1) Health snapshot (run before and after)
   - Commands:
     ```bash
     date -Is; uptime
     df -h; free -h
     systemctl status wazuh-indexer wazuh-manager wazuh-dashboard filebeat || true
     ```
2) Backup / Snapshot (Pflicht)
   - Commands:
     ```bash
     BACKUP_DIR="/root/wazuh_backup_$(date +%F_%H%M%S)"
     mkdir -p "$BACKUP_DIR"
     tar -czf "$BACKUP_DIR/var_ossec_etc.tgz" /var/ossec/etc
     ```
3) Controlled stop...
4) Upgrade components...
5) Post actions...

Rollback
- Standard: VM/Volume snapshot restore
- Alternative: apt package downgrade (document risk)

Post-Checks / Acceptance Criteria
- Dashboard reachable, login OK
- Dataflow: new events observed
- No critical errors in journalctl

References
- checklist: checklists/CHECK-0000-wazuh-upgrade-aio.md
- template: templates/CHANGE_NOTE_TEMPLATE.md