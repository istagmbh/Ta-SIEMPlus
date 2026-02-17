# Managed SIEM (Wazuh) – Runbook Upgrade Central Components (Ubuntu AIO, APT)

**Dokumenttyp:** SOP / Runbook  
**Geltungsbereich:** Wazuh All-in-One auf Ubuntu (APT): Indexer, Manager, Dashboard, Filebeat  
**Ziel:** Reproduzierbar, auditierbar, operator-freundlich (Gates + klare Reihenfolge)  
**Version:** 1.3  
**Letzte Aktualisierung:** Januar 2026  
**Änderungen:** Nur via Pull Request (Review required)

## Zweck und Anwendungsbereich

Dieses Runbook beschreibt den vollständigen Upgrade-Prozess für Wazuh Central Components auf einer Ubuntu All-in-One Installation mit umfassenden Validierungs- und Rollback-Verfahren.

**Wann zu verwenden:**
- Upgrade von Wazuh Indexer, Manager, Dashboard und Filebeat
- Für Ubuntu-basierte APT-Installationen
- Bei geplanten Wartungsfenstern (nicht für Notfall-Patches)
- Sowohl für Minor- als auch Major-Version-Upgrades

**Wichtige Hinweise:**
- Dieses Runbook ist auf den offiziellen Wazuh Upgrade Guide abgestimmt
- Alle Schritte sind in der vorgegebenen Reihenfolge auszuführen
- Abweichungen vom Guide müssen dokumentiert werden
- Verwenden Sie die zugehörige Checkliste für die Ticket-Dokumentation
- Planen Sie ausreichend Zeit ein (typisch 1-2 Stunden für kleinere Upgrades)

## Verbindliche Referenz (Guide)
- https://documentation.wazuh.com/current/upgrade-guide/upgrading-central-components.html
- Offizielle Wazuh Dokumentation: https://documentation.wazuh.com/

## Zugehörige Checkliste
- `../checklists/CHECKLIST_WAZUH_UPGRADE_AIO.md`

## Voraussetzungen

Vor Beginn des Upgrades müssen folgende Voraussetzungen erfüllt sein:

### Technische Voraussetzungen
- Root- oder sudo-Zugriff auf den Wazuh AIO Server
- Aktive Internetverbindung für Paket-Downloads
- Ausreichend Speicherplatz (mindestens 20% frei auf allen relevanten Partitionen)
- Gültige Backup/Snapshot-Lösung verfügbar
- Zugriff auf das Wazuh Dashboard und API für Validierung

### Organisatorische Voraussetzungen
- Genehmigtes Change-Ticket/Change Request
- Kommunikation an betroffene Stakeholder/Kunden
- Definiertes Wartungsfenster mit ausreichend Zeitpuffer
- Dokumentierte Rollback-Strategie
- Notfallkontakte verfügbar

### Wissensbasis
- Grundlegendes Verständnis von Wazuh-Architektur
- Erfahrung mit Linux-Systemadministration (systemd, APT)
- Kenntnisse über Elasticsearch/OpenSearch-Konzepte (Shards, Cluster-Health)
- Zugang zur Wazuh-Dokumentation

### Validierung der Voraussetzungen

Führen Sie folgende Checks durch, bevor Sie mit dem Upgrade beginnen:

```bash
# System-Ressourcen prüfen
df -h | egrep -v 'tmpfs|devtmpfs'  # Disk < 85% belegt
free -h                             # RAM-Verfügbarkeit
uptime                              # System-Stabilität

# Netzwerk-Konnektivität prüfen
ping -c 3 packages.wazuh.com
ping -c 3 raw.githubusercontent.com

# Aktuelle Services-Status prüfen
systemctl status wazuh-indexer wazuh-manager wazuh-dashboard filebeat

# Aktuelle Versionen dokumentieren
dpkg -l | egrep 'wazuh-(indexer|manager|dashboard)|filebeat'
```

**No-Go Kriterien:**
- Disk-Belegung > 90%
- Services nicht alle im Status "active (running)"
- Keine Internetverbindung zu Wazuh Repositories
- Cluster-Health = RED (falls Multi-Node)

---

## 0) Nicht verhandelbare Regeln (Upgrade)

1. **Komponenten-Versionen müssen identisch sein (inkl. Patchlevel):**
   - `wazuh-indexer`, `wazuh-manager`, `wazuh-dashboard`
2. **Manager-Version ≥ Agent-Version** (Agents können älter sein, aber nicht neuer)
3. **Ohne Snapshot/Backup kein produktives Upgrade** (Ausnahme: dokumentiertes Dev/Test-System)
4. **Upgrade gemäß Guide inkl. Pre-/Post-Actions** (Shard allocation, Flush, Security re-apply, etc.)
5. **Keine Default-Credentials in Produktion** (Indexer API Calls müssen die realen Credentials verwenden)
6. **Dokumentationspflicht:** Pre- und Post-Health Snapshots im Change-Ticket erforderlich

---

## 1) Runbook 0 – Health Snapshot (immer VOR und NACH Wartung)

> Zweck: in < 5 Minuten einen auditierbaren Zustand erzeugen (copy/paste ins Ticket).
> **WICHTIG:** Führen Sie diesen Check sowohl VOR als auch NACH dem Upgrade aus!

```bash
set -euo pipefail

echo "=== HEALTH SNAPSHOT START ==="
echo "Timestamp: $(date -Is)"
echo "Operator: ${USER}"

echo ""
echo "=== DATE/UPTIME ==="
date -Is
uptime

echo ""
echo "=== DISK/MEM ==="
df -h | egrep -v 'tmpfs|devtmpfs'
echo ""
free -h

echo ""
echo "=== SERVICES STATUS ==="
systemctl --no-pager -l status wazuh-indexer wazuh-manager wazuh-dashboard filebeat || true

echo ""
echo "=== PORTS (sanity check) ==="
ss -lntp | egrep '(:1514|:1515|:55000|:9200|:5601)\s' || echo "WARN: Not all expected ports listening"

echo ""
echo "=== INSTALLED PACKAGES ==="
dpkg -l | egrep 'wazuh-(indexer|manager|dashboard|agent)|filebeat' || true

echo ""
echo "=== INDEXER CLUSTER HEALTH (if accessible) ==="
curl -sk -u admin:admin https://127.0.0.1:9200/_cluster/health?pretty 2>/dev/null || echo "INFO: Indexer not accessible or stopped"

echo ""
echo "=== INDEXER NODES (if accessible) ==="
curl -sk -u admin:admin https://127.0.0.1:9200/_cat/nodes?v 2>/dev/null || echo "INFO: Indexer not accessible or stopped"

echo ""
echo "=== RECENT ERRORS (last 50 lines per service) ==="
echo "--- wazuh-indexer ---"
journalctl -u wazuh-indexer -n 50 --no-pager -p err || true
echo "--- wazuh-manager ---"
journalctl -u wazuh-manager -n 50 --no-pager -p err || true
echo "--- wazuh-dashboard ---"
journalctl -u wazuh-dashboard -n 50 --no-pager -p err || true
echo "--- filebeat ---"
journalctl -u filebeat -n 50 --no-pager -p err || true

echo ""
echo "=== HEALTH SNAPSHOT END ==="
```

**Post-Execution:**
- Kopieren Sie die gesamte Ausgabe in Ihr Change-Ticket
- Markieren Sie ob Pre- oder Post-Upgrade
- Bei Post-Upgrade: Vergleichen Sie mit Pre-Upgrade Snapshot

---

## 2) Upgrade Ablauf (Central Components, AIO)

### 2.1 Zielversion prüfen und dokumentieren

**No-Go wenn Versionen nicht identisch sind!**

