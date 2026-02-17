# Runbooks

Runbooks are **detailed step-by-step operational procedures** for Wazuh SIEM maintenance tasks. Each runbook includes:

- Complete command sequences
- Validation checks at each step
- Troubleshooting procedures
- Rollback strategies
- No-go safety gates

## 📖 Available Runbooks

### Wazuh Upgrades
- **[Wazuh Upgrade AIO Ubuntu](../../runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md)** - Complete upgrade procedure for Wazuh All-in-One installations on Ubuntu using APT

### Agent Management
- **[Wazuh Agent Group Management](../../runbooks/RUNBOOK_WAZUH_AGENT_GROUP_MANAGEMENT.md)** - Managing agent groups, configurations, and deployments

### Templates
- **[Runbook Template](../../runbooks/RUNBOOK-TEMPLATE.md)** - Standard template for creating new runbooks

## 🎯 How to Use Runbooks

### Before You Start
1. Read the entire runbook first
2. Ensure all prerequisites are met
3. Have the corresponding checklist ready
4. Verify you're within the maintenance window

### During Execution
1. Follow steps in exact order
2. Validate each step before proceeding
3. Document any deviations
4. Stop if any no-go gate is triggered
5. Capture health snapshots (pre and post)

### After Completion
1. Run all post-validation checks
2. Document any issues encountered
3. Update the change ticket
4. Notify stakeholders
5. Provide feedback for runbook improvements

## 🛑 No-Go Gates (Safety Rules)

**DO NOT PROCEED** if any of these conditions are present:

- ❌ Disk usage > 90%
- ❌ Any service not in `active (running)` state
- ❌ No valid backup/snapshot available
- ❌ Change ticket not approved
- ❌ Outside maintenance window
- ❌ Missing required credentials or access
- ❌ Critical errors in health check

## 📸 Health Snapshot Requirements

Every runbook execution requires capturing system state:

### Pre-Change Snapshot
```bash
# Component versions
dpkg -l | grep -E 'wazuh-(indexer|manager|dashboard)|filebeat'

# Service status
systemctl status wazuh-indexer wazuh-manager wazuh-dashboard filebeat

# Disk usage
df -h

# Cluster health
curl -sk -u admin:admin https://127.0.0.1:9200/_cluster/health?pretty

# Recent errors
journalctl -u wazuh-manager -n 50 --no-pager -p err
```

### Post-Change Snapshot
Run the same commands after the change and compare results.

## 🔧 Common Validation Commands

### Service Status
```bash
systemctl status wazuh-indexer wazuh-manager wazuh-dashboard filebeat
```

### Version Check
```bash
dpkg -l | grep -E 'wazuh-(indexer|manager|dashboard)|filebeat'
```

### Cluster Health
```bash
curl -sk -u admin:admin https://127.0.0.1:9200/_cluster/health?pretty
```

### API Check
```bash
curl -k -u <user>:<password> https://localhost:55000/
```

### Agent Status
```bash
/var/ossec/bin/agent_control -l
```

## 📝 Contributing New Runbooks

When creating a new runbook:

1. Use the [Runbook Template](../../runbooks/RUNBOOK-TEMPLATE.md)
2. Include all required sections:
   - Purpose and scope
   - Prerequisites
   - No-go gates
   - Step-by-step procedure
   - Validation checks
   - Rollback procedure
   - Troubleshooting
3. Create a corresponding checklist
4. Test in non-production environment
5. Submit via Pull Request with rationale

## 🔗 Related Resources

- [Checklists](../checklists/index.md) - Ticket templates synchronized with runbooks
- [Upgrade Guides](../upgrade-guides/index.md) - Version-specific upgrade procedures
- [Reference](../reference/index.md) - Quick command references
- [Official Wazuh Documentation](https://documentation.wazuh.com/)
