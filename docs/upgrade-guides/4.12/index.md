# Wazuh 4.12 Upgrade Guide

This guide covers upgrading to **Wazuh 4.12.x** from previous 4.x versions.

## 📊 Version Information

- **Target Version:** 4.12.0
- **Release Date:** January 2026 (example)
- **Support Status:** Current stable release
- **Upgrade Type:** Minor version upgrade

## 🎯 What's New in Wazuh 4.12

### Key Features
- Enhanced Security Configuration Assessment (SCA)
- Improved agent communication protocol with better compression
- Dashboard UI improvements for better user experience
- Performance optimizations for deployments with >10,000 agents
- Enhanced threat intelligence integration
- Improved log analysis capabilities

### Component Updates
- **Indexer:** OpenSearch-based improvements
- **Manager:** Enhanced detection rules and decoders
- **Dashboard:** UI/UX improvements, new widgets
- **Agents:** Better resource management, improved stability

### API Changes
- New endpoints for agent group management
- Enhanced authentication mechanisms
- Improved query performance

## 🔧 Prerequisites

### System Requirements

**Minimum Requirements:**
- **OS:** Ubuntu 20.04 LTS or later, Rocky/AlmaLinux 8+
- **RAM:** 4 GB (8 GB recommended for production)
- **Disk:** 50 GB free space (more for larger deployments)
- **CPU:** 2 cores (4+ recommended)

**Network Requirements:**
- Outbound internet access to packages.wazuh.com
- Proper firewall rules for Wazuh ports (1514, 1515, 55000, 9200, 5601)

### Version Compatibility

**Supported Upgrade Paths:**
- ✅ From 4.11.x to 4.12.x - Direct upgrade
- ✅ From 4.10.x to 4.12.x - Direct upgrade
- ✅ From 4.9.x to 4.12.x - Direct upgrade
- ⚠️ From 4.8.x or older - Review migration guide first

**Component Compatibility:**
- Filebeat: 7.10.2 (compatible with 4.12)
- OpenSearch: 2.x compatible
- Agents: 4.0.x to 4.12.x (Manager must be ≥ Agent version)

### Pre-Upgrade Checklist

- [ ] Current version documented (run version checks)
- [ ] Valid backup/snapshot created and verified
- [ ] Sufficient disk space available (minimum 20% free)
- [ ] All services currently healthy and running
- [ ] Change ticket approved
- [ ] Maintenance window scheduled
- [ ] Rollback plan documented

## 🚀 Upgrade Procedure

### Step-by-Step Process

For detailed commands and procedures, refer to:
- **[Runbook: Wazuh Upgrade AIO Ubuntu](../../runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md)**
- **[Checklist: Wazuh Upgrade AIO](../../checklists/CHECKLIST_WAZUH_UPGRADE_AIO.md)**

### High-Level Overview

1. **Pre-Upgrade Snapshot** (Section 1)
   - Document current versions
   - Capture service status
   - Record cluster health
   - Check for errors in logs

2. **Upgrade Wazuh Indexer** (Section 2)
   ```bash
   apt-get update
   apt-get install wazuh-indexer=4.12.0-1
   systemctl restart wazuh-indexer
   ```

3. **Upgrade Wazuh Manager** (Section 3)
   ```bash
   apt-get install wazuh-manager=4.12.0-1
   systemctl restart wazuh-manager
   ```

4. **Upgrade Wazuh Dashboard** (Section 4)
   ```bash
   apt-get install wazuh-dashboard=4.12.0-1
   systemctl restart wazuh-dashboard
   ```

5. **Verify Filebeat** (Section 5)
   ```bash
   apt-get install filebeat=7.10.2
   systemctl restart filebeat
   ```

6. **Post-Upgrade Validation** (Section 6)
   - Verify all versions updated
   - Check service status
   - Test cluster health
   - Validate API access
   - Review logs for errors

7. **Agent Upgrades** (Section 7)
   - Plan rolling upgrade strategy
   - Test with pilot group first
   - Use remote upgrade capability or manual upgrade

## ⚠️ Known Issues

### Issue #1: Dashboard Login Delay
**Symptoms:** Dashboard may take longer to respond after upgrade  
**Cause:** Index optimization in progress  
**Resolution:** Wait 5-10 minutes for initial optimization to complete

### Issue #2: Agent Disconnections (Rare)
**Symptoms:** Some agents may disconnect during manager restart  
**Cause:** Connection timeout during restart  
**Resolution:** Agents will automatically reconnect within 1-2 minutes

