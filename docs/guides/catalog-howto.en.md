# Catalog Management – Adding New Infrastructure

Step-by-step guide for adding a new Wazuh installation to the catalog.

---

## Scenario

You have received a **new customer** with a new **Wazuh installation**.
You need to add it to the catalog so operators can find the data quickly.

---

## STEP 1: Gather Infrastructure Data

Before entering anything, you need the following information from the customer/system admin:

### Customer information
```
Customer name:               ________________
Customer short code (URL):   ________________
Primary contact email:       ________________
Security policies:           ________________
```

### Wazuh installation
```
Installation type:           Ubuntu AIO (APT) / Docker / Other
Environment:                 prod / test / dev
Primary host (FQDN):         ________________
Management IP:               ________________
Timezone:                    ________________
```

### Access URLs
```
Dashboard:                   https://________________
API:                         https://________________:55000
Indexer:                     https://________________:9200
```

### Network & Ports
```
Agent port (TCP):            1514 / Other
Manager API (TCP):           55000 / Other
Dashboard (HTTPS):           5601 / Other
Indexer (HTTPS):             9200 / Other
Open ports:                  ________________
```

### Secrets/Credentials
```
⚠️ **NEVER enter directly!**
Instead: Where are the secrets stored?
  - Vault path?           vault://customer/wazuh/...
  - 1Password vault?
  - Keepass database?
  - Passwordstate?
```

### Maintenance policies
```
Maintenance window:          Mon-Fri 22:00-06:00 / Nights only? / Anytime?
Emergency contact (24/7):    ________________
Change approval required:    yes / no
```

---

## STEP 2: Create Entry (COPY-PASTE)

### 2a) Open the catalog file
File: `Catalog/CUSTOMERS.md`

### 2b) Go to the end of the file
Scroll to the bottom and find the last customer entry.

### 2c) Copy the template

Find `---` (YAML separator) in the file and copy a complete block:

```yaml
---
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
secrets_ref:
  admin_user: "vault://deepcloud/wazuh/admin_user"
  admin_password: "vault://deepcloud/wazuh/admin_password"
change_policy: "Within business hours (08:00 - 17:00 CET)"
contact_email: "siem-team@deepcloud.example.tld"
---
```

### 2d) Append template to catalog

At the **end of the file**, after the last entry, insert a blank line and paste your template:

```markdown
...
contact_email: "siem-team@existingcustomer.example.tld"
---

---
customer: "NEW AG"    ← YOUR NEW ENTRY
infrastructure: "NewInfra"
...
---
```

---

## STEP 3: Fill In Fields (with EXAMPLE)

Every YAML field must be filled in with real values:

### Example: BEFORE (template)
```yaml
---
customer: "DeepCloud AG"              ← TEMPLATE (still empty)
infrastructure: "DeepInfra"
environment: "prod"
wazuh_type: "Ubuntu AIO (APT)"
...
---
```

### Example: AFTER (filled in)
```yaml
---
customer: "Acme Corporation"          ← Real customer name
infrastructure: "Acme-PROD-01"        ← Infrastructure ID
environment: "prod"                   ← prod/test/dev
wazuh_type: "Ubuntu AIO (APT)"        ← Installation type
hosts:
  - role: "wazuh-aio"
    fqdn: "siem.acme.example.tld"     ← Hostname (FQDN)
    mgmt_ip: "192.168.10.50"          ← Management IP
urls:
  dashboard: "https://siem.acme.example.tld"
  api: "https://siem.acme.example.tld:55000"
  indexer: "https://siem.acme.example.tld:9200"
ports_expected:
  - "1514/tcp"                        ← Agent inbound
  - "1515/tcp"                        ← Agent cluster
  - "55000/tcp"                       ← Manager API
  - "5601/tcp"                        ← Dashboard
  - "9200/tcp"                        ← Indexer/Elasticsearch
secrets_ref:
  admin_user: "vault://acme/wazuh/admin_user"      ← NO real password!
  admin_password: "vault://acme/wazuh/admin_password"
change_policy: "Within business hours (08:00 - 18:00 CET), max 2h window"
contact_email: "siem-oncall@acme.example.tld"
---
```

