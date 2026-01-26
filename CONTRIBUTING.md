# Contributing to Ta-SIEMPlus

Thank you for contributing to the Managed SIEM (Wazuh) runbooks and checklists repository!

## How to Contribute

All changes must be submitted via Pull Request (PR). This ensures quality control and maintains consistency across the repository.

### Pull Request Process

1. **Create a feature branch** from the main branch
2. **Make your changes** following the guidelines below
3. **Submit a Pull Request** with a clear description of what changed and why
4. **Wait for review** - at least one reviewer must approve your PR
5. **Address feedback** if any changes are requested
6. **Merge** once approved

### Guidelines for Changes

#### When Modifying Runbooks
- **Always include a reason** for the change (e.g., "Updated to reflect Wazuh 4.12.0 changes")
- **Document any risks** introduced by the change
- **Provide rollback instructions** if the change affects critical procedures
- **Test commands** in a non-production environment before committing
- **Update related checklists** if runbook steps change

#### When Modifying Checklists
- **Keep checklists and runbooks in sync** - if you change one, verify the other doesn't need updates
- **Maintain the checkbox format** for easy tracking
- **Don't duplicate commands** - reference the runbook instead
- **Update version numbers** in metadata if applicable

#### When Modifying Templates
- **Preserve placeholder format** (e.g., `{{variable_name}}`)
- **Document new fields** added to templates
- **Ensure backward compatibility** where possible

#### When Updating Customer Catalog
- **Never commit secrets** - use references to your secret store (e.g., `vault://...`)
- **Validate YAML syntax** before committing
- **Use the provided template** for consistency

### File Naming Conventions

- Runbooks: `RUNBOOK_<DESCRIPTION>_<PLATFORM>.md`
- Checklists: `CHECKLIST_<DESCRIPTION>.md`
- Templates: `<TYPE>_TEMPLATE.md`
- Use UPPERCASE for file names
- Use underscores to separate words

### Commit Message Format

Use clear, descriptive commit messages:
```
<type>: <short description>

<optional longer description>
<optional: why this change is needed>
<optional: reference to related issue/ticket>
```

Examples:
- `fix: Correct indexer startup command in upgrade runbook`
- `docs: Add missing prerequisites to AIO checklist`
- `feat: Add new runbook for agent upgrade`

### Code Review Standards

Reviewers should check for:
- **Accuracy** - Are commands and procedures correct?
- **Completeness** - Are all necessary steps documented?
- **Clarity** - Is the documentation easy to follow?
- **Safety** - Are there appropriate warnings and rollback procedures?
- **Consistency** - Does it follow existing patterns and conventions?

### Questions or Issues?

If you're unsure about a change or have questions, please open an issue for discussion before submitting a PR.