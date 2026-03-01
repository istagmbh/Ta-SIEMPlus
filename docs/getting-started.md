# Erste Schritte

## Dokumentation

Die vollständige Dokumentation ist direkt im Browser erreichbar:

**[https://istagmbh.github.io/Ta-SIEMPlus/](https://istagmbh.github.io/Ta-SIEMPlus/)**

Kein Login, kein Setup – einfach die URL aufrufen.

---

## Web-Tools

Die interaktiven Tools sind ebenfalls über GitHub Pages zugänglich:

| Tool | Beschreibung |
|---|---|
| [Upgrade-Formular](webforms/upgrade-form.html) | Geführter Wazuh AIO Upgrade-Workflow mit PDF-Export |
| [Checklisten-Generator](webforms/checklist-generator.html) | Wartungschecklisten generieren und exportieren |
| [Agent-Verwaltung](webforms/agent-management.html) | Befehlsgenerator für Wazuh Agenten |
| [Wartungsprotokoll](webforms/maintenance-protocol.html) | Strukturierte Wartungsdokumentation |

Alle Tools laufen vollständig im Browser – kein Backend, keine Installation.

---

## Lokale Entwicklung (nur für Beitragende)

Wer Änderungen an der Dokumentation vornehmen möchte:

```bash
# Repo klonen
git clone https://github.com/istagmbh/Ta-SIEMPlus.git
cd Ta-SIEMPlus

# Abhängigkeiten installieren
pip install mkdocs-material mike pymdown-extensions

# Lokale Vorschau starten
mkdocs serve
# → http://127.0.0.1:8000
```

Änderungen in einem Feature-Branch committen und per PR einreichen –
GitHub Actions deployed automatisch nach Merge in `main`.
