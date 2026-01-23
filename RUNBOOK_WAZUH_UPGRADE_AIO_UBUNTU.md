# Managed SIEM (Wazuh) – Runbook Upgrade Central Components (Ubuntu AIO, APT)

**Dokumenttyp:** SOP / Runbook  
**Geltungsbereich:** Wazuh All-in-One auf Ubuntu (APT): Indexer, Manager, Dashboard, Filebeat  
**Ziel:** Reproduzierbar, auditierbar, operator-freundlich (Gates + klare Reihenfolge)  
**Version:** 1.2  
**Änderungen:** Nur via Pull Request (Review required)

## Verbindliche Referenz (Guide)
- https://documentation.wazuh.com/current/upgrade-guide/upgrading-central-components.html

## Zugehörige Checkliste
- `../checklists/CHECKLIST_WAZUH_UPGRADE_AIO.md`

---

## 0) Nicht verhandelbare Regeln (Upgrade)

1. **Komponenten-Versionen müssen identisch sein (inkl. Patchlevel):**
   - `wazuh-indexer`, `wazuh-manager`, `wazuh-dashboard`
2. **Manager-Version ≥ Agent-Version**
3. **Ohne Snapshot/Backup kein produktives Upgrade**
4. **Upgrade gemäss Guide inkl. Pre-/Post-Actions** (Shard allocation, Flush, Security re-apply, etc.)
5. **Keine Default-Credentials in Produktion** (Indexer API Calls müssen die realen Credentials verwenden)

---

## 1) Runbook 0 – Health Snapshot (immer VOR und NACH Wartung)

> Zweck: in < 5 Minuten einen auditierbaren Zustand erzeugen (copy/paste ins Ticket).

```bash
set -euo pipefail

echo "=== DATE/UPTIME ==="
date -Is
uptime

echo "=== DISK/MEM ==="
df -h
free -h

echo "=== SERVICES ==="
systemctl --no-pager -l status wazuh-indexer wazuh-manager wazuh-dashboard filebeat || true

echo "=== PORTS (sanity) ==="
ss -lntp | egrep '(:1514|:1515|:55000|:9200|:5601)\s' || true

echo "=== PACKAGES ==="
dpkg -l | egrep 'wazuh-(indexer|manager|dashboard|agent)|filebeat' || true

echo "=== RECENT ERRORS ==="
journalctl -u wazuh-indexer -n 200 --no-pager || true
journalctl -u wazuh-manager -n 200 --no-pager || true
journalctl -u wazuh-dashboard -n 200 --no-pager || true
journalctl -u filebeat -n 200 --no-pager || true
```

---

## 2) Upgrade Ablauf (Central Components, AIO)

### 2.1 Zielversion prüfen (No-Go wenn Versionen nicht identisch)

```bash
set -euo pipefail
apt-get update

echo "== Candidate versions =="
apt-cache policy wazuh-indexer | awk '/Candidate:/ {print "wazuh-indexer:", $2}'
apt-cache policy wazuh-manager | awk '/Candidate:/ {print "wazuh-manager:", $2}'
apt-cache policy wazuh-dashboard | awk '/Candidate:/ {print "wazuh-dashboard:", $2}'
```

**No-Go**, wenn Candidate-Versionen nicht identisch sind (inkl. Patchlevel).

---

### 2.2 Backup / Snapshot (Pflicht)

**Standard:** VM-/Volume-Snapshot (bevor Dienste gestoppt werden).  
**Zusätzlich empfohlen:** Konfig-Backup:

```bash
set -euo pipefail
BACKUP_DIR="/root/wazuh_backup_$(date +%F_%H%M%S)"
mkdir -p "$BACKUP_DIR"

tar -czf "$BACKUP_DIR/var_ossec_etc.tgz" /var/ossec/etc
tar -czf "$BACKUP_DIR/wazuh_indexer_etc.tgz" /etc/wazuh-indexer || true
tar -czf "$BACKUP_DIR/wazuh_dashboard_etc.tgz" /etc/wazuh-dashboard || true
tar -czf "$BACKUP_DIR/filebeat_etc.tgz" /etc/filebeat || true

echo "Backup written to: $BACKUP_DIR"
ls -lah "$BACKUP_DIR"
```

---

### 2.3 Controlled Stop (Guide-Minimum)

```bash
set -euo pipefail
systemctl stop filebeat
systemctl stop wazuh-dashboard
```

---

## 3) Indexer Pre-Actions (Guide)

> **Wichtig:** Credentials/PKI je Umgebung. Keine Default-Creds verwenden.

### 3.1 Security Config Backup (Indexer)

```bash
/usr/share/wazuh-indexer/bin/indexer-security-init.sh --options "-backup /etc/wazuh-indexer/opensearch-security -icl -nhnv"
```

### 3.2 Shard Allocation auf `primaries`

```bash
curl -X PUT "https://127.0.0.1:9200/_cluster/settings" -u admin:admin -k \
  -H 'Content-Type: application/json' -d'
{
  "persistent": { "cluster.routing.allocation.enable": "primaries" }
}
'
```

### 3.3 Flush