---

## Field Definitions

| Field | Format | Example | Explanation |
|------|--------|----------|-----------|
| `customer` | Text | "Acme Corp" | Customer name |
| `infrastructure` | Text (no spaces) | "Acme-PROD-01" | Unique ID for this installation |
| `environment` | prod/test/dev | "prod" | Environment type |
| `wazuh_type` | Text | "Ubuntu AIO (APT)" | Installation type |
| `fqdn` | FQDN | "siem.acme.tld" | Fully qualified hostname |
| `mgmt_ip` | IP address | "192.168.10.50" | Management IP (for SSH) |
| `dashboard` | HTTPS URL | "https://siem.acme.tld" | Dashboard access |
| `api` | HTTPS URL + port | "https://siem.acme.tld:55000" | Manager API |
| `indexer` | HTTPS URL + port | "https://siem.acme.tld:9200" | Elasticsearch/OpenSearch |
| `ports_expected` | List (TCP/UDP) | "1514/tcp" | Expected open ports |
| `admin_user` | Vault path | "vault://acme/wazuh/admin" | NEVER real passwords! |
| `admin_password` | Vault path | "vault://acme/wazuh/pass" | NEVER real passwords! |
| `change_policy` | Text (business hours) | "Mon-Fri 22:00-06:00" | When are changes permitted? |
| `contact_email` | Email | "siem@acme.tld" | Emergency contact |

---

## IMPORTANT: SECRETS

### Wrong (NEVER!)
```yaml
secrets_ref:
  admin_password: "MySecretPassword123!"
```

### Correct
```yaml
secrets_ref:
  admin_user: "vault://acme/wazuh/admin_user"
  admin_password: "vault://acme/wazuh/admin_password"
```

**Why?**
- The catalog file is in a Git repository
- Git stores the complete history (including deleted secrets!)
- Secrets must be in your secret store (Vault, 1Password, etc.)

**How do I use the secrets?**
```bash
# Retrieve password (e.g. with Vault):
vault kv get acme/wazuh/admin_password
# Output: password: MySecretPassword123!
```

---

## STEP 4: Submit Change via Pull Request

Now you need to get the change into the repository. This is done via **Git + Pull Request**:

### 4a) Create feature branch
```bash
# Terminal command to copy:
git checkout -b add/customer-acme-corp
```

### 4b) Save file & commit change
```bash
# Terminal commands to copy:
git add Catalog/CUSTOMERS.md
git commit -m "catalog: Add Acme Corporation infrastructure (Acme-PROD-01)"
```

### 4c) Push to GitHub
```bash
# Terminal command to copy:
git push origin add/customer-acme-corp
```

### 4d) Create pull request
1. Go to https://github.com/istagmbh/Ta-SIEMPlus
2. Click on **"Pull requests"**
3. Click on **"New Pull Request"**
4. Select:
   - **Base:** `main`
   - **Compare:** `add/customer-acme-corp`
5. **Title:** `catalog: Add Acme Corporation`
6. **Description:**
   ```markdown
   Adds new customer infrastructure to catalog:
   - Customer: Acme Corporation
   - Infrastructure: Acme-PROD-01
   - Environment: prod
   - Type: Ubuntu AIO (APT)
   - Dashboard: https://siem.acme.example.tld

   No breaking changes. Ready for review.
   ```
7. Click **"Create Pull Request"**

### 4e) Wait for review
- At least 1 reviewer must approve ✅
- Reviewer checks: syntax, secrets references, completeness
- After approval: **Merge** (your entry is live!)

---

## STEP 5: After the Merge

### 5a) Delete feature branch (cleanup)
```bash
# Terminal commands to copy:
git checkout main
git pull origin main
git branch -d add/customer-acme-corp
```

### 5b) Use new entries

Now operators can use your data:

```bash
# For example in a checklist:
customer: "Acme Corporation"
infrastructure: "Acme-PROD-01"
# → All data from Catalog/CUSTOMERS.md is automatically used!
```

