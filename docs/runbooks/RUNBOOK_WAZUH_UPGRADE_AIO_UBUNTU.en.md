# Managed SIEM (Wazuh) – Runbook Upgrade Central Components (Ubuntu AIO, APT)

**Document Type:** SOP / Runbook
**Scope:** Wazuh All-in-One on Ubuntu (APT): Indexer, Manager, Dashboard, Filebeat
**Goal:** Reproducible, auditable, operator-friendly (gates + clear order)
**Version:** 1.3
**Last Updated:** January 2026
**Changes:** Via Pull Request only (review required)

## Purpose and Scope

This runbook describes the complete upgrade process for Wazuh Central Components on an Ubuntu All-in-One installation, including comprehensive validation and rollback procedures.

**When to use:**
- Upgrading Wazuh Indexer, Manager, Dashboard, and Filebeat
- For Ubuntu-based APT installations
- During scheduled maintenance windows (not for emergency patches)
- For both minor and major version upgrades

**Important Notes:**
- This runbook is aligned with the official Wazuh Upgrade Guide
- All steps must be executed in the prescribed order
- Deviations from the guide must be documented
- Use the associated checklist for ticket documentation
- Plan sufficient time (typically 1–2 hours for minor upgrades)

## Authoritative Reference (Guide)
- https://documentation.wazuh.com/current/upgrade-guide/upgrading-central-components.html
- Official Wazuh Documentation: https://documentation.wazuh.com/

## Associated Checklist
- `../checklists/CHECKLIST_WAZUH_UPGRADE_AIO.md`

## Prerequisites

The following prerequisites must be met before starting the upgrade:

### Technical Prerequisites
- Root or sudo access to the Wazuh AIO server
- Active internet connection for package downloads
- Sufficient disk space (at least 20% free on all relevant partitions)
- Valid backup/snapshot solution available
- Access to the Wazuh Dashboard and API for validation

### Organizational Prerequisites
- Approved change ticket / change request
- Communication to affected stakeholders/customers
- Defined maintenance window with sufficient time buffer
- Documented rollback strategy
- Emergency contacts available

### Knowledge Base
- Basic understanding of Wazuh architecture
- Experience with Linux system administration (systemd, APT)
- Knowledge of Elasticsearch/OpenSearch concepts (shards, cluster health)
- Access to Wazuh documentation

### Prerequisites Validation

Perform the following checks before starting the upgrade:

```bash
# Check system resources
df -h | egrep -v 'tmpfs|devtmpfs'  # Disk < 85% used
free -h                             # RAM availability
uptime                              # System stability

# Check network connectivity
ping -c 3 packages.wazuh.com
ping -c 3 raw.githubusercontent.com

# Check current service status
systemctl status wazuh-indexer wazuh-manager wazuh-dashboard filebeat

# Document current versions
dpkg -l | egrep 'wazuh-(indexer|manager|dashboard)|filebeat'
```

**No-Go Criteria:**
- Disk usage > 90%
- Not all services in "active (running)" status
- No internet connection to Wazuh repositories
- Cluster health = RED (for multi-node setups)

---

## 0) Non-Negotiable Rules (Upgrade)

1. **Component versions must be identical (including patch level):**
   - `wazuh-indexer`, `wazuh-manager`, `wazuh-dashboard`
2. **Manager version ≥ Agent version** (agents may be older, but not newer)
3. **No production upgrade without snapshot/backup** (exception: documented dev/test system)
4. **Upgrade according to guide including pre-/post-actions** (shard allocation, flush, security re-apply, etc.)
5. **No default credentials in production** (Indexer API calls must use real credentials)
6. **Documentation required:** Pre- and post-health snapshots required in the change ticket

---

## 1) Runbook 0 – Health Snapshot (always BEFORE and AFTER maintenance)

> Purpose: Generate an auditable state in < 5 minutes (copy/paste into ticket).
> **IMPORTANT:** Run this check both BEFORE and AFTER the upgrade!

```bash
set -euo pipefail

echo "=== HEALTH SNAPSHOT START ==="
echo "Timestamp: $(date -Is)"
echo "Operator: ${USER}"

echo ""
echo "=== DATE/UPTIME ==="
date -Is
uptime

echo ""
echo "=== DISK/MEM ==="
df -h | egrep -v 'tmpfs|devtmpfs'
echo ""
free -h

echo ""
echo "=== SERVICES STATUS ==="
systemctl --no-pager -l status wazuh-indexer wazuh-manager wazuh-dashboard filebeat || true

echo ""
echo "=== PORTS (sanity check) ==="
ss -lntp | egrep '(:1514|:1515|:55000|:9200|:5601)\s' || echo "WARN: Not all expected ports listening"

echo ""
echo "=== INSTALLED PACKAGES ==="
dpkg -l | egrep 'wazuh-(indexer|manager|dashboard|agent)|filebeat' || true

echo ""
echo "=== INDEXER CLUSTER HEALTH (if accessible) ==="
curl -sk -u admin:admin https://127.0.0.1:9200/_cluster/health?pretty 2>/dev/null || echo "INFO: Indexer not accessible or stopped"

echo ""
echo "=== INDEXER NODES (if accessible) ==="
curl -sk -u admin:admin https://127.0.0.1:9200/_cat/nodes?v 2>/dev/null || echo "INFO: Indexer not accessible or stopped"

echo ""
echo "=== RECENT ERRORS (last 50 lines per service) ==="
echo "--- wazuh-indexer ---"
journalctl -u wazuh-indexer -n 50 --no-pager -p err || true
echo "--- wazuh-manager ---"
journalctl -u wazuh-manager -n 50 --no-pager -p err || true
echo "--- wazuh-dashboard ---"
journalctl -u wazuh-dashboard -n 50 --no-pager -p err || true
echo "--- filebeat ---"
journalctl -u filebeat -n 50 --no-pager -p err || true

echo ""
echo "=== HEALTH SNAPSHOT END ==="
```

**Post-Execution:**
- Copy the entire output into your change ticket
- Mark whether this is Pre- or Post-Upgrade
- For Post-Upgrade: Compare with Pre-Upgrade snapshot

---

## 2) Upgrade Process (Central Components, AIO)

### 2.1 Check and document target version

**No-Go if versions are not identical!**

```bash
set -euo pipefail
apt-get update

echo "=== Candidate versions ==="
INDEXER_VER=$(apt-cache policy wazuh-indexer | awk '/Candidate:/ {print $2}')
MANAGER_VER=$(apt-cache policy wazuh-manager | awk '/Candidate:/ {print $2}')
DASHBOARD_VER=$(apt-cache policy wazuh-dashboard | awk '/Candidate:/ {print $2}')
FILEBEAT_VER=$(apt-cache policy filebeat | awk '/Candidate:/ {print $2}')

echo "wazuh-indexer: $INDEXER_VER"
echo "wazuh-manager: $MANAGER_VER"
echo "wazuh-dashboard: $DASHBOARD_VER"
echo "filebeat: $FILEBEAT_VER"

# Check version consistency
if [ "$INDEXER_VER" != "$MANAGER_VER" ] || [ "$INDEXER_VER" != "$DASHBOARD_VER" ]; then
    echo ""
    echo "ERROR: Wazuh component versions are NOT identical!"
    echo "STOP: Do NOT proceed with upgrade until versions match."
    exit 1
fi

echo ""
echo "OK: Wazuh component versions are identical: $INDEXER_VER"
echo "Target upgrade version: $INDEXER_VER"
```