```bash
set -euo pipefail
apt-get update

echo "=== Candidate versions ==="
INDEXER_VER=$(apt-cache policy wazuh-indexer | awk '/Candidate:/ {print $2}')
MANAGER_VER=$(apt-cache policy wazuh-manager | awk '/Candidate:/ {print $2}')
DASHBOARD_VER=$(apt-cache policy wazuh-dashboard | awk '/Candidate:/ {print $2}')
FILEBEAT_VER=$(apt-cache policy filebeat | awk '/Candidate:/ {print $2}')

echo "wazuh-indexer: $INDEXER_VER"
echo "wazuh-manager: $MANAGER_VER"
echo "wazuh-dashboard: $DASHBOARD_VER"
echo "filebeat: $FILEBEAT_VER"

# Versions-Konsistenz prüfen
if [ "$INDEXER_VER" != "$MANAGER_VER" ] || [ "$INDEXER_VER" != "$DASHBOARD_VER" ]; then
    echo ""
    echo "ERROR: Wazuh component versions are NOT identical!"
    echo "STOP: Do NOT proceed with upgrade until versions match."
    exit 1
fi

echo ""
echo "OK: Wazuh component versions are identical: $INDEXER_VER"
echo "Target upgrade version: $INDEXER_VER"
```

**Dokumentieren Sie die Zielversion in Ihrem Change-Ticket!**

---

### 2.2 Backup / Snapshot (Pflicht für Produktion)

**Standard-Methode:** VM-/Volume-Snapshot (empfohlen vor Dienste-Stop)  
**Zusätzlich empfohlen:** Konfigurations-Backup für schnelle Wiederherstellung

```bash
set -euo pipefail
BACKUP_DIR="/root/wazuh_backup_$(date +%F_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "Creating configuration backup in $BACKUP_DIR"

# Kritische Konfigurationsdateien sichern
tar -czf "$BACKUP_DIR/var_ossec_etc.tgz" /var/ossec/etc 2>/dev/null || echo "WARN: Failed to backup /var/ossec/etc"
tar -czf "$BACKUP_DIR/wazuh_indexer_etc.tgz" /etc/wazuh-indexer 2>/dev/null || echo "WARN: Failed to backup /etc/wazuh-indexer"
tar -czf "$BACKUP_DIR/wazuh_dashboard_etc.tgz" /etc/wazuh-dashboard 2>/dev/null || echo "WARN: Failed to backup /etc/wazuh-dashboard"
tar -czf "$BACKUP_DIR/filebeat_etc.tgz" /etc/filebeat 2>/dev/null || echo "WARN: Failed to backup /etc/filebeat"

# Zusätzliche wichtige Dateien
cp /etc/wazuh-indexer/jvm.options "$BACKUP_DIR/indexer_jvm.options.backup" 2>/dev/null || true
cp /etc/filebeat/filebeat.yml "$BACKUP_DIR/filebeat.yml.backup" 2>/dev/null || true
cp /etc/wazuh-dashboard/opensearch_dashboards.yml "$BACKUP_DIR/opensearch_dashboards.yml.backup" 2>/dev/null || true

# Backup-Inventar erstellen
echo "Backup created at: $(date -Is)" > "$BACKUP_DIR/backup_info.txt"
echo "Hostname: $(hostname)" >> "$BACKUP_DIR/backup_info.txt"
echo "Packages before upgrade:" >> "$BACKUP_DIR/backup_info.txt"
dpkg -l | egrep 'wazuh-(indexer|manager|dashboard)|filebeat' >> "$BACKUP_DIR/backup_info.txt"

echo ""
echo "Backup completed successfully!"
echo "Backup location: $BACKUP_DIR"
ls -lah "$BACKUP_DIR"

# Backup-Pfad für Rollback dokumentieren
echo ""
echo "IMPORTANT: Document this backup path in your change ticket!"
echo "Backup path: $BACKUP_DIR"
```

**Validierung:**
```bash
# Prüfen Sie, dass alle wichtigen Backups erstellt wurden
ls -lh "$BACKUP_DIR"
# Mindestens 4 .tgz Dateien sollten vorhanden sein
```

**Für VM-Snapshot (empfohlen):**
- Erstellen Sie vor dem nächsten Schritt einen VM-Snapshot über Ihre Virtualisierungsplattform
- Dokumentieren Sie die Snapshot-ID im Change-Ticket
- Snapshot sollte erstellt werden, während Services noch laufen (konsistenter Zustand)

---

### 2.3 Controlled Stop (Guide-Minimum)

**Zweck:** Dienste in korrekter Reihenfolge stoppen, um Datenverlust zu vermeiden

```bash
set -euo pipefail

echo "Stopping services in correct order..."

# Filebeat zuerst stoppen (verhindert neue Events an Indexer)
echo "Stopping filebeat..."
systemctl stop filebeat
systemctl status filebeat --no-pager || true

# Dashboard stoppen (UI wird nicht mehr erreichbar sein)
echo "Stopping wazuh-dashboard..."
systemctl stop wazuh-dashboard
systemctl status wazuh-dashboard --no-pager || true

echo ""
echo "Services stopped successfully."
echo "IMPORTANT: Manager and Indexer are still running for pre-upgrade actions."
```

**Erwartetes Ergebnis:**
- filebeat: inactive (dead)
- wazuh-dashboard: inactive (dead)
- wazuh-manager: active (running) - wird später gestoppt
- wazuh-indexer: active (running) - wird später gestoppt

---

## 3) Indexer Pre-Actions (Guide)

> **Wichtig:** Credentials/PKI je Umgebung anpassen. **KEINE Default-Credentials in Produktion verwenden!**
> **Hinweis:** Ersetzen Sie `admin:admin` mit den tatsächlichen Indexer-Credentials aus Ihrem Secret-Store.

### 3.1 Security Config Backup (Indexer)

```bash
set -euo pipefail

echo "Backing up Indexer security configuration..."
/usr/share/wazuh-indexer/bin/indexer-security-init.sh --options "-backup /etc/wazuh-indexer/opensearch-security -icl -nhnv"

# Validierung
if [ -d "/etc/wazuh-indexer/opensearch-security" ]; then
    echo "Security config backup created successfully"
    ls -lah /etc/wazuh-indexer/opensearch-security/
else
    echo "ERROR: Security config backup failed!"
    exit 1
fi
```

---

### 3.2 Shard Allocation auf `primaries` setzen

**Zweck:** Verhindert Shard-Reallocation während des Upgrades (spart Netzwerk-Traffic und Zeit)

```bash
set -euo pipefail

# WICHTIG: Ersetzen Sie admin:admin mit Ihren echten Credentials!
INDEXER_USER="admin"
INDEXER_PASS="admin"  # CHANGE THIS!

echo "Setting shard allocation to primaries..."
RESPONSE=$(curl -X PUT "https://127.0.0.1:9200/_cluster/settings" \
  -u "$INDEXER_USER:$INDEXER_PASS" -k \
  -H 'Content-Type: application/json' -d'
{
  "persistent": { "cluster.routing.allocation.enable": "primaries" }
}
' 2>/dev/null)

echo "Response: $RESPONSE"

# Validierung
CURRENT_SETTING=$(curl -s -u "$INDEXER_USER:$INDEXER_PASS" -k \
  "https://127.0.0.1:9200/_cluster/settings?include_defaults=true&filter_path=**.cluster.routing.allocation.enable" 2>/dev/null)
echo "Current allocation setting: $CURRENT_SETTING"
```

**Erwartetes Ergebnis:** 
- Response sollte `{"acknowledged":true}` enthalten
- Shard allocation ist jetzt auf "primaries" gesetzt

---

### 3.3 Flush ausführen

**Zweck:** Stellt sicher, dass alle Daten aus dem Memory auf Disk geschrieben werden

```bash
set -euo pipefail

# WICHTIG: Ersetzen Sie admin:admin mit Ihren echten Credentials!
INDEXER_USER="admin"
INDEXER_PASS="admin"  # CHANGE THIS!

echo "Flushing all indices..."
RESPONSE=$(curl -X POST "https://127.0.0.1:9200/_flush" \
  -u "$INDEXER_USER:$INDEXER_PASS" -k 2>/dev/null)

echo "Flush response: $RESPONSE"

# Zusätzlich: Synced Flush für bessere Konsistenz
echo "Performing synced flush..."
curl -X POST "https://127.0.0.1:9200/_flush/synced" \
  -u "$INDEXER_USER:$INDEXER_PASS" -k 2>/dev/null || echo "INFO: Synced flush partially failed (acceptable)"
```

**Erwartetes Ergebnis:**
- Flush sollte erfolgreich sein
- Synced flush kann teilweise fehlschlagen (ist akzeptabel)

