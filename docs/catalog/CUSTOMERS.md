# Kunden- & Infrastruktur-Katalog (Managed SIEM)

**Purpose:** Central, version-controlled catalog for operational details.  
**Scope:** All managed Wazuh installations for customers.  

**IMPORTANT SECURITY NOTICE:**  
⚠️ **NO SECRETS IN THIS FILE!** ⚠️  
Credentials must only be referenced as paths to your secret store (e.g., Vault/1Password/Keepass/Passwordstate).

## How to Use This File

1. **Adding a New Customer/Infrastructure:**
   - Copy the YAML template at the bottom of this file
   - Fill in all fields with actual values
   - Replace `UNSET` placeholders with real data
   - For secrets, use references like `vault://path/to/secret`
   - Submit changes via Pull Request for review

2. **Updating Existing Entries:**
   - Locate the customer's YAML block
   - Make necessary changes
   - Update any affected runbooks or checklists
   - Submit via Pull Request

3. **Reference During Operations:**
   - Use this catalog to find URLs, hosts, and ports during maintenance
   - Check `change_policy` before scheduling maintenance windows
   - Reference `secrets_ref` paths when retrieving credentials

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