**Document the target version in your change ticket!**

---

### 2.2 Backup / Snapshot (mandatory for production)

**Standard method:** VM/Volume snapshot (recommended before stopping services)
**Also recommended:** Configuration backup for quick recovery

```bash
set -euo pipefail
BACKUP_DIR="/root/wazuh_backup_$(date +%F_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "Creating configuration backup in $BACKUP_DIR"

# Back up critical configuration files
tar -czf "$BACKUP_DIR/var_ossec_etc.tgz" /var/ossec/etc 2>/dev/null || echo "WARN: Failed to backup /var/ossec/etc"
tar -czf "$BACKUP_DIR/wazuh_indexer_etc.tgz" /etc/wazuh-indexer 2>/dev/null || echo "WARN: Failed to backup /etc/wazuh-indexer"
tar -czf "$BACKUP_DIR/wazuh_dashboard_etc.tgz" /etc/wazuh-dashboard 2>/dev/null || echo "WARN: Failed to backup /etc/wazuh-dashboard"
tar -czf "$BACKUP_DIR/filebeat_etc.tgz" /etc/filebeat 2>/dev/null || echo "WARN: Failed to backup /etc/filebeat"

# Additional important files
cp /etc/wazuh-indexer/jvm.options "$BACKUP_DIR/indexer_jvm.options.backup" 2>/dev/null || true
cp /etc/filebeat/filebeat.yml "$BACKUP_DIR/filebeat.yml.backup" 2>/dev/null || true
cp /etc/wazuh-dashboard/opensearch_dashboards.yml "$BACKUP_DIR/opensearch_dashboards.yml.backup" 2>/dev/null || true

# Create backup inventory
echo "Backup created at: $(date -Is)" > "$BACKUP_DIR/backup_info.txt"
echo "Hostname: $(hostname)" >> "$BACKUP_DIR/backup_info.txt"
echo "Packages before upgrade:" >> "$BACKUP_DIR/backup_info.txt"
dpkg -l | egrep 'wazuh-(indexer|manager|dashboard)|filebeat' >> "$BACKUP_DIR/backup_info.txt"

echo ""
echo "Backup completed successfully!"
echo "Backup location: $BACKUP_DIR"
ls -lah "$BACKUP_DIR"

# Document backup path for rollback
echo ""
echo "IMPORTANT: Document this backup path in your change ticket!"
echo "Backup path: $BACKUP_DIR"
```

**Validation:**
```bash
# Verify all important backups were created
ls -lh "$BACKUP_DIR"
# At least 4 .tgz files should be present
```

**For VM snapshot (recommended):**
- Create a VM snapshot via your virtualization platform before the next step
- Document the snapshot ID in the change ticket
- Snapshot should be created while services are still running (consistent state)

---

### 2.3 Controlled Stop (Guide minimum)

**Purpose:** Stop services in the correct order to prevent data loss

```bash
set -euo pipefail

echo "Stopping services in correct order..."

# Stop Filebeat first (prevents new events from reaching the Indexer)
echo "Stopping filebeat..."
systemctl stop filebeat
systemctl status filebeat --no-pager || true

# Stop Dashboard (UI will no longer be reachable)
echo "Stopping wazuh-dashboard..."
systemctl stop wazuh-dashboard
systemctl status wazuh-dashboard --no-pager || true

echo ""
echo "Services stopped successfully."
echo "IMPORTANT: Manager and Indexer are still running for pre-upgrade actions."
```

**Expected Result:**
- filebeat: inactive (dead)
- wazuh-dashboard: inactive (dead)
- wazuh-manager: active (running) – will be stopped later
- wazuh-indexer: active (running) – will be stopped later

---

## 3) Indexer Pre-Actions (Guide)

> **Important:** Adjust credentials/PKI per environment. **DO NOT use default credentials in production!**
> **Note:** Replace `admin:admin` with the actual Indexer credentials from your secret store.

### 3.1 Security Config Backup (Indexer)

```bash
set -euo pipefail

echo "Backing up Indexer security configuration..."
/usr/share/wazuh-indexer/bin/indexer-security-init.sh --options "-backup /etc/wazuh-indexer/opensearch-security -icl -nhnv"

# Validation
if [ -d "/etc/wazuh-indexer/opensearch-security" ]; then
    echo "Security config backup created successfully"
    ls -lah /etc/wazuh-indexer/opensearch-security/
else
    echo "ERROR: Security config backup failed!"
    exit 1
fi
```

---

### 3.2 Set Shard Allocation to `primaries`

**Purpose:** Prevents shard reallocation during the upgrade (saves network traffic and time)

```bash
set -euo pipefail

# IMPORTANT: Replace admin:admin with your real credentials!
INDEXER_USER="admin"
INDEXER_PASS="admin"  # CHANGE THIS!

echo "Setting shard allocation to primaries..."
RESPONSE=$(curl -X PUT "https://127.0.0.1:9200/_cluster/settings" \
  -u "$INDEXER_USER:$INDEXER_PASS" -k \
  -H 'Content-Type: application/json' -d'
{
  "persistent": { "cluster.routing.allocation.enable": "primaries" }
}
' 2>/dev/null)

echo "Response: $RESPONSE"

# Validation
CURRENT_SETTING=$(curl -s -u "$INDEXER_USER:$INDEXER_PASS" -k \
  "https://127.0.0.1:9200/_cluster/settings?include_defaults=true&filter_path=**.cluster.routing.allocation.enable" 2>/dev/null)
echo "Current allocation setting: $CURRENT_SETTING"
```

**Expected Result:**
- Response should contain `{"acknowledged":true}`
- Shard allocation is now set to "primaries"

---

### 3.3 Execute Flush

**Purpose:** Ensures all data is written from memory to disk

```bash
set -euo pipefail

# IMPORTANT: Replace admin:admin with your real credentials!
INDEXER_USER="admin"
INDEXER_PASS="admin"  # CHANGE THIS!

echo "Flushing all indices..."
RESPONSE=$(curl -X POST "https://127.0.0.1:9200/_flush" \
  -u "$INDEXER_USER:$INDEXER_PASS" -k 2>/dev/null)

echo "Flush response: $RESPONSE"

# Additionally: Synced flush for better consistency
echo "Performing synced flush..."
curl -X POST "https://127.0.0.1:9200/_flush/synced" \
  -u "$INDEXER_USER:$INDEXER_PASS" -k 2>/dev/null || echo "INFO: Synced flush partially failed (acceptable)"
```

**Expected Result:**
- Flush should succeed
- Synced flush may partially fail (acceptable)

---

### 3.4 Stop Manager (especially for single-node Indexer cluster)

**Purpose:** Prevents new data during Indexer upgrade

