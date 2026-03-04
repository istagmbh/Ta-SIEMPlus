# Operations

Operational documentation for Wazuh AIO systems – from planning through to completion.

---

<div class="grid cards" markdown>

-   **Upgrade Guides**

    ---

    Version-specific upgrade procedures for Wazuh AIO. Current: Wazuh 4.12.

    [:octicons-arrow-right-24: Upgrade Guides](../upgrade-guides/index.md)

-   **Runbooks**

    ---

    Detailed step-by-step SOPs for Upgrade AIO Ubuntu and Agent Group Management.

    [:octicons-arrow-right-24: Runbooks](../runbooks/index.md)

-   **Checklists**

    ---

    Change management checklists for safe and auditable operational procedures.

    [:octicons-arrow-right-24: Checklists](../checklists/index.md)

-   **Catalog**

    ---

    Customer and infrastructure registry for all managed Wazuh SIEM installations.

    [:octicons-arrow-right-24: Catalog](../catalog/index.md)

</div>

---

## What is Ta-SIEMPlus?

Ta-SIEMPlus is an **operational documentation system** for standardised Wazuh SIEM maintenance workflows. It provides runbooks, checklists and operational catalogs, optimised for reproducibility and auditability.

## Objectives

- **Reproducibility** – Every process is documented step by step
- **Auditability** – Complete documentation chain for compliance
- **Security** – Built-in gates prevent dangerous operations
- **Efficiency** – Structured workflows reduce errors

## Architecture principles

### 1. Workflow synchronisation

Checklists and runbooks are tightly coupled:

- Checklists reference runbooks for detailed commands
- Runbooks contain complete commands, validation logic and troubleshooting
- **Runbook changed → Update checklist** and vice versa

### 2. No-Go Gates (mandatory safety boundaries)

Every process has non-negotiable pre-flight checks:

- Disk usage > 90% → **STOP**
- Services not `active (running)` → **STOP**
- No verified snapshot/backup → **STOP**
- Change ticket not approved → **STOP**
- Outside maintenance window → **STOP**

### 3. Health Snapshots (audit trail)

Every intervention must capture the system state **before** and **after**:

- Pre-change snapshot: versions, disk, services, cluster health
- Post-change snapshot: verification that no regression has occurred
- Both snapshots must **be attached to the change ticket**

### 4. Metadata-Driven Execution

All checklists require structured metadata headers:

```yaml
operator: Max Muster
customer: Beispiel AG
infrastructure: wazuh-prod-01
change_ticket: CHG0012345
maintenance_window_start: 2026-03-01T02:00:00+01:00
maintenance_window_end: 2026-03-01T06:00:00+01:00
target_version: 4.12.0
snapshot_id: snap-2026-03-01-01-30
runbook_ref: RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md
```

## Standard workflow

```text
1 · PLANNING
    ├─ Create change ticket
    ├─ Look up customer data in the catalog
    └─ Plan maintenance window

2 · PREPARATION
    ├─ Fill in checklist metadata
    ├─ Review runbook procedure
    └─ Verify pre-go gates

3 · EXECUTION
    ├─ Execute runbook steps
    ├─ Check off each item
    └─ Document health snapshots

4 · VALIDATION & DOCUMENTATION
    ├─ Run post-go checks
    ├─ Document findings
    └─ Notify customer

5 · COMPLETION
    ├─ Close change ticket
    ├─ Attach snapshots
    └─ Provide feedback
```

## Wazuh AIO operations

### Component upgrade order

Components must be updated **in lockstep**:

1. wazuh-indexer
2. wazuh-manager
3. wazuh-dashboard
4. filebeat

### Version compatibility

- Manager version ≥ Agent version (always)
- All central components must run the same version

### Critical ports

| Port | Service |
|---|---|
| 1514 | Agent communication (UDP) |
| 1515 | Agent registration (TCP) |
| 55000 | Wazuh API |
| 9200 | Wazuh Indexer |
| 5601 | Wazuh Dashboard |
