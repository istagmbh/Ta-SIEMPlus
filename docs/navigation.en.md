# Project Overview

A map through all resources in Ta-SIEMPlus.

---

## Getting started

| What do you need? | Resource |
|---|---|
| Read documentation | [istagmbh.github.io/Ta-SIEMPlus](https://istagmbh.github.io/Ta-SIEMPlus/) |
| Perform an upgrade | [Web Tool: Upgrade Form](webforms/upgrade-form.html) |
| Generate a checklist | [Web Tool: Checklist Generator](webforms/checklist-generator.html) |
| Manage agents | [Web Tool: Agent Management](webforms/agent-management.html) |
| Maintenance log | [Web Tool: Maintenance Log](webforms/maintenance-protocol.html) |
| Quick commands | [Quick Reference](quick-reference.md) |
| Register a new customer | [Catalog guide](guides/catalog-howto.md) |

---

## Workflow: Wazuh Upgrade

```
START
  │
  ├─→ [1] Look up customer data
  │       catalog/CUSTOMERS.md
  │       ↓
  ├─→ [2] Prepare upgrade form or checklist
  │       webforms/upgrade-form.html
  │       checklists/CHECKLIST_WAZUH_UPGRADE_AIO.md
  │       ↓
  ├─→ [3] Perform upgrade
  │       runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md
  │       ↓
  ├─→ [4] Document health snapshot
  │       quick-reference.md (Pre/Post Snapshot)
  │       ↓
  └─→ [5] Close change note
          templates/CHANGE_NOTE_TEMPLATE.md

DONE ✅
```

---

## File overview

### Documentation

| File | Description |
|---|---|
| [getting-started.md](getting-started.md) | Getting started & GitHub Pages URL |
| [quick-reference.md](quick-reference.md) | Copy-paste commands & health checks |
| [overview/index.md](overview/index.md) | Architecture & principles |

### Runbooks & Checklists

| File | Description |
|---|---|
| [runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md](runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md) | Detailed upgrade runbook |
| [runbooks/RUNBOOK_WAZUH_AGENT_GROUP_MANAGEMENT.md](runbooks/RUNBOOK_WAZUH_AGENT_GROUP_MANAGEMENT.md) | Agent group management |
| [checklists/CHECKLIST_WAZUH_UPGRADE_AIO.md](checklists/CHECKLIST_WAZUH_UPGRADE_AIO.md) | Upgrade checklist |

### Web Tools

| Tool | Description |
|---|---|
| [webforms/upgrade-form.html](webforms/upgrade-form.html) | Upgrade wizard with PDF export |
| [webforms/checklist-generator.html](webforms/checklist-generator.html) | Checklist generator |
| [webforms/agent-management.html](webforms/agent-management.html) | Agent management |
| [webforms/maintenance-protocol.html](webforms/maintenance-protocol.html) | Maintenance log |

### Configuration templates

| File | Description |
|---|---|
| [config-templates/manager/ossec-manager.md](config-templates/manager/ossec-manager.md) | ossec.conf Manager AIO |
| [config-templates/agent/ossec-agent.md](config-templates/agent/ossec-agent.md) | ossec.conf Linux Agent |
| [config-templates/indexer/opensearch.md](config-templates/indexer/opensearch.md) | opensearch.yml Indexer |
| [config-templates/filebeat/filebeat.md](config-templates/filebeat/filebeat.md) | filebeat.yml |
| [config-templates/VARIABLES.md](config-templates/VARIABLES.md) | Variable reference |

### Catalog & templates

| File | Description |
|---|---|
| [catalog/CUSTOMERS.md](catalog/CUSTOMERS.md) | Customer registry |
| [guides/catalog-howto.md](guides/catalog-howto.md) | Catalog management |
| [guides/checklist-howto.md](guides/checklist-howto.md) | Checklist guide |

---

## Checklist: Am I ready for an upgrade?

- [ ] Customer data checked in [catalog/CUSTOMERS.md](catalog/CUSTOMERS.md)
- [ ] Change ticket exists
- [ ] Backup/snapshot created
- [ ] Disk usage < 90%
- [ ] All services `active (running)`
- [ ] Maintenance window planned

All yes → Proceed with the [Upgrade Form](webforms/upgrade-form.html) or [Runbook](runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md).
