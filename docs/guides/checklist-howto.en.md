# Checklist Fill-Out Guide (STEP-BY-STEP)

This guide shows you how to correctly fill out a checklist – with real examples.

---

## Goal
You copy a checklist into your change ticket and fill it in **during execution**.

---

## STEP 1: Gather Metadata

Before you start, you need the following information:

### From your change ticket:
```
✔ Change ticket ID:         CHG-2026-00456
✔ Approved on:              2026-01-27 10:00
✔ Maintenance window:       2026-01-30 22:00 – 2026-01-31 00:30
```

### From Catalog/CUSTOMERS.md:
```
✔ Customer name:            DeepCloud AG
✔ Infrastructure:           DeepPay
✔ Environment:              prod
✔ Dashboard URL:            https://wazuh-deeppay.example.tld
✔ API URL:                  https://wazuh-deeppay.example.tld:55000
```

### From yourself:
```
✔ Your name (operator):     David Dutler / Ivan Stricker
✔ Current version:          4.9.0   (→ `dpkg -l | grep wazuh`)
✔ Target version:           4.12.0  (→ Wazuh Release Notes)
```

### From the infrastructure:
```
✔ Snapshot ID:              snap-0987654321fedcba0
  (or backup path: /backups/wazuh_backup_2026-01-30.tar.gz)
```

---

## STEP 2: Copy & Fill Out the Checklist

### 2a) Open the checklist
File: `checklists/CHECKLIST_WAZUH_UPGRADE_AIO.md`
(or the **new improved version**: `checklists/CHECKLIST_WAZUH_UPGRADE_AIO_IMPROVED.md`)

### 2b) Copy the complete file
1. Open the checklist file
2. **Ctrl+A** (or **Cmd+A** on Mac) = Select all
3. **Ctrl+C** (or **Cmd+C**) = Copy

### 2c) Paste into change ticket
1. Open your change management system (Jira, Azure DevOps, etc.)
2. Open your change ticket: CHG-2026-00456
3. Click in the **Description** field
4. **Ctrl+V** (or **Cmd+V**) = Paste

---

## STEP 3: Fill in Metadata (YAML Block at the top)

At the start of the checklist there is a YAML block. Fill it in **now** (before starting!):

### Example: BEFORE (empty)
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

### Example: AFTER (filled in)
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

**Tip:** Copy these values everywhere you see `{{variable_name}}`!

---

## STEP 4: Check Pre-Go Gates (Section B)

### What are Pre-Go Gates?
These are **critical conditions** that must ALL be met:

```
⛔ If EVEN ONE box is NOT ✓ → POSTPONE THE UPGRADE!
```

### Example: Pre-Go Gates

```markdown
## B) Pre-Go (No-Go Gates)

- [x] Change approved
       ↑ Yes, approved since 2026-01-27 10:00

- [ ] Customer notified (downtime/impact communicated)
       ↑ Not done yet → Write customer note before starting!

- [ ] Guide read (breaking changes / special steps)
       ↑ Todo: Read Wazuh 4.12.0 release notes

- [x] System resources checked (disk < 85%, RAM available)
       ↑ Disk 72%, RAM 24 GB free → OK

- [ ] Snapshot/backup created
       ↑ Todo: Create VM snapshot
```

### Checklist before starting

| Gate | Action | Check |
|------|--------|-------|
| ✅ Change approved | Check in ticket | [x] |
| ⏳ Customer notified | Email/call with downtime info | [ ] |
| 📖 Guide read | https://documentation.wazuh.com/...#upgrade | [ ] |
| 💾 Backup/snapshot | VM snapshot or `tar` backup | [ ] |
| 💾 Snapshot ID documented | Fill in snapshot_id field above | [x] |
| 📸 Health snapshot (pre) | Run command + save output | [ ] |

⛔ **STOP:** No checkmarks? Do NOT start the upgrade!

---

## STEP 5: Check Off the Checklist During Execution

Work through the checklist **from top to bottom**.

### Procedure for each item:

**E.g. item C1.1:** `[ ] Stop filebeat`

1. **Read the checklist item:** "Stop filebeat"
2. **Open the runbook** in parallel: `runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md`
3. **Find the corresponding section** in the runbook (e.g. "Step 2: Stop Services")
4. **Copy the command** (highlighted in grey):
   ```bash
   systemctl stop filebeat
   ```
5. **Execute it on the server:**
   ```bash
   $ systemctl stop filebeat
   $ systemctl status filebeat
   # Output: inactive (dead) ← OK!
   ```
6. **Check the box in the checklist:**
   ```markdown
   - [x] Stop filebeat        ← Change [ ] to [x]
   ```

---

## STEP 6: Document Health Snapshots

### Pre-Snapshot (BEFORE – prior to starting the upgrade)

In the runbook, section "Health Snapshot (Pre-Change)", there is a complete command:

