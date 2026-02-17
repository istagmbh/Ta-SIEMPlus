# Mike Versioning Guide

This guide explains how to use **mike** for versioning the Ta-SIEMPlus documentation, particularly for managing multiple versions of Wazuh upgrade guides.

## What is Mike?

Mike is a Python utility that manages multiple versions of MkDocs-powered documentation. It allows you to:
- Deploy different versions of documentation
- Switch between versions
- Set a default version
- Maintain version aliases (e.g., "latest", "stable")

## Installation

Mike is already included in the project dependencies:

```bash
pip install mike
```

Or use the Docker image which has mike pre-installed.

## Basic Usage

### Deploy a New Version

When you create documentation for a new Wazuh version (e.g., 4.13), deploy it using mike:

```bash
# Deploy version 4.13 and tag it as "latest"
mike deploy 4.13 latest --update-aliases

# Deploy version 4.13 without changing aliases
mike deploy 4.13

# Deploy and push to remote (for GitHub Pages)
mike deploy 4.13 latest --push --update-aliases
```

### List All Versions

View all deployed versions:

```bash
mike list
```

Example output:
```
4.10
4.11
4.12 [latest]
```

### Set Default Version

Set which version users see by default:

```bash
mike set-default latest
```

### Delete a Version

Remove an old or deprecated version:

```bash
mike delete 4.10
```

### Serve Versioned Docs Locally

Test your versioned documentation locally:

```bash
mike serve
```

This starts a local server at http://localhost:8000 with version switching enabled.

## Workflow for New Wazuh Releases

When a new Wazuh version is released:

### 1. Create Version Documentation

```bash
# Create directory for new version
mkdir -p docs/upgrade-guides/4.13

# Copy template from previous version
cp docs/upgrade-guides/4.12/index.md docs/upgrade-guides/4.13/index.md
```

### 2. Update Content

Edit `docs/upgrade-guides/4.13/index.md`:
- Update version numbers
- Add new features and changes
- Update known issues
- Modify upgrade procedures if needed

### 3. Update Navigation

Edit `mkdocs.yml` to include the new version:

```yaml
nav:
  - Upgrade Guides:
    - upgrade-guides/index.md
    - Wazuh 4.13:
      - upgrade-guides/4.13/index.md
    - Wazuh 4.12:
      - upgrade-guides/4.12/index.md
```

### 4. Test Locally

```bash
# Build and test
mkdocs serve

# Test with mike
mike deploy 4.13 latest --update-aliases
mike serve
```

### 5. Deploy New Version

```bash
# Commit your changes
git add .
git commit -m "docs: Add Wazuh 4.13 upgrade guide"
git push

# Deploy with mike (if using GitHub Pages)
mike deploy 4.13 latest --push --update-aliases
```

## Version Aliases

Aliases are friendly names that point to specific versions:

- **latest**: Points to the most recent version
- **stable**: Points to the current stable release
- **dev**: Points to development/preview documentation

### Managing Aliases

```bash
# Set multiple aliases for a version
mike deploy 4.12 latest stable

# Update aliases
mike alias 4.12 latest --update

# Remove an alias
mike delete latest  # Deletes only the alias, not the version
```

## GitHub Pages Integration

To publish versioned docs to GitHub Pages:

### 1. Enable GitHub Pages

In your repository settings:
- Go to Settings → Pages
- Set source to "gh-pages" branch
- Save

### 2. Deploy Using Mike

```bash
# Deploy and push to gh-pages branch
mike deploy 4.12 latest --push --update-aliases

# Set default version
mike set-default --push latest
```

### 3. Access Your Docs

Your documentation will be available at:
```
https://[username].github.io/[repository-name]/
```

## Best Practices

### Version Naming

Use consistent version naming:
- ✅ `4.12`, `4.13`, `4.14` - Wazuh version numbers
- ✅ `latest`, `stable`, `dev` - Aliases
- ❌ `v4.12`, `version-4.12` - Inconsistent formats

### When to Create a New Version

Create new versioned documentation for:
- **Major Wazuh releases** (e.g., 4.0, 5.0)
- **Minor releases with significant changes** (e.g., 4.12, 4.13)
- **LTS (Long-Term Support) releases**

Don't create versions for:
- **Patch releases** (e.g., 4.12.1, 4.12.2) - update existing version
- **Documentation fixes** - update existing version
- **Minor corrections** - update existing version

### Maintaining Old Versions

- Keep **at least 2 previous major versions**
- Archive very old versions (move to archive section)
- Update old versions only for critical security issues

### Version Lifecycle

1. **New** - Recently released, actively updated
2. **Stable** - Current recommended version
3. **Previous** - Older but still supported
4. **Deprecated** - No longer recommended
5. **Archived** - Historical reference only

## Troubleshooting

### Version Not Showing

If a deployed version doesn't appear:

```bash
# Check deployed versions
mike list

# Rebuild version
mike deploy 4.12 --update-aliases

# Clear browser cache
```

### Wrong Default Version

```bash
# Set correct default
mike set-default latest

# Verify
mike list
```

### Broken Links After Deploying

Ensure all internal links use relative paths:
```markdown
# ✅ Good
[Upgrade Guide](../upgrade-guides/4.12/)

# ❌ Bad (won't work with versioning)
[Upgrade Guide](/upgrade-guides/4.12/)
```

### Can't Delete Version

If deletion fails:

```bash
# Force delete
mike delete 4.10 --force

# Or manually delete from gh-pages branch
git checkout gh-pages
git rm -r 4.10/
git commit -m "Remove version 4.10"
git push
```

## Advanced Usage

### Custom Version Selector

Customize the version selector in `mkdocs.yml`:

```yaml
extra:
  version:
    provider: mike
    default: latest
```

### Multiple Documentation Sites

You can use mike to manage different documentation sites:

```bash
# Deploy to different remote
mike deploy 4.12 --remote origin-docs --push

# Use different gh-pages branch
mike deploy 4.12 --branch documentation --push
```

### Version-Specific Configuration

Create version-specific overrides:

```bash
# In your deploy script
if [ "$VERSION" = "4.12" ]; then
  mike deploy 4.12 --config-file mkdocs-4.12.yml
fi
```

## Integration with CI/CD

Example GitHub Actions workflow:

```yaml
name: Deploy Docs
on:
  push:
    branches: [main]
    paths: ['docs/**', 'mkdocs.yml']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: 3.x
      
      - run: pip install mkdocs-material mike
      
      - run: |
          git config user.name github-actions
          git config user.email github-actions@github.com
          mike deploy --push --update-aliases ${{ github.ref_name }} latest
```

## Additional Resources

- [Mike Documentation](https://github.com/jimporter/mike)
- [MkDocs Documentation](https://www.mkdocs.org/)
- [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)

## Quick Reference Card

```bash
# Most common commands
mike deploy <version> [alias]     # Deploy a version
mike deploy <version> --push      # Deploy and push to remote
mike list                         # List all versions
mike set-default <version>        # Set default version
mike serve                        # Serve versioned docs locally
mike delete <version>             # Delete a version
mike alias <version> <new-alias>  # Add an alias to version
```
