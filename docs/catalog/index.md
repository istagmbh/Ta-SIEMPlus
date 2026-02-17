# Catalog

Customer infrastructure registry and configuration metadata for Wazuh SIEM installations.

## 📋 Overview

The catalog maintains a structured registry of:
- Customer information
- Infrastructure configurations
- System identifiers
- Secret references (vault paths only)
- Contact information

## 🎯 Purpose

The catalog serves as a **single source of truth** for:
- Planning maintenance operations
- Documenting infrastructure details
- Managing customer relationships
- Tracking deployed systems
- Referencing configuration metadata

## 📚 Available Catalog Resources

### [Customer Registry](../../Catalog/CUSTOMERS.md)
Complete registry of customers and their Wazuh infrastructure configurations.

**Includes:**
- Customer identification
- Infrastructure details (hostnames, IPs, versions)
- Contact information
- Secret vault references
- Maintenance windows
- System specifications

### [Catalog Documentation](../../Catalog/CATALOG.md)
Guidelines for maintaining and updating the catalog.

## 🔧 Using the Catalog

### For Planning Maintenance

1. **Look up customer** in CUSTOMERS.md
2. **Retrieve infrastructure details**:
   - Hostnames and IPs
   - Current versions
   - Access credentials (vault references)
3. **Check maintenance windows**
4. **Note contact information** for notifications

### For Documentation

When documenting a procedure:
- Reference customer by registered name
- Use infrastructure identifiers from catalog
- Include catalog metadata in checklists:
  ```yaml
  customer: Example Corp
  infrastructure: wazuh-prod-01
  ```

### For Onboarding New Customers

1. Follow the structure in CUSTOMERS.md
2. Document all required fields
3. Store secrets in vault (reference only)
4. Update catalog via Pull Request
5. Get review before merging

## 📊 Catalog Schema

### Customer Entry Template

```yaml
customer_name: "Example Corporation"
customer_id: "CUST-001"
contact:
  primary: "John Doe <john.doe@example.com>"
  technical: "Jane Smith <jane.smith@example.com>"
  phone: "+41 XX XXX XX XX"

infrastructure:
  - name: "wazuh-prod-01"
    type: "All-in-One"
    environment: "Production"
    
    access:
      hostname: "wazuh.example.com"
      ip_address: "10.0.1.10"
      ssh_port: 22
      secrets_ref: "vault://example-corp/wazuh-prod"
    
    components:
      wazuh_manager:
        version: "4.12.0"
        installed: "2025-01-15"
      wazuh_indexer:
        version: "4.12.0"
        installed: "2025-01-15"
      wazuh_dashboard:
        version: "4.12.0"
        installed: "2025-01-15"
      filebeat:
        version: "7.10.2"
        installed: "2025-01-15"
    
    agents:
      count: 150
      versions:
        - "4.12.0": 140
        - "4.11.0": 10
    
    system:
      os: "Ubuntu 22.04 LTS"
      cpu: "8 cores"
      memory: "32 GB"
      disk: "500 GB"
    
    maintenance:
      window: "Saturday 02:00-06:00 CET"
      frequency: "Monthly"
      next_scheduled: "2026-03-01"
    
    notes: |
      - Critical production system
      - 24/7 monitoring required
      - Customer requires 2-day advance notice
```

## 🔐 Secrets Management

**CRITICAL:** Never store secrets directly in the catalog.

### ✅ Correct Approach
```yaml
secrets_ref: "vault://example-corp/wazuh-prod"
```

The vault path should contain:
- SSH credentials
- API passwords
- Certificate passphrases
- Any other sensitive data

### ❌ Wrong Approach
```yaml
# NEVER DO THIS!
password: "MySecretPassword123"
api_key: "abc123def456"
```

## 📝 Catalog Maintenance

### Adding a New Customer

1. Create entry following template
2. Validate all required fields
3. Store secrets in vault first
4. Reference vault path in catalog
5. Submit PR with description
6. Get review from team
7. Merge after approval

### Updating Customer Information

1. Locate customer entry
2. Update changed fields
3. Document reason in PR
4. Update version numbers
5. Update last_modified date
6. Submit PR for review

### Version Tracking

After each upgrade:
1. Update component versions
2. Update agent version distribution
3. Note upgrade date
4. Update "last_modified" timestamp

### Regular Reviews

- **Monthly:** Verify contact information
- **Quarterly:** Audit version currency
- **Annually:** Review and archive inactive customers

## 🔍 Quick Lookup

### Finding Customer Information

```bash
# Search by customer name
grep -A 20 "customer_name: \"Example\"" Catalog/CUSTOMERS.md

# Find by infrastructure name
grep -A 30 "name: \"wazuh-prod-01\"" Catalog/CUSTOMERS.md

# List all customers
grep "customer_name:" Catalog/CUSTOMERS.md
```

### Verifying Current Versions

```bash
# Extract version information for a customer
grep -A 5 "wazuh_manager:" Catalog/CUSTOMERS.md | grep version
```

## 📋 Integration with Workflows

The catalog integrates with operational workflows:

### In Checklists
Reference customer and infrastructure from catalog:
```yaml
customer: Example Corporation  # From catalog
infrastructure: wazuh-prod-01  # From catalog
```

### In Runbooks
Retrieve access details and system specs from catalog before executing procedures.

### In Change Notes
Include catalog references for audit trail:
```
Customer: Example Corporation (CUST-001)
Infrastructure: wazuh-prod-01
```

## 🔗 Related Resources

- [Customer Registry (YAML)](../../Catalog/CUSTOMERS.md)
- [Catalog Guidelines](../../Catalog/CATALOG.md)
- [Checklists](../checklists/index.md) - Using catalog data in checklists
- [Templates](../templates/index.md) - Change documentation templates

## 📚 Additional Documentation

For more details on managing the catalog:
- See [CATALOG_HOWTO.md](../../CATALOG_HOWTO.md) for step-by-step guide
- Review existing entries as examples
- Follow the contributing guidelines for updates
