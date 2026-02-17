---
# ⚡ FILL IN THESE METADATA FIELDS FIRST

# Operator (choose one)
operator: "David Dutler"              # Options: "David Dutler" | "Ivan Stricker"

# Customer Info
customer: "DeepCloud AG"              # e.g., "DeepCloud AG"
infrastructure: "DeepInfra"           # e.g., "DeepInfra" | "DeepPay" | "SingleNode-PROD-01"
environment: "prod"                   # Options: prod | test | dev

# Change Management
change_ticket: "CHG-2026-00123"       # e.g., "CHG-2026-00123"
maintenance_window_start: "2026-01-30 22:00"   # Format: YYYY-MM-DD HH:MM (Europe/Zurich)
maintenance_window_end: "2026-01-31 00:30"     # Format: YYYY-MM-DD HH:MM (Europe/Zurich)

# Versions
current_version: "4.9.0"              # Current installed version
target_version: "4.12.0"              # Target upgrade version

# Recovery
snapshot_id: "snap-0123456789abcdef0" # VM/Volume snapshot ID OR backup reference

# Documentation References
system: "Ubuntu AIO (APT)"
runbook_ref: "../runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md"
guide_ref: "https://documentation.wazuh.com/current/upgrade-guide/upgrading-central-components.html"

---

# 🚀 Wazuh Upgrade Checkliste – Ubuntu AIO (Central Components)

**Purpose:** Copy this entire checklist into your change ticket and follow it step-by-step.  
**Detailed Commands:** See referenced runbook: `{{runbook_ref}}`

> **IMPORTANT:** Fill in all metadata fields above before proceeding!

---

## A) Pre-Flight Information (Metadata Confirmation)

**Operator:** `{{operator}}`  
**Customer:** `{{customer}}`  
**Infrastructure:** `{{infrastructure}}`  
**Environment:** `{{environment}}`  
**Change Ticket:** `{{change_ticket}}`  
**Maintenance Window:** `{{maintenance_window_start}}` – `{{maintenance_window_end}}` (Europe/Zurich)  
**Upgrade:** `{{current_version}}` → `{{target_version}}`  
**Recovery Point:** `{{snapshot_id}}`  
**Runbook:** `{{runbook_ref}}`  
**Official Guide:** `{{guide_ref}}`

---

## B) Pre-Go Gates (No-Go Conditions)

⛔ **STOP if ANY of these are not ✓ – DO NOT PROCEED**

- [ ] Change approved and authorized
- [ ] Customer notified (downtime/impact communicated)
- [ ] Upgrade guide read (breaking changes checked)
- [ ] Prerequisites validated (see Runbook "Prerequisites" section)
- [ ] System resources confirmed (Disk < 85%, RAM available, **STOP if Disk > 90%**)
- [ ] Network connectivity to Wazuh repositories verified
- [ ] Candidate versions are **identical** (Indexer/Manager/Dashboard same patch level)
- [ ] VM/Volume snapshot created (recommended) OR configuration backup created
- [ ] Snapshot/Backup ID documented in `snapshot_id` above
- [ ] Health Snapshot (pre-change) captured and attached to this ticket

**If all above are ✓, proceed to Section C.**

---

## C) Execution (Step-by-Step)

### C1) Pre-Change Health Snapshot (CRITICAL)

Execute this command **before** any changes:

```bash
date -Is
echo "=== DISK USAGE ==="
df -h | grep -v tmpfs
echo "=== MEMORY ==="
free -h
echo "=== SERVICES ==="
systemctl status wazuh-indexer wazuh-manager wazuh-dashboard filebeat
echo "=== INSTALLED VERSIONS ==="
dpkg -l | grep -E 'wazuh-(indexer|manager|dashboard)|filebeat'
echo "=== CLUSTER HEALTH ==="
curl -sk -u admin:admin https://127.0.0.1:9200/_cluster/health?pretty
```

- [ ] **Output saved to this ticket** (attach as file or paste in comments)

---

### C2) Controlled Stop (Services)

- [ ] Stop `filebeat`
- [ ] Stop `wazuh-dashboard`
- [ ] Stop `wazuh-manager`
- [ ] Stop `wazuh-indexer`
  
See Runbook Section 2-4 for exact commands.

---

### C3) Indexer Pre-Actions

- [ ] Security configuration backup completed
- [ ] Shard allocation set to `primaries`
- [ ] Cluster flush executed
- [ ] Verify: Disk space still < 85%

See Runbook Section 5-7 for exact commands.

---

### C4) APT Package Upgrade

- [ ] APT package list updated (`apt update`)
- [ ] Wazuh Indexer upgraded
- [ ] Wazuh Manager upgraded
- [ ] Wazuh Dashboard upgraded
- [ ] Filebeat upgraded

See Runbook Section 8 for exact commands.

---

### C5) Services Start & Verification

- [ ] Start `wazuh-indexer` (wait 30-60 seconds)
- [ ] Verify indexer is `active (running)`
- [ ] Start `wazuh-manager` (wait 20-30 seconds)
- [ ] Verify manager is `active (running)`
- [ ] Start `wazuh-dashboard`
- [ ] Verify dashboard is `active (running)`
- [ ] Start `filebeat`
- [ ] Verify filebeat is `active (running)`