---

### 3.4 Manager stoppen (insb. single-node Indexer Cluster)

**Zweck:** Verhindert neue Daten während Indexer-Upgrade

```bash
set -euo pipefail

echo "Stopping wazuh-manager..."
systemctl stop wazuh-manager

# Validierung
sleep 2
systemctl status wazuh-manager --no-pager || true

# Prüfen, ob Manager-Prozesse wirklich gestoppt sind
MANAGER_PROCS=$(pgrep -f wazuh-manager || true)
if [ -z "$MANAGER_PROCS" ]; then
    echo "OK: wazuh-manager stopped successfully"
else
    echo "WARN: Manager processes still running: $MANAGER_PROCS"
    echo "Waiting additional 5 seconds..."
    sleep 5
fi
```

**Erwartetes Ergebnis:**
- wazuh-manager: inactive (dead)
- Keine wazuh-manager Prozesse mehr vorhanden

---

## 4) Indexer Upgrade (Guide)

```bash
set -euo pipefail

echo "=== Indexer Upgrade Start ==="

# Indexer stoppen
echo "Stopping wazuh-indexer..."
systemctl stop wazuh-indexer
sleep 3

# Status validieren
systemctl status wazuh-indexer --no-pager || true

# JVM Settings sichern (für Vergleich und Rollback)
echo "Backing up JVM settings..."
cp /etc/wazuh-indexer/jvm.options /etc/wazuh-indexer/jvm.options.pre-upgrade

# Aktuelle Version dokumentieren
echo "Current version before upgrade:"
dpkg -l | grep wazuh-indexer

# Upgrade durchführen
echo "Installing wazuh-indexer upgrade..."
apt-get install -y wazuh-indexer

# Neue Version dokumentieren
echo "New version after upgrade:"
dpkg -l | grep wazuh-indexer

# JVM Settings vergleichen (manuell prüfen ob Anpassungen übernommen wurden)
echo "Comparing JVM settings (old vs new)..."
if diff /etc/wazuh-indexer/jvm.options.pre-upgrade /etc/wazuh-indexer/jvm.options; then
    echo "INFO: JVM settings unchanged"
else
    echo "WARN: JVM settings have changed - review if custom settings need to be reapplied"
    echo "See: /etc/wazuh-indexer/jvm.options.pre-upgrade for old settings"
fi

# Service neu laden und starten
echo "Reloading systemd and starting wazuh-indexer..."
systemctl daemon-reload
systemctl enable wazuh-indexer
systemctl start wazuh-indexer

# Auf Startup warten
echo "Waiting for indexer to start (up to 60 seconds)..."
for i in {1..60}; do
    if systemctl is-active --quiet wazuh-indexer; then
        echo "Indexer started after $i seconds"
        break
    fi
    sleep 1
done

# Status prüfen
systemctl --no-pager -l status wazuh-indexer

echo "=== Indexer Upgrade Complete ==="
```

**Triage bei Start-Fehlern:**
```bash
# Detaillierte Logs anzeigen
journalctl -u wazuh-indexer -n 300 --no-pager

# Indexer-spezifische Logs
ls -lah /var/log/wazuh-indexer/
tail -n 100 /var/log/wazuh-indexer/wazuh-cluster.log

# Häufige Probleme:
# - JVM heap size zu groß/klein
# - Fehlende Berechtigungen
# - Port bereits belegt
# - Disk voll
```

**Plugins Validierung:**
```bash
# Installierte Plugins auflisten
/usr/share/wazuh-indexer/bin/opensearch-plugin list

# Erwartete Plugins sollten vorhanden sein
# Falls manuell installierte Plugins vorhanden waren, diese ggf. neu installieren
```

**Cluster-Health Check (vor Post-Actions):**
```bash
# WICHTIG: Credentials anpassen!
curl -k -u admin:admin https://127.0.0.1:9200/_cat/health?v

# Erwartetes Ergebnis: status = yellow (single node) oder green (multi-node)
# RED = kritisches Problem, nicht fortfahren!
```

---

## 5) Indexer Post-Actions (Guide)

**Zweck:** Security-Konfiguration reaktivieren und normale Cluster-Operationen wiederherstellen

### 5.1 Security erneut anwenden

```bash
set -euo pipefail

echo "Re-applying indexer security configuration..."
/usr/share/wazuh-indexer/bin/indexer-security-init.sh

# Validierung: Security-Zugriff testen
sleep 5
echo "Testing indexer access..."
# WICHTIG: Credentials anpassen!
curl -sk -u admin:admin https://127.0.0.1:9200/ | head -20

if [ $? -eq 0 ]; then
    echo "OK: Indexer security applied successfully"
else
    echo "ERROR: Cannot access indexer after security init!"
    exit 1
fi
```

---

### 5.2 Nodes und Cluster-Status prüfen

```bash
set -euo pipefail

# WICHTIG: Credentials anpassen!
INDEXER_USER="admin"
INDEXER_PASS="admin"  # CHANGE THIS!

echo "=== Cluster Health ==="
curl -k -u "$INDEXER_USER:$INDEXER_PASS" https://127.0.0.1:9200/_cat/health?v

echo ""
echo "=== Nodes List ==="
curl -k -u "$INDEXER_USER:$INDEXER_PASS" https://127.0.0.1:9200/_cat/nodes?v

echo ""
echo "=== Indices Overview ==="
curl -k -u "$INDEXER_USER:$INDEXER_PASS" https://127.0.0.1:9200/_cat/indices?v | head -20
```

**Erwartetes Ergebnis:**
- Cluster status: green (multi-node) oder yellow (single-node AIO - akzeptabel)
- Node sollte in der Liste erscheinen
- Indices sollten sichtbar sein

**No-Go Kriterium:**
- Cluster status: RED → Upgrade abbrechen und Rollback durchführen!

---

### 5.3 Shard Allocation wieder aktivieren

**Zweck:** Normale Shard-Operationen wiederherstellen

```bash
set -euo pipefail

# WICHTIG: Credentials anpassen!
INDEXER_USER="admin"
INDEXER_PASS="admin"  # CHANGE THIS!

echo "Restoring shard allocation to 'all'..."
RESPONSE=$(curl -X PUT "https://127.0.0.1:9200/_cluster/settings" \
  -u "$INDEXER_USER:$INDEXER_PASS" -k \
  -H 'Content-Type: application/json' -d'
{
  "persistent": { "cluster.routing.allocation.enable": "all" }
}
' 2>/dev/null)

echo "Response: $RESPONSE"

# Validierung
echo "Verifying shard allocation setting..."
CURRENT_SETTING=$(curl -s -u "$INDEXER_USER:$INDEXER_PASS" -k \
  "https://127.0.0.1:9200/_cluster/settings?include_defaults=true&filter_path=**.cluster.routing.allocation.enable" 2>/dev/null)
echo "Current allocation setting: $CURRENT_SETTING"

# Kurz warten und erneut Cluster-Health prüfen
sleep 5
echo ""
echo "=== Cluster Health After Allocation Restore ==="
curl -k -u "$INDEXER_USER:$INDEXER_PASS" https://127.0.0.1:9200/_cat/health?v
```

**Erwartetes Ergebnis:**
- Shard allocation = "all"
- Cluster sollte stabil bleiben (yellow oder green)

---

## 6) Manager Upgrade (Guide)

```bash
set -euo pipefail

echo "=== Manager Upgrade Start ==="

# Aktuelle Version dokumentieren
echo "Current version before upgrade:"
dpkg -l | grep wazuh-manager

# Upgrade durchführen
echo "Installing wazuh-manager upgrade..."
apt-get install -y wazuh-manager

# Neue Version dokumentieren
echo "New version after upgrade:"
dpkg -l | grep wazuh-manager

# Service neu laden und starten
echo "Reloading systemd and starting wazuh-manager..."
systemctl daemon-reload
systemctl enable wazuh-manager
systemctl start wazuh-manager

# Auf Startup warten
echo "Waiting for manager to start (up to 30 seconds)..."
for i in {1..30}; do
    if systemctl is-active --quiet wazuh-manager; then
        echo "Manager started after $i seconds"
        break
    fi
    sleep 1
done

# Status prüfen
systemctl --no-pager -l status wazuh-manager

echo "=== Manager Upgrade Complete ==="
```

