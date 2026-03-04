---
hide:
  - toc
---

# Ta-SIEMPlus

**Operational documentation for standardised Wazuh SIEM maintenance workflows.**
Developed and maintained by [T-Alpha GmbH](https://www.t-alpha.ch).

---

<div class="grid cards" markdown>

-   :material-tools:{ .lg .middle } **Web Tools**

    ---

    Browser-based tools for upgrades, checklists, agent management and maintenance logs.
    No server, no installation required.

    [:octicons-arrow-right-24: Open Web Tools](tools/index.md)

-   :material-wrench:{ .lg .middle } **Operations**

    ---

    Upgrade guides, runbooks and checklists for daily Wazuh AIO operations –
    from planning through to completion.

    [:octicons-arrow-right-24: Operations documentation](overview/index.md)

-   :material-file-code:{ .lg .middle } **Configuration**

    ---

    Ready-made configuration templates for Manager, Agent, Indexer and Filebeat
    with a complete variable reference.

    [:octicons-arrow-right-24: Configuration templates](config-templates/index.md)

-   :material-lightning-bolt:{ .lg .middle } **Quick Reference**

    ---

    Copy-paste commands for health checks, upgrades and diagnostics –
    for daily use in the terminal.

    [:octicons-arrow-right-24: Quick Reference](quick-reference.md)

</div>

---

## Workflow at a glance

| Step | Task | Tool |
|---|---|---|
| **1 · Preparation** | Look up customer data | [Catalog](catalog/CUSTOMERS.md) |
| **2 · Planning** | Fill out the upgrade form | [Web Tools](tools/index.md) |
| **3 · Execution** | Run the runbook | [Runbook AIO Ubuntu](runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md) |
| **4 · Documentation** | Capture health snapshot | [Quick Reference](quick-reference.md) |
| **5 · Completion** | Close the change note | [Change Note Template](templates/CHANGE_NOTE_TEMPLATE.md) |

---

## Core principles

| Principle | Description |
|---|---|
| **No-Go Gates** | Hard stop points: Disk > 90%, services not active, missing backup → no upgrade |
| **Health Snapshots** | System state fully documented before and after every change |
| **Workflow Sync** | Checklist and runbook must always be kept in sync |
| **Secrets** | Never plaintext – always reference `vault://path/to/secret` in the catalog |
