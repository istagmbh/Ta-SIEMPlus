# Configuration Templates (Config Templates)

Production-ready configuration templates for all Wazuh components.
All variables are marked with `{{ VARIABLE_NAME }}` – a complete reference
of all variables is available in [VARIABLES.md](VARIABLES.md).

---

## Usage

### Step 1 – Define variables

Create a file `vars.yml` (which is **never** committed):

```yaml
# vars.yml – DO NOT check into Git!
MANAGER_HOST: "192.168.1.10"
CLUSTER_NAME: "wazuh-cluster"
CLUSTER_NODE_NAME: "wazuh-manager-01"
INDEXER_HOST: "127.0.0.1"
INDEXER_PORT: "9200"
CUSTOMER_ID: "kunde-ag"
```

### Step 2 – Fill in the template

```bash
# With envsubst (simplest method)
export $(cat vars.yml | grep -v '#' | xargs)
envsubst < manager/ossec.conf.template > /var/ossec/etc/ossec.conf

# Or with sed for individual variables
sed 's/{{ MANAGER_HOST }}/192.168.1.10/g' manager/ossec.conf.template
```

### Step 3 – Validate & deploy

```bash
# Validate Wazuh configuration
/var/ossec/bin/wazuh-control check-config

# Restart service
systemctl restart wazuh-manager
```

---

## Available Templates

| File | Component | Description |
|---|---|---|
| [manager/ossec.conf.template](manager/ossec.conf.template) | Manager (AIO) | Complete manager configuration |
| [agent/ossec.conf.template](agent/ossec.conf.template) | Agent (Linux) | Standard Linux agent configuration |
| [manager/agent_groups/linux-servers.conf](manager/agent_groups/linux-servers.conf) | Agent group | Shared config for Linux servers |
| [manager/agent_groups/windows-endpoints.conf](manager/agent_groups/windows-endpoints.conf) | Agent group | Shared config for Windows endpoints |
| [indexer/opensearch.yml.template](indexer/opensearch.yml.template) | Wazuh Indexer | OpenSearch/Indexer configuration |
| [filebeat/filebeat.yml.template](filebeat/filebeat.yml.template) | Filebeat | Filebeat for Wazuh Dashboard |

---

## Variable Reference

Complete description of all `{{ VARIABLE }}` placeholders: **[VARIABLES.md](VARIABLES.md)**

---

## Notes

!!! warning "Secrets"
    Variables such as `INDEXER_PASSWORD` or `API_PASSWORD` must **never** be checked into Git.
    Always populate them via Vault or CI/CD secrets:
    ```bash
    INDEXER_PASSWORD=$(vault kv get -field=password secret/wazuh/indexer)
    ```

!!! info "Wazuh Version"
    Templates are tested for **Wazuh {{ WAZUH_VERSION }}**.
    For other versions, check the documentation for structural changes.
