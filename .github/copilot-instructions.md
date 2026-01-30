# Copilot Instructions – Ta-SIEMPlus (Managed SIEM Wazuh)

## Project Overview

**Ta-SIEMPlus** is an operational documentation system for managing Wazuh SIEM installations. It standardizes maintenance workflows (upgrades, incidents, onboarding) for reliability and auditability. **This is not code** – it's a structured knowledge base of runbooks, checklists, and operational catalogs.

**Key artifacts:**
- **Runbooks** (`runbooks/`): Detailed step-by-step procedures with commands, validation gates, and rollback strategies
- **Checklists** (`checklists/`): Actionable ticket templates (synchronized with runbooks, no duplicate commands)
- **Catalog** (`Catalog/`): Customer infrastructure registry (YAML metadata, secret references only)
- **Templates** (`templates/`): Standardized change notes and communication formats

## Critical Architectural Patterns

### 1. **Workflow Synchronization Requirement**
Checklists and runbooks are **tightly coupled**:
- Checklists reference runbooks for detailed commands (e.g., `(reference: Runbook Section X)`)
- Checklists contain only **checkbox items and brief descriptions**
- Runbooks contain complete **commands, validation logic, and troubleshooting**
- **If you modify a runbook section, update its corresponding checklist** and vice versa
- See [checklists/CHECKLIST-TEMPLATE.md](checklists/CHECKLIST-TEMPLATE.md) and [runbooks/RUNBOOK-TEMPLATE.md](runbooks/RUNBOOK-TEMPLATE.md)

### 2. **No-Go Gates (Mandatory Safety Boundaries)**
Every procedure has non-negotiable pre-flight checks:
- Disk usage > 90% = **STOP** (documented in Section 1 of RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md)
- All services must be `active (running)` before upgrade
- Snapshot/backup must exist and be verified
- Change ticket must be approved
- **These are documented explicitly in "0) Nicht verhandelbare Regeln"** sections – treat as immovable constraints

### 3. **Health Snapshots (Audit Trail)**
Every procedure must capture system state **before** and **after**:
- Pre-change snapshot: baseline of versions, disk, services, cluster health
- Post-change snapshot: verify nothing regressed
- Both snapshots **must be attached to the change ticket**
- See [runbooks/RUNBOOK-TEMPLATE.md](runbooks/RUNBOOK-TEMPLATE.md) "Step 0" pattern

### 4. **Metadata-Driven Execution**
All checklists require structured metadata headers:
```yaml
operator, customer, infrastructure, change_ticket, 
maintenance_window_start/end, target_version, snapshot_id, runbook_ref
```
This **drives audit trails and traceability**. Always fill these completely.

## Development Workflow

### File Naming Conventions
- **Runbooks:** `RUNBOOK_<DESCRIPTION>_<PLATFORM>.md` (e.g., `RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md`)
- **Checklists:** `CHECKLIST_<DESCRIPTION>.md`
- **Templates:** `<TYPE>_TEMPLATE.md`
- Use **UPPERCASE** and underscores

### Git Workflow
1. **All changes via Pull Request** (no direct commits)
2. **Require minimum 1 reviewer** (checked in [CONTRIBUTING.md](CONTRIBUTING.md))
3. **Commit message format:** `<type>: <short desc>` + rationale
   - `fix: Correct indexer startup command in upgrade runbook`
   - `docs: Add missing prerequisites to AIO checklist`

### When Modifying Runbooks
- **Always document the reason** (why changed, what risk, rollback method)
- **Test commands in non-production** before committing
- **Update related checklists** if any steps change
- **Preserve structure:** Sections 0–N, Pre-Checks, Health Snapshot pattern
- Reference official Wazuh docs (e.g., https://documentation.wazuh.com/current/upgrade-guide/)

### When Modifying Checklists
- **Sync with runbooks** – if you change checklist steps, verify runbook matches
- **Don't duplicate commands** – reference runbook instead
- **Keep checkbox format** for operational tracking
- Update version/target_version metadata if applicable
- See [checklists/CHECKLIST_WAZUH_UPGRADE_AIO.md](checklists/CHECKLIST_WAZUH_UPGRADE_AIO.md) as reference

### Secrets Management
**CRITICAL:** Never commit secrets directly
- Use vault/secret-store references: `vault://path/to/secret`
- See [Catalog/CUSTOMERS.md](Catalog/CUSTOMERS.md) schema for examples
- Document which secrets are required in runbook prerequisites

## Project-Specific Patterns

### Operating on Wazuh AIO Systems
- Components must upgrade **in lockstep:** wazuh-indexer, wazuh-manager, wazuh-dashboard, filebeat
- Manager version ≥ Agent version (rule from Section 0)
- Ubuntu systems use **APT** package manager
- Critical ports: 1514, 1515, 55000 (API), 9200 (Indexer), 5601 (Dashboard)
- Cluster health checks via: `curl -sk -u admin:admin https://127.0.0.1:9200/_cluster/health?pretty`

### Health Check Commands (Reusable Pattern)
```bash
# Status
systemctl status wazuh-indexer wazuh-manager wazuh-dashboard filebeat
# Versions
dpkg -l | grep -E 'wazuh-(indexer|manager|dashboard)|filebeat'
# Cluster health
curl -sk -u admin:admin https://127.0.0.1:9200/_cluster/health?pretty
# Journal errors (last 50 lines)
journalctl -u <service> -n 50 --no-pager -p err
```

### Timeouts & Maintenance Windows
- Runbook execution typically **1–2 hours** for minor upgrades
- Windows specified in checklist metadata: `maintenance_window_start/end` (Europe/Zurich timezone)
- Always schedule with customer contact list available

## Integration Points

- **Wazuh Official Docs:** https://documentation.wazuh.com/
- **APT Repository:** packages.wazuh.com
- **Secret Store:** Referenced as `vault://...` (your Vault/1Password/Keepass)
- **Change Management:** Ticket system must be created before procedure execution

## Quick Reference for Common Tasks

| Task | Primary File | Key Section |
|------|--------------|-------------|
| Create new Wazuh upgrade checklist | [checklists/CHECKLIST-TEMPLATE.md](checklists/CHECKLIST-TEMPLATE.md) | Copy & fill metadata |
| Add new runbook | [runbooks/RUNBOOK-TEMPLATE.md](runbooks/RUNBOOK-TEMPLATE.md) | Follow structure, include no-go gates |
| Register customer infrastructure | [Catalog/CUSTOMERS.md](Catalog/CUSTOMERS.md) | Use YAML schema, no secrets |
| Review PR changes | [CONTRIBUTING.md](CONTRIBUTING.md) | Check accuracy, safety, consistency |
| Execute Wazuh upgrade | [runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md](runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md) | Section 1: Health snapshot; Sections 2–9: steps; Section 11: troubleshooting |
