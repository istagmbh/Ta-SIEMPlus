# Reference

Quick reference guides, command lookups, and technical documentation for Wazuh SIEM operations.

## 📚 Quick References

### Common Commands

#### Service Management
```bash
# Check status of all Wazuh services
systemctl status wazuh-indexer wazuh-manager wazuh-dashboard filebeat

# Restart services (in correct order)
systemctl restart wazuh-indexer
systemctl restart wazuh-manager
systemctl restart wazuh-dashboard
systemctl restart filebeat

# Stop all services
systemctl stop wazuh-dashboard filebeat wazuh-manager wazuh-indexer

# Start all services (in correct order)
systemctl start wazuh-indexer
systemctl start wazuh-manager
systemctl start wazuh-dashboard
systemctl start filebeat
```

#### Version Checks
```bash
# Check all component versions
dpkg -l | grep -E 'wazuh-(indexer|manager|dashboard)|filebeat'

# Manager version
/var/ossec/bin/wazuh-control info | grep VERSION

# Indexer version
curl -sk -u admin:admin https://127.0.0.1:9200/ | grep number

# API version
curl -k -u <user>:<password> https://localhost:55000/ | jq .data
```

#### Health Checks
```bash
# Cluster health
curl -sk -u admin:admin https://127.0.0.1:9200/_cluster/health?pretty

# Manager status
/var/ossec/bin/wazuh-control status

# Agent list
/var/ossec/bin/agent_control -l

# API connectivity
curl -k -u <user>:<password> https://localhost:55000/
```

#### Log Analysis
```bash
# Check manager logs
tail -f /var/ossec/logs/ossec.log

# Check indexer logs
journalctl -u wazuh-indexer -f

# Check dashboard logs
journalctl -u wazuh-dashboard -f

# Check for errors (last 50 lines)
journalctl -u wazuh-manager -n 50 --no-pager -p err
journalctl -u wazuh-indexer -n 50 --no-pager -p err
```

#### Disk Usage
```bash
# Overall disk usage
df -h

# Wazuh data directories
du -sh /var/ossec/*
du -sh /var/lib/wazuh-indexer/*

# Find large files
find /var/ossec -type f -size +100M -exec ls -lh {} \;
```

### Agent Management

```bash
# List all agents
/var/ossec/bin/agent_control -l

# List active agents
/var/ossec/bin/agent_control -lc

# List disconnected agents
/var/ossec/bin/agent_control -l | grep -i "never connected\|disconnected"

# Get agent information
/var/ossec/bin/agent_control -i <agent_id>

# Restart agent remotely
/var/ossec/bin/agent_control -R -a

# Remove agent
/var/ossec/bin/manage_agents -r <agent_id>
```

### Configuration Files

```bash
# Manager configuration
/var/ossec/etc/ossec.conf

# Indexer configuration
/etc/wazuh-indexer/opensearch.yml

# Dashboard configuration
/etc/wazuh-dashboard/opensearch_dashboards.yml

# Filebeat configuration
/etc/filebeat/filebeat.yml

# Agent groups
/var/ossec/etc/shared/
```

## 🔧 Troubleshooting

### Common Issues

#### Service Won't Start
```bash
# Check service status
systemctl status wazuh-manager

# Check journal logs
journalctl -u wazuh-manager -n 100 --no-pager

# Check configuration syntax
/var/ossec/bin/wazuh-control check

# Verify ports are available
netstat -tlnp | grep -E '1514|1515|55000|9200|5601'
```

#### Agents Not Connecting
```bash
# Check manager connectivity
telnet <manager-ip> 1514

# Check agent status
/var/ossec/bin/agent_control -l

# Review agent logs
tail -f /var/ossec/logs/ossec.log

# Check firewall rules
iptables -L -n | grep -E '1514|1515'
```

#### High Disk Usage
```bash
# Check indexer disk usage
curl -sk -u admin:admin https://127.0.0.1:9200/_cat/allocation?v

# Clean old indices
curl -sk -u admin:admin -X DELETE https://127.0.0.1:9200/wazuh-alerts-4.x-2025.01.*

# Check log rotation
ls -lh /var/ossec/logs/archives/
```