```bash
# Copy this command & execute it:
date -Is
echo "=== DISK ==="
df -h | grep -v tmpfs
echo "=== SERVICES ==="
systemctl status wazuh-indexer wazuh-manager wazuh-dashboard filebeat
echo "=== VERSIONS ==="
dpkg -l | grep -E 'wazuh-(indexer|manager|dashboard)|filebeat'
```

**Save the complete output:**
```
2026-01-30T22:01:00+01:00
=== DISK ===
Filesystem     Size  Used Avail Use% Mounted on
/dev/sda1      100G  62G  35G  65% /
=== SERVICES ===
...
(save all output)
```

Post this output **in the change ticket** (e.g. in a comment or as an attachment).

---

### Post-Snapshot (AFTER – once the upgrade is complete)

After all steps:
1. **Run the same command again**
2. **Save the new output**
3. **Compare PRE vs POST:**
   - Versions updated? ✅
   - All services running? ✅
   - Disk OK? ✅

**Document in the checklist:**
```markdown
### D) Post-Checks (Acceptance Criteria)

- [x] Pre-snapshot taken and documented in ticket
      → https://link-to-ticket/comment/12345

- [x] Post-snapshot taken and documented in ticket
      → https://link-to-ticket/comment/12346

- [x] Versions correct: 4.12.0 on all components
      wazuh-indexer: 4.12.0
      wazuh-manager: 4.12.0
      wazuh-dashboard: 4.12.0
      filebeat: 4.12.0

- [x] All services running
      wazuh-indexer: active (running)
      wazuh-manager: active (running)
      wazuh-dashboard: active (running)
      filebeat: active (running)

- [x] Dashboard accessible (login OK)
```

---

## STEP 7: Troubleshooting

### Problem: Service won't start

**What to do:**

1. Open the runbook, section **"Troubleshooting"** (usually section 11)
2. Run the **diagnostic commands** listed there:
   ```bash
   journalctl -u wazuh-manager -n 50 --no-pager -p err
   ```
3. Post the error output **in the change ticket**
4. Select a solution from the runbook

### Problem: Upgrade failed – rollback required

**What to do:**

1. Go to **Section E: Rollback (If Needed)** in the checklist
2. Select the rollback method:
   - **Option 1:** Restore VM snapshot (fastest method)
   - **Option 2:** Downgrade packages
   - **Option 3:** Configuration restore
3. Document in the ticket:
   ```markdown
   ## Rollback performed

   **Reason:** wazuh-manager does not start after upgrade (Java OOM Error)
   **Method:** VM snapshot restore (snap-...)
   **Time:** 2026-01-30 23:45
   **Result:** ✅ Successful, system restored
   ```
4. Create an **incident ticket** for root-cause analysis

---

## STEP 8: Close the Checklist

At the end of the checklist:

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

### Final steps:

1. **Copy the completion note** to a new file:
   `templates/CHANGE_NOTE_TEMPLATE.md`
2. **Sign digitally** (reviewer name + date)
3. **Close the change ticket** in the change management system
4. **Notify the customer** → Email stating "Upgrade successfully completed"

---

## Summary (Quick Checklist)

```
CHECKLIST WORKFLOW:

1  Gather metadata (customer, versions, ticket, snapshot)
2  Copy checklist file → paste into change ticket
3  Fill in YAML block (operator, customer, etc.)
4  Check pre-go gates (all must be ✅!)
5  Run health snapshot (pre) → save in ticket
6  Work through steps from top to bottom
   - Read checklist item
   - Consult runbook
   - Copy & execute command
   - Check box [x]
7  Run health snapshot (post) → compare with pre
8  Write completion note
9  Reviewer signs off
10 Close ticket + notify customer
```

---

## Common Mistakes (avoid!)

| Mistake | Problem | Solution |
|--------|---------|--------|
| ❌ Leave metadata empty | Not traceable | **Fill in ALL fields!** |
| ❌ Ignore pre-go gates | Data loss possible | **ALWAYS check all gates** |
| ❌ Skip snapshot | No rollback possible | **Backup/snapshot first** |
| ❌ Don't save health snapshots | Missing audit trail | **Document in ticket** |
| ❌ Don't consult runbook | Wrong order | **Copy commands from runbook** |
| ❌ Execute outside window | Unauthorized change | **Only within maintenance window** |

---

## Further Help

| Question | Answer |
|-------|--------|
| Which checklist for what? | See `README.md` – table "Which file for which purpose?" |
| Where do I find the commands? | `runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md` |
| I don't understand what a command does? | Read the documentation in the runbook or Wazuh Docs |
| Can I change the order? | **NO!** The runbooks are tested for a safe sequence |
| What if I forget the checklist? | That's OK – copy it later, but the audit trail will be incomplete |

---

✅ **You're ready!** Let's get started with your first upgrade!