See Runbook Section 9 for exact commands.

---

## D) Post-Change Validation

### D1) Health Check (POST-UPGRADE)

Execute the **same** health snapshot command from Section C1:

```bash
date -Is
echo "=== DISK USAGE ==="
df -h | grep -v tmpfs
echo "=== MEMORY ==="
free -h
echo "=== SERVICES ==="
systemctl status wazuh-indexer wazuh-manager wazuh-dashboard filebeat
echo "=== INSTALLED VERSIONS ==="
dpkg -l | grep -E 'wazuh-(indexer|manager|dashboard)|filebeat'
echo "=== CLUSTER HEALTH ==="
curl -sk -u admin:admin https://127.0.0.1:9200/_cluster/health?pretty
```

- [ ] **Output saved to this ticket** (compare with PRE-snapshot)
- [ ] **Versions confirmed:** All components updated to `{{target_version}}`
- [ ] **All services running:** status = `active (running)`
- [ ] **Cluster health:** Yellow or Green (NOT Red)

---

### D2) Functional Testing

- [ ] Dashboard accessible (open in browser)
- [ ] Login successful (admin user works)
- [ ] Data ingestion working (agents reporting data)
- [ ] API responsive (`/api/v1/manager/info`)
- [ ] No critical errors in logs (check journal output)

See Runbook Section 10 for detailed tests.

---

### D3) Deviations & Findings

- [ ] All pre-checks passed: YES / NO
- [ ] All services upgraded successfully: YES / NO
- [ ] Any warnings or errors encountered? Describe:
  ```
  (paste relevant journal output or describe issues)
  ```
- [ ] Workarounds applied? If yes, describe:
  ```
  (paste workarounds)
  ```

---

## E) Rollback (If Needed)

### Rollback Triggers

Execute rollback **immediately** if:
- [ ] Service fails to start after 2-3 minutes
- [ ] Cluster health = RED (cannot recover)
- [ ] Data loss detected
- [ ] Critical functionality broken

### Rollback Method

Choose ONE:

**Option 1: VM/Volume Snapshot Restore (Recommended)**
- [ ] Power off server
- [ ] Restore VM/Volume snapshot: `{{snapshot_id}}`
- [ ] Power on server
- [ ] Verify services running and data intact

**Option 2: Downgrade Packages**
```bash
apt install --allow-downgrades wazuh-indexer={{current_version}} wazuh-manager={{current_version}} wazuh-dashboard={{current_version}} filebeat={{current_version}}
systemctl restart wazuh-indexer wazuh-manager wazuh-dashboard filebeat
```
- [ ] Downgrade completed
- [ ] Services verified running
- [ ] Health snapshot taken

**Option 3: Configuration Restore**
```bash
# Restore from backup
tar -xzf /root/wazuh_backup_*/var_ossec_etc.tgz -C /
systemctl restart wazuh-*
```
- [ ] Configuration restored
- [ ] Services restarted
- [ ] Health snapshot taken

---

### Post-Rollback

- [ ] Incident ticket created: `INC-XXXX-XXXXX`
- [ ] Root cause analysis scheduled
- [ ] Customer notified of rollback
- [ ] Recovery snapshot documented: `snap-XXXXXXXXXXXXXX`

---

## F) Sign-Off & Documentation

### Approval

- [ ] **Executed by (Operator):** `{{operator}}`
- [ ] **Approved by (Reviewer):** _________________ (Name + Date)
- [ ] **Customer Notified:** YES / NO (Date: ____________)

### Final Checklist

- [ ] Change ticket **closed** (status: Completed/Rolled-back)
- [ ] Pre- and post-health snapshots **attached**
- [ ] All deviations **documented**
- [ ] Customer sign-off **obtained**
- [ ] Runbook feedback **provided** (if applicable)

### Change Note (Optional)

Copy this template into your Change Management System for final documentation:

```markdown
# Change Completion Note

**Change:** Wazuh Upgrade (Central Components)  
**Ticket:** {{change_ticket}}  
**Operator:** {{operator}}  
**Date:** YYYY-MM-DD  

## Summary
Upgraded {{system}} from {{current_version}} to {{target_version}}.

## Pre-Change State
[Paste PRE-snapshot here]

## Post-Change State
[Paste POST-snapshot here]

## Findings
[List any deviations or warnings]

## Status
✅ Successful / 🔄 Rolled-back / ⚠️ Partial

## Next Steps
[If issues remain, describe action items]
```

---

## G) Quick Help

| Issue | Action |
|-------|--------|
| Disk > 90% | STOP – Free disk space first |
| Service won't start | Check journal (`journalctl -u <service> -n 50`) – see Runbook Troubleshooting |
| Cluster health RED | Restore snapshot or perform rollback |
| Agents not reporting | Verify network / API connectivity |
| Dashboard slow | Wait 5 min for indexing, check disk usage |

---

**Questions?** See Runbook Section 11 (Troubleshooting) or contact your team.

✅ **When all boxes are checked → Upgrade is complete!**
