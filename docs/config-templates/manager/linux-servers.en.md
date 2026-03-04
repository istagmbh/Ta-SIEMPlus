# Agent Group – Linux Servers

Shared configuration for the agent group **`linux-servers`**.
Automatically distributed to all group members.

**Raw file (for download):** [`agent_groups/linux-servers.conf`](agent_groups/linux-servers.conf)

## Deployment

```bash
# Create group (if not already present)
/var/ossec/bin/agent_groups -a -g linux-servers

# Deploy configuration
cp docs/config-templates/manager/agent_groups/linux-servers.conf \
   /var/ossec/etc/shared/linux-servers/agent.conf

# Add agent to group
/var/ossec/bin/agent_groups -a -i <AGENT_ID> -g linux-servers

# Reload configuration (no restart required)
/var/ossec/bin/wazuh-control reload
```

## Template

```xml
<!--
  agent_groups/linux-servers.conf – Shared config for Linux server group
  Template Version: 1.0
  Group:            linux-servers

  This file is distributed to all agents in the "linux-servers" group.
  Deployment: /var/ossec/etc/shared/linux-servers/agent.conf
-->
<agent_config>

  <!-- FIM – Additional paths for Linux servers -->
  <syscheck>
    <directories check_all="yes" realtime="yes">/etc/nginx,/etc/apache2</directories>
    <directories check_all="yes">/etc/mysql,/etc/postgresql</directories>
    <directories check_all="yes" realtime="yes">/etc/ssh</directories>
    <directories check_all="yes">/etc/cron.d,/var/spool/cron</directories>
    <ignore>/var/log</ignore>
    <ignore>/var/ossec/logs</ignore>
  </syscheck>

  <!-- Systemd journal -->
  <localfile>
    <log_format>journald</log_format>
    <location>journald</location>
  </localfile>

  <!-- SCA – Linux server policy -->
  <sca>
    <enabled>yes</enabled>
    <scan_on_start>yes</scan_on_start>
    <interval>12h</interval>
    <skip_nfs>yes</skip_nfs>
    <policies>
      <policy>etc/shared/sca/cis_ubuntu22-04_server.yml</policy>
    </policies>
  </sca>

</agent_config>
```

## Notes

- Nginx/Apache/MySQL logs are commented out – only enable them if the services are actually running
- The CIS policy `cis_ubuntu22-04_server.yml` must be present on the manager
