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

</div>

---

## In Entwicklung

Folgende Tools sind geplant und werden in zukünftigen Versionen verfügbar sein:

<div class="grid cards" markdown>

-   **Konfigurations-Generator** _(geplant)_

    ---

    Formularbasierte Erstellung von `ossec.conf` für Manager und Agent.
    Variablen aus einem Formular eingeben – fertige Konfigurationsdatei zum Kopieren erhalten.

-   **Alert-Regeleditor** _(geplant)_

    ---

    Wazuh Custom Detection Rules direkt im Browser erstellen und validieren.
    XML-Editor mit Syntaxhighlighting und Test-Interface.

-   **Patch-Planer** _(geplant)_

    ---

    Wartungsfenster für mehrere Kunden koordinieren.
    Upgrade-Abhängigkeiten und Zeitpläne in einer Übersicht visualisieren.

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
- **PDF-Export** ist im Upgrade-Formular und Wartungsprotokoll verfügbar