### Issue #3: APT Package Cache
**Symptoms:** Upgrade fails with package not found  
**Cause:** Stale APT cache  
**Resolution:**
```bash
apt-get clean
apt-get update
```

## 🔄 Rollback Procedure

If the upgrade fails or causes issues:

### Quick Rollback (from snapshot)
1. Stop all Wazuh services
2. Restore from snapshot/backup
3. Verify services start correctly
4. Document rollback reason

### Manual Rollback (downgrade packages)
```bash
# Stop services
systemctl stop wazuh-dashboard filebeat wazuh-manager wazuh-indexer

# Downgrade packages (example to 4.11.0)
apt-get install --allow-downgrades \
  wazuh-indexer=4.11.0-1 \
  wazuh-manager=4.11.0-1 \
  wazuh-dashboard=4.11.0-1

# Restart services in order
systemctl start wazuh-indexer
systemctl start wazuh-manager
systemctl start wazuh-dashboard
systemctl start filebeat
```

**Note:** Always prefer snapshot restore over manual downgrade.

## 📋 Post-Upgrade Tasks

### Immediate Tasks
- [ ] Verify all services running
- [ ] Check cluster status
- [ ] Test API connectivity
- [ ] Validate agent connections
- [ ] Review error logs

### Within 24 Hours
- [ ] Monitor system performance
- [ ] Check agent check-ins
- [ ] Verify alert generation
- [ ] Test integrations (if any)
- [ ] Update documentation

### Within 1 Week
- [ ] Plan agent upgrades
- [ ] Review new features
- [ ] Update operational procedures
- [ ] Training for new capabilities (if needed)

## 🔧 Configuration Changes

### No Configuration Changes Required
Wazuh 4.12 maintains backward compatibility with 4.11 configurations. Existing configurations will continue to work without modifications.

### Optional Configuration Enhancements
Consider reviewing these new configuration options:
- Enhanced SCA policies
- New agent communication settings
- Improved vulnerability detection rules

See: [Wazuh 4.12 Configuration Reference](https://documentation.wazuh.com/4.12/user-manual/reference/ossec-conf/)

## 📊 Performance Expectations

### Upgrade Duration
- **Small deployment** (<100 agents): 30-45 minutes
- **Medium deployment** (100-1000 agents): 45-60 minutes
- **Large deployment** (>1000 agents): 60-90 minutes

### Expected Downtime
- **Indexer:** ~2-3 minutes
- **Manager:** ~5-10 minutes (agents buffer events during this time)
- **Dashboard:** ~2-3 minutes
- **Total:** ~15-20 minutes for core services

### Post-Upgrade Performance
- No significant performance degradation expected
- May see improved indexing performance
- Dashboard queries may be faster

## 📚 Additional Resources

### Official Documentation
- [Wazuh 4.12 Release Notes](https://documentation.wazuh.com/current/release-notes/release-4-12-0.html)
- [Official Upgrade Guide](https://documentation.wazuh.com/current/upgrade-guide/)
- [4.12 User Manual](https://documentation.wazuh.com/4.12/)

### Ta-SIEMPlus Resources
- [Upgrade Runbook](../../runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md)
- [Upgrade Checklist](../../checklists/CHECKLIST_WAZUH_UPGRADE_AIO.md)
- [Command Reference](../../reference/index.md)

### Community Resources
- [Wazuh Community Forum](https://groups.google.com/forum/#!forum/wazuh)
- [GitHub Issues](https://github.com/wazuh/wazuh/issues)
- [Wazuh Slack](https://wazuh.com/community/join-us-on-slack/)

## 🆘 Getting Help

If you encounter issues during the upgrade:

1. **Check the logs:**
   ```bash
   journalctl -u wazuh-manager -n 100 --no-pager
   journalctl -u wazuh-indexer -n 100 --no-pager
   ```

2. **Review known issues** (above)

3. **Consult the troubleshooting guide:** [Reference](../../reference/index.md)

4. **Contact support:** Your organization's support channels

5. **Community help:** Wazuh forums and Slack

## ✅ Success Criteria

Your upgrade to 4.12 is successful when:

- [ ] All components show version 4.12.0
- [ ] All services are `active (running)`
- [ ] Cluster health is `green`
- [ ] API responds correctly
- [ ] Agents are connected and reporting
- [ ] Dashboard is accessible and functional
- [ ] No critical errors in logs
- [ ] Post-upgrade validation passed

---

**Last Updated:** February 2026  
**Validated On:** Ubuntu 22.04 LTS with Wazuh 4.12.0  
**Maintainer:** Ta-SIEMPlus Team