```bash
set -euo pipefail

echo "Stopping wazuh-manager..."
systemctl stop wazuh-manager

# Validation
sleep 2
systemctl status wazuh-manager --no-pager || true

# Check if Manager processes have actually stopped
MANAGER_PROCS=$(pgrep -f wazuh-manager || true)
if [ -z "$MANAGER_PROCS" ]; then
    echo "OK: wazuh-manager stopped successfully"
else
    echo "WARN: Manager processes still running: $MANAGER_PROCS"
    echo "Waiting additional 5 seconds..."
    sleep 5
fi
```

**Expected Result:**
- wazuh-manager: inactive (dead)
- No more wazuh-manager processes present

---

## 4) Indexer Upgrade (Guide)

```bash
set -euo pipefail

echo "=== Indexer Upgrade Start ==="

# Stop Indexer
echo "Stopping wazuh-indexer..."
systemctl stop wazuh-indexer
sleep 3

# Validate status
systemctl status wazuh-indexer --no-pager || true

# Back up JVM settings (for comparison and rollback)
echo "Backing up JVM settings..."
cp /etc/wazuh-indexer/jvm.options /etc/wazuh-indexer/jvm.options.pre-upgrade

# Document current version
echo "Current version before upgrade:"
dpkg -l | grep wazuh-indexer

# Perform upgrade
echo "Installing wazuh-indexer upgrade..."
apt-get install -y wazuh-indexer

# Document new version
echo "New version after upgrade:"
dpkg -l | grep wazuh-indexer

# Compare JVM settings (manually verify if custom settings were preserved)
echo "Comparing JVM settings (old vs new)..."
if diff /etc/wazuh-indexer/jvm.options.pre-upgrade /etc/wazuh-indexer/jvm.options; then
    echo "INFO: JVM settings unchanged"
else
    echo "WARN: JVM settings have changed - review if custom settings need to be reapplied"
    echo "See: /etc/wazuh-indexer/jvm.options.pre-upgrade for old settings"
fi

# Reload and start service
echo "Reloading systemd and starting wazuh-indexer..."
systemctl daemon-reload
systemctl enable wazuh-indexer
systemctl start wazuh-indexer

# Wait for startup
echo "Waiting for indexer to start (up to 60 seconds)..."
for i in {1..60}; do
    if systemctl is-active --quiet wazuh-indexer; then
        echo "Indexer started after $i seconds"
        break
    fi
    sleep 1
done

# Check status
systemctl --no-pager -l status wazuh-indexer

echo "=== Indexer Upgrade Complete ==="
```

**Triage for startup failures:**
```bash
# Show detailed logs
journalctl -u wazuh-indexer -n 300 --no-pager

# Indexer-specific logs
ls -lah /var/log/wazuh-indexer/
tail -n 100 /var/log/wazuh-indexer/wazuh-cluster.log

# Common issues:
# - JVM heap size too large/small
# - Missing permissions
# - Port already in use
# - Disk full
```

**Plugin validation:**
```bash
# List installed plugins
/usr/share/wazuh-indexer/bin/opensearch-plugin list

# Expected plugins should be present
# If manually installed plugins were present, they may need to be reinstalled
```

**Cluster health check (before post-actions):**
```bash
# IMPORTANT: Adjust credentials!
curl -k -u admin:admin https://127.0.0.1:9200/_cat/health?v

# Expected result: status = yellow (single node) or green (multi-node)
# RED = critical problem, do not continue!
```

---

## 5) Indexer Post-Actions (Guide)

**Purpose:** Re-activate security configuration and restore normal cluster operations

### 5.1 Re-apply security

```bash
set -euo pipefail

echo "Re-applying indexer security configuration..."
/usr/share/wazuh-indexer/bin/indexer-security-init.sh

# Validation: Test security access
sleep 5
echo "Testing indexer access..."
# IMPORTANT: Adjust credentials!
curl -sk -u admin:admin https://127.0.0.1:9200/ | head -20

if [ $? -eq 0 ]; then
    echo "OK: Indexer security applied successfully"
else
    echo "ERROR: Cannot access indexer after security init!"
    exit 1
fi
```

---

### 5.2 Check nodes and cluster status

```bash
set -euo pipefail

# IMPORTANT: Adjust credentials!
INDEXER_USER="admin"
INDEXER_PASS="admin"  # CHANGE THIS!

echo "=== Cluster Health ==="
curl -k -u "$INDEXER_USER:$INDEXER_PASS" https://127.0.0.1:9200/_cat/health?v

echo ""
echo "=== Nodes List ==="
curl -k -u "$INDEXER_USER:$INDEXER_PASS" https://127.0.0.1:9200/_cat/nodes?v

echo ""
echo "=== Indices Overview ==="
curl -k -u "$INDEXER_USER:$INDEXER_PASS" https://127.0.0.1:9200/_cat/indices?v | head -20
```

**Expected Result:**
- Cluster status: green (multi-node) or yellow (single-node AIO – acceptable)
- Node should appear in the list
- Indices should be visible

**No-Go Criterion:**
- Cluster status: RED → Abort upgrade and perform rollback!

---

### 5.3 Re-enable Shard Allocation

**Purpose:** Restore normal shard operations

```bash
set -euo pipefail

# IMPORTANT: Adjust credentials!
INDEXER_USER="admin"
INDEXER_PASS="admin"  # CHANGE THIS!

echo "Restoring shard allocation to 'all'..."
RESPONSE=$(curl -X PUT "https://127.0.0.1:9200/_cluster/settings" \
  -u "$INDEXER_USER:$INDEXER_PASS" -k \
  -H 'Content-Type: application/json' -d'
{
  "persistent": { "cluster.routing.allocation.enable": "all" }
}
' 2>/dev/null)

echo "Response: $RESPONSE"

# Validation
echo "Verifying shard allocation setting..."
CURRENT_SETTING=$(curl -s -u "$INDEXER_USER:$INDEXER_PASS" -k \
  "https://127.0.0.1:9200/_cluster/settings?include_defaults=true&filter_path=**.cluster.routing.allocation.enable" 2>/dev/null)
echo "Current allocation setting: $CURRENT_SETTING"

# Wait briefly and check cluster health again
sleep 5
echo ""
echo "=== Cluster Health After Allocation Restore ==="
curl -k -u "$INDEXER_USER:$INDEXER_PASS" https://127.0.0.1:9200/_cat/health?v
```

**Expected Result:**
- Shard allocation = "all"
- Cluster should remain stable (yellow or green)

---

## 6) Manager Upgrade (Guide)

```bash
set -euo pipefail

echo "=== Manager Upgrade Start ==="

# Document current version
echo "Current version before upgrade:"
dpkg -l | grep wazuh-manager

# Perform upgrade
echo "Installing wazuh-manager upgrade..."
apt-get install -y wazuh-manager

# Document new version
echo "New version after upgrade:"
dpkg -l | grep wazuh-manager

# Reload and start service
echo "Reloading systemd and starting wazuh-manager..."
systemctl daemon-reload
systemctl enable wazuh-manager
systemctl start wazuh-manager

# Wait for startup
echo "Waiting for manager to start (up to 30 seconds)..."
for i in {1..30}; do
    if systemctl is-active --quiet wazuh-manager; then
        echo "Manager started after $i seconds"
        break
    fi
    sleep 1
done

# Check status
systemctl --no-pager -l status wazuh-manager

echo "=== Manager Upgrade Complete ==="
```

