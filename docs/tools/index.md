---
hide:
  - toc
---

# Web-Tools

Interaktive Browser-Tools für alle operativen Ta-SIEMPlus Workflows.
Kein Server, keine Installation – alles läuft direkt im Browser.

<div style="text-align: center; margin: 24px 0">
  <a href="../webforms/index.html" style="display:inline-block; background:#3b3e90; color:#fff; padding:12px 28px; border-radius:6px; font-weight:600; text-decoration:none; font-size:1em;">Alle Tools im Portal öffnen ↗</a>
</div>

---

## Upgrade & Wartung

<div class="grid cards" markdown>

-   **Wazuh Upgrade Formular**

    ---

    Geführter Upgrade-Workflow für Wazuh AIO. Generiert automatisch alle Befehle
    und erstellt Checklisten für Pre- und Post-Checks.

    - Pre-Flight Checks & No-Go Gates
    - Schritt-für-Schritt Anleitung
    - Health Snapshots (Pre & Post)
    - PDF-Export für Ticketsystem

    [:octicons-arrow-right-24: Upgrade Formular öffnen](../webforms/upgrade-form.html)

-   **Checklisten-Generator**

    ---

    Individuelle Checklisten für Wartungsfenster generieren, befüllen und exportieren.

    - Anpassbare Templates
    - Metadaten-Management
    - Markdown-Export
    - Copy-to-Ticket

    [:octicons-arrow-right-24: Checklisten-Generator öffnen](../webforms/checklist-generator.html)

-   **Wartungsprotokoll**

    ---

    Strukturierte Protokollierung von Wartungsarbeiten mit lokalem Speichern (LocalStorage).

    - Strukturierte Erfassung
    - Zeiterfassung
    - Problembehebung dokumentieren
    - PDF-Archivierung

    [:octicons-arrow-right-24: Wartungsprotokoll öffnen](../webforms/maintenance-protocol.html)

</div>

---
## Administration

<div class="grid cards" markdown>

-   **Agent-Verwaltung**

    ---

    Befehlsgenerator für Wazuh Agent-Gruppen, Registrierung und Konfigurationsverteilung.

    - Gruppen erstellen & bearbeiten
    - Agenten zuweisen
    - Befehls-Generator
    - Multi-Gruppen Support

    [:octicons-arrow-right-24: Agent-Verwaltung öffnen](../webforms/agent-management.html)

-   **Alert-Regeleditor**

    ---

    Wazuh Custom Detection Rules visuell erstellen, validieren und als XML exportieren.

    - Visueller Regel-Builder (kein XML nötig)
    - 8 Vorlagen (Brute-Force, Mimikatz, PowerShell, …)
    - Live XML-Vorschau mit Validierung
    - MITRE ATT&CK Mapping, Regel-Bibliothek

    [:octicons-arrow-right-24: Alert-Regeleditor öffnen](../webforms/alert-regeleditor.html)

</div>

---

## Konfiguration & Planung

<div class="grid cards" markdown>

-   **Konfigurations-Generator**

    ---

    Wazuh Konfigurationsdateien per Formular generieren – kein manuelles Editieren mehr.

    - Manager, Agent (Linux/Windows), Indexer, Filebeat
    - Live-Vorschau mit Syntax-Highlighting
    - ossec.conf Validator (Altlasten & Diffs)
    - Copy + Download als Datei

    [:octicons-arrow-right-24: Konfigurations-Generator öffnen](../webforms/config-generator.html)

-   **Patch-Planer**

    ---

    Wartungsfenster für mehrere Kunden koordinieren und Konflikte vermeiden.

    - Monatskalender (100% Browser/offline)
    - Kunden, Typen, Versionen, Dauer verwalten
    - JSON Import/Export für Team-Sharing
    - PDF-Export für Ticketsystem

    [:octicons-arrow-right-24: Patch-Planer öffnen](../webforms/patch-planner.html)

</div>

---

## Information

<div class="grid cards" markdown>

-   **Warum ganzheitliches SIEM?**

    ---

    Erklärt, warum Antivirus allein nicht ausreicht und welchen Mehrwert
    ein ganzheitliches SIEM mit Wazuh bietet.

    - Antivirus vs. SIEM Vergleich
    - Ganzheitliche Sicherheitsüberwachung
    - Paradigmenwechsel erklärt
    - Empfohlene nächste Schritte

    [:octicons-arrow-right-24: Mehr erfahren](../webforms/warum-siem.html)

</div>

---

## Hinweise

- Alle Tools laufen **vollständig im Browser** – keine Serverprozesse, kein Backend
- Daten werden lokal im **LocalStorage** des Browsers gespeichert
- Funktionieren **offline** nach dem ersten Laden (Fonts werden gecacht)
- **PDF-Export** verfügbar in Upgrade-Formular, Wartungsprotokoll und Patch-Planer
