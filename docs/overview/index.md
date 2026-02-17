# Overview

## What is Ta-SIEMPlus?

Ta-SIEMPlus is an **operational documentation system** for standardized Wazuh SIEM maintenance workflows. It provides runbooks, checklists, and operational catalogs designed for reliability and auditability.

## 🎯 Goals

- **Reproducibility**: Every procedure is documented step-by-step
- **Auditability**: Complete documentation trail for compliance
- **Safety**: Built-in gates prevent dangerous operations
- **Efficiency**: Structured workflows reduce errors

## 🏗️ Architecture Principles

### 1. Workflow Synchronization
Checklists and runbooks are tightly coupled:
- Checklists reference runbooks for detailed commands
- Checklists contain only checkbox items and brief descriptions
- Runbooks contain complete commands, validation logic, and troubleshooting
- **If you modify a runbook section, update its corresponding checklist** and vice versa

### 2. No-Go Gates (Mandatory Safety Boundaries)
Every procedure has non-negotiable pre-flight checks:
- Disk usage > 90% = **STOP**
- All services must be `active (running)` before upgrade
- Snapshot/backup must exist and be verified
- Change ticket must be approved
- Must be within maintenance window

### 3. Health Snapshots (Audit Trail)
Every procedure must capture system state **before** and **after**:
- Pre-change snapshot: baseline of versions, disk, services, cluster health
- Post-change snapshot: verify nothing regressed
- Both snapshots **must be attached to the change ticket**

### 4. Metadata-Driven Execution
All checklists require structured metadata headers:
```yaml
operator: John Doe
customer: Example Corp
infrastructure: wazuh-prod-01
change_ticket: CHG0012345
maintenance_window_start: 2026-03-01T02:00:00+01:00
maintenance_window_end: 2026-03-01T06:00:00+01:00
target_version: 4.12.0
snapshot_id: snap-2026-03-01-01-30
runbook_ref: RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md
```

## 📊 Standard Workflow

```
1️⃣ PLANNING
   ├─ Create change ticket
   ├─ Get customer data from catalog
   └─ Schedule maintenance window

2️⃣ PREPARATION  
   ├─ Fill out checklist metadata
   ├─ Review runbook procedure
   └─ Check pre-go gates

3️⃣ EXECUTION
   ├─ Follow runbook steps
   ├─ Check off each item
   └─ Document health snapshots

4️⃣ VALIDATION & DOCUMENTATION
   ├─ Run post-go checks
   ├─ Document findings
   └─ Notify customer

5️⃣ CLOSURE
   ├─ Close change ticket
   ├─ Attach snapshots
   └─ Provide feedback
```

## 🔧 Operating on Wazuh AIO Systems

### Component Upgrade Order
Components must upgrade **in lockstep**:
1. wazuh-indexer
2. wazuh-manager
3. wazuh-dashboard
4. filebeat

### Version Compatibility
- Manager version ≥ Agent version (always)
- All central components should be same version

### Critical Ports
- 1514: Agent communication (UDP)
- 1515: Agent enrollment (TCP)
- 55000: Wazuh API
- 9200: Wazuh Indexer
- 5601: Wazuh Dashboard

## 🚀 Getting Started

New to Ta-SIEMPlus? Follow these steps:

1. **Understand the structure**: Browse [Runbooks](../runbooks/index.md) and [Checklists](../checklists/index.md)
2. **Review a sample upgrade**: See [Upgrade Guides](../upgrade-guides/index.md)
3. **Practice with the workflow**: Follow a runbook in a test environment
4. **Contribute improvements**: See the contributing guidelines

## 📚 Next Steps

- [View Available Runbooks](../runbooks/index.md)
- [Browse Checklists](../checklists/index.md)
- [Check Upgrade Guides](../upgrade-guides/index.md)
- [Quick Reference Commands](../reference/index.md)
