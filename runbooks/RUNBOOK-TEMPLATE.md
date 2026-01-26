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
related_checklist: "checklists/CHECKLIST-TEMPLATE.md"
last_reviewed: 2026-01-01
tags: ["wazuh","upgrade","aio"]
---

# {{title}}

## Purpose / Scope

Describe what this runbook covers:
- What systems/components are affected
- What type of operation this runbook supports (upgrade, maintenance, recovery, etc.)
- When to use this runbook

## Prerequisites

Before starting, ensure you have:
- [ ] Required access credentials (stored in vault: `vault://...`)
- [ ] Maintenance window scheduled: `YYYY-MM-DD HH:MM - HH:MM (Timezone)`
- [ ] Valid snapshot/backup ID: `{{snapshot_id}}`
- [ ] Customer notification sent
- [ ] Change ticket created: `{{change_ticket}}`

**Required Knowledge:**
- Understanding of Wazuh architecture
- Familiarity with Linux system administration
- Access to emergency contacts

## Pre-Checks (No-Go Gates)

These conditions **must** be met before proceeding. If any check fails, **DO NOT PROCEED**:

1. **Version Compatibility**: Manager-Version ≥ Agent-Version
2. **Backup Exists**: Snapshot/backup verified and accessible
3. **System Health**: All services in healthy state
4. **Disk Space**: Sufficient disk space available (< 85% usage, **No-Go > 90%**)
5. **Time Window**: Current time is within approved maintenance window

## Runbook Steps

### Step 0: Health Snapshot (Pre-Change)

**Purpose:** Create an auditable baseline of system state before making changes.

**Commands:**
```bash
set -euo pipefail

echo "=== DATE/UPTIME ==="
date -Is
uptime

echo "=== DISK/MEM ==="
df -h
free -h

echo "=== SERVICES ==="
systemctl status wazuh-indexer wazuh-manager wazuh-dashboard filebeat || true

echo "=== VERSIONS ==="
dpkg -l | egrep 'wazuh-(indexer|manager|dashboard)' || true
```

**Expected Output:** All services should be active (running). Note any warnings.

**Documentation:** Save this output to your change ticket as "Pre-Change Health Snapshot"

---

### Step 1: Backup / Snapshot (Mandatory)

**Purpose:** Create recovery point before making any changes.

**Standard Method:** VM/Volume snapshot (recommended)

**Alternative Method:** Configuration backup

**Commands:**
```bash
set -euo pipefail
BACKUP_DIR="/root/wazuh_backup_$(date +%F_%H%M%S)"
mkdir -p "$BACKUP_DIR"
tar -czf "$BACKUP_DIR/var_ossec_etc.tgz" /var/ossec/etc

echo "Backup written to: $BACKUP_DIR"
ls -lah "$BACKUP_DIR"
```

**Verification:** Confirm backup file exists and has reasonable size (> 0 bytes)

**Documentation:** Record snapshot ID in your checklist and change ticket

---

### Step 2: Main Operations

**Purpose:** Describe what the main operations accomplish.

**Commands:**
```bash
# Add specific commands for your procedure here
# Use set -euo pipefail for error handling
# Include verification steps after each critical operation
```

**Troubleshooting:**
- **If X happens:** Do Y
- **If service fails to start:** Check logs with `journalctl -u service-name -n 100`

---

### Step 3: Post-Change Actions

**Purpose:** Verify changes and restore normal operations.

**Commands:**
```bash
# Commands to finalize the change
# Restart services if needed
# Verify connectivity and functionality
```

---

### Step 4: Health Snapshot (Post-Change)

**Purpose:** Verify system health after changes.

**Commands:** (Same as Step 0)

**Verification:**
- [ ] All services active (running)
- [ ] No critical errors in logs
- [ ] Versions match target (for upgrades)

**Documentation:** Save this output to your change ticket as "Post-Change Health Snapshot"

---

## Rollback Procedure

**When to Rollback:**
- Service fails to start or crashes repeatedly
- Critical functionality is broken
- Data integrity issues detected
- Unable to complete procedure within maintenance window

**Standard Rollback Method:** Snapshot/Volume Restore

**Steps:**
1. Stop all affected services
2. Restore from snapshot ID: `{{snapshot_id}}`
3. Verify services start successfully
4. Run Health Snapshot (Step 0) and document
5. Create incident record with root cause

**Alternative Rollback Method:** (If snapshot not available - document risk!)

**Post-Rollback Actions:**
- [ ] Notify customer of rollback and current status
- [ ] Create incident/problem record
- [ ] Schedule root cause analysis
- [ ] Document lessons learned

---

## Post-Checks / Acceptance Criteria

Minimum criteria for successful completion:

- [ ] Dashboard/UI reachable and functional
- [ ] User login successful
- [ ] Data flow verified (new events observed / test event confirmed)
- [ ] No critical errors in system logs
- [ ] Customer acceptance obtained
- [ ] Change ticket fully documented (Pre/Post snapshots, findings, deviations)

---

## References

- **Related Checklist:** `{{related_checklist}}`
- **Change Note Template:** `templates/CHANGE_NOTE_TEMPLATE.md`
- **Customer Catalog:** `Catalog/CUSTOMERS.md`
- **Official Wazuh Documentation:** https://documentation.wazuh.com/current/

---

## Maintenance Notes

**Last Updated:** {{last_reviewed}}  
**Update Frequency:** Review quarterly or after significant Wazuh version changes  
**Change History:** See git commit history for this file  

**Known Issues:**
- (Document any known limitations or issues with this procedure)

**Future Improvements:**
- (Track planned enhancements to this runbook)