#### Dashboard Not Accessible
```bash
# Check dashboard service
systemctl status wazuh-dashboard

# Check port binding
netstat -tlnp | grep 5601

# Review dashboard logs
journalctl -u wazuh-dashboard -n 100 --no-pager

# Test indexer connectivity from dashboard
curl -sk -u admin:admin https://127.0.0.1:9200/
```

## 📊 Monitoring

### Key Metrics to Monitor

```bash
# CPU and Memory usage
top -b -n 1 | grep -E "wazuh|java|node"

# Service uptime
systemctl status wazuh-manager | grep Active

# Agent count
/var/ossec/bin/agent_control -l | wc -l

# Event rate
tail -n 1000 /var/ossec/logs/ossec.log | grep -c "INFO:"

# Index size
curl -sk -u admin:admin https://127.0.0.1:9200/_cat/indices?v
```

### Performance Tuning

```bash
# Check Java heap size (Indexer)
cat /etc/wazuh-indexer/jvm.options | grep "^-Xm"

# Indexer thread pool
curl -sk -u admin:admin https://127.0.0.1:9200/_cat/thread_pool?v

# Manager process limits
grep ossec /etc/security/limits.conf
```

## 🔐 Security

### User Management
```bash
# List API users
curl -k -u <user>:<password> https://localhost:55000/security/users

# Create API user
curl -k -u <admin>:<password> -X POST \
  https://localhost:55000/security/users \
  -H 'Content-Type: application/json' \
  -d '{"username":"newuser","password":"newpass"}'
```

### Certificate Management
```bash
# Check indexer certificates
openssl x509 -in /etc/wazuh-indexer/certs/node.pem -text -noout

# Check dashboard certificates
openssl x509 -in /etc/wazuh-dashboard/certs/dashboard.pem -text -noout

# Certificate expiry
openssl x509 -in /etc/wazuh-indexer/certs/node.pem -noout -dates
```

## 📖 Configuration Examples

### Custom Rules
Location: `/var/ossec/etc/rules/local_rules.xml`

```xml
<group name="custom,">
  <rule id="100010" level="5">
    <if_sid>5716</if_sid>
    <srcip>10.0.0.0/8</srcip>
    <description>SSH login from internal network</description>
  </rule>
</group>
```

### Custom Decoders
Location: `/var/ossec/etc/decoders/local_decoder.xml`

```xml
<decoder name="custom-app">
  <program_name>myapp</program_name>
</decoder>

<decoder name="custom-app">
  <parent>custom-app</parent>
  <regex>^(\S+) - (\S+)</regex>
  <order>user, action</order>
</decoder>
```

## 🌐 API Reference

### Common API Calls

```bash
# Get cluster status
curl -k -u <user>:<password> https://localhost:55000/cluster/status

# List agents
curl -k -u <user>:<password> https://localhost:55000/agents

# Get agent details
curl -k -u <user>:<password> https://localhost:55000/agents/001

# Restart agent
curl -k -u <user>:<password> -X PUT https://localhost:55000/agents/001/restart

# Get manager info
curl -k -u <user>:<password> https://localhost:55000/manager/info
```

## 📁 Important Paths

```
/var/ossec/                     # Main Wazuh directory
├── bin/                        # Executables
├── etc/                        # Configuration files
│   ├── ossec.conf             # Main config
│   ├── shared/                # Agent group configs
│   └── rules/                 # Detection rules
├── logs/                       # Log files
│   ├── ossec.log              # Main log
│   ├── alerts/                # Alert logs
│   └── archives/              # Event archives
├── queue/                      # Processing queues
└── var/                        # Runtime data

/var/lib/wazuh-indexer/         # Indexer data
/etc/wazuh-indexer/             # Indexer config
/etc/wazuh-dashboard/           # Dashboard config
/etc/filebeat/                  # Filebeat config
```

## 🔗 External Resources

- [Official Wazuh Documentation](https://documentation.wazuh.com/)
- [Wazuh API Reference](https://documentation.wazuh.com/current/user-manual/api/reference.html)
- [Wazuh GitHub](https://github.com/wazuh/wazuh)
- [Community Forum](https://groups.google.com/forum/#!forum/wazuh)

## 📝 Additional Guides

For detailed procedures, see:
- [Runbooks](../runbooks/index.md)
- [Checklists](../checklists/index.md)
- [Upgrade Guides](../upgrade-guides/index.md)
