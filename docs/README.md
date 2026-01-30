# 📚 Dokumentation und Web-Werkzeuge

Dieses Verzeichnis enthält **ergänzende Web-Dokumentation und Werkzeuge** für den Managed SIEM Service (Wazuh).

---

## 🎯 WICHTIG: Dokumentations-Einstiegspunkte

> **🚀 Neue Benutzer:**  
> Starten Sie **NICHT hier**, sondern öffnen Sie:  
> → [**GETTING_STARTED.md**](../GETTING_STARTED.md) im Root-Verzeichnis  
> → Dann: [**QUICK_REFERENCE.md**](../QUICK_REFERENCE.md) für schnelle Befehle

**Alle Markdown-Dokumentationen sind im Root:**
```
Ta-SIEMPlus/
├── GETTING_STARTED.md          ← 🚀 EINSTIEG (neu!)
├── QUICK_REFERENCE.md          ← ⚡ SCHNELLE BEFEHLE (neu!)
├── CHECKLIST_HOWTO.md          ← 📋 CHECKLISTEN (neu!)
├── CATALOG_HOWTO.md            ← 🏗️ KATALOG (neu!)
├── NAVIGATION.md               ← 🗺️ NAVIGATION (neu!)
├── README.md                   ← 📖 PROJEKT-ÜBERBLICK
└── docs/                       ← 💻 WEB-FORMULARE (diese Datei)
```

---

## 💻 Web-basiertes Wartungsformular

Die Datei `maintenance-form.html` bietet eine **interaktive, browserbasierte Alternative** zu den markdown-basierten Checklisten.

### 🆕 Schritt 0: Metadaten-Konfigurations-Panel

Das Formular hat jetzt einen **dediziertem Setup-Bereich am Anfang**:

```
🔧 Schritt 0: Basis-Konfiguration
─────────────────────────────────
👤 Kunde:                  [_______________]
🏗️ Infrastruktur:           [_______________]
🎫 Change/Ticket-ID:        [_______________]
📦 Ist-Version:             [_______________]
⬆️ Zielversion:             [_______________]
⏰ Wartungsfenster Start:    [_______________]
⏹️ Wartungsfenster Ende:     [_______________]
🌍 Zeitzone:                [Europe/Zurich ▼]

[✓ Speichern & Vorausfüllen]  [📚 Aus Katalog laden]
```

**Was passiert beim Klick auf "Speichern & Vorausfüllen":**
1. ✅ Validierung aller Pflichtfelder
2. 💾 Speicherung im Browser-LocalStorage (persistent)
3. 🔄 **Automatisches Ausfüllen** aller Formular-Felder (Schritt 1–5)
4. 📊 Anzeige einer Zusammenfassung
5. 🎯 Automatisches Scroll zu Schritt 1

→ **Dokumentation:** [WEB_FORM_METADATA_INTEGRATION.md](../WEB_FORM_METADATA_INTEGRATION.md)

### Funktionen

- **Umfassendes Formular**: Erfasst alle wesentlichen Informationen des Wartungsworkflows basierend auf Wazuh Best Practices
- **Client-seitige PDF-Generierung**: Erstellt professionelle PDF-Berichte direkt im Browser ohne Server-Abhängigkeiten
- **Validierung**: Integrierte Formularvalidierung stellt sicher, dass alle erforderlichen Felder ausgefüllt sind
- **Responsive Design**: Funktioniert auf Desktop- und Mobilgeräten
- **Keine Installation erforderlich**: Öffnen Sie einfach die HTML-Datei in einem modernen Webbrowser

### Erforderliche Felder

Das Formular enthält die folgenden erforderlichen Felder:
- System-/Asset-Name
- Umgebung (Produktion/Test/Entwicklung)
- Wartungstyp (Routine/Ad-hoc/Notfall)
- Start- und Enddatum/-zeit
- Verantwortliche Person
- Change/Ticket-ID
- Schritt-für-Schritt-Checkliste (mehrzeilig)
- Ergebnis/Status (Erfolg/Fehlgeschlagen/Teilweise erfolgreich/Zurückgerollt)
- Post-Wartungs-Validierung/Prüfung
- Backout/Rollback-Plan
- Genehmigung/Review (Name + Datum)

### Optionale Felder

- Betroffene Systeme/Logs
- Notizen/Anhänge

### Verwendung

1. Öffnen Sie `maintenance-form.html` in einem Webbrowser (Chrome, Firefox, Edge, Safari)
2. Füllen Sie alle erforderlichen Felder aus (markiert mit *)
3. Fügen Sie bei Bedarf optionale Informationen hinzu
4. Klicken Sie auf "PDF generieren", um einen herunterladbaren Wartungsbericht zu erstellen
5. Das PDF wird automatisch mit einem Dateinamen heruntergeladen, der die Ticket-ID und das Datum enthält

### Browser-Kompatibilität

Das Formular funktioniert in allen modernen Browsern:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Hinweis**: Das Formular verwendet die jsPDF-Bibliothek von CDN (unpkg.com) zur PDF-Generierung. Eine aktive Internetverbindung ist erforderlich, damit die PDF-Generierungsfunktion funktioniert. Die Bibliothek wird client-seitig geladen und benötigt keine serverseitigen Abhängigkeiten.

### Integration mit Runbooks & Checklisten

Während dieses Formular einen praktischen **digitalen Workflow** bietet, ergänzt es die bestehenden Markdown-Runbooks und -Checklisten:

| Ansatz | Dateien | Für wen | Vorteile |
|--------|---------|--------|----------|
| **📋 Markdown Checklisten** | `../checklists/` | Ticket-basierte Prozesse | Versionskontrolle, Git-integration, Copy-Paste |
| **💻 Web-Formular** | `maintenance-form.html` | Schnelle digitale Erfassung | Benutzerfreundlich, PDF-Export, Browser-basiert |
| **📚 Runbooks** | `../runbooks/` | Detaillierte Anleitungen | Detailliert, Troubleshooting, Best Practices |

**→ Wähle den Ansatz, der zu deinem Workflow passt:**
- **Ticket-System?** → Nutze Markdown Checklisten
- **Schnelle Erfassung?** → Nutze Web-Formular
- **Detaillierte Anleitung?** → Nutze Runbook

Siehe auch: [GETTING_STARTED.md](../GETTING_STARTED.md) für alle Optionen.

## Zukünftige Verbesserungen

Mögliche zukünftige Verbesserungen:
- ✅ **Metadaten-Auto-Ausfüllen** (implementiert!)
- [ ] Auto-Speicherung im Browser Local Storage (implementiert!)
- [ ] Katalog-Integration: Kundendaten automatisch laden
- [ ] Import/Export von Formulardaten als JSON
- [ ] Integration mit Ticketing-Systemen
- [ ] Versions-Verlauf (frühere Wartungen)

- Zusätzliche PDF-Styling-Optionen
- Vorbefüllen aus Checklisten-Vorlagen
