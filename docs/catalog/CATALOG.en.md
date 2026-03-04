# Customer Catalog – Managed SIEM Infrastructures

This document catalogs all managed Wazuh instances and their associations.

**Status:** ✅ Production
**Last updated:** January 30, 2026
**Management:** This document is managed by the web-based catalog feature (the catalog YAML).

---

## 1. Deepcloud AG

**Customer:** Deepcloud AG
**Region:** Switzerland (CH)
**Contact:** [vault://deepcloud/contact]
**Support level:** 24/7 Premium

### Infrastructures

| ID | Name | Region | Status | Wazuh Version | Upgrade Plan |
|---|---|---|---|---|---|
| `deeppay` | DeepPay | CH | 🟢 Active | 4.7.0 | Q2 2026 |
| `deepcloud` | DeepCloud | CH | 🟢 Active | 4.7.0 | Q2 2026 |
| `payinfra` | PayInfra | CH | 🟢 Active | 4.6.0 | Q1 2026 |
| `deepinfra` | DeepInfra | CH | 🟢 Active | 4.7.0 | Q2 2026 |

**Special characteristics:**
- Multi-node cluster (payinfra & deepinfra)
- Geographically distributed data centers
- Compliance requirements: PCI-DSS, GDPR

**Contact information:**
```
Primary contact: [vault://deepcloud/primary_contact]
Backup contact: [vault://deepcloud/secondary_contact]
Change window: Tuesdays 02:00–06:00 UTC
```

---

## 2. Wagner International Group AG

**Customer:** Wagner International Group AG
**Region:** Germany (DE)
**Contact:** [vault://wagner/contact]
**Support level:** Business Hours + Escalation

### Infrastructures

| ID | Name | Region | Status | Wazuh Version | Upgrade Plan |
|---|---|---|---|---|---|
| `altstätten` | Altstätten | DE/CH | 🟢 Active | 4.6.0 | Q1 2026 |
| `markdorf` | Markdorf | DE | 🟢 Active | 4.5.0 | Q4 2025 |

**Special characteristics:**
- Dual-region setup
- Legacy system (Markdorf) with incremental upgrade plan
- Redundant failover architecture

**Contact information:**
```
Primary contact: [vault://wagner/primary_contact]
Change window: Wednesdays 22:00–02:00 UTC (maintenance window)
Emergency hotline: [vault://wagner/emergency_number]
```

---

## 3. Abacus Research AG

**Customer:** Abacus Research AG
**Region:** Switzerland (CH)
**Contact:** [vault://abacus/contact]
**Support level:** Standard Business Hours

### Infrastructures

| ID | Name | Region | Status | Wazuh Version | Upgrade Plan |
|---|---|---|---|---|---|
| `mito` | MITO | CH | 🟢 Active | 4.7.0 | Q2 2026 |
| `aba_infra` | ABA Infrastructure | CH | 🟢 Active | 4.7.0 | Q2 2026 |

**Special characteristics:**
- Research-focused environments
- Frequent test deployments
- Flexible upgrade windows

**Contact information:**
```
Primary contact: [vault://abacus/primary_contact]
IT lead: [vault://abacus/it_lead]
Change window: Fridays 15:00–19:00 UTC
```

---

## 4. Oro de Cacao

**Customer:** Oro de Cacao
**Region:** Other EU (EU)
**Contact:** [vault://orodecacao/contact]
**Support level:** Standard

### Infrastructures

| ID | Name | Region | Status | Wazuh Version | Upgrade Plan |
|---|---|---|---|---|---|
| `default` | Default Infrastructure | EU | 🟢 Active | 4.6.0 | Q1 2026 |

**Special characteristics:**
- Single-node instance
- Standard configuration
- Cost-optimized

**Contact information:**
```
Primary contact: [vault://orodecacao/primary_contact]
Change window: Mondays 01:00–05:00 UTC
Timezone: Europe/Madrid
```

---

## Upgrade Roadmap

### Q4 2025
- ⬜ Wagner / Markdorf: 4.5.0 → 4.6.0
- ⬜ Oro de Cacao: 4.6.0 → 4.7.0

### Q1 2026
- 🔄 Wagner / Altstätten: 4.6.0 → 4.7.0
- 🔄 Abacus / MITO & ABA: 4.7.0 → 4.8.0 (planned)

### Q2 2026
- 🔄 Deepcloud / All: 4.7.0 → 4.8.0 (planned)

---

## Management Policies

### Catalog Updates

1. **Customer data:** Updates via pull request on this document
2. **Version changes:** After successful upgrade, with change ticket reference
3. **Contact changes:** Update IMMEDIATELY (safety-critical)
4. **Add infrastructure:** New row in the appropriate table + new section if new customer

### Secret Data (Vault References)

**⚠️ NEVER commit directly:**
- Passwords
- API keys
- SSH keys
- Private IPs (if classified)

**Instead:** Use Vault references: `vault://customer/secret_key`

### Integration with Web Tools

The catalog data is maintained in the YAML files:
- Customers and infrastructures are interactively selectable
- Selection is automatically applied to the form, checklist, and runbook
- LocalStorage enables persistence during the session

---

## Quick Reference: Region by Customer

| Customer | Primary Region | Failover Region | Timezone |
|---|---|---|---|
| Deepcloud AG | CH | CH | Europe/Zurich |
| Wagner International Group AG | DE | CH | Europe/Berlin / Europe/Zurich |
| Abacus Research AG | CH | — | Europe/Zurich |
| Oro de Cacao | EU | — | Europe/Madrid |

---

## Common Tasks

### "I need to perform an upgrade for customer X"

1. Open [catalog/CUSTOMERS.md](CUSTOMERS.md)
2. Find the customer, select the infrastructure
3. Click **"Use in form"**
4. Metadata is automatically populated ✅
5. Open the **maintenance form** (maintenance-form.html)
6. Follow steps 1–5 with the **runbook** and **checklist**

### "I need to add new contact details for customer X"

1. Edit this document (MARKDOWN)
2. Add Vault references: `vault://kunde/secret_key`
3. Create pull request + 1 reviewer
4. Merged → documentation is up to date
5. **Web catalog is updated via JavaScript** (cache invalidation)

### "Which infrastructures need upgrades?"

See the **Upgrade Roadmap** above or use the web catalog search function.

---

## Feedback & Extensions

This catalog system is **collaboratively maintainable**:

- New infrastructure? → Add row in table + upgrade plan
- New customer? → New section with contact info + upgrade plan
- Data error? → Pull request with correction
- Security concern? → Private issue or email to Ops team

**Goal:** A single catalog, synchronized between Markdown and web.

---

**Appendices:**
- Catalog: [catalog/CUSTOMERS.md](CUSTOMERS.md)
- Upgrade Runbook: [runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md](../runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md)
- Change Checklist: [checklists/CHECKLIST_WAZUH_UPGRADE_AIO.md](../checklists/CHECKLIST_WAZUH_UPGRADE_AIO.md)
