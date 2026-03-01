# Variablenreferenz

Alle `{{ VARIABLE_NAME }}`-Platzhalter in den Config-Templates mit Typ, Beispielwert und Beschreibung.

---

## Allgemein

| Variable | Typ | Beispiel | Beschreibung |
|---|---|---|---|
| `WAZUH_VERSION` | String | `4.12.0` | Installierte Wazuh-Version |
| `CUSTOMER_ID` | String | `kunde-ag` | Kunden-Identifier aus dem Katalog |
| `CHANGE_TICKET` | String | `CHG-2026-0123` | Referenz auf das Change-Ticket |

---

## Manager / Cluster

| Variable | Typ | Beispiel | Beschreibung |
|---|---|---|---|
| `MANAGER_HOST` | IP / FQDN | `192.168.1.10` | IP oder Hostname des Wazuh-Managers |
| `MANAGER_PORT` | Integer | `1514` | Kommunikationsport (UDP/TCP) |
| `CLUSTER_NAME` | String | `wazuh-cluster` | Name des Wazuh-Clusters |
| `CLUSTER_NODE_NAME` | String | `wazuh-manager-01` | Eindeutiger Nodename im Cluster |
| `CLUSTER_NODE_TYPE` | String | `master` | `master` oder `worker` |
| `CLUSTER_KEY` | String | *(vault)* | 32-Zeichen Cluster-Shared-Key – **niemals** im Klartext! |
| `CLUSTER_BIND_ADDR` | IP | `0.0.0.0` | Bind-Adresse für Cluster-Kommunikation |
| `CLUSTER_NODES` | CSV | `192.168.1.10` | Kommagetrennte Liste aller Cluster-Nodes |
| `CLUSTER_DISABLED` | Boolean | `yes` | `yes` für AIO (Single-Node), `no` für Multi-Node |

---

## Indexer

| Variable | Typ | Beispiel | Beschreibung |
|---|---|---|---|
| `INDEXER_HOST` | IP / FQDN | `127.0.0.1` | Host des Wazuh-Indexers (AIO: localhost) |
| `INDEXER_PORT` | Integer | `9200` | API-Port des Indexers |
| `INDEXER_USERNAME` | String | `admin` | Indexer-Benutzername |
| `INDEXER_PASSWORD` | String | *(vault)* | Indexer-Passwort – **niemals** im Klartext! |
| `INDEXER_SSL_VERIFY` | Boolean | `true` | TLS-Zertifikat des Indexers prüfen |
| `INDEXER_NODE_NAME` | String | `wazuh-indexer-01` | Nodename im Indexer-Cluster |
| `INDEXER_NETWORK_HOST` | IP | `0.0.0.0` | Bind-IP des Indexers |
| `INDEXER_CLUSTER_NAME` | String | `wazuh-cluster` | Cluster-Name im Indexer |
| `INDEXER_INITIAL_MASTERS` | String | `wazuh-indexer-01` | Initial master nodes |

---

## API

| Variable | Typ | Beispiel | Beschreibung |
|---|---|---|---|
| `API_HOST` | IP | `0.0.0.0` | Bind-Adresse der Wazuh-API |
| `API_PORT` | Integer | `55000` | Port der Wazuh-API |
| `API_USERNAME` | String | `wazuh-wui` | API-Benutzername für Dashboard |
| `API_PASSWORD` | String | *(vault)* | API-Passwort – **niemals** im Klartext! |

---

## E-Mail / Benachrichtigungen

| Variable | Typ | Beispiel | Beschreibung |
|---|---|---|---|
| `EMAIL_ENABLED` | Boolean | `no` | E-Mail-Benachrichtigungen aktivieren |
| `EMAIL_TO` | E-Mail | `soc@firma.ch` | Empfängeradresse |
| `EMAIL_FROM` | E-Mail | `wazuh@firma.ch` | Absenderadresse |
| `EMAIL_SMTP_SERVER` | FQDN | `mail.firma.ch` | SMTP-Relay-Server |
| `EMAIL_ALERT_LEVEL` | Integer | `12` | Mindest-Level für E-Mail-Alerts (0–15) |

---

## Syslog-Output

| Variable | Typ | Beispiel | Beschreibung |
|---|---|---|---|
| `SYSLOG_ENABLED` | Boolean | `no` | Syslog-Output aktivieren |
| `SYSLOG_SERVER` | IP / FQDN | `siem.firma.ch` | Syslog-Zielserver |
| `SYSLOG_PORT` | Integer | `514` | Syslog-Port |
| `SYSLOG_PROTOCOL` | String | `udp` | `udp` oder `tcp` |
| `SYSLOG_ALERT_LEVEL` | Integer | `9` | Mindest-Level für Syslog-Weitergabe |

---

## Agent

| Variable | Typ | Beispiel | Beschreibung |
|---|---|---|---|
| `AGENT_NAME` | String | `web-server-01` | Name des Agents (Hostname empfohlen) |
| `AGENT_GROUP` | String | `linux-servers` | Zugewiesene Agentengruppe |
| `AGENT_PROTOCOL` | String | `tcp` | Transportprotokoll: `tcp` oder `udp` |

---

## Pfade & Logs

| Variable | Typ | Beispiel | Beschreibung |
|---|---|---|---|
| `LOG_ALL` | Boolean | `no` | Alle Events loggen (Achtung: Volumen!) |
| `LOG_FORMAT` | String | `plain` | `plain` oder `json` |
| `SYSCHECK_FREQUENCY` | Integer | `43200` | FIM-Scan-Intervall in Sekunden (Standard: 12h) |

---

## Sicherheitshinweis

!!! danger "Niemals im Klartext committen"
    Variablen mit `*(vault)*` sind Secrets. Diese **nie** direkt in eine Datei schreiben.

    ```bash
    # Richtig: Aus Vault lesen
    export INDEXER_PASSWORD=$(vault kv get -field=password secret/wazuh/indexer)
    export CLUSTER_KEY=$(vault kv get -field=key secret/wazuh/cluster)

    # Richtig: Aus CI/CD-Secrets
    # → GitHub: Settings → Secrets and variables → Actions

    # FALSCH:
    # INDEXER_PASSWORD="MeinPasswort123"  ← niemals!
    ```