**Triage bei Problemen:**
```bash
# Systemd Journal
journalctl -u wazuh-manager -n 300 --no-pager

# Wazuh-spezifische Logs
tail -n 200 /var/ossec/logs/ossec.log

# Manager-Prozesse prüfen
ps aux | grep wazuh

# Häufige Probleme:
# - Konfigurationsfehler in ossec.conf
# - Fehlende Berechtigungen auf /var/ossec
# - Indexer nicht erreichbar (wird Manager starten aber warnings loggen)
```

**Validierung:**
```bash
# Manager-Version prüfen
/var/ossec/bin/wazuh-control info

# API-Status prüfen (falls konfiguriert)
curl -k https://127.0.0.1:55000/ || echo "INFO: API not yet accessible"

# Active Agents prüfen (sollte nach einigen Minuten wieder Agents zeigen)
/var/ossec/bin/agent_control -l 2>/dev/null || echo "INFO: Waiting for agents to reconnect"
```

---

## 7) Filebeat Update/Setup (Guide)

> Ziel: Wazuh Module + Template + Pipelines/Index-Management auf Zielversion aktualisieren.

```bash
set -euo pipefail

echo "=== Filebeat Update Start ==="

# Zielversion ermitteln
TARGET_WAZUH_VERSION="$(apt-cache policy wazuh-manager | awk '/Installed:/ {print $2}' | cut -d- -f1)"
echo "Target Wazuh version for Filebeat module: $TARGET_WAZUH_VERSION"

# Wazuh Filebeat Module installieren/aktualisieren
echo "Downloading and installing Wazuh Filebeat module..."
curl -s https://packages.wazuh.com/4.x/filebeat/wazuh-filebeat-0.5.tar.gz \
  | tar -xvz -C /usr/share/filebeat/module

# Validate module installation
if [ -d "/usr/share/filebeat/module/wazuh" ]; then
    echo "OK: Wazuh Filebeat module installed"
    ls -lah /usr/share/filebeat/module/wazuh/
else
    echo "ERROR: Failed to install Wazuh Filebeat module!"
    exit 1
fi

# Template passend zur Zielversion laden
echo "Downloading Wazuh template for version $TARGET_WAZUH_VERSION..."
curl -so /etc/filebeat/wazuh-template.json \
  "https://raw.githubusercontent.com/wazuh/wazuh/v${TARGET_WAZUH_VERSION}/extensions/elasticsearch/7.x/wazuh-template.json"

# Validate template download
if [ -f "/etc/filebeat/wazuh-template.json" ]; then
    chmod go+r /etc/filebeat/wazuh-template.json
    echo "OK: Wazuh template downloaded"
    ls -lh /etc/filebeat/wazuh-template.json
else
    echo "WARN: Failed to download Wazuh template - proceeding with existing template"
fi

# Filebeat Config sichern
echo "Backing up Filebeat configuration..."
cp /etc/filebeat/filebeat.yml /etc/filebeat/filebeat.yml.pre-upgrade

# Aktuelle Version dokumentieren
echo "Current Filebeat version:"
dpkg -l | grep filebeat

# Filebeat upgraden
echo "Installing Filebeat upgrade..."
apt-get install -y filebeat

# Config wiederherstellen (apt könnte sie überschrieben haben)
echo "Restoring Filebeat configuration..."
cp /etc/filebeat/filebeat.yml.pre-upgrade /etc/filebeat/filebeat.yml

# Neue Version dokumentieren
echo "New Filebeat version:"
dpkg -l | grep filebeat

# Service neu laden und starten
echo "Reloading systemd and starting filebeat..."
systemctl daemon-reload
systemctl enable filebeat
systemctl start filebeat

# Auf Startup warten
sleep 5
systemctl --no-pager -l status filebeat

# Pipelines laden
echo "Loading Filebeat pipelines..."
filebeat setup --pipelines

# Index-Management laden
echo "Loading Filebeat index management..."
filebeat setup --index-management -E output.logstash.enabled=false

echo "=== Filebeat Update Complete ==="
```

**Triage bei Problemen:**
```bash
# Filebeat Logs
journalctl -u filebeat -n 300 --no-pager

# Filebeat Test Config
filebeat test config -e

# Filebeat Test Output
filebeat test output -e

# Häufige Probleme:
# - Indexer nicht erreichbar
# - Falsche Credentials in filebeat.yml
# - Template-Upload fehlgeschlagen
# - Pipeline-Setup Fehler
```

**Validierung:**
```bash
# Filebeat Status
systemctl status filebeat

# Prüfen ob Events ankommen (nach ein paar Minuten)
# WICHTIG: Credentials anpassen!
curl -sk -u admin:admin 'https://127.0.0.1:9200/wazuh-alerts-*/_search?size=1&sort=@timestamp:desc' | head -50

# Erwartetes Ergebnis: Aktuelle Events sollten sichtbar sein
```

---

## 8) Dashboard Upgrade (Guide)

```bash
set -euo pipefail

echo "=== Dashboard Upgrade Start ==="

# Dashboard Config sichern
echo "Backing up Dashboard configuration..."
cp /etc/wazuh-dashboard/opensearch_dashboards.yml /etc/wazuh-dashboard/opensearch_dashboards.yml.pre-upgrade

# Aktuelle Version dokumentieren
echo "Current Dashboard version:"
dpkg -l | grep wazuh-dashboard

# Upgrade durchführen
echo "Installing wazuh-dashboard upgrade..."
apt-get install -y wazuh-dashboard

# Neue Version dokumentieren
echo "New Dashboard version:"
dpkg -l | grep wazuh-dashboard

# Config vergleichen (prüfen ob Anpassungen nötig sind)
echo "Comparing Dashboard configuration (old vs new)..."
if diff /etc/wazuh-dashboard/opensearch_dashboards.yml.pre-upgrade /etc/wazuh-dashboard/opensearch_dashboards.yml; then
    echo "INFO: Dashboard config unchanged"
else
    echo "WARN: Dashboard config has changed - review if custom settings need to be reapplied"
    echo "See: /etc/wazuh-dashboard/opensearch_dashboards.yml.pre-upgrade for old settings"
fi

# Service neu laden und starten
echo "Reloading systemd and starting wazuh-dashboard..."
systemctl daemon-reload
systemctl enable wazuh-dashboard
systemctl start wazuh-dashboard

# Auf Startup warten (Dashboard kann länger brauchen)
echo "Waiting for dashboard to start (up to 60 seconds)..."
for i in {1..60}; do
    if systemctl is-active --quiet wazuh-dashboard; then
        echo "Dashboard started after $i seconds"
        break
    fi
    sleep 1
done

# Status prüfen
systemctl --no-pager -l status wazuh-dashboard

echo "=== Dashboard Upgrade Complete ==="
```

**Plugins Validierung (falls manuell installiert):**
```bash
# Installierte Plugins auflisten
sudo -u wazuh-dashboard /usr/share/wazuh-dashboard/bin/opensearch-dashboards-plugin list

# Falls manuell installierte Plugins vorhanden waren:
# Diese müssen möglicherweise neu installiert werden, kompatibel zur neuen Version
```

**Dashboard Erreichbarkeit testen:**
```bash
# Port-Check
ss -lntp | grep :5601

# HTTP-Zugriff testen (sollte zu Login-Seite umleiten)
curl -I http://127.0.0.1:5601 2>&1 | head -10

# HTTPS-Zugriff testen (falls konfiguriert)
curl -k -I https://127.0.0.1:5601 2>&1 | head -10
```

**Triage bei Problemen:**
```bash
# Dashboard Logs
journalctl -u wazuh-dashboard -n 300 --no-pager

# Dashboard-spezifische Logs
ls -lah /var/log/wazuh-dashboard/
tail -n 100 /var/log/wazuh-dashboard/opensearch_dashboards.log

# Häufige Probleme:
# - Indexer nicht erreichbar
# - Port 5601 bereits belegt
# - Fehlende Berechtigungen
# - Config-Fehler in opensearch_dashboards.yml
```

---

## 9) Post-Upgrade Validierung und Abnahme

