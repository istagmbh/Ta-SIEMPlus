# Upgrade Guides

Version-specific upgrade procedures for Wazuh SIEM components. Each guide is tailored to a specific Wazuh release version and includes version-specific considerations, known issues, and validated upgrade paths.

## 📚 About Versioned Upgrade Guides

Upgrade guides are **versioned using mike** to maintain documentation for multiple Wazuh releases. This allows you to:

- Access upgrade procedures for your specific version
- Review historical upgrade paths
- Understand version-specific requirements and changes

## 🎯 Available Upgrade Guides

### Wazuh 4.x Series

#### [Wazuh 4.12 Upgrade Guide](4.12/index.md)
Latest stable release with enhanced detection capabilities and performance improvements.

**Key Changes:**
- Improved SCA (Security Configuration Assessment)
- Enhanced agent communication protocol
- Dashboard UI improvements
- Performance optimizations for large deployments

**Upgrade Path:** 4.10.x, 4.11.x → 4.12.0

#### [Wazuh 4.11 Upgrade Guide](4.11/index.md) *(Coming Soon)*
Previous stable release with focus on reliability.

#### [Wazuh 4.10 Upgrade Guide](4.10/index.md) *(Coming Soon)*
Long-term support release.

### Version Selection Guide

| From Version | To Version | Guide | Complexity | Downtime |
|-------------|------------|-------|------------|----------|
| 4.11.x | 4.12.x | [4.12](4.12/index.md) | Low | ~30 min |
| 4.10.x | 4.12.x | [4.12](4.12/index.md) | Medium | ~45 min |
| 4.9.x | 4.12.x | [4.12](4.12/index.md) | Medium | ~45 min |
| 4.8.x or older | 4.12.x | Contact Support | High | ~90 min |

## 🚀 How to Use Upgrade Guides

### 1. Determine Your Current Version
```bash
# Check manager version
/var/ossec/bin/wazuh-control info | grep VERSION

# Check indexer version
curl -sk -u admin:admin https://127.0.0.1:9200/ | grep number

# Check dashboard version
dpkg -l | grep wazuh-dashboard
```

### 2. Select Target Version
- Review release notes for target version
- Check compatibility requirements
- Verify your infrastructure meets prerequisites
- Review known issues and breaking changes

### 3. Review Upgrade Path
- Ensure your upgrade path is supported
- Note any intermediate versions required
- Plan for configuration migrations if needed

### 4. Follow Version-Specific Guide
- Use the guide for your **target version**
- Follow all version-specific prerequisites
- Complete all validation steps
- Document version numbers in metadata

## 📋 Version-Specific Considerations

### Component Version Compatibility

**Critical Rule:** Manager version must be ≥ Agent version

```
✅ SUPPORTED:
   Manager 4.12.0 + Agent 4.11.0
   Manager 4.12.0 + Agent 4.12.0

❌ NOT SUPPORTED:
   Manager 4.11.0 + Agent 4.12.0
```

### Upgrade Order for Central Components

Always upgrade in this order:
1. **Wazuh Indexer** first
2. **Wazuh Manager** second
3. **Wazuh Dashboard** third
4. **Filebeat** last

### Agent Upgrade Strategy

Two approaches:
- **Rolling upgrade**: Upgrade agents in phases (recommended for large deployments)
- **Batch upgrade**: Upgrade all agents simultaneously (suitable for smaller environments)

## 🔍 Version-Specific Resources

### Wazuh 4.12
- [Release Notes](https://documentation.wazuh.com/current/release-notes/release-4-12-0.html)
- [Upgrade Guide](4.12/index.md)
- [Known Issues](4.12/known-issues.md)
- [Migration Guide](4.12/migration.md)

### Official Wazuh Documentation
- [Current Documentation](https://documentation.wazuh.com/current/)
- [Upgrade Guide](https://documentation.wazuh.com/current/upgrade-guide/)
- [Compatibility Matrix](https://documentation.wazuh.com/current/installation-guide/compatibility.html)

## 📝 Version Metadata Requirements

When following an upgrade guide, always document:

```yaml
current_version:
  indexer: "4.11.0"
  manager: "4.11.0"
  dashboard: "4.11.0"
  filebeat: "7.10.2"

target_version:
  indexer: "4.12.0"
  manager: "4.12.0"
  dashboard: "4.12.0"
  filebeat: "7.10.2"

upgrade_path: "4.11.0 -> 4.12.0"
guide_version: "4.12"
```

## 🔄 Using Mike for Version Management

This documentation uses **mike** for managing versioned content. See [Deployment Guide](../reference/deployment.md) for details.

### Quick Reference
```bash
# Deploy a specific version
mike deploy 4.12 latest

# List all versions
mike list

# Set default version
mike set-default latest

# Delete a version
mike delete 4.11
```

## 🛡️ Pre-Upgrade Checklist

Before starting any upgrade:

- [ ] Review target version release notes
- [ ] Check compatibility matrix
- [ ] Verify upgrade path is supported
- [ ] Review version-specific known issues
- [ ] Create backup/snapshot of current system
- [ ] Document current versions
- [ ] Schedule maintenance window
- [ ] Get change approval
- [ ] Notify stakeholders

## 🔗 Related Resources

- [Runbooks](../runbooks/index.md) - Detailed upgrade procedures
- [Checklists](../checklists/index.md) - Upgrade tracking templates
- [Reference](../reference/index.md) - Command references
- [Official Wazuh Releases](https://github.com/wazuh/wazuh/releases)
