# opensearch.yml – Wazuh Indexer

OpenSearch configuration for the **Wazuh Indexer**.

**Variable reference:** [VARIABLES.md](../VARIABLES.md)
**Raw file (for download):** [`opensearch.yml.template`](opensearch.yml.template)

## Usage

```bash
# Export variables
export INDEXER_CLUSTER_NAME="wazuh-cluster"
export INDEXER_NODE_NAME="wazuh-indexer-01"
export INDEXER_NETWORK_HOST="0.0.0.0"
export INDEXER_PORT="9200"
export INDEXER_INITIAL_MASTERS="wazuh-indexer-01"

# Fill in template
envsubst < docs/config-templates/indexer/opensearch.yml.template \
         > /etc/wazuh-indexer/opensearch.yml

# Restart service
systemctl restart wazuh-indexer

# Check status
systemctl status wazuh-indexer
curl -k -u admin:${INDEXER_PASSWORD} https://localhost:9200/_cluster/health
```

## Template

```yaml
# opensearch.yml – Wazuh Indexer (OpenSearch)
# Template Version: 1.0
# Wazuh Version:    {{ WAZUH_VERSION }}
# Customer:         {{ CUSTOMER_ID }}
# Change Ticket:    {{ CHANGE_TICKET }}

# ============================================================
# CLUSTER
# ============================================================
cluster.name: {{ INDEXER_CLUSTER_NAME }}
cluster.initial_cluster_manager_nodes:
  - "{{ INDEXER_INITIAL_MASTERS }}"

# ============================================================
# NODE
# ============================================================
node.name: {{ INDEXER_NODE_NAME }}

# ============================================================
# NETWORK
# ============================================================
network.host: {{ INDEXER_NETWORK_HOST }}
http.port: {{ INDEXER_PORT }}

# ============================================================
# PATHS
# ============================================================
path.data: /var/lib/wazuh-indexer
path.logs: /var/log/wazuh-indexer

# ============================================================
# TLS / SECURITY
# ============================================================
plugins.security.ssl.transport.pemcert_filepath: /etc/wazuh-indexer/certs/{{ INDEXER_NODE_NAME }}.pem
plugins.security.ssl.transport.pemkey_filepath: /etc/wazuh-indexer/certs/{{ INDEXER_NODE_NAME }}-key.pem
plugins.security.ssl.transport.pemtrustedcas_filepath: /etc/wazuh-indexer/certs/root-ca.pem
plugins.security.ssl.transport.enforce_hostname_verification: false

plugins.security.ssl.http.enabled: true
plugins.security.ssl.http.pemcert_filepath: /etc/wazuh-indexer/certs/{{ INDEXER_NODE_NAME }}.pem
plugins.security.ssl.http.pemkey_filepath: /etc/wazuh-indexer/certs/{{ INDEXER_NODE_NAME }}-key.pem
plugins.security.ssl.http.pemtrustedcas_filepath: /etc/wazuh-indexer/certs/root-ca.pem

plugins.security.allow_default_init_securityindex: true
plugins.security.authcz.admin_dn:
  - "CN=admin,OU=Wazuh,O=Wazuh,L=California,C=US"
plugins.security.nodes_dn:
  - "CN={{ INDEXER_NODE_NAME }},OU=Wazuh,O=Wazuh,L=California,C=US"

plugins.security.restapi.roles_enabled:
  - "all_access"
  - "security_rest_api_access"

plugins.security.system_indices.enabled: true
plugins.security.system_indices.indices:
  - ".opendistro-alerting-config"
  - ".opendistro-alerting-alert*"
  - ".opendistro-anomaly-results*"
  - ".opendistro-anomaly-detector*"
  - ".opendistro-anomaly-checkpoints"
  - ".opendistro-anomaly-detection-state"
  - ".opendistro-reports-*"
  - ".opendistro-notifications-*"
  - ".opendistro-notebooks"
  - ".opensearch-observability"
  - ".opendistro-asynchronous-search-response*"
  - ".replication-metadata-store"

# ============================================================
# DISCOVERY
# ============================================================
discovery.seed_hosts:
  - "{{ INDEXER_NETWORK_HOST }}"
```
