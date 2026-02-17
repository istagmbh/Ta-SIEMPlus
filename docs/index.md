# Ta-SIEMPlus Documentation

Welcome to the **Ta-SIEMPlus** operational documentation system for managing Wazuh SIEM installations.

## 🎯 Purpose

This documentation provides standardized maintenance workflows for Wazuh SIEM operations, focusing on:

- **Reproducibility**: Clear, step-by-step procedures
- **Auditability**: Complete documentation trail
- **Reliability**: Validated processes with safety gates

## 📚 Documentation Sections

### [Overview](overview/index.md)
Getting started with Ta-SIEMPlus, architecture principles, and workflow overview.

### [Runbooks](runbooks/index.md)
Detailed step-by-step operational procedures for Wazuh maintenance tasks.

### [Checklists](checklists/index.md)
Actionable ticket templates synchronized with runbooks for change management.

### [Upgrade Guides](upgrade-guides/index.md)
Versioned upgrade procedures for Wazuh components by release version.

### [Reference](reference/index.md)
Quick command references, troubleshooting guides, and technical documentation.

### [Catalog](catalog/index.md)
Customer infrastructure registry and configuration metadata.

### [Templates](templates/index.md)
Standardized templates for change notes and communication.

## 🚀 Quick Start

1. **New to Ta-SIEMPlus?** Start with the [Overview](overview/index.md)
2. **Planning an upgrade?** Check [Upgrade Guides](upgrade-guides/index.md)
3. **Need a command?** See [Reference](reference/index.md)
4. **Following a procedure?** Use [Runbooks](runbooks/index.md) and [Checklists](checklists/index.md)

## 🔐 Security First

- Never commit secrets directly to the repository
- Always use vault references: `vault://path/to/secret`
- Follow the established governance and review processes

## 📋 Key Principles

### Workflow Synchronization
Checklists reference runbooks (no command duplication). When updating one, update the other.

### No-Go Gates
Mandatory safety boundaries:
- Disk usage > 90% = **STOP**
- Services must be `active (running)`
- Valid backup/snapshot required
- Approved change ticket required

### Health Snapshots
Capture system state before and after every change for audit trail.

---

**License:** MIT | **Repository:** [istagmbh/Ta-SIEMPlus](https://github.com/istagmbh/Ta-SIEMPlus)
