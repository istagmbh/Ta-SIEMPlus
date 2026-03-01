# ossec.conf – Wazuh Agent (Linux)

Standard-Konfiguration für **Wazuh Linux-Agenten**.

**Variablenreferenz:** [VARIABLES.md](../VARIABLES.md)
**Rohdatei (zum Download):** [`ossec.conf.template`](ossec.conf.template)

## Verwendung

```bash
# Variablen exportieren
export MANAGER_HOST="192.168.1.10"
export MANAGER_PORT="1514"
export AGENT_PROTOCOL="tcp"
export AGENT_GROUP="linux-servers"
export SYSCHECK_FREQUENCY="43200"
export LOG_FORMAT="plain"

# Template befüllen
envsubst < docs/config-templates/agent/ossec.conf.template \
         > /var/ossec/etc/ossec.conf

# Validieren & neu starten
/var/ossec/bin/wazuh-control check-config
systemctl restart wazuh-agent
```

## Registrierung

```bash
# Agent beim Manager registrieren (einmalig)
/var/ossec/bin/agent-auth -m {{ MANAGER_HOST }} -A {{ AGENT_NAME }}

# Gruppe zuweisen (auf dem Manager)
/var/ossec/bin/agent_groups -a -i <AGENT_ID> -g {{ AGENT_GROUP }}
```

## Template

```xml
<!--
  ossec.conf – Wazuh Agent (Linux)
  Template Version: 1.0
  Wazuh Version:    {{ WAZUH_VERSION }}
  Agent-Name:       {{ AGENT_NAME }}
  Gruppe:           {{ AGENT_GROUP }}
  Kunde:            {{ CUSTOMER_ID }}
  Change-Ticket:    {{ CHANGE_TICKET }}

  Variablen: siehe docs/config-templates/VARIABLES.md
  Befüllen:  envsubst < ossec.conf.template > /var/ossec/etc/ossec.conf
  Validieren: /var/ossec/bin/wazuh-control check-config
  Registrieren: /var/ossec/bin/agent-auth -m {{ MANAGER_HOST }}
-->
<ossec_config>

  <!-- ============================================================
       CLIENT (VERBINDUNG ZUM MANAGER)
       ============================================================ -->
  <client>
    <server>
      <address>{{ MANAGER_HOST }}</address>
      <port>{{ MANAGER_PORT }}</port>
      <protocol>{{ AGENT_PROTOCOL }}</protocol>
    </server>
    <config-profile>{{ AGENT_GROUP }}</config-profile>
    <notify_time>10</notify_time>
    <time-reconnect>60</time-reconnect>
    <auto_restart>yes</auto_restart>
  </client>

  <!-- ============================================================
       CLIENT BUFFER
       ============================================================ -->
  <client_buffer>
    <disabled>no</disabled>
    <queue_size>5000</queue_size>
    <events_per_second>500</events_per_second>
  </client_buffer>

  <!-- ============================================================
       FILE INTEGRITY MONITORING (FIM / SYSCHECK)
       ============================================================ -->
  <syscheck>
    <disabled>no</disabled>
    <frequency>{{ SYSCHECK_FREQUENCY }}</frequency>
    <scan_on_start>yes</scan_on_start>
    <alert_new_files>yes</alert_new_files>
    <auto_ignore frequency="10" timeframe="3600">no</auto_ignore>
    <directories check_all="yes" realtime="yes">/etc,/usr/bin,/usr/sbin</directories>
    <directories check_all="yes" realtime="yes">/bin,/sbin,/boot</directories>
    <ignore>/etc/mtab</ignore>
    <ignore>/etc/hosts.deny</ignore>
    <ignore type="sregex">.log$|.swp$|.tmp$</ignore>
  </syscheck>

  <!-- ============================================================
       ROOTCHECK
       ============================================================ -->
  <rootcheck>
    <disabled>no</disabled>
    <check_files>yes</check_files>
    <check_trojans>yes</check_trojans>
    <check_dev>yes</check_dev>
    <check_sys>yes</check_sys>
    <check_pids>yes</check_pids>
    <check_ports>yes</check_ports>
    <check_if>yes</check_if>
    <frequency>43200</frequency>
  </rootcheck>

  <!-- ============================================================
       SCA (Security Configuration Assessment)
       ============================================================ -->
  <sca>
    <enabled>yes</enabled>
    <scan_on_start>yes</scan_on_start>
    <interval>12h</interval>
    <skip_nfs>yes</skip_nfs>
  </sca>

  <!-- ============================================================
       LOG-ANALYSE (LOCALFILE)
       ============================================================ -->
  <localfile>
    <log_format>syslog</log_format>
    <location>/var/log/syslog</location>
  </localfile>
  <localfile>
    <log_format>syslog</log_format>
    <location>/var/log/auth.log</location>
  </localfile>
  <localfile>
    <log_format>syslog</log_format>
    <location>/var/log/kern.log</location>
  </localfile>
  <localfile>
    <log_format>syslog</log_format>
    <location>/var/log/dpkg.log</location>
  </localfile>

  <!-- Applikationsspezifisch (ggf. auskommentieren) -->
  <!--
  <localfile>
    <log_format>apache</log_format>
    <location>/var/log/nginx/error.log</location>
  </localfile>
  -->

  <localfile>
    <log_format>command</log_format>
    <command>df -P</command>
    <frequency>360</frequency>
  </localfile>
  <localfile>
    <log_format>full_command</log_format>
    <command>last -n 20</command>
    <frequency>360</frequency>
  </localfile>

  <!-- ============================================================
       ACTIVE RESPONSE
       ============================================================ -->
  <active-response>
    <disabled>no</disabled>
    <ca_store>var/ossec/etc/wpk_root.pem</ca_store>
    <ca_verification>yes</ca_verification>
  </active-response>

  <!-- ============================================================
       LOGGING
       ============================================================ -->
  <logging>
    <log_format>{{ LOG_FORMAT }}</log_format>
  </logging>

</ossec_config>
```