**Triage for issues:**
```bash
# Systemd journal
journalctl -u wazuh-manager -n 300 --no-pager

# Wazuh-specific logs
tail -n 200 /var/ossec/logs/ossec.log

# Check Manager processes
ps aux | grep wazuh

# Common issues:
# - Configuration errors in ossec.conf
# - Missing permissions on /var/ossec
# - Indexer not reachable (Manager will start but log warnings)
```

**Validation:**
```bash
# Check Manager version
/var/ossec/bin/wazuh-control info

# Check API status (if configured)
curl -k https://127.0.0.1:55000/ || echo "INFO: API not yet accessible"

# Check active agents (should show agents again after a few minutes)
/var/ossec/bin/agent_control -l 2>/dev/null || echo "INFO: Waiting for agents to reconnect"
```

---

## 7) Filebeat Update/Setup (Guide)

> Goal: Update Wazuh module + template + pipelines/index management to target version.

```bash
set -euo pipefail

echo "=== Filebeat Update Start ==="

# Determine target version
TARGET_WAZUH_VERSION="$(apt-cache policy wazuh-manager | awk '/Installed:/ {print $2}' | cut -d- -f1)"
echo "Target Wazuh version for Filebeat module: $TARGET_WAZUH_VERSION"

# Install/update Wazuh Filebeat module
echo "Downloading and installing Wazuh Filebeat module..."
curl -s https://packages.wazuh.com/4.x/filebeat/wazuh-filebeat-0.5.tar.gz \
  | tar -xvz -C /usr/share/filebeat/module

# Validate module installation
if [ -d "/usr/share/filebeat/module/wazuh" ]; then
    echo "OK: Wazuh Filebeat module installed"
    ls -lah /usr/share/filebeat/module/wazuh/
else
    echo "ERROR: Failed to install Wazuh Filebeat module!"
    exit 1
fi

# Load template matching target version
echo "Downloading Wazuh template for version $TARGET_WAZUH_VERSION..."
curl -so /etc/filebeat/wazuh-template.json \
  "https://raw.githubusercontent.com/wazuh/wazuh/v${TARGET_WAZUH_VERSION}/extensions/elasticsearch/7.x/wazuh-template.json"

# Validate template download
if [ -f "/etc/filebeat/wazuh-template.json" ]; then
    chmod go+r /etc/filebeat/wazuh-template.json
    echo "OK: Wazuh template downloaded"
    ls -lh /etc/filebeat/wazuh-template.json
else
    echo "WARN: Failed to download Wazuh template - proceeding with existing template"
fi

# Back up Filebeat config
echo "Backing up Filebeat configuration..."
cp /etc/filebeat/filebeat.yml /etc/filebeat/filebeat.yml.pre-upgrade

# Document current version
echo "Current Filebeat version:"
dpkg -l | grep filebeat

# Upgrade Filebeat
echo "Installing Filebeat upgrade..."
apt-get install -y filebeat

# Restore config (apt may have overwritten it)
echo "Restoring Filebeat configuration..."
cp /etc/filebeat/filebeat.yml.pre-upgrade /etc/filebeat/filebeat.yml

# Document new version
echo "New Filebeat version:"
dpkg -l | grep filebeat

# Reload and start service
echo "Reloading systemd and starting filebeat..."
systemctl daemon-reload
systemctl enable filebeat
systemctl start filebeat

# Wait for startup
sleep 5
systemctl --no-pager -l status filebeat

# Load pipelines
echo "Loading Filebeat pipelines..."
filebeat setup --pipelines

# Load index management
echo "Loading Filebeat index management..."
filebeat setup --index-management -E output.logstash.enabled=false

echo "=== Filebeat Update Complete ==="
```

**Triage for issues:**
```bash
# Filebeat logs
journalctl -u filebeat -n 300 --no-pager

# Test Filebeat config
filebeat test config -e

# Test Filebeat output
filebeat test output -e

# Common issues:
# - Indexer not reachable
# - Wrong credentials in filebeat.yml
# - Template upload failed
# - Pipeline setup errors
```

**Validation:**
```bash
# Filebeat status
systemctl status filebeat

# Check if events are arriving (after a few minutes)
# IMPORTANT: Adjust credentials!
curl -sk -u admin:admin 'https://127.0.0.1:9200/wazuh-alerts-*/_search?size=1&sort=@timestamp:desc' | head -50

# Expected result: Current events should be visible
```

---

## 8) Dashboard Upgrade (Guide)

```bash
set -euo pipefail

echo "=== Dashboard Upgrade Start ==="

# Back up Dashboard config
echo "Backing up Dashboard configuration..."
cp /etc/wazuh-dashboard/opensearch_dashboards.yml /etc/wazuh-dashboard/opensearch_dashboards.yml.pre-upgrade

# Document current version
echo "Current Dashboard version:"
dpkg -l | grep wazuh-dashboard

# Perform upgrade
echo "Installing wazuh-dashboard upgrade..."
apt-get install -y wazuh-dashboard

# Document new version
echo "New Dashboard version:"
dpkg -l | grep wazuh-dashboard

# Compare config (check if customizations need to be reapplied)
echo "Comparing Dashboard configuration (old vs new)..."
if diff /etc/wazuh-dashboard/opensearch_dashboards.yml.pre-upgrade /etc/wazuh-dashboard/opensearch_dashboards.yml; then
    echo "INFO: Dashboard config unchanged"
else
    echo "WARN: Dashboard config has changed - review if custom settings need to be reapplied"
    echo "See: /etc/wazuh-dashboard/opensearch_dashboards.yml.pre-upgrade for old settings"
fi

# Reload and start service
echo "Reloading systemd and starting wazuh-dashboard..."
systemctl daemon-reload
systemctl enable wazuh-dashboard
systemctl start wazuh-dashboard

# Wait for startup (Dashboard may take longer)
echo "Waiting for dashboard to start (up to 60 seconds)..."
for i in {1..60}; do
    if systemctl is-active --quiet wazuh-dashboard; then
        echo "Dashboard started after $i seconds"
        break
    fi
    sleep 1
done

# Check status
systemctl --no-pager -l status wazuh-dashboard

echo "=== Dashboard Upgrade Complete ==="
```

**Plugin validation (if manually installed):**
```bash
# List installed plugins
sudo -u wazuh-dashboard /usr/share/wazuh-dashboard/bin/opensearch-dashboards-plugin list

# If manually installed plugins were present:
# They may need to be reinstalled, compatible with the new version
```

**Test Dashboard accessibility:**
```bash
# Port check
ss -lntp | grep :5601

# HTTP access test (should redirect to login page)
curl -I http://127.0.0.1:5601 2>&1 | head -10

# HTTPS access test (if configured)
curl -k -I https://127.0.0.1:5601 2>&1 | head -10
```