### 9.1 Versionen verifizieren

**Zweck:** Sicherstellen, dass alle Komponenten erfolgreich aktualisiert wurden

```bash
set -euo pipefail

echo "=== Installed Versions After Upgrade ==="
echo ""
echo "Wazuh Indexer:"
apt list --installed wazuh-indexer 2>/dev/null | grep wazuh-indexer

echo ""
echo "Wazuh Manager:"
apt list --installed wazuh-manager 2>/dev/null | grep wazuh-manager
/var/ossec/bin/wazuh-control info 2>/dev/null || true

echo ""
echo "Wazuh Dashboard:"
apt list --installed wazuh-dashboard 2>/dev/null | grep wazuh-dashboard

echo ""
echo "Filebeat:"
apt list --installed filebeat 2>/dev/null | grep filebeat

echo ""
echo "=== Version Consistency Check ==="
INDEXER_VER=$(dpkg -l | awk '/wazuh-indexer/ {print $3}')
MANAGER_VER=$(dpkg -l | awk '/wazuh-manager/ {print $3}')
DASHBOARD_VER=$(dpkg -l | awk '/wazuh-dashboard/ {print $3}')

if [ "$INDEXER_VER" = "$MANAGER_VER" ] && [ "$INDEXER_VER" = "$DASHBOARD_VER" ]; then
    echo "OK: All Wazuh components are on the same version: $INDEXER_VER"
else
    echo "ERROR: Version mismatch detected!"
    echo "Indexer: $INDEXER_VER"
    echo "Manager: $MANAGER_VER"
    echo "Dashboard: $DASHBOARD_VER"
fi
```

---

### 9.2 Services Health Check

**Zweck:** Alle Services müssen aktiv und fehlerfrei laufen

```bash
set -euo pipefail

echo "=== Services Status Check ==="
echo ""

# Funktion für Service-Check mit Exit-Code
check_service() {
    SERVICE=$1
    echo "Checking $SERVICE..."
    if systemctl is-active --quiet $SERVICE; then
        echo "✓ $SERVICE is active"
        return 0
    else
        echo "✗ $SERVICE is NOT active!"
        systemctl status $SERVICE --no-pager || true
        return 1
    fi
}

# Alle Services prüfen
FAILED=0
check_service wazuh-indexer || FAILED=1
check_service wazuh-manager || FAILED=1
check_service wazuh-dashboard || FAILED=1
check_service filebeat || FAILED=1

echo ""
if [ $FAILED -eq 0 ]; then
    echo "OK: All services are running"
else
    echo "ERROR: One or more services are not running!"
    exit 1
fi

# Ports-Check
echo ""
echo "=== Ports Listening Check ==="
ss -lntp | egrep '(:1514|:1515|:55000|:9200|:5601)\s'

REQUIRED_PORTS=("1514" "1515" "55000" "9200" "5601")
for PORT in "${REQUIRED_PORTS[@]}"; do
    if ss -lntp | grep -q ":$PORT "; then
        echo "✓ Port $PORT is listening"
    else
        echo "✗ Port $PORT is NOT listening!"
        FAILED=1
    fi
done
```

---

### 9.3 Funktionale Validierung

**Zweck:** Sicherstellen, dass alle Komponenten funktional arbeiten

```bash
set -euo pipefail

# WICHTIG: Credentials anpassen!
INDEXER_USER="admin"
INDEXER_PASS="admin"  # CHANGE THIS!

echo "=== Functional Validation ==="
echo ""

# 1. Indexer Cluster Health
echo "1. Indexer Cluster Health:"
CLUSTER_HEALTH=$(curl -sk -u "$INDEXER_USER:$INDEXER_PASS" \
  'https://127.0.0.1:9200/_cluster/health' | grep -o '"status":"[^"]*"')
echo "$CLUSTER_HEALTH"

if echo "$CLUSTER_HEALTH" | grep -q "green\|yellow"; then
    echo "✓ Cluster health is acceptable"
else
    echo "✗ Cluster health is RED or unavailable!"
    exit 1
fi

# 2. Indices prüfen
echo ""
echo "2. Active Indices:"
curl -sk -u "$INDEXER_USER:$INDEXER_PASS" \
  'https://127.0.0.1:9200/_cat/indices?v' | head -10

# 3. Neueste Events prüfen
echo ""
echo "3. Recent Events (last 5 minutes):"
RECENT_EVENTS=$(curl -sk -u "$INDEXER_USER:$INDEXER_PASS" \
  'https://127.0.0.1:9200/wazuh-alerts-*/_count?q=timestamp:[now-5m TO now]' 2>/dev/null)
echo "$RECENT_EVENTS"

if echo "$RECENT_EVENTS" | grep -q '"count":[0-9]'; then
    echo "✓ Events are being indexed"
else
    echo "⚠ No recent events found (may be normal if no activity)"
fi

# 4. Manager API Check (falls konfiguriert)
echo ""
echo "4. Wazuh Manager API:"
API_STATUS=$(curl -sk https://127.0.0.1:55000/ 2>&1)
if echo "$API_STATUS" | grep -q "Unauthorized\|wazuh"; then
    echo "✓ Manager API is responding"
else
    echo "⚠ Manager API not responding (check if configured)"
fi

# 5. Dashboard Zugriff
echo ""
echo "5. Dashboard Accessibility:"
DASHBOARD_STATUS=$(curl -I http://127.0.0.1:5601 2>&1 | head -1)
echo "$DASHBOARD_STATUS"
if echo "$DASHBOARD_STATUS" | grep -q "200\|302"; then
    echo "✓ Dashboard is accessible"
else
    echo "✗ Dashboard is not accessible!"
fi
```

---

### 9.4 Datenfluss-Test (Empfohlen)

**Zweck:** Verifizieren, dass neue Events verarbeitet werden

```bash
# Test-Event generieren (auf einem überwachten System)
echo "Creating test event..."
logger -t WAZUH_UPGRADE_TEST "Upgrade validation test event - $(date -Is)"

# Warten auf Event-Verarbeitung
echo "Waiting 60 seconds for event processing..."
sleep 60

# Test-Event im Indexer suchen
# WICHTIG: Credentials anpassen!
echo "Searching for test event..."
curl -sk -u admin:admin \
  'https://127.0.0.1:9200/wazuh-alerts-*/_search?q=WAZUH_UPGRADE_TEST&size=1' | grep -o '"_id":"[^"]*"' || echo "Test event not found (may need more time)"
```

---

### 9.5 Post-Health Snapshot ausführen

**Zweck:** Dokumentation des erfolgreichen Upgrade-Zustands

```bash
# Führen Sie Runbook 0 (Health Snapshot) erneut aus
# und fügen Sie die Ausgabe dem Change-Ticket hinzu

echo "EXECUTE RUNBOOK 0 (Section 1) NOW FOR POST-UPGRADE SNAPSHOT"
echo "Mark the output as 'POST-UPGRADE HEALTH SNAPSHOT' in your ticket"
```

---

### 9.6 Abnahmekriterien (Minimum für Produktions-Freigabe)

**Alle folgenden Kriterien MÜSSEN erfüllt sein:**

- [ ] Alle Wazuh-Komponenten haben identische Versionen (Indexer, Manager, Dashboard)
- [ ] Alle Services sind aktiv: `systemctl status wazuh-*` und `filebeat`
- [ ] Alle erforderlichen Ports hören: 1514, 1515, 55000, 9200, 5601
- [ ] Indexer Cluster-Health ist GREEN oder YELLOW (nicht RED)
- [ ] Dashboard ist über HTTPS erreichbar
- [ ] Dashboard-Login funktioniert (mit korrekten Credentials)
- [ ] Neue Events werden im Indexer gespeichert (Datenfluss funktioniert)
- [ ] Filebeat läuft ohne Fehler (check `journalctl -u filebeat`)
- [ ] Keine kritischen Fehler in journalctl-Logs (Indexer/Manager/Dashboard/Filebeat)
- [ ] Post-Health Snapshot wurde erstellt und im Ticket dokumentiert
- [ ] Test-Event wurde erfolgreich verarbeitet (optional aber empfohlen)

