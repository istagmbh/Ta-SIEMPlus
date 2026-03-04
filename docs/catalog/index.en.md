# Catalog

Customer and infrastructure registry for managed Wazuh SIEM installations.

<div class="grid cards" markdown>

-   **Customer Registry**

    ---

    Complete list of all customers with infrastructure configuration,
    credential references, and maintenance windows.

    [:octicons-arrow-right-24: View customers](CUSTOMERS.md)

-   **Catalog Management**

    ---

    Schema reference, maintenance processes, and instructions for new customer entries.

    [:octicons-arrow-right-24: Management guide](CATALOG.md)

</div>

---

## Catalog in the Workflow

| When | Purpose |
|---|---|
| **Before upgrade** | Look up hostname, IP, current version, and Vault reference |
| **In the checklist** | Fill in `customer` and `infrastructure` fields |
| **In the change ticket** | Reference customer ID and infrastructure name |
| **After upgrade** | Update version fields in the catalog |

---

## Quick Search

```bash
# List all customers
grep "customer_name:" CUSTOMERS.md

# Search customer by name
grep -A 20 "customer_name: \"Beispiel\"" CUSTOMERS.md

# Search infrastructure
grep -A 30 "name: \"wazuh-prod-01\"" CUSTOMERS.md
```

---

## Secrets Rule

Never store plaintext passwords in the catalog. Always use a Vault reference:

```yaml
secrets_ref: "vault://kundenname/wazuh-prod"  # Correct ✓
password: "geheimesPasswort123"                # Wrong ✗ – NEVER DO THIS
```

---

## Customer Entry Schema

```yaml
customer_name: "Beispiel AG"
customer_id: "CUST-001"
contact:
  primary: "Max Muster <max.muster@beispiel.ch>"
  technical: "Lisa Muster <lisa.muster@beispiel.ch>"
  phone: "+41 XX XXX XX XX"

infrastructure:
  - name: "wazuh-prod-01"
    type: "All-in-One"
    environment: "Production"
    access:
      hostname: "wazuh.beispiel.ch"
      ip_address: "10.0.1.10"
      ssh_port: 22
      secrets_ref: "vault://beispiel-ag/wazuh-prod"
    components:
      wazuh_manager: { version: "4.12.0" }
      wazuh_indexer:  { version: "4.12.0" }
      wazuh_dashboard: { version: "4.12.0" }
      filebeat: { version: "7.10.2" }
    agents:
      count: 150
    maintenance:
      window: "Saturday 02:00–06:00 CET"
      next_scheduled: "2026-04-05"
```