**Triage for issues:**
```bash
# Dashboard logs
journalctl -u wazuh-dashboard -n 300 --no-pager

# Dashboard-specific logs
ls -lah /var/log/wazuh-dashboard/
tail -n 100 /var/log/wazuh-dashboard/opensearch_dashboards.log

# Common issues:
# - Indexer not reachable
# - Port 5601 already in use
# - Missing permissions
# - Config errors in opensearch_dashboards.yml
```

---

## 9) Post-Upgrade Validation and Acceptance

### 9.1 Verify versions

**Purpose:** Ensure all components were successfully updated

```bash
set -euo pipefail

echo "=== Installed Versions After Upgrade ==="
echo ""
echo "Wazuh Indexer:"
apt list --installed wazuh-indexer 2>/dev/null | grep wazuh-indexer

echo ""
echo "Wazuh Manager:"
apt list --installed wazuh-manager 2>/dev/null | grep wazuh-manager
/var/ossec/bin/wazuh-control info 2>/dev/null || true

echo ""
echo "Wazuh Dashboard:"
apt list --installed wazuh-dashboard 2>/dev/null | grep wazuh-dashboard

echo ""
echo "Filebeat:"
apt list --installed filebeat 2>/dev/null | grep filebeat

echo ""
echo "=== Version Consistency Check ==="
INDEXER_VER=$(dpkg -l | awk '/wazuh-indexer/ {print $3}')
MANAGER_VER=$(dpkg -l | awk '/wazuh-manager/ {print $3}')
DASHBOARD_VER=$(dpkg -l | awk '/wazuh-dashboard/ {print $3}')

if [ "$INDEXER_VER" = "$MANAGER_VER" ] && [ "$INDEXER_VER" = "$DASHBOARD_VER" ]; then
    echo "OK: All Wazuh components are on the same version: $INDEXER_VER"
else
    echo "ERROR: Version mismatch detected!"
    echo "Indexer: $INDEXER_VER"
    echo "Manager: $MANAGER_VER"
    echo "Dashboard: $DASHBOARD_VER"
fi
```

---

### 9.2 Services Health Check

**Purpose:** All services must be active and error-free

```bash
set -euo pipefail

echo "=== Services Status Check ==="
echo ""

# Function for service check with exit code
check_service() {
    SERVICE=$1
    echo "Checking $SERVICE..."
    if systemctl is-active --quiet $SERVICE; then
        echo "✓ $SERVICE is active"
        return 0
    else
        echo "✗ $SERVICE is NOT active!"
        systemctl status $SERVICE --no-pager || true
        return 1
    fi
}

# Check all services
FAILED=0
check_service wazuh-indexer || FAILED=1
check_service wazuh-manager || FAILED=1
check_service wazuh-dashboard || FAILED=1
check_service filebeat || FAILED=1

echo ""
if [ $FAILED -eq 0 ]; then
    echo "OK: All services are running"
else
    echo "ERROR: One or more services are not running!"
    exit 1
fi

# Ports check
echo ""
echo "=== Ports Listening Check ==="
ss -lntp | egrep '(:1514|:1515|:55000|:9200|:5601)\s'

REQUIRED_PORTS=("1514" "1515" "55000" "9200" "5601")
for PORT in "${REQUIRED_PORTS[@]}"; do
    if ss -lntp | grep -q ":$PORT "; then
        echo "✓ Port $PORT is listening"
    else
        echo "✗ Port $PORT is NOT listening!"
        FAILED=1
    fi
done
```

---

### 9.3 Functional Validation

**Purpose:** Ensure all components are working functionally

```bash
set -euo pipefail

# IMPORTANT: Adjust credentials!
INDEXER_USER="admin"
INDEXER_PASS="admin"  # CHANGE THIS!

echo "=== Functional Validation ==="
echo ""

# 1. Indexer Cluster Health
echo "1. Indexer Cluster Health:"
CLUSTER_HEALTH=$(curl -sk -u "$INDEXER_USER:$INDEXER_PASS" \
  'https://127.0.0.1:9200/_cluster/health' | grep -o '"status":"[^"]*"')
echo "$CLUSTER_HEALTH"

if echo "$CLUSTER_HEALTH" | grep -q "green\|yellow"; then
    echo "✓ Cluster health is acceptable"
else
    echo "✗ Cluster health is RED or unavailable!"
    exit 1
fi

# 2. Check indices
echo ""
echo "2. Active Indices:"
curl -sk -u "$INDEXER_USER:$INDEXER_PASS" \
  'https://127.0.0.1:9200/_cat/indices?v' | head -10

# 3. Check recent events
echo ""
echo "3. Recent Events (last 5 minutes):"
RECENT_EVENTS=$(curl -sk -u "$INDEXER_USER:$INDEXER_PASS" \
  'https://127.0.0.1:9200/wazuh-alerts-*/_count?q=timestamp:[now-5m TO now]' 2>/dev/null)
echo "$RECENT_EVENTS"

if echo "$RECENT_EVENTS" | grep -q '"count":[0-9]'; then
    echo "✓ Events are being indexed"
else
    echo "⚠ No recent events found (may be normal if no activity)"
fi

# 4. Manager API check (if configured)
echo ""
echo "4. Wazuh Manager API:"
API_STATUS=$(curl -sk https://127.0.0.1:55000/ 2>&1)
if echo "$API_STATUS" | grep -q "Unauthorized\|wazuh"; then
    echo "✓ Manager API is responding"
else
    echo "⚠ Manager API not responding (check if configured)"
fi

# 5. Dashboard access
echo ""
echo "5. Dashboard Accessibility:"
DASHBOARD_STATUS=$(curl -I http://127.0.0.1:5601 2>&1 | head -1)
echo "$DASHBOARD_STATUS"
if echo "$DASHBOARD_STATUS" | grep -q "200\|302"; then
    echo "✓ Dashboard is accessible"
else
    echo "✗ Dashboard is not accessible!"
fi
```

---

### 9.4 Data Flow Test (Recommended)

**Purpose:** Verify that new events are being processed

```bash
# Generate a test event (on a monitored system)
echo "Creating test event..."
logger -t WAZUH_UPGRADE_TEST "Upgrade validation test event - $(date -Is)"

# Wait for event processing
echo "Waiting 60 seconds for event processing..."
sleep 60

# Search for test event in Indexer
# IMPORTANT: Adjust credentials!
echo "Searching for test event..."
curl -sk -u admin:admin \
  'https://127.0.0.1:9200/wazuh-alerts-*/_search?q=WAZUH_UPGRADE_TEST&size=1' | grep -o '"_id":"[^"]*"' || echo "Test event not found (may need more time)"
```

---

### 9.5 Run Post-Health Snapshot

**Purpose:** Document the successful upgrade state

```bash
# Run Runbook 0 (Health Snapshot) again
# and add the output to the change ticket

echo "EXECUTE RUNBOOK 0 (Section 1) NOW FOR POST-UPGRADE SNAPSHOT"
echo "Mark the output as 'POST-UPGRADE HEALTH SNAPSHOT' in your ticket"
```

---

### 9.6 Acceptance Criteria (Minimum for production release)

**All of the following criteria MUST be met:**

