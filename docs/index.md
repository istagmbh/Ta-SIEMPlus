---
hide:
  - toc
---

# Ta-SIEMPlus

**Operative Dokumentation für standardisierte Wazuh SIEM Wartungsabläufe.**
Entwickelt und gepflegt von [T-Alpha GmbH](https://www.t-alpha.ch).

---

<div class="grid cards" markdown>

-   :material-tools:{ .lg .middle } **Web-Tools**

    ---

    Browser-basierte Tools für Upgrades, Checklisten, Agent-Verwaltung und Wartungsprotokoll.
    Kein Server, keine Installation erforderlich.

    [:octicons-arrow-right-24: Web-Tools öffnen](tools/index.md)

-   :material-wrench:{ .lg .middle } **Betrieb**

    ---

    Upgrade Guides, Runbooks und Checklisten für den täglichen Wazuh AIO Betrieb –
    von der Planung bis zum Abschluss.

    [:octicons-arrow-right-24: Betriebsdokumentation](overview/index.md)

-   :material-file-code:{ .lg .middle } **Konfiguration**

    ---

    Vorgefertigte Konfigurationsvorlagen für Manager, Agent, Indexer und Filebeat
    mit vollständiger Variablenreferenz.

    [:octicons-arrow-right-24: Konfigurationsvorlagen](config-templates/index.md)

-   :material-lightning-bolt:{ .lg .middle } **Schnellreferenz**

    ---

    Copy-Paste Befehle für Health Checks, Upgrades und Diagnose –
    für den täglichen Einsatz im Terminal.

    [:octicons-arrow-right-24: Schnellreferenz](quick-reference.md)

</div>

---

## Workflow auf einen Blick

| Schritt | Aufgabe | Tool |
|---|---|---|
| **1 · Vorbereitung** | Kundendaten nachschlagen | [Katalog](catalog/CUSTOMERS.md) |
| **2 · Planung** | Upgrade-Formular ausfüllen | [Web-Tools](tools/index.md) |
| **3 · Durchführung** | Runbook ausführen | [Runbook AIO Ubuntu](runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md) |
| **4 · Dokumentation** | Health Snapshot erfassen | [Schnellreferenz](quick-reference.md) |
| **5 · Abschluss** | Change Note abschliessen | [Change Note Template](templates/CHANGE_NOTE_TEMPLATE.md) |

---

## Kernprinzipien

| Prinzip | Beschreibung |
|---|---|
| **No-Go Gates** | Harte Stopppunkte: Disk > 90%, Services nicht aktiv, fehlendes Backup → kein Upgrade |
| **Health Snapshots** | Systemzustand vor und nach jeder Änderung vollständig dokumentieren |
| **Workflow-Sync** | Checkliste und Runbook immer synchron halten |
| **Secrets** | Niemals Klartext – immer `vault://pfad/zum/secret` im Katalog referenzieren |
