# Betrieb

Betriebsdokumentation für Wazuh AIO Systeme – von der Planung bis zum Abschluss.

---

<div class="grid cards" markdown>

-   **Upgrade Guides**

    ---

    Versionsspezifische Upgrade-Prozeduren für Wazuh AIO. Aktuell: Wazuh 4.12.

    [:octicons-arrow-right-24: Upgrade Guides](../upgrade-guides/index.md)

-   **Runbooks**

    ---

    Detaillierte Schritt-für-Schritt SOPs für Upgrade AIO Ubuntu und Agent Group Management.

    [:octicons-arrow-right-24: Runbooks](../runbooks/index.md)

-   **Checklisten**

    ---

    Change-Management-Checklisten für sichere und nachvollziehbare Betriebsabläufe.

    [:octicons-arrow-right-24: Checklisten](../checklists/index.md)

-   **Katalog**

    ---

    Kunden- und Infrastruktur-Registry für alle verwalteten Wazuh SIEM Installationen.

    [:octicons-arrow-right-24: Katalog](../catalog/index.md)

</div>

---

## Was ist Ta-SIEMPlus?

Ta-SIEMPlus ist ein **operatives Dokumentationssystem** für standardisierte Wazuh SIEM Wartungsabläufe. Es bietet Runbooks, Checklisten und Betriebskataloge, optimiert für Reproduzierbarkeit und Auditierbarkeit.

## Ziele

- **Reproduzierbarkeit** – Jeder Prozess ist Schritt für Schritt dokumentiert
- **Auditierbarkeit** – Vollständige Dokumentationskette für Compliance
- **Sicherheit** – Eingebaute Gates verhindern gefährliche Operationen
- **Effizienz** – Strukturierte Workflows reduzieren Fehler

## Architekturprinzipien

### 1. Workflow-Synchronisierung

Checklisten und Runbooks sind eng miteinander verknüpft:

- Checklisten referenzieren Runbooks für detaillierte Befehle
- Runbooks enthalten vollständige Befehle, Validierungslogik und Troubleshooting
- **Runbook geändert → Checkliste updaten** und umgekehrt

### 2. No-Go Gates (Pflicht-Sicherheitsgrenzen)

Jeder Prozess hat nicht verhandelbare Pre-Flight Checks:

- Disk-Belegung > 90% → **STOP**
- Services nicht `active (running)` → **STOP**
- Kein verifizierter Snapshot/Backup → **STOP**
- Change-Ticket nicht genehmigt → **STOP**
- Ausserhalb des Wartungsfensters → **STOP**

### 3. Health Snapshots (Audit-Trail)

Jeder Eingriff muss den Systemzustand **vor** und **nach** erfassen:

- Pre-Change Snapshot: Versionen, Disk, Services, Cluster Health
- Post-Change Snapshot: Verifizierung dass keine Regression eingetreten
- Beide Snapshots müssen **am Change-Ticket angehängt werden**

### 4. Metadata-Driven Execution

Alle Checklisten benötigen strukturierte Metadaten-Header:

```yaml
operator: Max Muster
customer: Beispiel AG
infrastructure: wazuh-prod-01
change_ticket: CHG0012345
maintenance_window_start: 2026-03-01T02:00:00+01:00
maintenance_window_end: 2026-03-01T06:00:00+01:00
target_version: 4.12.0
snapshot_id: snap-2026-03-01-01-30
runbook_ref: RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md
```

## Standard-Workflow

```text
1 · PLANUNG
    ├─ Change-Ticket erstellen
    ├─ Kundendaten im Katalog nachschlagen
    └─ Wartungsfenster planen

2 · VORBEREITUNG
    ├─ Checklisten-Metadaten ausfüllen
    ├─ Runbook-Prozedur prüfen
    └─ Pre-Go-Gates verifizieren

3 · DURCHFÜHRUNG
    ├─ Runbook-Schritte ausführen
    ├─ Jeden Punkt abhaken
    └─ Health Snapshots dokumentieren

4 · VALIDIERUNG & DOKUMENTATION
    ├─ Post-Go-Checks ausführen
    ├─ Befunde dokumentieren
    └─ Kunden benachrichtigen

5 · ABSCHLUSS
    ├─ Change-Ticket schliessen
    ├─ Snapshots anhängen
    └─ Feedback geben
```

## Wazuh AIO Betrieb

### Upgrade-Reihenfolge der Komponenten

Komponenten müssen **im Gleichschritt** aktualisiert werden:

1. wazuh-indexer
2. wazuh-manager
3. wazuh-dashboard
4. filebeat

### Versionskompatibilität

- Manager-Version ≥ Agent-Version (immer)
- Alle zentralen Komponenten müssen dieselbe Version haben

### Kritische Ports

| Port | Dienst |
|---|---|
| 1514 | Agent-Kommunikation (UDP) |
| 1515 | Agent-Registrierung (TCP) |
| 55000 | Wazuh API |
| 9200 | Wazuh Indexer |
| 5601 | Wazuh Dashboard |