- [ ] All Wazuh components have identical versions (Indexer, Manager, Dashboard)
- [ ] All services are active: `systemctl status wazuh-*` and `filebeat`
- [ ] All required ports are listening: 1514, 1515, 55000, 9200, 5601
- [ ] Indexer cluster health is GREEN or YELLOW (not RED)
- [ ] Dashboard is reachable via HTTPS
- [ ] Dashboard login works (with correct credentials)
- [ ] New events are stored in the Indexer (data flow works)
- [ ] Filebeat runs without errors (check `journalctl -u filebeat`)
- [ ] No critical errors in journalctl logs (Indexer/Manager/Dashboard/Filebeat)
- [ ] Post-health snapshot has been created and documented in the ticket
- [ ] Test event was successfully processed (optional but recommended)

**Documentation in the change ticket:**
- Pre-Upgrade Health Snapshot (complete)
- Backup/Snapshot ID documented
- Upgrade start and end timestamps
- Target version documented
- Post-Upgrade Health Snapshot (complete)
- All deviations and findings documented
- Completion notification to customer prepared

---

## 10) Rollback Procedure

**When to perform a rollback:**

Perform a rollback when:
- Indexer cluster health = RED after upgrade
- Critical services do not start (after multiple attempts)
- Data flow is permanently interrupted
- Dashboard is unreachable/non-functional
- Authentication/authorization fails
- Performance degradation is unacceptable
- Critical functionality is lost
- Maintenance window is exceeded without successful completion

**Rollback decision:**
- Make the decision quickly (within 15–30 minutes of problem detection)
- Document the reason for rollback in the change ticket
- Inform all stakeholders of the rollback decision
- Plan post-mortem and reattempt upgrade

---

### 10.1 Rollback Method 1: VM/Volume Snapshot Restore (RECOMMENDED)

**Advantages:**
- Fastest method
- Guaranteed consistent state
- No risk from package incompatibilities
- Proven method

**Prerequisites:**
- VM or volume snapshot was created before the upgrade
- Snapshot ID is documented

**Procedure:**

```bash
# IMPORTANT: These steps are performed on your virtualization/storage platform!

# 1. Stop current VM/Volume (via hypervisor/cloud console)
#    - VMware: Shut down VM
#    - Proxmox: Stop VM
#    - AWS: Stop instance
#    - Azure: Stop VM

# 2. Restore snapshot (via hypervisor/cloud console)
#    - Select the documented pre-upgrade snapshot
#    - Perform restore
#    - For volume snapshots: Restore and re-attach volumes

# 3. Start VM/system

# 4. After startup: Validate services
ssh user@wazuh-server

# Validation after snapshot restore:
echo "=== Validation After Snapshot Restore ==="

# Check versions (should be old versions)
dpkg -l | egrep 'wazuh-(indexer|manager|dashboard)|filebeat'

# Check services
systemctl status wazuh-indexer wazuh-manager wazuh-dashboard filebeat

# Run health check
# Execute Runbook 0 (Health Snapshot)

# Confirm functionality
curl -sk -u admin:admin https://127.0.0.1:9200/_cluster/health?pretty
curl -I http://127.0.0.1:5601
```

**Expected Result:**
- System is in pre-upgrade state
- All services are running
- Old versions are installed
- Functionality is restored

**Documentation:**
- Rollback timestamp in ticket
- Document rollback method
- Document reason for rollback
- Create post-rollback health snapshot

---

### 10.2 Rollback Method 2: Package Downgrade (ONLY if snapshot not available)

**⚠️ IMPORTANT:** This method carries risks and should only be used as a last resort!

**Risks:**
- Configuration files may be incompatible
- Database schemas may have changed
- Plugins may be incompatible
- Not guaranteed to work

**Prerequisites:**
- Old versions are still available in the APT repository
- Configuration backup was created (Step 2.2)

**Procedure:**

```bash
set -euo pipefail

echo "=== PACKAGE DOWNGRADE ROLLBACK START ==="
echo "WARNING: This is a risky operation. VM snapshot restore is preferred!"
echo ""

# 1. Determine available versions
echo "=== Available Package Versions ==="
apt-cache madison wazuh-indexer | head -5
apt-cache madison wazuh-manager | head -5
apt-cache madison wazuh-dashboard | head -5
apt-cache madison filebeat | head -5

# 2. Set target version for downgrade
# IMPORTANT: Replace with the actual old version!
OLD_VERSION="4.7.0-1"  # EXAMPLE - ADJUST!

echo ""
echo "Downgrading to version: $OLD_VERSION"
read -p "Press Enter to continue or Ctrl+C to abort..."

# 3. Stop all services
echo "Stopping all services..."
systemctl stop filebeat
systemctl stop wazuh-dashboard
systemctl stop wazuh-manager
systemctl stop wazuh-indexer

# 4. Downgrade packages (in reverse upgrade order)
echo "Downgrading packages..."

# Dashboard
apt-get install -y --allow-downgrades wazuh-dashboard=$OLD_VERSION || echo "WARN: Dashboard downgrade failed"

# Filebeat (keep or downgrade to matching version)
# apt-get install -y --allow-downgrades filebeat=FILEBEAT_VERSION

# Manager
apt-get install -y --allow-downgrades wazuh-manager=$OLD_VERSION || echo "WARN: Manager downgrade failed"

# Indexer
apt-get install -y --allow-downgrades wazuh-indexer=$OLD_VERSION || echo "WARN: Indexer downgrade failed"

# 5. Restore configurations if needed
echo "Checking if configuration restore is needed..."

# Determine backup directory (latest backup)
LATEST_BACKUP=$(ls -td /root/wazuh_backup_* 2>/dev/null | head -1)
if [ -n "$LATEST_BACKUP" ]; then
    echo "Found backup: $LATEST_BACKUP"

    # Optional: Restore configs
    # tar -xzf "$LATEST_BACKUP/wazuh_indexer_etc.tgz" -C /
    # tar -xzf "$LATEST_BACKUP/wazuh_dashboard_etc.tgz" -C /
    # etc.

    echo "Review backup and restore configs if needed"
else
    echo "WARN: No backup found!"
fi

# 6. Start services
echo "Starting services..."
systemctl start wazuh-indexer
sleep 10
systemctl start wazuh-manager
sleep 5
systemctl start wazuh-dashboard
sleep 5
systemctl start filebeat

# 7. Check status
echo "=== Services Status ==="
systemctl status wazuh-indexer --no-pager || true
systemctl status wazuh-manager --no-pager || true
systemctl status wazuh-dashboard --no-pager || true
systemctl status filebeat --no-pager || true

echo ""
echo "=== PACKAGE DOWNGRADE ROLLBACK COMPLETE ==="
echo "IMPORTANT: Perform full validation (Runbook 0) immediately!"
```

**Post-downgrade validation:**
```bash
# Confirm versions
dpkg -l | egrep 'wazuh-(indexer|manager|dashboard)|filebeat'

# Validate services
systemctl status wazuh-indexer wazuh-manager wazuh-dashboard filebeat

# Indexer health
curl -sk -u admin:admin https://127.0.0.1:9200/_cluster/health?pretty

# Dashboard access
curl -I http://127.0.0.1:5601

# Execute RUNBOOK 0 completely
```

