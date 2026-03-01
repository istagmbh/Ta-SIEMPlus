# filebeat.yml – Filebeat für Wazuh

Filebeat-Konfiguration zum Weiterleiten von Wazuh-Alerts an den **Wazuh Indexer**.

**Variablenreferenz:** [VARIABLES.md](../VARIABLES.md)
**Rohdatei (zum Download):** [`filebeat.yml.template`](filebeat.yml.template)

## Verwendung

```bash
# Passwort sicher aus Vault lesen (niemals im Klartext!)
export INDEXER_PASSWORD=$(vault kv get -field=password secret/wazuh/indexer)

# Weitere Variablen exportieren
export INDEXER_HOST="127.0.0.1"
export INDEXER_PORT="9200"
export INDEXER_USERNAME="admin"

# Template befüllen
envsubst < docs/config-templates/filebeat/filebeat.yml.template \
         > /etc/filebeat/filebeat.yml

# Konfiguration validieren
filebeat test config -e

# Verbindung zum Indexer testen
filebeat test output

# Dienst neu starten
systemctl restart filebeat
```

## Template

```yaml
# filebeat.yml – Filebeat für Wazuh Dashboard
# Template Version: 1.0
# Wazuh Version:    {{ WAZUH_VERSION }}
# Kunde:            {{ CUSTOMER_ID }}
# Change-Ticket:    {{ CHANGE_TICKET }}

# ============================================================
# OUTPUT – Wazuh Indexer (OpenSearch)
# ============================================================
output.elasticsearch:
  hosts:
    - "https://{{ INDEXER_HOST }}:{{ INDEXER_PORT }}"
  protocol: https
  username: "{{ INDEXER_USERNAME }}"
  # Passwort aus Vault/Umgebungsvariable – niemals im Klartext!
  password: "${INDEXER_PASSWORD}"
  ssl.certificate_authorities:
    - /etc/filebeat/certs/root-ca.pem
  ssl.certificate: /etc/filebeat/certs/filebeat.pem
  ssl.key: /etc/filebeat/certs/filebeat-key.pem

# ============================================================
# SETUP – Index-Template & Dashboards
# ============================================================
setup.template.json.enabled: true
setup.template.json.path: /etc/filebeat/wazuh-template.json
setup.template.json.name: wazuh
setup.template.overwrite: true
setup.ilm.enabled: false

# ============================================================
# FILEBEAT INPUTS
# ============================================================
filebeat.inputs:
  - type: log
    paths:
      - /var/ossec/logs/alerts/alerts.json
    fields:
      file_type: wazuh_alerts
    json.message_key: full_log
    json.keys_under_root: true
    json.add_error_key: true
    json.overwrite_keys: true

# ============================================================
# FILEBEAT MODULES
# ============================================================
filebeat.config.modules:
  path: /etc/filebeat/modules.d/*.yml
  reload.enabled: false

# ============================================================
# LOGGING
# ============================================================
logging.level: info
logging.to_files: true
logging.files:
  path: /var/log/filebeat
  name: filebeat
  keepfiles: 7
  permissions: 0644

# ============================================================
# PROZESSOR – Host-Metadaten hinzufügen
# ============================================================
processors:
  - add_host_metadata:
      when.not.contains.tags: forwarded
```
