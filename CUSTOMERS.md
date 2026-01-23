# Kunden- & Infrastruktur-Katalog (Managed SIEM)

Zweck: zentraler, versionierter Katalog für operative Details.  
**Wichtig:** Keine Secrets in diesem File. Credentials nur als Referenz auf euren Secret-Store (z.B. Vault/1Password/Keepass/Passwordstate).

## Schema (pro Kunde/Infrastruktur)

```yaml
customer: "DeepCloud AG"
infrastructure: "DeepInfra"
environment: "prod"
wazuh_type: "Ubuntu AIO (APT)"
hosts:
  - role: "wazuh-aio"
    fqdn: "wazuh01.example.tld"
    mgmt_ip: "10.10.10.10"
urls:
  dashboard: "https://wazuh01.example.tld"
  api: "https://wazuh01.example.tld:55000"
  indexer: "https://wazuh01.example.tld:9200"
ports_expected:
  - "1514/tcp"
  - "1515/tcp"
  - "55000/tcp"
  - "5601/tcp"
  - "9200/tcp"
monitoring:
  log_sources:
    - "wazuh-manager journal"
    - "wazuh-indexer journal"
    - "wazuh-dashboard journal"
    - "filebeat journal"
  health_notes: "z.B. tägliche Checks, Disk Schwellen, Backup Job"
secrets_ref:
  indexer_admin_creds: "vault://…/indexer-admin"
  wazuh_api_creds: "vault://…/wazuh-api"
  tls_material: "vault://…/tls"
change_policy:
  window: "z.B. Mo 20:00–22:00 CET"
  customer_contacts: ["…"]
```

## Einträge

> Pro Kunde/Infrastruktur einen Block einfügen (copy/paste des Schemas).

### TEMPLATE – bitte kopieren

```yaml
customer: "UNSET"
infrastructure: "UNSET"
environment: "prod|stage|dev"
wazuh_type: "Ubuntu AIO (APT)"
hosts:
  - role: "wazuh-aio"
    fqdn: "UNSET"
    mgmt_ip: "UNSET"
urls:
  dashboard: "UNSET"
  api: "UNSET"
  indexer: "UNSET"
ports_expected:
  - "1514/tcp"
  - "1515/tcp"
  - "55000/tcp"
  - "5601/tcp"
  - "9200/tcp"
secrets_ref:
  indexer_admin_creds: "UNSET"
  wazuh_api_creds: "UNSET"
  tls_material: "UNSET"
change_policy:
  window: "UNSET"
  customer_contacts: []
```
