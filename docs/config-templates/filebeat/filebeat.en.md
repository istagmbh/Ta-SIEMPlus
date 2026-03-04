# filebeat.yml – Filebeat for Wazuh

Filebeat configuration for forwarding Wazuh alerts to the **Wazuh Indexer**.

**Variable reference:** [VARIABLES.md](../VARIABLES.md)
**Raw file (for download):** [`filebeat.yml.template`](filebeat.yml.template)

## Usage

```bash
# Read password securely from Vault (never in plaintext!)
export INDEXER_PASSWORD=$(vault kv get -field=password secret/wazuh/indexer)

# Export additional variables
export INDEXER_HOST="127.0.0.1"
export INDEXER_PORT="9200"
export INDEXER_USERNAME="admin"

# Fill in template
envsubst < docs/config-templates/filebeat/filebeat.yml.template \
         > /etc/filebeat/filebeat.yml

# Validate configuration
filebeat test config -e

# Test connection to indexer
filebeat test output

# Restart service
systemctl restart filebeat
```

## Template

```yaml
# filebeat.yml – Filebeat for Wazuh Dashboard
# Template Version: 1.0
# Wazuh Version:    {{ WAZUH_VERSION }}
# Customer:         {{ CUSTOMER_ID }}
# Change Ticket:    {{ CHANGE_TICKET }}

# ============================================================
# OUTPUT – Wazuh Indexer (OpenSearch)
# ============================================================
output.elasticsearch:
  hosts:
    - "https://{{ INDEXER_HOST }}:{{ INDEXER_PORT }}"
  protocol: https
  username: "{{ INDEXER_USERNAME }}"
  # Password from Vault/environment variable – never in plaintext!
  password: "${INDEXER_PASSWORD}"
  ssl.certificate_authorities:
    - /etc/filebeat/certs/root-ca.pem
  ssl.certificate: /etc/filebeat/certs/filebeat.pem
  ssl.key: /etc/filebeat/certs/filebeat-key.pem

# ============================================================
# SETUP – Index template & dashboards
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
# PROCESSOR – Add host metadata
# ============================================================
processors:
  - add_host_metadata:
      when.not.contains.tags: forwarded
```
