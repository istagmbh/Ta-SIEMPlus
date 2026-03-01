# Projektübersicht

Eine Karte durch alle Ressourcen in Ta-SIEMPlus.

---

## Einstieg

| Was brauchst du? | Ressource |
|---|---|
| Dokumentation lesen | [istagmbh.github.io/Ta-SIEMPlus](https://istagmbh.github.io/Ta-SIEMPlus/) |
| Upgrade durchführen | [Web-Tool: Upgrade-Formular](webforms/upgrade-form.html) |
| Checkliste generieren | [Web-Tool: Checklisten-Generator](webforms/checklist-generator.html) |
| Agent verwalten | [Web-Tool: Agent-Verwaltung](webforms/agent-management.html) |
| Wartungsprotokoll | [Web-Tool: Wartungsprotokoll](webforms/maintenance-protocol.html) |
| Schnelle Befehle | [Schnellreferenz](quick-reference.md) |
| Neuen Kunden registrieren | [Katalog-Anleitung](guides/catalog-howto.md) |

---

## Workflow: Wazuh Upgrade

```
START
  │
  ├─→ [1] Kundendaten nachschlagen
  │       catalog/CUSTOMERS.md
  │       ↓
  ├─→ [2] Upgrade-Formular oder Checkliste vorbereiten
  │       webforms/upgrade-form.html
  │       checklists/CHECKLIST_WAZUH_UPGRADE_AIO.md
  │       ↓
  ├─→ [3] Upgrade durchführen
  │       runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md
  │       ↓
  ├─→ [4] Health Snapshot dokumentieren
  │       quick-reference.md (Pre/Post Snapshot)
  │       ↓
  └─→ [5] Change Note abschliessen
          templates/CHANGE_NOTE_TEMPLATE.md

FERTIG ✅
```

---

## Dateiübersicht

### Dokumentation

| Datei | Beschreibung |
|---|---|
| [getting-started.md](getting-started.md) | Erste Schritte & GitHub Pages URL |
| [quick-reference.md](quick-reference.md) | Copy-Paste Befehle & Health Checks |
| [overview/index.md](overview/index.md) | Architektur & Prinzipien |

### Runbooks & Checklisten

| Datei | Beschreibung |
|---|---|
| [runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md](runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md) | Detailliertes Upgrade-Runbook |
| [runbooks/RUNBOOK_WAZUH_AGENT_GROUP_MANAGEMENT.md](runbooks/RUNBOOK_WAZUH_AGENT_GROUP_MANAGEMENT.md) | Agent-Gruppen-Verwaltung |
| [checklists/CHECKLIST_WAZUH_UPGRADE_AIO.md](checklists/CHECKLIST_WAZUH_UPGRADE_AIO.md) | Upgrade-Checkliste |

### Web-Tools

| Tool | Beschreibung |
|---|---|
| [webforms/upgrade-form.html](webforms/upgrade-form.html) | Upgrade-Wizard mit PDF-Export |
| [webforms/checklist-generator.html](webforms/checklist-generator.html) | Checklisten-Generator |
| [webforms/agent-management.html](webforms/agent-management.html) | Agent-Verwaltung |
| [webforms/maintenance-protocol.html](webforms/maintenance-protocol.html) | Wartungsprotokoll |

### Konfigurationsvorlagen

| Datei | Beschreibung |
|---|---|
| [config-templates/manager/ossec-manager.md](config-templates/manager/ossec-manager.md) | ossec.conf Manager AIO |
| [config-templates/agent/ossec-agent.md](config-templates/agent/ossec-agent.md) | ossec.conf Linux Agent |
| [config-templates/indexer/opensearch.md](config-templates/indexer/opensearch.md) | opensearch.yml Indexer |
| [config-templates/filebeat/filebeat.md](config-templates/filebeat/filebeat.md) | filebeat.yml |
| [config-templates/VARIABLES.md](config-templates/VARIABLES.md) | Variablenreferenz |

### Katalog & Vorlagen

| Datei | Beschreibung |
|---|---|
| [catalog/CUSTOMERS.md](catalog/CUSTOMERS.md) | Kunden-Registry |
| [guides/catalog-howto.md](guides/catalog-howto.md) | Katalog-Verwaltung |
| [guides/checklist-howto.md](guides/checklist-howto.md) | Checklisten-Anleitung |

---

## Checkliste: Bin ich bereit für ein Upgrade?

- [ ] Kundendaten in [catalog/CUSTOMERS.md](catalog/CUSTOMERS.md) nachgeschaut
- [ ] Change-Ticket vorhanden
- [ ] Backup/Snapshot erstellt
- [ ] Disk-Belegung < 90%
- [ ] Alle Services `active (running)`
- [ ] Maintenance Window geplant

Ja zu allen → Los geht's mit dem [Upgrade-Formular](webforms/upgrade-form.html) oder [Runbook](runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md).