**Possible issues after downgrade:**
- Indexer does not start → Restore JVM settings from backup
- Dashboard does not load → Restore opensearch_dashboards.yml from backup
- Manager does not start → Check ossec.conf, restore from backup if needed
- Security init required → Run `/usr/share/wazuh-indexer/bin/indexer-security-init.sh`

---

### 10.3 Post-Rollback Actions

**Regardless of rollback method:**

1. **Validation:**
   - Run Runbook 0 (Health Snapshot) completely
   - Document post-rollback status in ticket
   - Confirm functionality (Dashboard login, data flow)

2. **Communication:**
   - Inform all stakeholders of successful rollback
   - Communicate estimated timeframe for reattempted upgrade
   - Update change ticket with rollback timestamp

3. **Root Cause Analysis:**
   - Create incident report
   - Document what went wrong
   - Identify gaps in preparation or process
   - Plan measures to avoid issues on next attempt

4. **Next Steps:**
   - Create follow-up ticket for reattempted upgrade
   - Address identified issues before next attempt
   - Consider upgrading in test environment first
   - Plan longer maintenance window for next attempt

---

### 10.4 Rollback Prevention (Preventive Measures)

**Before the upgrade:**
- Perform test upgrade in staging environment
- Read release notes and known issues
- Check community forums for known problems
- Plan a longer maintenance window (50–100% time buffer)
- Double-check all prerequisites

**During the upgrade:**
- Validate each step individually before moving to the next
- Stop and analyze at the first warning signs
- Do not skip steps under time pressure
- When in doubt: Perform rollback sooner rather than later

**Document lessons learned:**
- Document every upgrade (successful or not)
- Update best practices
- Adjust runbook if needed
- Share team knowledge

---

## 11) Troubleshooting Guide

### Common Issues and Solutions

#### Problem: Indexer does not start after upgrade

**Symptoms:**
- `systemctl status wazuh-indexer` shows "failed" or "inactive"
- Port 9200 not reachable

**Diagnosis:**
```bash
journalctl -u wazuh-indexer -n 500 --no-pager | less
tail -100 /var/log/wazuh-indexer/wazuh-cluster.log
```

**Common Causes and Solutions:**

1. **JVM Heap Size problem:**
   ```bash
   # Check available RAM
   free -h

   # Adjust JVM settings (if needed)
   nano /etc/wazuh-indexer/jvm.options
   # Recommended: -Xms2g -Xmx2g for 4GB RAM, -Xms4g -Xmx4g for 8GB RAM

   # Restart service
   systemctl restart wazuh-indexer
   ```

2. **Permission issues:**
   ```bash
   # Fix permissions
   chown -R wazuh-indexer:wazuh-indexer /var/lib/wazuh-indexer
   chown -R wazuh-indexer:wazuh-indexer /usr/share/wazuh-indexer
   chown -R wazuh-indexer:wazuh-indexer /etc/wazuh-indexer
   chown -R wazuh-indexer:wazuh-indexer /var/log/wazuh-indexer

   systemctl restart wazuh-indexer
   ```

3. **Disk full:**
   ```bash
   df -h
   # If disk full: Delete old logs/indices or expand disk
   ```

4. **Port already in use:**
   ```bash
   ss -lntp | grep :9200
   # If port occupied: Identify and stop the other process
   ```

---

#### Problem: Manager does not start after upgrade

**Symptoms:**
- `systemctl status wazuh-manager` shows "failed"
- No connection on port 1514/1515

**Diagnosis:**
```bash
journalctl -u wazuh-manager -n 500 --no-pager
tail -200 /var/ossec/logs/ossec.log
```

**Solutions:**

1. **Configuration errors:**
   ```bash
   # Test configuration
   /var/ossec/bin/wazuh-control start
   # Errors will be shown in output

   # If config errors: Restore from backup
   LATEST_BACKUP=$(ls -td /root/wazuh_backup_* 2>/dev/null | head -1)
   tar -xzf "$LATEST_BACKUP/var_ossec_etc.tgz" -C /

   systemctl restart wazuh-manager
   ```

2. **Indexer not reachable:**
   ```bash
   # Manager can start but with warnings if Indexer is unavailable
   # Fix Indexer first, then restart Manager
   systemctl restart wazuh-manager
   ```

---

#### Problem: Dashboard not reachable

**Symptoms:**
- Port 5601 does not respond
- Browser shows "Connection refused" or timeout

**Diagnosis:**
```bash
systemctl status wazuh-dashboard
journalctl -u wazuh-dashboard -n 500 --no-pager
tail -100 /var/log/wazuh-dashboard/opensearch_dashboards.log
```

**Solutions:**

1. **Indexer connection problem:**
   ```bash
   # Dashboard requires Indexer to start
   # Check Indexer status
   curl -sk -u admin:admin https://127.0.0.1:9200/_cluster/health

   # If Indexer is OK: Check Dashboard config
   grep "opensearch.hosts" /etc/wazuh-dashboard/opensearch_dashboards.yml
   ```

2. **Port conflict:**
   ```bash
   ss -lntp | grep :5601
   # If port occupied: Stop the other process
   ```

3. **Permissions:**
   ```bash
   chown -R wazuh-dashboard:wazuh-dashboard /usr/share/wazuh-dashboard
   chown -R wazuh-dashboard:wazuh-dashboard /etc/wazuh-dashboard
   chown -R wazuh-dashboard:wazuh-dashboard /var/lib/wazuh-dashboard
   systemctl restart wazuh-dashboard
   ```

---

#### Problem: Filebeat running but no events in Indexer

**Symptoms:**
- Filebeat service is running
- But no new wazuh-alerts-* indices or no new events

**Diagnosis:**
```bash
journalctl -u filebeat -n 500 --no-pager
filebeat test output
filebeat test config
```

**Solutions:**

1. **Connection problem to Indexer:**
   ```bash
   # Check credentials
   grep -A5 "output.elasticsearch:" /etc/filebeat/filebeat.yml

   # Manual connection test
   curl -sk -u <user>:<pass> https://127.0.0.1:9200/
   ```

2. **Template/pipeline not loaded:**
   ```bash
   # Reload template and pipelines
   filebeat setup --pipelines
   filebeat setup --index-management -E output.logstash.enabled=false

   systemctl restart filebeat
   ```

3. **Wrong permissions on Wazuh logs:**
   ```bash
   # Filebeat must be able to read /var/ossec/logs/alerts/alerts.json
   ls -l /var/ossec/logs/alerts/alerts.json
   chmod 644 /var/ossec/logs/alerts/alerts.json
   systemctl restart filebeat
   ```

---

#### Problem: Cluster Health = RED

**Symptoms:**
- `curl -k -u admin:admin https://127.0.0.1:9200/_cluster/health` shows "red"

**Diagnosis:**
```bash
# Detailed cluster info
curl -sk -u admin:admin https://127.0.0.1:9200/_cluster/health?pretty

# Identify unassigned shards
curl -sk -u admin:admin 'https://127.0.0.1:9200/_cat/shards?v&h=index,shard,prirep,state,unassigned.reason' | grep UNASSIGNED
```

**Solutions:**

