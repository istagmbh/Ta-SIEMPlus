# Checklists

Checklists are **actionable ticket templates** for change management. They are synchronized with runbooks and provide a structured way to track progress during maintenance operations.

## 📋 Available Checklists

### Wazuh Upgrades
- **[Wazuh Upgrade AIO](CHECKLIST_WAZUH_UPGRADE_AIO.md)** - Checklist for All-in-One Wazuh upgrades
- **[Wazuh Upgrade AIO (Improved)](CHECKLIST_WAZUH_UPGRADE_AIO_IMPROVED.md)** - Enhanced version with additional validation steps

### Templates
- **[Checklist Template](CHECKLIST-TEMPLATE.md)** - Standard template for creating new checklists

## 🎯 How to Use Checklists

### Before You Start

1. **Copy the checklist** into your change ticket or issue tracker
2. **Fill out metadata** completely:
   ```yaml
   operator: <your name>
   customer: <customer name>
   infrastructure: <system identifier>
   change_ticket: <ticket number>
   maintenance_window_start: <ISO 8601 timestamp>
   maintenance_window_end: <ISO 8601 timestamp>
   target_version: <version number>
   snapshot_id: <snapshot identifier>
   runbook_ref: <runbook filename>
   ```
3. **Review the runbook** referenced in the checklist
4. **Verify prerequisites** are met

### During Execution

1. **Follow the checklist order** - items are sequenced for safety
2. **Check off each item** as you complete it: `- [x] Completed item`
3. **Reference the runbook** for detailed commands (don't copy commands into checklist)
4. **Document deviations** in the notes section
5. **Stop if you hit a no-go gate** and escalate

### After Completion

1. **Complete all validation items**
2. **Attach health snapshots** (pre and post)
3. **Document findings** in the checklist notes
4. **Update the change ticket**
5. **Close the checklist** only when all items are checked

## 📊 Checklist Structure

### A) Metadata Header
Required information for audit trail and tracking:
- Operator name
- Customer/infrastructure details
- Change ticket reference
- Maintenance window
- Target versions
- Snapshot identifiers

### B) Pre-Flight Checks (No-Go Gates)
Mandatory safety checks that must pass before proceeding:
- [ ] Disk usage < 90%
- [ ] All services active (running)
- [ ] Valid backup/snapshot exists
- [ ] Change ticket approved
- [ ] Within maintenance window

### C) Pre-Change Snapshot
Capture baseline system state:
- [ ] Document current versions
- [ ] Check service status
- [ ] Review disk usage
- [ ] Verify cluster health
- [ ] Check for recent errors

### D) Execution Steps
Main procedure items (references runbook for details):
- [ ] Step 1 (reference: Runbook Section X)
- [ ] Step 2 (reference: Runbook Section Y)
- [ ] Validation check
- [ ] Continue...

### E) Post-Change Snapshot
Verify system state after changes:
- [ ] Confirm new versions
- [ ] Verify all services running
- [ ] Check cluster health
- [ ] Review logs for errors

### F) Post-Validation
Final checks before closure:
- [ ] Functional tests passed
- [ ] Performance acceptable
- [ ] Customer notification sent
- [ ] Documentation updated

### G) Notes & Findings
Document any issues, deviations, or observations

## 🔄 Synchronization with Runbooks

**CRITICAL:** Checklists and runbooks must stay synchronized.

- **Checklists** contain brief descriptions and reference runbook sections
- **Runbooks** contain detailed commands and troubleshooting
- **Don't duplicate commands** - reference the runbook instead
- **When updating a runbook**, check if checklist needs updates
- **When updating a checklist**, verify runbook sections match

### Example of Proper Referencing

❌ **WRONG** - Duplicating commands in checklist:
```markdown
- [ ] Upgrade indexer
  ```bash
  sudo apt-get update
  sudo apt-get install wazuh-indexer=4.12.0-1
  ```
```

✅ **CORRECT** - Referencing runbook:
```markdown
- [ ] Upgrade Wazuh Indexer (reference: Runbook Section 2.1)
```

## 🛑 No-Go Gates in Checklists

Every checklist includes mandatory no-go gates. **DO NOT PROCEED** if any check fails:

```markdown
## B) Pre-Flight Checks (No-Go Gates)
- [ ] Disk usage < 90% on all partitions (STOP if > 90%)
- [ ] All Wazuh services are `active (running)` (STOP if any failed)
- [ ] Valid snapshot/backup created and verified (STOP if missing)
- [ ] Change ticket CHG-XXXXX approved (STOP if not approved)
- [ ] Within maintenance window (STOP if outside window)
- [ ] All prerequisites from runbook verified
```

## 📝 Creating New Checklists

When creating a new checklist:

1. **Start with the template**: Use [CHECKLIST-TEMPLATE.md](CHECKLIST-TEMPLATE.md)
2. **Reference existing runbook**: Ensure a corresponding runbook exists
3. **Include all metadata fields**: Don't skip the header section
4. **Add appropriate no-go gates**: Based on the procedure's risks
5. **Test in practice**: Validate in non-production first
6. **Submit via PR**: Include rationale for new checklist

## 📸 Health Snapshot Tracking

Both pre and post snapshots must be:
1. Captured during the procedure
2. Documented in the checklist
3. Attached to the change ticket
4. Reviewed for any anomalies

### What to Include in Snapshots
- Component versions (before/after)
- Service status (all components)
- Resource utilization (disk, memory)
- Cluster health status
- Recent error logs (last 50 lines)
- API connectivity test results

## 🔗 Related Resources

- [Runbooks](../runbooks/index.md) - Detailed procedures referenced by checklists
- [Upgrade Guides](../upgrade-guides/index.md) - Version-specific upgrade information
- [Templates](../templates/index.md) - Change note templates for documentation
- [Catalog](../catalog/index.md) - Customer infrastructure information