---

## VALIDATION: Check before committing

Before running git commit, verify:

### Checklist:
- [ ] **All fields filled in?** (nothing left as "UNSET")
- [ ] **YAML syntax correct?** (no tabs, spaces only!)
- [ ] **Secrets as Vault paths only?** (no real password!)
- [ ] **URLs reachable?** (at least test dashboard + API)
- [ ] **No duplicates?** (grep -n "customer: \"Acme\"" Catalog/CUSTOMERS.md)
- [ ] **Commit message meaningful?** (short + precise)

### Test YAML syntax
Open the file in a YAML validator:
- Online: https://jsoncrack.com/editor
- Local: `python -c "import yaml; yaml.safe_load(open('Catalog/CUSTOMERS.md'))"`

If errors: fix before committing!

---

## Complete Example

### Before (template)
File: `Catalog/CUSTOMERS.md`, line 100+

```yaml
---
customer: "UNSET"
infrastructure: "UNSET"
environment: "UNSET"
...
---
```

### After (filled in)
```yaml
---
customer: "TechVision AG"
infrastructure: "TechVision-Security-01"
environment: "prod"
wazuh_type: "Ubuntu AIO (APT)"
hosts:
  - role: "wazuh-aio"
    fqdn: "wazuh-prod.techvision.internal"
    mgmt_ip: "10.50.100.5"
urls:
  dashboard: "https://wazuh-prod.techvision.internal"
  api: "https://wazuh-prod.techvision.internal:55000"
  indexer: "https://wazuh-prod.techvision.internal:9200"
ports_expected:
  - "1514/tcp"
  - "1515/tcp"
  - "55000/tcp"
  - "5601/tcp"
  - "9200/tcp"
secrets_ref:
  admin_user: "vault://techvision/wazuh/admin_user"
  admin_password: "vault://techvision/wazuh/admin_password"
change_policy: "Weekdays 22:00-06:00 CET, no change Fri evening to Sun"
contact_email: "security-oncall@techvision.internal"
---
```

Git commit:
```bash
git add Catalog/CUSTOMERS.md
git commit -m "catalog: Add TechVision AG infrastructure (prod environment)"
git push origin add/customer-techvision-ag
```

---

## Common Mistakes

| Mistake | Symptom | Fix |
|--------|---------|-----|
| YAML syntax wrong | `yaml.scanner.ScannerError` | Check indentation (2 spaces, no tabs) |
| Field missing | `infrastructure: UNSET` remains empty | Fill in all fields! |
| Secret as plaintext | `admin_password: "MyPassword123"` | Only `vault://...` references! |
| Duplicate entry | Two customers with the same name | Check with `grep` |
| Wrong URL | `http://` instead of `https://` | Use HTTPS! |
| Port in URLs | `https://siem.tld:5601` (wrong) | Port only in indexer/api, not dashboard |

---

## Pro Tips

### Tip 1: Quickly find a customer
```bash
grep -A 5 "customer: \"Acme" Catalog/CUSTOMERS.md
```

### Tip 2: List all customers
```bash
grep "^customer:" Catalog/CUSTOMERS.md | sort
```

### Tip 3: Validate YAML (quickly)
```bash
python3 -c "import yaml; yaml.safe_load(open('Catalog/CUSTOMERS.md'))"
# No output = ✅ OK!
```

### Tip 4: Check secrets paths (safely!)
```bash
grep "secrets_ref:" -A 3 Catalog/CUSTOMERS.md | grep -v "vault://"
# No output = ✅ All secure!
```

---

## Support

| Question | Answer |
|-------|--------|
| Where do I find example entries? | In `Catalog/CUSTOMERS.md` itself (search for `---`) |
| How do I test YAML? | Online: https://jsoncrack.com/editor |
| Who can approve changes? | 1 reviewer (see CONTRIBUTING.md) |
| Can I use URLs as HTTP (not HTTPS)? | No – always HTTPS for security |
| Can I add ports? | Yes, if necessary. Document in a comment. |

---

✅ **You're ready!** Good luck adding new infrastructures!
