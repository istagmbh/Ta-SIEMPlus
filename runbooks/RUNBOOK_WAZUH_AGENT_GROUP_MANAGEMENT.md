# RUNBOOK: Wazuh Agentengruppen-Verwaltung

**Version:** 1.0.0  
**Letzte Aktualisierung:** 2026-02-17  
**Anwendbar auf:** Wazuh Manager (alle Versionen ab 4.x)  
**Betriebssystem:** Linux (Ubuntu, CentOS, RHEL, etc.)

---

## 📋 Inhaltsverzeichnis

1. [Überblick](#überblick)
2. [Wichtige Dateien](#wichtige-dateien)
3. [Kommandozeilenverwaltung](#kommandozeilenverwaltung)
4. [Gruppenkonfiguration](#gruppenkonfiguration)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

---

## 0) Nicht verhandelbare Regeln

⚠️ **STOP-Kriterien** – Diese Bedingungen sind absolute STOP-Signale:

| **Regel** | **Beschreibung** | **Check-Befehl** |
|-----------|------------------|------------------|
| **Wazuh Manager muss laufen** | Der Manager-Service muss aktiv sein | `systemctl status wazuh-manager` |
| **Backup vor Änderungen** | Vor größeren Gruppenänderungen Backup erstellen | `tar -czf /tmp/wazuh-groups-backup-$(date +%F).tar.gz /var/ossec/etc/shared/` |
| **Keine gleichzeitigen Änderungen** | Nur ein Administrator darf Gruppen ändern | Koordination im Team |
| **Gültige Gruppennamen** | Nur alphanumerische Zeichen und Unterstriche erlaubt | `[a-zA-Z0-9_-]+` |

---

## Überblick

### Was sind Wazuh Agentengruppen?

Wazuh Agentengruppen ermöglichen die zentrale Verwaltung von Agent-Konfigurationen. Agenten können einer oder mehreren Gruppen zugeordnet werden und erhalten automatisch die kombinierten Konfigurationen aller Gruppen.

### Hauptmerkmale:

- **Zentrale Konfigurationsverwaltung**: Konfigurationen werden vom Manager verwaltet und automatisch an Agenten verteilt
- **Multi-Gruppen-Unterstützung**: Ein Agent kann mehreren Gruppen gleichzeitig angehören
- **Automatische Synchronisation**: Änderungen werden automatisch an alle betroffenen Agenten übertragen
- **Persistenz**: Gruppenzugehörigkeiten bleiben bei Agent-Neuregistrierung erhalten

---

## Wichtige Dateien

### 1. merged.mg

**Pfad:** `/var/ossec/etc/shared/<agent-id>/merged.mg`

**Beschreibung:**  
Die Datei `merged.mg` wird vom Wazuh-Manager generiert und enthält die **konsolidierte Konfiguration** aller Gruppen, denen ein Agent angehört. Diese Datei spielt eine zentrale Rolle bei der Agent-Konfiguration.

**Funktionsweise:**
- Wird automatisch vom Manager erstellt und aktualisiert
- Enthält die zusammengeführte Konfiguration aus allen Gruppen des Agents
- Wird bei jeder Konfigurationsänderung oder Gruppenzuordnung neu generiert
- Automatisch an den Agent übertragen
- Über das Dashboard einsehbar, aber **nicht editierbar**

**Wichtige Eigenschaften:**
- Stellt sicher, dass Agenten stets die aktuelle Konfiguration erhalten
- Unterstützt automatische Wiederzuordnung nach erneuter Registrierung
- Konfliktauflösung bei überlappenden Konfigurationen folgt einer definierten Priorität

**Beispiel-Struktur:**
```xml
<!-- merged.mg -->
<agent_config>
  <!-- Konfiguration aus Gruppe "linux-servers" -->
  <localfile>
    <location>/var/log/syslog</location>
    <log_format>syslog</log_format>
  </localfile>
  
  <!-- Konfiguration aus Gruppe "web-servers" -->
  <localfile>
    <location>/var/log/apache2/access.log</location>
    <log_format>apache</log_format>
  </localfile>
</agent_config>
```

### 2. ar.conf

**Pfad:** `/var/ossec/etc/shared/<group-name>/ar.conf`

**Beschreibung:**  
Die Datei `ar.conf` (Active Response Configuration) definiert **Befehle**, die auf den Agenten innerhalb einer Gruppe ausgeführt werden können.

**Verwendungszweck:**
- Liste von Befehlen für Active Response
- Skripte oder Programme für Wartungsaufgaben
- Befehle zur Problembehebung
- Service-Neustart-Anweisungen

**Beispiel-Inhalt:**
```bash
# ar.conf - Active Response Commands

# Neustart des Wazuh-Agents (Linux)
restart-wazuh0 - restart-wazuh - 0

# Neustart des Wazuh-Agents (Windows)
restart-wazuh-windows - restart-wazuh.exe - 0

# Neustart des OSSEC-Dienstes
restart-ossec0 - restart-ossec - 0

# Firewall-Blockierung
firewall-block - firewall-block.sh - default-firewall-drop

# Host-Deny
host-deny - host-deny.sh - default-ossec-deny
```

**Befehls-Format:**
```
<name> - <executable> - <timeout/event-location>
```

**Wichtige Hinweise:**
- Befehle müssen auf dem Agent-System verfügbar sein
- Ausführungsberechtigungen müssen korrekt gesetzt sein
- Über das Dashboard einsehbar, aber **nicht editierbar**
- Änderungen erfordern Manager-Neustart

### 3. agent.conf

**Pfad:** `/var/ossec/etc/shared/<group-name>/agent.conf`

**Beschreibung:**  
Enthält die spezifische Konfiguration für alle Agenten in dieser Gruppe.

**Beispiel:**
```xml
<agent_config>
  <client_buffer>
    <disabled>no</disabled>
    <queue_size>5000</queue_size>
  </client_buffer>
  
  <localfile>
    <location>/var/log/syslog</location>
    <log_format>syslog</log_format>
  </localfile>
</agent_config>
```

---

## Kommandozeilenverwaltung

Das Tool `agent_groups` ermöglicht die vollständige Verwaltung von Agentengruppen über die Kommandozeile.

### Gruppen erstellen

**Neue Agentengruppe erstellen:**
```bash
/var/ossec/bin/agent_groups -a -g <group-name>
```

**Beispiele:**
```bash
# Linux-Server-Gruppe erstellen
/var/ossec/bin/agent_groups -a -g linux-servers

# Web-Server-Gruppe erstellen
/var/ossec/bin/agent_groups -a -g web-servers

# Datenbank-Server-Gruppe erstellen
/var/ossec/bin/agent_groups -a -g db-servers

# Entwicklungs-Umgebung
/var/ossec/bin/agent_groups -a -g dev-environment
```

**Hinweise:**
- Gruppennamen sollten beschreibend sein
- Verwenden Sie Bindestriche oder Unterstriche (keine Leerzeichen)
- Keine Sonderzeichen außer `-` und `_`

---

### Gruppen auflisten

**Alle Gruppen anzeigen:**
```bash
/var/ossec/bin/agent_groups -l
```

**Gruppen mit Details anzeigen:**
```bash
/var/ossec/bin/agent_groups -l -g <group-name>
```

**Beispiel-Ausgabe:**
```
Groups:
  - linux-servers (5 agents)
  - web-servers (3 agents)
  - db-servers (2 agents)
  - default (0 agents)
```

---

### Agenten zu Gruppen hinzufügen

**Agent zu einer Gruppe hinzufügen:**
```bash
/var/ossec/bin/agent_groups -a -i <agent-id> -g <group-name>
```

**Agent zu mehreren Gruppen hinzufügen:**
```bash
/var/ossec/bin/agent_groups -a -i <agent-id> -g <group1>,<group2>,<group3>
```

**Beispiele:**
```bash
# Agent 001 zur Gruppe linux-servers hinzufügen
/var/ossec/bin/agent_groups -a -i 001 -g linux-servers

# Agent 002 zu linux-servers und web-servers hinzufügen
/var/ossec/bin/agent_groups -a -i 002 -g linux-servers,web-servers

# Agent 003 zu mehreren Gruppen
/var/ossec/bin/agent_groups -a -i 003 -g linux-servers,db-servers,prod-environment
```

---

### Agenten aus Gruppen entfernen

**Agent aus einer Gruppe entfernen:**
```bash
/var/ossec/bin/agent_groups -r -i <agent-id> -g <group-name>
```

**Agent komplett aus allen Gruppen entfernen:**
```bash
/var/ossec/bin/agent_groups -r -i <agent-id>
```

**Beispiele:**
```bash
# Agent 001 aus web-servers entfernen
/var/ossec/bin/agent_groups -r -i 001 -g web-servers

# Agent 003 aus allen Gruppen entfernen
/var/ossec/bin/agent_groups -r -i 003
```

---

### Gruppen-Mitglieder anzeigen

**Alle Agenten einer Gruppe auflisten:**
```bash
/var/ossec/bin/agent_groups -l -g <group-name>
```

**Detaillierte Agenten-Info mit Gruppen:**
```bash
/var/ossec/bin/manage_agents -l
```

**Beispiel-Ausgabe:**
```
Available agents:
   ID: 001, Name: web-server-01, IP: 10.0.1.10, Groups: linux-servers,web-servers
   ID: 002, Name: db-server-01, IP: 10.0.1.20, Groups: linux-servers,db-servers
   ID: 003, Name: app-server-01, IP: 10.0.1.30, Groups: linux-servers
```

---

### Gruppe löschen

**Achtung: Agenten müssen zuerst aus der Gruppe entfernt werden!**

```bash
# Schritt 1: Alle Agenten aus der Gruppe entfernen
/var/ossec/bin/agent_groups -r -g <group-name>

# Schritt 2: Gruppe löschen (Verzeichnis entfernen)
rm -rf /var/ossec/etc/shared/<group-name>

# Schritt 3: Manager-Cache aktualisieren
systemctl restart wazuh-manager
```

**Beispiel:**
```bash
# Gruppe "old-servers" komplett entfernen
/var/ossec/bin/agent_groups -r -g old-servers
rm -rf /var/ossec/etc/shared/old-servers
systemctl restart wazuh-manager
```

---

## Gruppenkonfiguration

### Gruppenkonfiguration erstellen

**1. Gruppenverzeichnis anlegen (automatisch beim Erstellen der Gruppe):**
```bash
/var/ossec/bin/agent_groups -a -g <group-name>
```

**2. Konfigurationsdatei erstellen:**
```bash
vi /var/ossec/etc/shared/<group-name>/agent.conf
```

**3. Beispiel-Konfiguration:**
```xml
<agent_config>
  <!-- Logging-Konfiguration -->
  <localfile>
    <location>/var/log/syslog</location>
    <log_format>syslog</log_format>
  </localfile>

  <localfile>
    <location>/var/log/auth.log</location>
    <log_format>syslog</log_format>
  </localfile>

  <!-- Rootcheck-Konfiguration -->
  <rootcheck>
    <frequency>43200</frequency>
  </rootcheck>

  <!-- SCA-Konfiguration -->
  <sca>
    <enabled>yes</enabled>
    <scan_on_start>yes</scan_on_start>
    <interval>12h</interval>
  </sca>
</agent_config>
```

**4. Active Response Commands konfigurieren (optional):**
```bash
vi /var/ossec/etc/shared/<group-name>/ar.conf
```

```bash
# Beispiel ar.conf
restart-wazuh0 - restart-wazuh - 0
firewall-block - firewall-block.sh - default-firewall-drop
```

**5. Konfiguration validieren:**
```bash
/var/ossec/bin/wazuh-logtest-config
```

**6. Manager neu laden:**
```bash
systemctl restart wazuh-manager
```

---

## Best Practices

### 1. Namenskonventionen

**Empfohlene Namensstruktur:**
```
<umgebung>-<funktion>-<location>

Beispiele:
- prod-web-servers
- dev-database-servers
- test-app-servers
- prod-linux-eu-west
```

### 2. Gruppen-Hierarchie

**Basis-Gruppen:**
```
linux-base      → Grundkonfiguration für alle Linux-Systeme
windows-base    → Grundkonfiguration für alle Windows-Systeme
```

**Funktions-Gruppen:**
```
web-servers     → Spezifische Konfiguration für Webserver
db-servers      → Spezifische Konfiguration für Datenbankserver
app-servers     → Spezifische Konfiguration für Applikationsserver
```

**Umgebungs-Gruppen:**
```
prod            → Produktionsumgebung
test            → Testumgebung
dev             → Entwicklungsumgebung
```

**Agent-Zuordnung (Multi-Gruppen):**
```bash
# Beispiel: Production Web Server
/var/ossec/bin/agent_groups -a -i 001 -g linux-base,web-servers,prod
```

### 3. Konfigurationsmanagement

**Versionskontrolle:**
- Alle Gruppenkonfigurationen in Git verwalten
- Änderungen über Pull Requests reviewen
- Rollback-Möglichkeit sicherstellen

**Backup-Strategie:**
```bash
# Vor Änderungen Backup erstellen
tar -czf /backup/wazuh-groups-$(date +%F-%H%M).tar.gz /var/ossec/etc/shared/

# Regelmäßige Backups (Cron)
0 2 * * * tar -czf /backup/wazuh-groups-$(date +\%F).tar.gz /var/ossec/etc/shared/
```

### 4. Testing

**Test-Gruppe verwenden:**
```bash
# Test-Gruppe erstellen
/var/ossec/bin/agent_groups -a -g test-config

# Test-Agent zuweisen
/var/ossec/bin/agent_groups -a -i 999 -g test-config

# Konfiguration testen
# ... Änderungen beobachten ...

# Bei Erfolg auf alle Agenten ausrollen
```

### 5. Dokumentation

**Für jede Gruppe dokumentieren:**
- Zweck der Gruppe
- Enthaltene Konfigurationen
- Zugewiesene Agenten
- Änderungshistorie
- Verantwortliche Person

**Beispiel-Dokumentation:**
```yaml
gruppe: web-servers
zweck: Konfiguration für Apache/Nginx Webserver
konfigurationen:
  - Apache access/error logs
  - Nginx access/error logs
  - ModSecurity monitoring
  - SSL/TLS certificate monitoring
agenten_count: 12
erstellt: 2026-01-15
verantwortlich: security-team@company.com
```

---

## Troubleshooting

### Problem: Agent erhält keine Konfiguration

**Symptom:**
```
Agent logs zeigen keine Konfigurationsaktualisierung
```

**Diagnose:**
```bash
# 1. Gruppenzugehörigkeit prüfen
/var/ossec/bin/agent_groups -l -g <group-name>

# 2. merged.mg prüfen
ls -la /var/ossec/etc/shared/<agent-id>/merged.mg

# 3. Manager-Logs prüfen
tail -f /var/ossec/logs/ossec.log | grep "group"

# 4. Agent-Verbindung prüfen
/var/ossec/bin/agent_control -l
```

**Lösung:**
```bash
# Agent erneut zur Gruppe hinzufügen
/var/ossec/bin/agent_groups -a -i <agent-id> -g <group-name>

# Manager neu starten
systemctl restart wazuh-manager

# Agent-Synchronisation erzwingen
/var/ossec/bin/agent_control -R <agent-id>
```

---

### Problem: merged.mg wird nicht aktualisiert

**Symptom:**
```
Konfigurationsänderungen werden nicht an Agenten übertragen
```

**Diagnose:**
```bash
# 1. Dateiberechtigungen prüfen
ls -la /var/ossec/etc/shared/<group-name>/

# 2. Manager-Prozess prüfen
ps aux | grep wazuh-remoted

# 3. Queue prüfen
ls -la /var/ossec/queue/rids/
```

**Lösung:**
```bash
# 1. Berechtigungen korrigieren
chown -R wazuh:wazuh /var/ossec/etc/shared/<group-name>/
chmod 750 /var/ossec/etc/shared/<group-name>/
chmod 640 /var/ossec/etc/shared/<group-name>/*

# 2. Manager neu starten
systemctl restart wazuh-manager

# 3. Agent-Synchronisation erzwingen
/var/ossec/bin/agent_control -R -a
```

---

### Problem: Gruppe kann nicht gelöscht werden

**Symptom:**
```
Fehler beim Löschen einer Gruppe
```

**Diagnose:**
```bash
# 1. Agenten in der Gruppe prüfen
/var/ossec/bin/agent_groups -l -g <group-name>

# 2. Dateisystem-Locks prüfen
lsof | grep /var/ossec/etc/shared/<group-name>
```

**Lösung:**
```bash
# 1. Alle Agenten aus der Gruppe entfernen
/var/ossec/bin/agent_groups -r -g <group-name>

# 2. Manager stoppen
systemctl stop wazuh-manager

# 3. Gruppe löschen
rm -rf /var/ossec/etc/shared/<group-name>

# 4. Manager starten
systemctl start wazuh-manager
```

---

### Problem: ar.conf Befehle funktionieren nicht

**Symptom:**
```
Active Response Befehle werden nicht ausgeführt
```

**Diagnose:**
```bash
# 1. ar.conf Syntax prüfen
cat /var/ossec/etc/shared/<group-name>/ar.conf

# 2. Befehl auf Agent vorhanden?
# (auf dem Agent-System)
ls -la /var/ossec/active-response/bin/

# 3. Agent-Logs prüfen
# (auf dem Agent-System)
tail -f /var/ossec/logs/active-responses.log
```

**Lösung:**
```bash
# 1. ar.conf korrigieren
vi /var/ossec/etc/shared/<group-name>/ar.conf

# 2. Berechtigungen setzen
chmod 750 /var/ossec/active-response/bin/*

# 3. Manager neu starten
systemctl restart wazuh-manager

# 4. Agent-Synchronisation erzwingen
/var/ossec/bin/agent_control -R <agent-id>
```

---

## Health Check Commands

### Gruppen-Status überprüfen

```bash
# Alle Gruppen mit Anzahl Agenten
/var/ossec/bin/agent_groups -l

# Spezifische Gruppe mit Details
/var/ossec/bin/agent_groups -l -g <group-name>

# Alle Agenten mit Gruppenzugehörigkeit
/var/ossec/bin/manage_agents -l | grep -i "group"

# Gruppen-Verzeichnisse prüfen
ls -la /var/ossec/etc/shared/

# Konfigurationsdateien prüfen
find /var/ossec/etc/shared/ -name "agent.conf" -o -name "ar.conf" -o -name "merged.mg"
```

### Synchronisations-Status

```bash
# Agent-Verbindungsstatus
/var/ossec/bin/agent_control -l

# Letzte Agent-Synchronisation
/var/ossec/bin/agent_control -i <agent-id>

# Queue-Status
ls -la /var/ossec/queue/rids/

# Manager-Logs für Gruppen-Events
grep -i "group" /var/ossec/logs/ossec.log | tail -n 50
```

---

## Nützliche Scripts

### Script: Alle Agenten einer Gruppe auflisten

```bash
#!/bin/bash
# list-group-agents.sh

GROUP_NAME="$1"

if [ -z "$GROUP_NAME" ]; then
    echo "Usage: $0 <group-name>"
    exit 1
fi

echo "=== Agents in group: $GROUP_NAME ==="
/var/ossec/bin/manage_agents -l | grep "Groups:.*$GROUP_NAME"
```

### Script: Gruppen-Backup erstellen

```bash
#!/bin/bash
# backup-groups.sh

BACKUP_DIR="/backup/wazuh-groups"
TIMESTAMP=$(date +%F-%H%M%S)

mkdir -p "$BACKUP_DIR"

tar -czf "$BACKUP_DIR/groups-backup-$TIMESTAMP.tar.gz" \
    /var/ossec/etc/shared/

echo "Backup created: $BACKUP_DIR/groups-backup-$TIMESTAMP.tar.gz"
ls -lh "$BACKUP_DIR/groups-backup-$TIMESTAMP.tar.gz"
```

### Script: Konfiguration auf alle Gruppen anwenden

```bash
#!/bin/bash
# apply-config-to-all.sh

CONFIG_FILE="$1"

if [ ! -f "$CONFIG_FILE" ]; then
    echo "Config file not found: $CONFIG_FILE"
    exit 1
fi

for group_dir in /var/ossec/etc/shared/*/; do
    group_name=$(basename "$group_dir")
    
    if [ "$group_name" != "default" ]; then
        echo "Applying to: $group_name"
        cp "$CONFIG_FILE" "$group_dir/agent.conf"
    fi
done

systemctl restart wazuh-manager
echo "Configuration applied to all groups"
```

---

## Weiterführende Dokumentation

- **Wazuh Official Docs - Agent Groups:** https://documentation.wazuh.com/current/user-manual/agent-enrollment/agent-enrollment.html
- **Wazuh Official Docs - Centralized Configuration:** https://documentation.wazuh.com/current/user-manual/reference/centralized-configuration.html
- **Wazuh Official Docs - Active Response:** https://documentation.wazuh.com/current/user-manual/capabilities/active-response/index.html

---

**Letzte Aktualisierung:** 2026-02-17  
**Nächste Review:** 2026-05-17  
**Verantwortlich:** Security Operations Team