```bash
curl -X POST "https://127.0.0.1:9200/_flush" -u admin:admin -k
```

### 3.4 Manager stoppen (insb. single-node Indexer Cluster)

```bash
systemctl stop wazuh-manager
```

---

## 4) Indexer Upgrade (Guide)

```bash
set -euo pipefail
systemctl stop wazuh-indexer

# JVM Settings sichern (für Vergleich)
cp /etc/wazuh-indexer/jvm.options /etc/wazuh-indexer/jvm.options.old

apt-get install -y wazuh-indexer

systemctl daemon-reload
systemctl enable wazuh-indexer
systemctl start wazuh-indexer
systemctl --no-pager -l status wazuh-indexer
```

**Triage, falls Start fehlschlägt:**
```bash
journalctl -u wazuh-indexer -n 300 --no-pager
ls -lah /var/log/wazuh-indexer/ || true
```

**Plugins (manuell installierte Plugins sind separat zu behandeln):**
```bash
/usr/share/wazuh-indexer/bin/opensearch-plugin list
```

---

## 5) Indexer Post-Actions (Guide)

```bash
# Security erneut anwenden
/usr/share/wazuh-indexer/bin/indexer-security-init.sh

# Nodes prüfen
curl -k -u admin:admin https://127.0.0.1:9200/_cat/nodes?v

# Shard Allocation wieder aktivieren
curl -X PUT "https://127.0.0.1:9200/_cluster/settings" -u admin:admin -k \
  -H 'Content-Type: application/json' -d'
{
  "persistent": { "cluster.routing.allocation.enable": "all" }
}
'
```

---

## 6) Manager Upgrade (Guide)

```bash
set -euo pipefail
apt-get install -y wazuh-manager

systemctl daemon-reload
systemctl enable wazuh-manager
systemctl start wazuh-manager
systemctl --no-pager -l status wazuh-manager
```

**Triage:**
```bash
journalctl -u wazuh-manager -n 300 --no-pager
tail -n 200 /var/ossec/logs/ossec.log || true
```

---

## 7) Filebeat Update/Setup (Guide)

> Ziel: Wazuh Module + Template + Pipelines/Index-Management auf Zielversion.

```bash
set -euo pipefail

# Wazuh Filebeat Module installieren/aktualisieren
curl -s https://packages.wazuh.com/4.x/filebeat/wazuh-filebeat-0.5.tar.gz \
  | tar -xvz -C /usr/share/filebeat/module

# Template passend zur Zielversion laden
TARGET_WAZUH_VERSION="$(apt-cache policy wazuh-manager | awk '/Candidate:/ {print $2}' | cut -d- -f1)"
curl -so /etc/filebeat/wazuh-template.json \
  "https://raw.githubusercontent.com/wazuh/wazuh/v${TARGET_WAZUH_VERSION}/extensions/elasticsearch/7.x/wazuh-template.json"
chmod go+r /etc/filebeat/wazuh-template.json

# Filebeat upgraden (Config sichern/restore)
cp /etc/filebeat/filebeat.yml /etc/filebeat/filebeat.yml.old
apt-get install -y filebeat
cp /etc/filebeat/filebeat.yml.old /etc/filebeat/filebeat.yml

systemctl daemon-reload
systemctl enable filebeat
systemctl start filebeat
systemctl --no-pager -l status filebeat

# Pipelines/Index-Management laden
filebeat setup --pipelines
filebeat setup --index-management -E output.logstash.enabled=false
```

**Triage:**
```bash
journalctl -u filebeat -n 300 --no-pager
```

---

## 8) Dashboard Upgrade (Guide)

```bash
set -euo pipefail
cp /etc/wazuh-dashboard/opensearch_dashboards.yml /etc/wazuh-dashboard/opensearch_dashboards.yml.old

apt-get install -y wazuh-dashboard

systemctl daemon-reload
systemctl enable wazuh-dashboard
systemctl start wazuh-dashboard
systemctl --no-pager -l status wazuh-dashboard
```

**Plugins (falls manuell installiert):**
```bash
sudo -u wazuh-dashboard /usr/share/wazuh-dashboard/bin/opensearch-dashboards-plugin list
```

---

## 9) Abschluss (Guide) – Versionen + Post-Health Snapshot

```bash
apt list --installed wazuh-indexer
apt list --installed wazuh-manager
apt list --installed wazuh-dashboard

# Danach Runbook 0 erneut ausführen
```

**Abnahmekriterien (Minimum):**
- Dashboard erreichbar (HTTPS) + Login möglich
- Datenfluss plausibel (neue Events / verifiziertes Testevent)
- Keine kritischen Errors in Journals
- Ticket vollständig dokumentiert (Pre-/Post-Snapshot, Versionen, Zeiten, Findings)

---

## 10) Rollback (Standard)

**Standard:** Snapshot Restore  
**Alternative (nur wenn Snapshot nicht möglich):** Paket-Downgrade nach `apt-cache madison` (Risiko dokumentieren)

```bash
apt-cache madison wazuh-indexer
apt-cache madison wazuh-manager
apt-cache madison wazuh-dashboard
```
