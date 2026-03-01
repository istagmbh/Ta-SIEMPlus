# Agent Group – Linux Server

Shared-Konfiguration für die Agentengruppe **`linux-servers`**.
Wird automatisch an alle Mitglieder der Gruppe verteilt.

**Rohdatei (zum Download):** [`agent_groups/linux-servers.conf`](agent_groups/linux-servers.conf)

## Deployment

```bash
# Gruppe anlegen (falls nicht vorhanden)
/var/ossec/bin/agent_groups -a -g linux-servers

# Konfiguration deployen
cp docs/config-templates/manager/agent_groups/linux-servers.conf \
   /var/ossec/etc/shared/linux-servers/agent.conf

# Agent zur Gruppe hinzufügen
/var/ossec/bin/agent_groups -a -i <AGENT_ID> -g linux-servers

# Konfiguration neu laden (kein Neustart nötig)
/var/ossec/bin/wazuh-control reload
```

## Template

```xml
<!--
  agent_groups/linux-servers.conf – Shared Config für Linux-Server-Gruppe
  Template Version: 1.0
  Gruppe:           linux-servers

  Diese Datei wird auf alle Agenten der Gruppe "linux-servers" verteilt.
  Deployment: /var/ossec/etc/shared/linux-servers/agent.conf
-->
<agent_config>

  <!-- FIM – Zusätzliche Pfade für Linux-Server -->
  <syscheck>
    <directories check_all="yes" realtime="yes">/etc/nginx,/etc/apache2</directories>
    <directories check_all="yes">/etc/mysql,/etc/postgresql</directories>
    <directories check_all="yes" realtime="yes">/etc/ssh</directories>
    <directories check_all="yes">/etc/cron.d,/var/spool/cron</directories>
    <ignore>/var/log</ignore>
    <ignore>/var/ossec/logs</ignore>
  </syscheck>

  <!-- Systemd-Journal -->
  <localfile>
    <log_format>journald</log_format>
    <location>journald</location>
  </localfile>

  <!-- SCA – Linux-Server-Policy -->
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

## Hinweise

- Nginx/Apache/MySQL-Logs sind auskommentiert – nur aktivieren wenn die Dienste tatsächlich laufen
- Die CIS-Policy `cis_ubuntu22-04_server.yml` muss auf dem Manager vorhanden sein
