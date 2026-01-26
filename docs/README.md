# Dokumentation und Werkzeuge

Dieses Verzeichnis enthält ergänzende Dokumentation und Werkzeuge für den Managed SIEM Service (Wazuh).

## Web-basiertes Wartungsformular

Die Datei `maintenance-form.html` bietet eine interaktive, browserbasierte Alternative zu den markdown-basierten Runbooks und Checklisten.

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

### Integration mit Runbooks

Während dieses Formular einen praktischen digitalen Workflow bietet, ergänzt es die bestehenden Markdown-Runbooks und -Checklisten, anstatt sie zu ersetzen:

- **Runbooks** (`../runbooks/`): Bieten detaillierte Schritt-für-Schritt-Anleitungen
- **Checklisten** (`../checklists/`): Bieten Copy-Paste-Vorlagen für Change-Tickets
- **Wartungsformular**: Bietet eine geführte digitale Oberfläche für Dokumentation und PDF-Export

Verwenden Sie den Ansatz, der am besten zu Ihrem Workflow und Ihren Change-Management-Anforderungen passt.

## Zukünftige Verbesserungen

Mögliche zukünftige Verbesserungen:
- Auto-Speicherung im Browser Local Storage
- Import/Export von Formulardaten als JSON
- Integration mit Ticketing-Systemen
- Zusätzliche PDF-Styling-Optionen
- Vorbefüllen aus Checklisten-Vorlagen