**Dokumentation im Change-Ticket:**
- Pre-Upgrade Health Snapshot (vollständig)
- Backup/Snapshot-ID dokumentiert
- Upgrade-Start und -Ende Zeitstempel
- Zielversion dokumentiert
- Post-Upgrade Health Snapshot (vollständig)
- Alle Abweichungen und Findings dokumentiert
- Abschlussmeldung an Kunde vorbereitet

---

## 10) Rollback-Verfahren

**Wann Rollback durchführen:**

Führen Sie einen Rollback durch, wenn:
- Indexer Cluster-Health = RED nach Upgrade
- Kritische Services starten nicht (nach mehreren Versuchen)
- Datenfluss ist dauerhaft unterbrochen
- Dashboard ist nicht erreichbar/nicht funktional
- Authentifizierung/Authorization fehlschlägt
- Performance-Degradation ist inakzeptabel
- Kritische Funktionalität ist verloren
- Upgrade-Zeitfenster wird überschritten ohne erfolgreichen Abschluss

**Rollback-Entscheidung:**
- Treffen Sie die Entscheidung schnell (innerhalb von 15-30 Minuten nach Problem-Erkennung)
- Dokumentieren Sie den Grund für Rollback im Change-Ticket
- Informieren Sie alle Stakeholder über Rollback-Entscheidung
- Planen Sie Post-Mortem und erneuten Upgrade-Versuch

---

### 10.1 Rollback-Methode 1: VM/Volume Snapshot Restore (EMPFOHLEN)

**Vorteile:**
- Schnellste Methode
- Garantiert konsistenter Zustand
- Kein Risiko durch Paket-Inkompatibilitäten
- Bewährte Methode

**Voraussetzungen:**
- VM- oder Volume-Snapshot wurde vor Upgrade erstellt
- Snapshot-ID ist dokumentiert

**Durchführung:**

```bash
# WICHTIG: Diese Schritte erfolgen auf Ihrer Virtualisierungs-/Storage-Plattform!

# 1. Aktuelle VM/Volume stoppen (über Hypervisor/Cloud-Console)
#    - VMware: VM herunterfahren
#    - Proxmox: VM stoppen
#    - AWS: Instance stoppen
#    - Azure: VM stoppen

# 2. Snapshot wiederherstellen (über Hypervisor/Cloud-Console)
#    - Wählen Sie den dokumentierten Pre-Upgrade Snapshot
#    - Führen Sie Restore durch
#    - Bei Volume-Snapshots: Volumes wiederherstellen und neu attachieren

# 3. VM/System starten

# 4. Nach dem Start: Services validieren
ssh user@wazuh-server

# Validierung nach Snapshot-Restore:
echo "=== Validation After Snapshot Restore ==="

# Versionen prüfen (sollten alte Versionen sein)
dpkg -l | egrep 'wazuh-(indexer|manager|dashboard)|filebeat'

# Services prüfen
systemctl status wazuh-indexer wazuh-manager wazuh-dashboard filebeat

# Health-Check durchführen
# Führen Sie Runbook 0 (Health Snapshot) aus

# Funktionalität bestätigen
curl -sk -u admin:admin https://127.0.0.1:9200/_cluster/health?pretty
curl -I http://127.0.0.1:5601
```

**Erwartetes Ergebnis:**
- System ist im Pre-Upgrade Zustand
- Alle Services laufen
- Alte Versionen sind installiert
- Funktionalität ist wiederhergestellt

**Dokumentation:**
- Rollback-Zeitstempel im Ticket
- Rollback-Methode dokumentieren
- Grund für Rollback dokumentieren
- Post-Rollback Health Snapshot erstellen

---

### 10.2 Rollback-Methode 2: Paket-Downgrade (NUR wenn Snapshot nicht verfügbar)

**⚠️ WICHTIG:** Diese Methode hat Risiken und sollte nur als letzte Option verwendet werden!

**Risiken:**
- Konfigurationsdateien könnten inkompatibel sein
- Datenbank-Schemas könnten geändert worden sein
- Plugins könnten inkompatibel sein
- Nicht garantiert funktionsfähig

**Voraussetzungen:**
- Alte Versionen sind noch im APT-Repository verfügbar
- Konfigurations-Backup wurde erstellt (Schritt 2.2)

**Durchführung:**

```bash
set -euo pipefail

echo "=== PAKET-DOWNGRADE ROLLBACK START ==="
echo "WARNING: This is a risky operation. VM snapshot restore is preferred!"
echo ""

# 1. Verfügbare Versionen ermitteln
echo "=== Available Package Versions ==="
apt-cache madison wazuh-indexer | head -5
apt-cache madison wazuh-manager | head -5
apt-cache madison wazuh-dashboard | head -5
apt-cache madison filebeat | head -5

# 2. Zielversion für Downgrade festlegen
# WICHTIG: Ersetzen Sie mit der tatsächlichen alten Version!
OLD_VERSION="4.7.0-1"  # BEISPIEL - ANPASSEN!

echo ""
echo "Downgrading to version: $OLD_VERSION"
read -p "Press Enter to continue or Ctrl+C to abort..."

# 3. Alle Services stoppen
echo "Stopping all services..."
systemctl stop filebeat
systemctl stop wazuh-dashboard
systemctl stop wazuh-manager
systemctl stop wazuh-indexer

# 4. Packages downgraden (in umgekehrter Upgrade-Reihenfolge)
echo "Downgrading packages..."

# Dashboard
apt-get install -y --allow-downgrades wazuh-dashboard=$OLD_VERSION || echo "WARN: Dashboard downgrade failed"

# Filebeat (behalten oder zu passender Version)
# apt-get install -y --allow-downgrades filebeat=FILEBEAT_VERSION

# Manager
apt-get install -y --allow-downgrades wazuh-manager=$OLD_VERSION || echo "WARN: Manager downgrade failed"

# Indexer
apt-get install -y --allow-downgrades wazuh-indexer=$OLD_VERSION || echo "WARN: Indexer downgrade failed"

# 5. Konfigurationen wiederherstellen (falls nötig)
echo "Checking if configuration restore is needed..."

# Backup-Verzeichnis ermitteln (letztes Backup)
LATEST_BACKUP=$(ls -td /root/wazuh_backup_* 2>/dev/null | head -1)
if [ -n "$LATEST_BACKUP" ]; then
    echo "Found backup: $LATEST_BACKUP"
    
    # Optional: Configs wiederherstellen
    # tar -xzf "$LATEST_BACKUP/wazuh_indexer_etc.tgz" -C /
    # tar -xzf "$LATEST_BACKUP/wazuh_dashboard_etc.tgz" -C /
    # etc.
    
    echo "Review backup and restore configs if needed"
else
    echo "WARN: No backup found!"
fi

# 6. Services starten
echo "Starting services..."
systemctl start wazuh-indexer
sleep 10
systemctl start wazuh-manager
sleep 5
systemctl start wazuh-dashboard
sleep 5
systemctl start filebeat

# 7. Status prüfen
echo "=== Services Status ==="
systemctl status wazuh-indexer --no-pager || true
systemctl status wazuh-manager --no-pager || true
systemctl status wazuh-dashboard --no-pager || true
systemctl status filebeat --no-pager || true

echo ""
echo "=== PAKET-DOWNGRADE ROLLBACK COMPLETE ==="
echo "IMPORTANT: Perform full validation (Runbook 0) immediately!"
```

**Post-Downgrade Validierung:**
```bash
# Versionen bestätigen
dpkg -l | egrep 'wazuh-(indexer|manager|dashboard)|filebeat'

# Services validieren
systemctl status wazuh-indexer wazuh-manager wazuh-dashboard filebeat

# Indexer Health
curl -sk -u admin:admin https://127.0.0.1:9200/_cluster/health?pretty

# Dashboard Zugriff
curl -I http://127.0.0.1:5601

# Führen Sie RUNBOOK 0 vollständig aus
```

**Mögliche Probleme nach Downgrade:**
- Indexer startet nicht → JVM-Settings aus Backup wiederherstellen
- Dashboard lädt nicht → opensearch_dashboards.yml aus Backup wiederherstellen
- Manager startet nicht → ossec.conf prüfen, ggf. aus Backup wiederherstellen
- Security-Init erforderlich → `/usr/share/wazuh-indexer/bin/indexer-security-init.sh` ausführen

