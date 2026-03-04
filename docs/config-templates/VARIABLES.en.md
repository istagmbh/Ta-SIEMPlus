# Variable Reference

All `{{ VARIABLE_NAME }}` placeholders in the config templates with type, example value, and description.

---

## General

| Variable | Type | Example | Description |
|---|---|---|---|
| `WAZUH_VERSION` | String | `4.12.0` | Installed Wazuh version |
| `CUSTOMER_ID` | String | `kunde-ag` | Customer identifier from the catalog |
| `CHANGE_TICKET` | String | `CHG-2026-0123` | Reference to the change ticket |

---

## Manager / Cluster

| Variable | Type | Example | Description |
|---|---|---|---|
| `MANAGER_HOST` | IP / FQDN | `192.168.1.10` | IP or hostname of the Wazuh Manager |
| `MANAGER_PORT` | Integer | `1514` | Communication port (UDP/TCP) |
| `CLUSTER_NAME` | String | `wazuh-cluster` | Name of the Wazuh cluster |
| `CLUSTER_NODE_NAME` | String | `wazuh-manager-01` | Unique node name in the cluster |
| `CLUSTER_NODE_TYPE` | String | `master` | `master` or `worker` |
| `CLUSTER_KEY` | String | *(vault)* | 32-character cluster shared key – **never** in plaintext! |
| `CLUSTER_BIND_ADDR` | IP | `0.0.0.0` | Bind address for cluster communication |
| `CLUSTER_NODES` | CSV | `192.168.1.10` | Comma-separated list of all cluster nodes |
| `CLUSTER_DISABLED` | Boolean | `yes` | `yes` for AIO (single-node), `no` for multi-node |

---

## Indexer

| Variable | Type | Example | Description |
|---|---|---|---|
| `INDEXER_HOST` | IP / FQDN | `127.0.0.1` | Host of the Wazuh Indexer (AIO: localhost) |
| `INDEXER_PORT` | Integer | `9200` | API port of the indexer |
| `INDEXER_USERNAME` | String | `admin` | Indexer username |
| `INDEXER_PASSWORD` | String | *(vault)* | Indexer password – **never** in plaintext! |
| `INDEXER_SSL_VERIFY` | Boolean | `true` | Verify TLS certificate of the indexer |
| `INDEXER_NODE_NAME` | String | `wazuh-indexer-01` | Node name in the indexer cluster |
| `INDEXER_NETWORK_HOST` | IP | `0.0.0.0` | Bind IP of the indexer |
| `INDEXER_CLUSTER_NAME` | String | `wazuh-cluster` | Cluster name in the indexer |
| `INDEXER_INITIAL_MASTERS` | String | `wazuh-indexer-01` | Initial master nodes |

---

## API

| Variable | Type | Example | Description |
|---|---|---|---|
| `API_HOST` | IP | `0.0.0.0` | Bind address of the Wazuh API |
| `API_PORT` | Integer | `55000` | Port of the Wazuh API |
| `API_USERNAME` | String | `wazuh-wui` | API username for dashboard |
| `API_PASSWORD` | String | *(vault)* | API password – **never** in plaintext! |

---

## Email / Notifications

| Variable | Type | Example | Description |
|---|---|---|---|
| `EMAIL_ENABLED` | Boolean | `no` | Enable email notifications |
| `EMAIL_TO` | Email | `soc@firma.ch` | Recipient address |
| `EMAIL_FROM` | Email | `wazuh@firma.ch` | Sender address |
| `EMAIL_SMTP_SERVER` | FQDN | `mail.firma.ch` | SMTP relay server |
| `EMAIL_ALERT_LEVEL` | Integer | `12` | Minimum level for email alerts (0–15) |

---

## Syslog Output

| Variable | Type | Example | Description |
|---|---|---|---|
| `SYSLOG_ENABLED` | Boolean | `no` | Enable syslog output |
| `SYSLOG_SERVER` | IP / FQDN | `siem.firma.ch` | Syslog destination server |
| `SYSLOG_PORT` | Integer | `514` | Syslog port |
| `SYSLOG_PROTOCOL` | String | `udp` | `udp` or `tcp` |
| `SYSLOG_ALERT_LEVEL` | Integer | `9` | Minimum level for syslog forwarding |

---

## Agent

| Variable | Type | Example | Description |
|---|---|---|---|
| `AGENT_NAME` | String | `web-server-01` | Name of the agent (hostname recommended) |
| `AGENT_GROUP` | String | `linux-servers` | Assigned agent group |
| `AGENT_PROTOCOL` | String | `tcp` | Transport protocol: `tcp` or `udp` |

---

## Paths & Logs

| Variable | Type | Example | Description |
|---|---|---|---|
| `LOG_ALL` | Boolean | `no` | Log all events (caution: high volume!) |
| `LOG_FORMAT` | String | `plain` | `plain` or `json` |
| `SYSCHECK_FREQUENCY` | Integer | `43200` | FIM scan interval in seconds (default: 12h) |

---

## Security Notice

!!! danger "Never commit in plaintext"
    Variables marked with `*(vault)*` are secrets. **Never** write them directly into a file.

    ```bash
    # Correct: Read from Vault
    export INDEXER_PASSWORD=$(vault kv get -field=password secret/wazuh/indexer)
    export CLUSTER_KEY=$(vault kv get -field=key secret/wazuh/cluster)

    # Correct: From CI/CD secrets
    # → GitHub: Settings → Secrets and variables → Actions

    # WRONG:
    # INDEXER_PASSWORD="MyPassword123"  ← never!
    ```
