# ⚡ QUICK REFERENCE – Schnelle Lookups

Ein Cheat-Sheet für erfahrene Operatoren. Alle Befehle zum Kopieren.

---

## 🎯 Wazuh Upgrade (Ubuntu AIO)

### Datei-Locations
```
Checkliste (Markdown):     checklists/CHECKLIST_WAZUH_UPGRADE_AIO.md
Checkliste (Web):          docs/maintenance-form.html
Runbook:                   runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md
Template:                  templates/CHANGE_NOTE_TEMPLATE.md
Kunden-Info:               Catalog/CUSTOMERS.md
```

---

### Metadaten für Change-Ticket (Copy-Paste Template)

```yaml
operator: "UNSET"
customer: "UNSET"
infrastructure: "UNSET"
change_ticket: "UNSET"
maintenance_window_start: "UNSET"      # Europe/Zurich
maintenance_window_end: "UNSET"        # Europe/Zurich
target_version: "UNSET"
current_version: "UNSET"
snapshot_id: "UNSET"
system: "Ubuntu AIO (APT)"
runbook_ref: "../runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md"
```

---

## 📋 Health Snapshot (Pre/Post Upgrade)

### Pre-Snapshot (vor Upgrade)
```bash
date -Is
echo "=== DISK ==="
df -h | grep -v tmpfs
echo "=== MEMORY ==="
free -h
echo "=== SERVICES ==="
systemctl status wazuh-indexer wazuh-manager wazuh-dashboard filebeat
echo "=== VERSIONS ==="
dpkg -l | grep -E 'wazuh-(indexer|manager|dashboard)|filebeat'
echo "=== CLUSTER HEALTH ==="
curl -sk -u admin:admin https://127.0.0.1:9200/_cluster/health?pretty
```

### Post-Snapshot (nach Upgrade)
```bash
# Exakt denselben Befehl wie oben nochmal ausführen
# Vergleichen & dokumentieren
```

---

## 🔍 Diagnose-Befehle (Troubleshooting)

### Service-Status Check
```bash
systemctl status wazuh-indexer wazuh-manager wazuh-dashboard filebeat -l
```

### Letzte 50 Fehler im Journal
```bash
journalctl -u wazuh-indexer -n 50 --no-pager -p err
journalctl -u wazuh-manager -n 50 --no-pager -p err
journalctl -u wazuh-dashboard -n 50 --no-pager -p err
journalctl -u filebeat -n 50 --no-pager -p err
```

### Cluster Health (Indexer)
```bash
curl -sk -u admin:admin https://127.0.0.1:9200/_cluster/health?pretty
curl -sk -u admin:admin https://127.0.0.1:9200/_cat/shards?v
```

### Manager API Health
```bash
curl -sk -u admin:admin https://127.0.0.1:55000/api/v1/manager/info
```

### Disk Space
```bash
df -h
du -sh /var/ossec/*
du -sh /var/lib/wazuh/*
```

---

## 🔄 Häufige Prozess-Schritte

### 1. Services stoppen (für Upgrade)
```bash
systemctl stop filebeat
systemctl stop wazuh-dashboard
systemctl stop wazuh-manager
systemctl stop wazuh-indexer
```

### 2. Paketliste aktualisieren
```bash
apt update
```

### 3. Upgrade durchführen (alle Komponenten)
```bash
apt install --only-upgrade wazuh-indexer wazuh-manager wazuh-dashboard filebeat
```

### 4. Services starten (nach Upgrade)
```bash
systemctl start wazuh-indexer
systemctl start wazuh-manager
systemctl start wazuh-dashboard
systemctl start filebeat
```

### 5. Status verifizieren
```bash
systemctl status wazuh-indexer wazuh-manager wazuh-dashboard filebeat
```

---

## 📁 Katalog-Einträge

### Neue Infra schnell finden
```bash
grep -A 10 "customer: \"DeepCloud AG\"" Catalog/CUSTOMERS.md
```

### Template für neuen Kunden (copy-paste)
```yaml
---
customer: "UNSET"
infrastructure: "UNSET"
environment: "prod|test|dev"
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
  admin_user: "vault://path/to/secret"
  admin_password: "vault://path/to/secret"
change_policy: "Within business hours (08:00 - 17:00 CET)"
contact_email: "team@example.tld"
---
```

---

## 🚨 No-Go Gates (STOP wenn erfüllt!)

| Gate | Check |
|------|-------|
| **Disk > 90%** | `df -h` → Freigeben vor Upgrade |
| **Services nicht running** | `systemctl status ...` → Starten/Debuggen |
| **Keine Backup** | VM-Snapshot ODER tar-Backup erstellen |
| **Außerhalb Fenster** | Verschieben auf geplante Zeit |
| **Manager < Agent Version** | Upgrade Manager ZUERST |

---

## 📝 Git Workflow (schnell)

### Änderung einreichen
```bash
# Feature-Branch
git checkout -b fix/upgrade-command

# Datei ändern...

# Committe
git add runbooks/RUNBOOK_*.md
git commit -m "fix: Update command for service restart (Wazuh 4.12)"
git push origin fix/upgrade-command

# → Pull Request erstellen im Web
```

### Änderung reviewen
```bash
# Feature-Branch auschecken
git fetch origin fix/upgrade-command
git checkout -b review/fix-upgrade-command origin/fix/upgrade-command

# Review & test...

# Mergen (nach Approval)
git checkout main
git merge --ff-only review/fix-upgrade-command
```

---

## 🔐 Secrets Management

**Richtig:**
```yaml
secrets_ref:
  password: "vault://deepcloud/wazuh/admin_password"
```

**FALSCH (NIE!):**
```yaml
secrets_ref:
  password: "MySecretPassword123!"  # ❌ NICHT!
```

Alle Credentials müssen via Secret-Store referenziert sein!

---

## 📞 Support-Links

| Resource | URL |
|----------|-----|
| Wazuh Upgrade Guide | https://documentation.wazuh.com/current/upgrade-guide/ |
| Wazuh Official Docs | https://documentation.wazuh.com/ |
| Project Repo | /Users/i.stricker/docker/dev/Ta-SIEMPlus |
| Contributing Guide | CONTRIBUTING.md |

---

## 💡 Pro-Tips

### Tip 1: Mehrere Befehle in Serie mit && verketten
```bash
systemctl stop filebeat && systemctl stop wazuh-dashboard && echo "Stopped successfully"
```

### Tip 2: Health Check in einer Datei speichern
```bash
date -Is > /tmp/pre-upgrade-health.txt
systemctl status wazuh-* >> /tmp/pre-upgrade-health.txt
dpkg -l | grep wazuh >> /tmp/pre-upgrade-health.txt
cat /tmp/pre-upgrade-health.txt  # Später im Ticket posten
```

### Tip 3: Schnell in Katalog suchen
```bash
grep -n "infrastructure:" Catalog/CUSTOMERS.md | grep DeepInfra
```

### Tip 4: Checkliste lokal öffnen
```bash
# Mac:
open checklists/CHECKLIST_WAZUH_UPGRADE_AIO.md

# Linux:
xdg-open checklists/CHECKLIST_WAZUH_UPGRADE_AIO.md

# Windows (PowerShell):
start checklists\CHECKLIST_WAZUH_UPGRADE_AIO.md
```

---

**Brauchst du mehr Details?** → [GETTING_STARTED.md](GETTING_STARTED.md)

**Änderung einreichen?** → [CONTRIBUTING.md](CONTRIBUTING.md)

**Projekt-Überblick?** → [README.md](README.md)