---

### 10.3 Post-Rollback Aktionen

**Unabhängig von der Rollback-Methode:**

1. **Validierung:**
   - Führen Sie Runbook 0 (Health Snapshot) vollständig aus
   - Dokumentieren Sie Post-Rollback Status im Ticket
   - Bestätigen Sie Funktionalität (Dashboard Login, Datenfluss)

2. **Kommunikation:**
   - Informieren Sie alle Stakeholder über erfolgreichen Rollback
   - Kommunizieren Sie geschätzten Zeitpunkt für erneuten Upgrade-Versuch
   - Update im Change-Ticket mit Rollback-Zeitstempel

3. **Root Cause Analysis:**
   - Erstellen Sie Incident-Report
   - Dokumentieren Sie was schief gelaufen ist
   - Identifizieren Sie Lücken in Vorbereitung oder Prozess
   - Planen Sie Maßnahmen zur Vermeidung beim nächsten Versuch

4. **Nächste Schritte:**
   - Erstellen Sie Follow-up Ticket für erneuten Upgrade-Versuch
   - Addressieren Sie identifizierte Probleme vor erneutem Versuch
   - Erwägen Sie Upgrade in Test-Umgebung zuerst
   - Planen Sie längeres Wartungsfenster für erneuten Versuch

---

### 10.4 Rollback-Vermeidung (Präventive Maßnahmen)

**Vor dem Upgrade:**
- Test-Upgrade in Staging-Umgebung durchführen
- Release Notes und Known Issues lesen
- Community-Foren für bekannte Probleme prüfen
- Längeres Wartungsfenster einplanen (Zeitpuffer 50-100%)
- Alle Voraussetzungen doppelt prüfen

**Während des Upgrades:**
- Jeden Schritt einzeln validieren bevor zum nächsten übergehen
- Bei ersten Warnzeichen stoppen und analysieren
- Nicht unter Zeitdruck Schritte überspringen
- Bei Unsicherheit: Rollback früher als später durchführen

**Lessons Learned dokumentieren:**
- Jedes Upgrade (erfolgreich oder nicht) dokumentieren
- Best Practices aktualisieren
- Runbook bei Bedarf anpassen
- Team-Wissen teilen

---

## 11) Troubleshooting Guide

### Häufige Probleme und Lösungen

#### Problem: Indexer startet nach Upgrade nicht

**Symptome:**
- `systemctl status wazuh-indexer` zeigt "failed" oder "inactive"
- Port 9200 nicht erreichbar

**Diagnose:**
```bash
journalctl -u wazuh-indexer -n 500 --no-pager | less
tail -100 /var/log/wazuh-indexer/wazuh-cluster.log
```

**Häufige Ursachen und Lösungen:**

1. **JVM Heap Size Problem:**
   ```bash
   # Prüfen Sie verfügbaren RAM
   free -h
   
   # JVM Settings anpassen (falls nötig)
   nano /etc/wazuh-indexer/jvm.options
   # Empfohlen: -Xms2g -Xmx2g für 4GB RAM, -Xms4g -Xmx4g für 8GB RAM
   
   # Service neu starten
   systemctl restart wazuh-indexer
   ```

2. **Berechtigungsprobleme:**
   ```bash
   # Berechtigungen korrigieren
   chown -R wazuh-indexer:wazuh-indexer /var/lib/wazuh-indexer
   chown -R wazuh-indexer:wazuh-indexer /usr/share/wazuh-indexer
   chown -R wazuh-indexer:wazuh-indexer /etc/wazuh-indexer
   chown -R wazuh-indexer:wazuh-indexer /var/log/wazuh-indexer
   
   systemctl restart wazuh-indexer
   ```

3. **Disk voll:**
   ```bash
   df -h
   # Falls Disk voll: Alte Logs/Indices löschen oder Disk erweitern
   ```

4. **Port bereits belegt:**
   ```bash
   ss -lntp | grep :9200
   # Falls Port belegt: Anderen Prozess identifizieren und stoppen
   ```

---

#### Problem: Manager startet nicht nach Upgrade

**Symptome:**
- `systemctl status wazuh-manager` zeigt "failed"
- Keine Verbindung auf Port 1514/1515

**Diagnose:**
```bash
journalctl -u wazuh-manager -n 500 --no-pager
tail -200 /var/ossec/logs/ossec.log
```

**Lösungen:**

1. **Konfigurationsfehler:**
   ```bash
   # Konfiguration testen
   /var/ossec/bin/wazuh-control start
   # Fehler werden in Ausgabe angezeigt
   
   # Falls Config-Fehler: Aus Backup wiederherstellen
   LATEST_BACKUP=$(ls -td /root/wazuh_backup_* 2>/dev/null | head -1)
   tar -xzf "$LATEST_BACKUP/var_ossec_etc.tgz" -C /
   
   systemctl restart wazuh-manager
   ```

2. **Indexer nicht erreichbar:**
   ```bash
   # Manager kann starten aber mit Warnings wenn Indexer nicht da ist
   # Erst Indexer fixen, dann Manager neu starten
   systemctl restart wazuh-manager
   ```

---

#### Problem: Dashboard nicht erreichbar

**Symptome:**
- Port 5601 antwortet nicht
- Browser zeigt "Connection refused" oder Timeout

**Diagnose:**
```bash
systemctl status wazuh-dashboard
journalctl -u wazuh-dashboard -n 500 --no-pager
tail -100 /var/log/wazuh-dashboard/opensearch_dashboards.log
```

**Lösungen:**

1. **Indexer-Verbindungsproblem:**
   ```bash
   # Dashboard benötigt Indexer zum Starten
   # Prüfen Sie Indexer-Status
   curl -sk -u admin:admin https://127.0.0.1:9200/_cluster/health
   
   # Falls Indexer OK: Dashboard Config prüfen
   grep "opensearch.hosts" /etc/wazuh-dashboard/opensearch_dashboards.yml
   ```

2. **Port-Konflikt:**
   ```bash
   ss -lntp | grep :5601
   # Falls Port belegt: Anderen Prozess stoppen
   ```

3. **Berechtigungen:**
   ```bash
   chown -R wazuh-dashboard:wazuh-dashboard /usr/share/wazuh-dashboard
   chown -R wazuh-dashboard:wazuh-dashboard /etc/wazuh-dashboard
   chown -R wazuh-dashboard:wazuh-dashboard /var/lib/wazuh-dashboard
   systemctl restart wazuh-dashboard
   ```

---

#### Problem: Filebeat läuft, aber keine Events im Indexer

**Symptome:**
- Filebeat Service läuft
- Aber keine neuen wazuh-alerts-* Indices oder keine neuen Events

**Diagnose:**
```bash
journalctl -u filebeat -n 500 --no-pager
filebeat test output
filebeat test config
```

**Lösungen:**

1. **Verbindungsproblem zum Indexer:**
   ```bash
   # Credentials prüfen
   grep -A5 "output.elasticsearch:" /etc/filebeat/filebeat.yml
   
   # Manueller Verbindungstest
   curl -sk -u <user>:<pass> https://127.0.0.1:9200/
   ```

2. **Template/Pipeline nicht geladen:**
   ```bash
   # Template und Pipelines neu laden
   filebeat setup --pipelines
   filebeat setup --index-management -E output.logstash.enabled=false
   
   systemctl restart filebeat
   ```

3. **Falsche Berechtigungen auf Wazuh-Logs:**
   ```bash
   # Filebeat muss /var/ossec/logs/alerts/alerts.json lesen können
   ls -l /var/ossec/logs/alerts/alerts.json
   chmod 644 /var/ossec/logs/alerts/alerts.json
   systemctl restart filebeat
   ```

---

#### Problem: Cluster Health = RED

**Symptome:**
- `curl -k -u admin:admin https://127.0.0.1:9200/_cluster/health` zeigt "red"

**Diagnose:**
```bash
# Detaillierte Cluster-Info
curl -sk -u admin:admin https://127.0.0.1:9200/_cluster/health?pretty

# Unassigned Shards identifizieren
curl -sk -u admin:admin 'https://127.0.0.1:9200/_cat/shards?v&h=index,shard,prirep,state,unassigned.reason' | grep UNASSIGNED
```

