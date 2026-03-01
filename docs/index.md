# Ta-SIEMPlus Dokumentation

**Operative Dokumentation für standardisierte Wazuh SIEM Wartungsabläufe.**
Reproduzierbar · Auditierbar · Operator-freundlich

---

## Einstieg

| | Beschreibung |
|---|---|
| [Erste Schritte](getting-started.md) | Schritt-für-Schritt für alle Haupt-Szenarien |
| [Installation](installation.md) | Setup-Anleitung (Web / Docker / Python) |
| [Schnellreferenz](quick-reference.md) | Copy-Paste Befehle & Health Checks |
| [Projektübersicht](navigation.md) | Visuelle Karte durch alle Ressourcen |

## Inhalte

| Bereich | Beschreibung |
|---|---|
| [Overview](overview/index.md) | Architekturprinzipien & Workflow-Übersicht |
| [Runbooks](runbooks/index.md) | Detaillierte SOPs (Upgrade, Agent Groups) |
| [Checklists](checklists/index.md) | Change-Management-Checklisten |
| [Upgrade Guides](upgrade-guides/index.md) | Versionsspezifische Upgrade-Prozeduren |
| [Anleitungen](guides/index.md) | How-To für Checklisten & Katalog |
| [Referenz](reference/index.md) | Deployment & Versioning |
| [Katalog](catalog/index.md) | Kunden- & Infrastruktur-Registry |
| [Templates](templates/index.md) | Dokumentationsvorlagen |
| [Config Templates](config-templates/index.md) | Befüllbare Konfigurationsvorlagen mit `{{ VARIABLE }}`-Syntax |

---

## Kernprinzipien

**No-Go Gates** – Obligatorische Stopkriterien:

- Disk-Belegung > 90% → **STOP**
- Services nicht `active (running)` → **STOP**
- Kein Backup/Snapshot → **STOP**
- Change nicht genehmigt → **STOP**

**Health Snapshots** – Systemzustand vor und nach jeder Änderung dokumentieren.

**Secrets** – Niemals direkt im Repository. Immer `vault://pfad/zum/secret` verwenden.

---

**Lizenz:** MIT | **Repository:** [istagmbh/Ta-SIEMPlus](https://github.com/istagmbh/Ta-SIEMPlus)
