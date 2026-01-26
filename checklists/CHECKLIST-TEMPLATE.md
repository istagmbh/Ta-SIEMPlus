---
# Metadata section - Fill these values before using the checklist
checklist_id: "UNIQUE-ID"
title: "Descriptive Title of the Checklist"
operator: "UNSET"           # Name of the operator performing the task
customer: "UNSET"           # Customer name
infrastructure: "UNSET"     # Infrastructure identifier
change_ticket: "UNSET"      # Change ticket number (e.g., CHG-2026-00123)
maintenance_window_start: "UNSET"  # Start time (Europe/Zurich)
maintenance_window_end: "UNSET"    # End time (Europe/Zurich)
target_version: "UNSET"     # Target version for upgrades
snapshot_id: "UNSET"        # Backup/Snapshot reference
runbook_ref: "path/to/runbook.md"  # Path to associated runbook
---

# Checklist Template

**Purpose:** This template provides a starting point for creating new checklists for operational procedures.

**How to use:**
1. Copy this file and rename it following the convention: `CHECKLIST_<DESCRIPTION>.md`
2. Fill in the metadata section at the top
3. Customize the checklist items below to match your procedure
4. Reference the corresponding runbook for detailed commands
5. Use this checklist in your change ticket for tracking progress

## A) Pre-Flight Information

**Operator:** `{{operator}}`  
**Customer:** `{{customer}}`  
**Infrastructure:** `{{infrastructure}}`  
**Change Ticket:** `{{change_ticket}}`  
**Maintenance Window:** `{{maintenance_window_start}}` – `{{maintenance_window_end}}`  
**Runbook Reference:** `{{runbook_ref}}`

---

## B) Pre-Checks (No-Go Gates)

- [ ] Change approved and documented
- [ ] Customer notified of maintenance window
- [ ] Backup/Snapshot created and verified: `{{snapshot_id}}`
- [ ] Prerequisites met (list specific requirements)
- [ ] Emergency contacts available

---

## C) Execution Steps

### C1) Preparation
- [ ] Step 1: Description of what to do (reference: Runbook Section X)
- [ ] Step 2: Another preparation step

### C2) Main Tasks
- [ ] Task 1: Core activity description
- [ ] Task 2: Another core activity
- [ ] Task 3: Verification checkpoint

### C3) Post-Actions
- [ ] Post-action 1: Cleanup or finalization
- [ ] Post-action 2: Documentation update

---

## D) Post-Checks (Acceptance Criteria)

- [ ] Service operational and accessible
- [ ] Functionality verified (describe specific tests)
- [ ] No critical errors in logs
- [ ] Customer notification sent
- [ ] Change ticket updated with results

---

## E) Rollback (If Needed)

**Rollback Triggers:**
- [ ] Service fails to start
- [ ] Critical functionality broken
- [ ] Data loss detected

**Rollback Method:**
- [ ] Restore from snapshot: `{{snapshot_id}}`
- [ ] Alternative method (if applicable)

**Post-Rollback:**
- [ ] Incident record created
- [ ] Root cause analysis scheduled
