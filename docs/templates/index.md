# Templates

Standardized templates for change documentation, communication, and operational procedures.

## 📋 Available Templates

### Change Management

#### [Change Note Template](CHANGE_NOTE_TEMPLATE.md)
Standard template for documenting changes and maintenance activities.

**Use for:**
- Post-upgrade documentation
- Incident response documentation
- Configuration change records
- Audit trail documentation

**Includes:**
- Change metadata (ticket, date, operator)
- Pre-change state
- Changes performed
- Post-change state
- Issues encountered
- Rollback information
- Sign-off section

### Operational Procedures

#### [Runbook Template](../runbooks/RUNBOOK-TEMPLATE.md)
Template for creating new operational runbooks.

**Use for:**
- New maintenance procedures
- System administration tasks
- Troubleshooting guides
- Installation procedures

**Includes:**
- Document metadata
- Purpose and scope
- Prerequisites
- No-go gates
- Step-by-step procedure
- Validation checks
- Rollback procedure
- Troubleshooting section

#### [Checklist Template](../checklists/CHECKLIST-TEMPLATE.md)
Template for creating operational checklists.

**Use for:**
- Change management tracking
- Maintenance execution tracking
- Compliance documentation
- Audit trail

**Includes:**
- Metadata header
- Pre-flight checks
- Pre-change snapshot
- Execution steps
- Post-change snapshot
- Validation items
- Notes section

## 🎯 How to Use Templates

### General Workflow

1. **Select appropriate template** for your task
2. **Copy the template** to your working location
3. **Fill in all sections** completely
4. **Follow the structure** - don't skip sections
5. **Submit for review** if creating new reusable content
6. **Archive** completed documents appropriately

### For Change Documentation

```markdown
1. Before change: Copy CHANGE_NOTE_TEMPLATE.md
2. Fill in metadata (ticket, customer, operator)
3. Document pre-change state
4. Execute change following runbook
5. Document post-change state
6. Note any issues or deviations
7. Get customer sign-off
8. Attach to change ticket
```

### For Creating New Runbooks

```markdown
1. Copy RUNBOOK-TEMPLATE.md
2. Fill in document metadata
3. Define purpose and scope clearly
4. List all prerequisites
5. Define no-go gates
6. Write step-by-step procedure with commands
7. Add validation after each major step
8. Document rollback procedure
9. Add troubleshooting section
10. Test in non-production
11. Submit PR for review
12. Create corresponding checklist
```

### For Creating New Checklists

```markdown
1. Ensure runbook exists first
2. Copy CHECKLIST-TEMPLATE.md
3. Define metadata fields needed
4. Reference runbook sections (don't duplicate commands)
5. Add appropriate no-go gates
6. Structure steps to match runbook
7. Include validation checkpoints
8. Test with actual procedure
9. Submit PR with runbook reference
```

## 📝 Template Best Practices

### Document Metadata

Always include complete metadata:
```yaml
document_type: Runbook | Checklist | Change Note
title: Clear, descriptive title
version: 1.0
last_updated: YYYY-MM-DD
author: Name
status: Draft | Review | Approved | Active
```

### Version Control

- Use semantic versioning (1.0, 1.1, 2.0)
- Major version: Significant procedure changes
- Minor version: Small corrections or clarifications
- Document all changes in PR description

### Naming Conventions

- **Runbooks:** `RUNBOOK_<DESCRIPTION>_<PLATFORM>.md`
- **Checklists:** `CHECKLIST_<DESCRIPTION>.md`
- **Change Notes:** `CHANGE_NOTE_<TICKET>_<DATE>.md`
- **Templates:** `<TYPE>_TEMPLATE.md`

Use uppercase and underscores for consistency.

### Section Structure

Keep consistent structure across documents:
1. Header/Metadata
2. Purpose/Overview
3. Prerequisites/Context
4. Main Content (procedures/steps)
5. Validation/Verification
6. Troubleshooting/Issues
7. References/Related Docs

### Command Documentation

When documenting commands:
```bash
# Good: Include context comment
systemctl restart wazuh-manager  # Restart after config change

# Good: Show expected output
$ curl -sk https://localhost:9200/_cluster/health?pretty
{
  "status" : "green",
  ...
}

# Good: Document what to verify
# Verify all services are running (should show "active (running)")
systemctl status wazuh-manager wazuh-indexer
```

## 🔄 Template Maintenance

### Regular Review

Templates should be reviewed:
- **Quarterly:** Check for accuracy and relevance
- **After incidents:** Update based on lessons learned
- **Version updates:** Adapt to new Wazuh versions
- **Team feedback:** Incorporate improvement suggestions

### Improvement Process

1. **Identify gap or issue** with template
2. **Document improvement** needed
3. **Draft changes** with rationale
4. **Test updated template** in practice
5. **Submit PR** with explanation
6. **Get review** from team
7. **Update related docs** if needed

### Creating New Templates

If existing templates don't fit your needs:

1. **Check if similar template exists**
2. **Document why new template needed**
3. **Draft based on similar templates**
4. **Include all standard sections**
5. **Test with real use case**
6. **Submit PR with usage examples**
7. **Update this index** to list new template

## 📊 Template Checklist

When using any template, verify:

- [ ] All metadata fields completed
- [ ] Customer/infrastructure info accurate
- [ ] References to other docs correct
- [ ] Commands tested and validated
- [ ] Validation steps included
- [ ] Rollback procedure documented
- [ ] Secrets properly referenced (vault paths)
- [ ] Timestamps in ISO 8601 format
- [ ] Version numbers documented
- [ ] Review/approval obtained (if required)

## 🔗 Related Resources

### Templates
- [Change Note Template](CHANGE_NOTE_TEMPLATE.md)
- [Runbook Template](../runbooks/RUNBOOK-TEMPLATE.md)
- [Checklist Template](../checklists/CHECKLIST-TEMPLATE.md)

### Documentation
- [Runbooks](../runbooks/index.md) - Operational procedures
- [Checklists](../checklists/index.md) - Execution tracking
- [Contributing Guidelines](../../CONTRIBUTING.md) - PR process

### Guides
- [GETTING_STARTED.md](../../GETTING_STARTED.md) - Overview of workflows
- [CHECKLIST_HOWTO.md](../../CHECKLIST_HOWTO.md) - Checklist usage guide
- [CATALOG_HOWTO.md](../../CATALOG_HOWTO.md) - Catalog management

## 💡 Tips

- **Don't skip sections** - every section has a purpose
- **Be specific** - vague documentation is dangerous
- **Test first** - validate procedures before documenting
- **Include examples** - real examples are more helpful than abstract descriptions
- **Reference sources** - link to official docs and related procedures
- **Keep it updated** - outdated docs are worse than no docs
- **Get feedback** - have colleagues review your documentation

## 📚 Additional Resources

For more information on documentation:
- [Contributing Guidelines](../../CONTRIBUTING.md)
- [Navigation Guide](../../NAVIGATION.md)
- [Official Wazuh Documentation](https://documentation.wazuh.com/)