**Lösungen:**

1. **Shard Allocation prüfen:**
   ```bash
   # Allocation Status
   curl -sk -u admin:admin https://127.0.0.1:9200/_cluster/settings?pretty
   
   # Falls noch auf "primaries": Zurück auf "all"
   curl -X PUT "https://127.0.0.1:9200/_cluster/settings" -u admin:admin -k \
     -H 'Content-Type: application/json' -d'
   {
     "persistent": { "cluster.routing.allocation.enable": "all" }
   }
   '
   ```

2. **Disk Watermark Problem:**
   ```bash
   df -h
   # Falls Disk > 85%: Alte Indices löschen oder Disk erweitern
   
   # Temporär Watermark anpassen (nur für Recovery!)
   curl -X PUT "https://127.0.0.1:9200/_cluster/settings" -u admin:admin -k \
     -H 'Content-Type: application/json' -d'
   {
     "transient": {
       "cluster.routing.allocation.disk.watermark.low": "95%",
       "cluster.routing.allocation.disk.watermark.high": "98%"
     }
   }
   '
   ```

3. **Corrupted Shards:**
   ```bash
   # Als letztes Mittel: Corrupted Index löschen
   # ACHTUNG: Datenverlust für diesen Index!
   curl -X DELETE "https://127.0.0.1:9200/<index-name>" -u admin:admin -k
   ```

---

#### Problem: Login am Dashboard funktioniert nicht

**Symptome:**
- Dashboard lädt, aber Login schlägt fehl mit "Incorrect username or password"
- Oder: "Authentication Exception"

**Lösungen:**

1. **Security-Konfiguration neu anwenden:**
   ```bash
   systemctl stop wazuh-dashboard
   /usr/share/wazuh-indexer/bin/indexer-security-init.sh
   systemctl start wazuh-dashboard
   ```

2. **Passwort zurücksetzen (Admin-User):**
   ```bash
   # Hash für neues Passwort generieren
   /usr/share/wazuh-indexer/plugins/opensearch-security/tools/hash.sh -p NewPassword123
   
   # In internal_users.yml eintragen
   nano /etc/wazuh-indexer/opensearch-security/internal_users.yml
   # Ersetzen Sie den Hash beim admin-User
   
   # Security neu laden
   /usr/share/wazuh-indexer/bin/indexer-security-init.sh
   ```

---

#### Problem: "Version Conflict" oder "Compatibility Issues"

**Symptome:**
- Fehlermeldungen über inkompatible Versionen
- Dashboard zeigt Warnungen über Index-Template Versionen

**Lösung:**
```bash
# Versionen aller Komponenten prüfen
dpkg -l | egrep 'wazuh-(indexer|manager|dashboard)'

# Falls Versionen nicht identisch: Upgrade/Downgrade auf einheitliche Version
apt-get install wazuh-indexer=X.Y.Z-1 wazuh-manager=X.Y.Z-1 wazuh-dashboard=X.Y.Z-1

# Template neu laden
TARGET_VERSION="X.Y.Z"
curl -so /etc/filebeat/wazuh-template.json \
  "https://raw.githubusercontent.com/wazuh/wazuh/v${TARGET_VERSION}/extensions/elasticsearch/7.x/wazuh-template.json"

filebeat setup --index-management -E output.logstash.enabled=false
```

---

### Notfall-Kommandos

**Komplett Neustart aller Services (in korrekter Reihenfolge):**
```bash
systemctl stop filebeat wazuh-dashboard wazuh-manager wazuh-indexer
sleep 5
systemctl start wazuh-indexer
sleep 15
systemctl start wazuh-manager
sleep 10
systemctl start wazuh-dashboard
sleep 10
systemctl start filebeat

# Status prüfen
systemctl status wazuh-indexer wazuh-manager wazuh-dashboard filebeat
```

**Alle Logs an einer Stelle sammeln (für Support):**
```bash
SUPPORT_DIR="/tmp/wazuh_support_$(date +%F_%H%M%S)"
mkdir -p "$SUPPORT_DIR"

# System-Info
uname -a > "$SUPPORT_DIR/system_info.txt"
df -h >> "$SUPPORT_DIR/system_info.txt"
free -h >> "$SUPPORT_DIR/system_info.txt"

# Versionen
dpkg -l | egrep 'wazuh|filebeat' > "$SUPPORT_DIR/packages.txt"

# Services Status
systemctl status wazuh-indexer wazuh-manager wazuh-dashboard filebeat > "$SUPPORT_DIR/services_status.txt"

# Logs
journalctl -u wazuh-indexer -n 1000 --no-pager > "$SUPPORT_DIR/indexer.log"
journalctl -u wazuh-manager -n 1000 --no-pager > "$SUPPORT_DIR/manager.log"
journalctl -u wazuh-dashboard -n 1000 --no-pager > "$SUPPORT_DIR/dashboard.log"
journalctl -u filebeat -n 1000 --no-pager > "$SUPPORT_DIR/filebeat.log"

# Cluster State
curl -sk -u admin:admin https://127.0.0.1:9200/_cluster/health?pretty > "$SUPPORT_DIR/cluster_health.json"
curl -sk -u admin:admin https://127.0.0.1:9200/_cat/nodes?v > "$SUPPORT_DIR/nodes.txt"
curl -sk -u admin:admin https://127.0.0.1:9200/_cat/indices?v > "$SUPPORT_DIR/indices.txt"

# Archivieren
tar -czf "$SUPPORT_DIR.tar.gz" -C /tmp "$(basename $SUPPORT_DIR)"
echo "Support bundle created: $SUPPORT_DIR.tar.gz"
```

---

## 12) Anhang

### Referenzen

- **Offizielle Wazuh Dokumentation:**
  - Upgrade Guide: https://documentation.wazuh.com/current/upgrade-guide/
  - Central Components: https://documentation.wazuh.com/current/upgrade-guide/upgrading-central-components.html
  - Release Notes: https://documentation.wazuh.com/current/release-notes/
  
- **Community-Ressourcen:**
  - Wazuh Slack: https://wazuh.com/community/join-us-on-slack/
  - GitHub Issues: https://github.com/wazuh/wazuh/issues
  - Wazuh Google Groups: https://groups.google.com/forum/#!forum/wazuh

### Nützliche Befehle (Quick Reference)

```bash
# Status aller Wazuh-Services
systemctl status wazuh-indexer wazuh-manager wazuh-dashboard filebeat

# Cluster Health
curl -sk -u admin:admin https://127.0.0.1:9200/_cluster/health?pretty

# Neueste Alerts anzeigen
curl -sk -u admin:admin 'https://127.0.0.1:9200/wazuh-alerts-*/_search?size=5&sort=@timestamp:desc&pretty'

# Aktive Agents
/var/ossec/bin/agent_control -l

# Wazuh Manager Info
/var/ossec/bin/wazuh-control info

# Logs in Echtzeit verfolgen
journalctl -u wazuh-manager -f
tail -f /var/ossec/logs/ossec.log
```

### Kontakte und Eskalation

**Bei kritischen Problemen während des Upgrades:**
1. Entscheiden Sie schnell: Fortfahren oder Rollback?
2. Dokumentieren Sie alle Schritte und Fehlermeldungen
3. Bei Unsicherheit: Rollback durchführen
4. Support kontaktieren mit gesammelten Logs

**Eskalationsweg:**
1. Level 1: Runbook Troubleshooting-Sektion konsultieren
2. Level 2: Wazuh Community (Slack/Forum) fragen
3. Level 3: Wazuh Support kontaktieren (falls Support-Vertrag)
4. Level 4: Post-Mortem und lessons learned dokumentieren

---

## Änderungshistorie

| Version | Datum | Autor | Änderungen |
|---------|-------|-------|------------|
| 1.3 | 2026-01 | System | Umfassende Überarbeitung: Erweiterte Voraussetzungen, verbesserte Validierungsschritte, detailliertes Rollback-Verfahren, neue Troubleshooting-Sektion |
| 1.2 | - | - | Frühere Version |
| 1.1 | - | - | Initiale Version |

---

**Ende des Runbooks**