1. **Check shard allocation:**
   ```bash
   # Allocation status
   curl -sk -u admin:admin https://127.0.0.1:9200/_cluster/settings?pretty

   # If still on "primaries": Switch back to "all"
   curl -X PUT "https://127.0.0.1:9200/_cluster/settings" -u admin:admin -k \
     -H 'Content-Type: application/json' -d'
   {
     "persistent": { "cluster.routing.allocation.enable": "all" }
   }
   '
   ```

2. **Disk watermark problem:**
   ```bash
   df -h
   # If disk > 85%: Delete old indices or expand disk

   # Temporarily adjust watermark (for recovery only!)
   curl -X PUT "https://127.0.0.1:9200/_cluster/settings" -u admin:admin -k \
     -H 'Content-Type: application/json' -d'
   {
     "transient": {
       "cluster.routing.allocation.disk.watermark.low": "95%",
       "cluster.routing.allocation.disk.watermark.high": "98%"
     }
   }
   '
   ```

3. **Corrupted shards:**
   ```bash
   # Last resort: Delete corrupted index
   # CAUTION: Data loss for this index!
   curl -X DELETE "https://127.0.0.1:9200/<index-name>" -u admin:admin -k
   ```

---

#### Problem: Dashboard login does not work

**Symptoms:**
- Dashboard loads, but login fails with "Incorrect username or password"
- Or: "Authentication Exception"

**Solutions:**

1. **Re-apply security configuration:**
   ```bash
   systemctl stop wazuh-dashboard
   /usr/share/wazuh-indexer/bin/indexer-security-init.sh
   systemctl start wazuh-dashboard
   ```

2. **Reset password (admin user):**
   ```bash
   # Generate hash for new password
   /usr/share/wazuh-indexer/plugins/opensearch-security/tools/hash.sh -p NewPassword123

   # Add to internal_users.yml
   nano /etc/wazuh-indexer/opensearch-security/internal_users.yml
   # Replace the hash for the admin user

   # Reload security
   /usr/share/wazuh-indexer/bin/indexer-security-init.sh
   ```

---

#### Problem: "Version Conflict" or "Compatibility Issues"

**Symptoms:**
- Error messages about incompatible versions
- Dashboard shows warnings about index template versions

**Solution:**
```bash
# Check versions of all components
dpkg -l | egrep 'wazuh-(indexer|manager|dashboard)'

# If versions are not identical: Upgrade/downgrade to a uniform version
apt-get install wazuh-indexer=X.Y.Z-1 wazuh-manager=X.Y.Z-1 wazuh-dashboard=X.Y.Z-1

# Reload template
TARGET_VERSION="X.Y.Z"
curl -so /etc/filebeat/wazuh-template.json \
  "https://raw.githubusercontent.com/wazuh/wazuh/v${TARGET_VERSION}/extensions/elasticsearch/7.x/wazuh-template.json"

filebeat setup --index-management -E output.logstash.enabled=false
```

---

### Emergency Commands

**Complete restart of all services (in correct order):**
```bash
systemctl stop filebeat wazuh-dashboard wazuh-manager wazuh-indexer
sleep 5
systemctl start wazuh-indexer
sleep 15
systemctl start wazuh-manager
sleep 10
systemctl start wazuh-dashboard
sleep 10
systemctl start filebeat

# Check status
systemctl status wazuh-indexer wazuh-manager wazuh-dashboard filebeat
```

**Collect all logs in one place (for support):**
```bash
SUPPORT_DIR="/tmp/wazuh_support_$(date +%F_%H%M%S)"
mkdir -p "$SUPPORT_DIR"

# System info
uname -a > "$SUPPORT_DIR/system_info.txt"
df -h >> "$SUPPORT_DIR/system_info.txt"
free -h >> "$SUPPORT_DIR/system_info.txt"

# Versions
dpkg -l | egrep 'wazuh|filebeat' > "$SUPPORT_DIR/packages.txt"

# Services status
systemctl status wazuh-indexer wazuh-manager wazuh-dashboard filebeat > "$SUPPORT_DIR/services_status.txt"

# Logs
journalctl -u wazuh-indexer -n 1000 --no-pager > "$SUPPORT_DIR/indexer.log"
journalctl -u wazuh-manager -n 1000 --no-pager > "$SUPPORT_DIR/manager.log"
journalctl -u wazuh-dashboard -n 1000 --no-pager > "$SUPPORT_DIR/dashboard.log"
journalctl -u filebeat -n 1000 --no-pager > "$SUPPORT_DIR/filebeat.log"

# Cluster state
curl -sk -u admin:admin https://127.0.0.1:9200/_cluster/health?pretty > "$SUPPORT_DIR/cluster_health.json"
curl -sk -u admin:admin https://127.0.0.1:9200/_cat/nodes?v > "$SUPPORT_DIR/nodes.txt"
curl -sk -u admin:admin https://127.0.0.1:9200/_cat/indices?v > "$SUPPORT_DIR/indices.txt"

# Archive
tar -czf "$SUPPORT_DIR.tar.gz" -C /tmp "$(basename $SUPPORT_DIR)"
echo "Support bundle created: $SUPPORT_DIR.tar.gz"
```

---

## 12) Appendix

### References

- **Official Wazuh Documentation:**
  - Upgrade Guide: https://documentation.wazuh.com/current/upgrade-guide/
  - Central Components: https://documentation.wazuh.com/current/upgrade-guide/upgrading-central-components.html
  - Release Notes: https://documentation.wazuh.com/current/release-notes/

- **Community Resources:**
  - Wazuh Slack: https://wazuh.com/community/join-us-on-slack/
  - GitHub Issues: https://github.com/wazuh/wazuh/issues
  - Wazuh Google Groups: https://groups.google.com/forum/#!forum/wazuh

### Useful Commands (Quick Reference)

```bash
# Status of all Wazuh services
systemctl status wazuh-indexer wazuh-manager wazuh-dashboard filebeat

# Cluster health
curl -sk -u admin:admin https://127.0.0.1:9200/_cluster/health?pretty

# Show latest alerts
curl -sk -u admin:admin 'https://127.0.0.1:9200/wazuh-alerts-*/_search?size=5&sort=@timestamp:desc&pretty'

# Active agents
/var/ossec/bin/agent_control -l

# Wazuh Manager info
/var/ossec/bin/wazuh-control info

# Follow logs in real time
journalctl -u wazuh-manager -f
tail -f /var/ossec/logs/ossec.log
```

### Contacts and Escalation

**For critical issues during the upgrade:**
1. Decide quickly: Continue or rollback?
2. Document all steps and error messages
3. When in doubt: Perform rollback
4. Contact support with collected logs

**Escalation path:**
1. Level 1: Consult the runbook troubleshooting section
2. Level 2: Ask the Wazuh community (Slack/forum)
3. Level 3: Contact Wazuh support (if support contract)
4. Level 4: Document post-mortem and lessons learned

---

## Change History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.3 | 2026-01 | System | Comprehensive revision: Extended prerequisites, improved validation steps, detailed rollback procedure, new troubleshooting section |
| 1.2 | - | - | Earlier version |
| 1.1 | - | - | Initial version |

---

**End of Runbook**
