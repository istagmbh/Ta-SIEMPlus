# 🔧 Web-Formular Metadaten-Integration

## Überblick

Das Wazuh SIEM Wartungsformular (`docs/maintenance-form.html`) hat jetzt einen **"Schritt 0: Basis-Konfiguration"**-Panel, das es ermöglicht:

1. **Alle Metadaten zentral einzugeben** (Kunde, Infrastruktur, Ticket, Versionen, Zeitfenster)
2. **Das Formular automatisch auszufüllen** (alle Felder in Schritt 1–5 werden populiert)
3. **Daten zu speichern** (Browser LocalStorage für Persistenz)
4. **Schneller durchzustarten** (kein manuelles Kopieren/Einfügen in jedem Schritt)

---

## 🎯 Verwendung: Schritt-für-Schritt

### 1. Formular öffnen

Öffne [docs/maintenance-form.html](docs/maintenance-form.html) im Browser (lokal oder über HTTP-Server):

```bash
# Option A: Lokal (keine Server-Installation)
open docs/maintenance-form.html

# Option B: HTTP-Server (z.B. Python)
cd /Users/i.stricker/docker/dev/Ta-SIEMPlus
python3 -m http.server 8000
# Öffne dann: http://localhost:8000/docs/maintenance-form.html
```

### 2. Schritt 0: Basis-Konfiguration ausfüllen

Du siehst oben ein **blaues Panel** mit folgende Feldern:

| Feld | Beispiel | Pflicht |
|------|----------|---------|
| 👤 **Kunde** | DeepCloud AG | ✅ Ja |
| 🏗️ **Infrastruktur** | SingleNode-PROD-01 | ✅ Ja |
| 🎫 **Change/Ticket-ID** | CHG-2026-00123 | ✅ Ja |
| 📦 **Ist-Version** | 4.9.0 | ❌ Optional |
| ⬆️ **Zielversion** | 4.12.0 | ✅ Ja |
| ⏰ **Wartungsfenster Start** | 2026-01-30 14:00 | ❌ Optional |
| ⏹️ **Wartungsfenster Ende** | 2026-01-30 16:00 | ❌ Optional |
| 🌍 **Zeitzone** | Europe/Zurich | ❌ Vordefiniert |

### 3. Daten speichern & Formular ausfüllen

Klick auf den Button **"✓ Speichern & Vorausfüllen"**:

```
✓ Speichern & Vorausfüllen
```

**Was passiert:**
1. ✅ Alle Felder werden validiert (Pflichtfelder)
2. 💾 Daten werden im **Browser LocalStorage** gespeichert
3. 🔄 **Alle Formular-Felder** (Schritt 1–5) werden automatisch gefüllt:
   - `customer` → Feld "Kunde" in Schritt 1
   - `infrastructure` → Feld "Infrastruktur" in Schritt 1
   - `ticket` → Feld "Change/Ticket-ID" in Schritt 1
   - `currentVersion` → Feld "Aktuelle Version" in Schritt 1
   - `targetVersion` → Feld "Zielversion" in Schritt 1
   - `maintenanceStart` → Feld "Wartungsfenster Start" in Schritt 1
   - `maintenanceEnd` → Feld "Wartungsfenster Ende" in Schritt 1
4. 📋 Eine **Zusammenfassung** wird angezeigt (grüne Box unten)
5. 🎯 Formular scrollt automatisch zu **Schritt 1**

### 4. Sichtbare Zusammenfassung

Nach dem Speichern sehen Sie:

```
┌─────────────────────────────────────────────┐
│ 👤 Kunde:           DeepCloud AG            │
│ 🏗️ Infrastruktur:   SingleNode-PROD-01      │
│ 🎫 Ticket:         CHG-2026-00123          │
│ 📦 Upgrade:        4.9.0 → 4.12.0          │
└─────────────────────────────────────────────┘
```

---

## 🔄 Persistenz (LocalStorage)

Die Metadaten werden **persistent im Browser gespeichert**:

### Speicherung
```javascript
localStorage.setItem('wazuh_maintenance_metadata', JSON.stringify(metadata))
```

### Abruf beim Neuladen
Wenn Sie die Seite neu laden oder später zurückkommen, werden die Daten **automatisch wiederhergestellt**.

### Klaren des Speichers
Um den Speicher zu löschen (z.B. für neue Wartung), öffnen Sie Developer Tools:

```javascript
// In Browser Console (F12)
localStorage.removeItem('wazuh_maintenance_metadata')
```

---

## 📚 Integration mit Katalog (Katalog-Loader)

Der Button **"📚 Aus Katalog laden"** öffnet eine Anleitung für die Zukunft:

```
📚 Katalog-Laderinktion:

1. Öffnen Sie: ../Catalog/CUSTOMERS.md
2. Kopieren Sie die gewünschten Kundendaten
3. Fügen Sie die Werte manuell ein oder nutzen Sie den Auto-Fill-Mechanismus

Future: Diese Funktion wird automatisch Kundendaten aus dem Katalog laden.
```

**Geplant für Phase 2:**
- Automatisches Laden von Kundendaten aus `Catalog/CUSTOMERS.md`
- Dropdown-Auswahl statt Freitextfeld für Kunde/Infrastruktur
- JSON-Import für Batch-Konfiguration

---

## 🔗 Metadaten-zu-Form-Mapping

| Metadaten-Feld | Ziel-Formular-Feld | Schritt |
|----------------|-------------------|--------|
| `customer` | `#customer` | 1: Stammdaten |
| `infrastructure` | `#infrastructure` | 1: Stammdaten |
| `ticket` | `#ticketId` | 1: Stammdaten |
| `currentVersion` | `#currentVersion` | 1: Stammdaten |
| `targetVersion` | `#targetVersion` | 1: Stammdaten |
| `maintenanceStart` | `#startDateTime` | 1: Stammdaten |
| `maintenanceEnd` | `#endDateTime` | 1: Stammdaten |

---

## ⚙️ Technische Details

### Validierung
Beim Klick auf "Speichern & Vorausfüllen" werden diese Felder geprüft:

```javascript
if (!metadata.customer || !metadata.infrastructure || 
    !metadata.ticket || !metadata.targetVersion) {
    alert('⚠️ Bitte füllen Sie mindestens aus: Kunde, Infrastruktur, Ticket-ID und Zielversion');
    return;
}
```

### Speicher-Struktur
```json
{
  "customer": "DeepCloud AG",
  "infrastructure": "SingleNode-PROD-01",
  "ticket": "CHG-2026-00123",
  "currentVersion": "4.9.0",
  "targetVersion": "4.12.0",
  "maintenanceStart": "2026-01-30T14:00",
  "maintenanceEnd": "2026-01-30T16:00",
  "timezone": "Europe/Zurich",
  "timestamp": "2026-01-30T10:00:00.000Z"
}
```

### Browser-Kompatibilität
- ✅ Chrome/Edge (v4+)
- ✅ Firefox (v3.5+)
- ✅ Safari (v4+)
- ❌ Internet Explorer (kein localStorage)

---

## 🎨 UI/UX Features

### Visuelle Indikatoren

1. **Erfolgs-Meldung** (grüne Box)
   ```
   ✓ Metadaten gespeichert! Sie werden automatisch in alle Schritte übernommen.
   ```

2. **Zusammenfassung** (transparente Box)
   - Zeigt Kunde, Infrastruktur, Ticket, Upgrade-Pfad
   - Verschwindet nach Scroll

3. **Automatisches Scrollen**
   - Nach dem Speichern scrolled die Seite zu Schritt 1

4. **Responsive Design**
   - Metadaten-Grid passt sich an Bildschirmbreite an
   - Buttons sind mobil-freundlich

---

## 📝 Workflow-Beispiel

### Szenario: Upgrade für DeepCloud AG

```
1. Öffne: docs/maintenance-form.html

2. Schritt 0: Basis-Konfiguration
   - Kunde: DeepCloud AG
   - Infrastruktur: SingleNode-PROD-01
   - Change/Ticket-ID: CHG-2026-00123
   - Ist-Version: 4.9.0
   - Zielversion: 4.12.0
   - Wartungsfenster: 2026-01-30 14:00 – 16:00

3. Klick: "✓ Speichern & Vorausfüllen"
   → Alle Felder automatisch gefüllt
   → Grüne Erfolgsmeldung
   → Seite scrolled zu Schritt 1

4. Schritt 1: Stammdaten
   → Alle Felder bereits ausgefüllt!
   → Nur noch fehlende Felder ausfüllen (z.B. Betreiber, Maintenance-Typ)

5. Schritte 2–5: Wie gewöhnlich
   → Einmal ausgefüllte Daten bleiben erhalten
```

---

## ⚠️ Fehlerbehandlung

| Fehler | Ursache | Lösung |
|--------|--------|--------|
| Felder werden nicht ausgefüllt | JavaScript deaktiviert | Developer Tools aktivieren oder Browser-Einstellungen prüfen |
| Daten gehen nach Neuladen verloren | LocalStorage nicht aktiviert | Browser-Einstellungen prüfen, LocalStorage ermöglichen |
| "Pflichtfelder"-Warnung | Leere Felder | Alle rot markierten Felder ausfüllen |

---

## 🔮 Zukünftige Verbesserungen

### Phase 2 (Geplant)
- [ ] Automatischer Import aus `Catalog/CUSTOMERS.md`
- [ ] Dropdown-Auswahl statt Freitextfeld
- [ ] JSON-Datei-Upload für Batch-Konfiguration
- [ ] Versionsverlauf (frühere Wartungen)

### Phase 3 (Geplant)
- [ ] Integration mit Change-Management-System (Jira/Azure DevOps)
- [ ] API-basierter Daten-Abruf
- [ ] Multi-Infrastruktur-Support (Parallel-Upgrades)
- [ ] Cloud-Synchronisation

---

## 📖 Verwandte Dokumente

- [GETTING_STARTED.md](GETTING_STARTED.md) – Allgemeiner Einstieg (Abschnitt "NEU: Automatisches Ausfüllen")
- [docs/maintenance-form.html](docs/maintenance-form.html) – Das Formular selbst
- [Catalog/CUSTOMERS.md](Catalog/CUSTOMERS.md) – Kundendaten-Katalog (für zukünftigen Auto-Import)
- [WEB_TOOLS_INTEGRATION.md](WEB_TOOLS_INTEGRATION.md) – Überblick aller Web-Tools

---

## 💬 FAQ

**F: Wo werden meine Daten gespeichert?**  
A: Im Browser-LocalStorage Ihres Computers. Nicht auf einem Server.

**F: Kann ich die Daten exportieren?**  
A: Ja! Im PDF-Export (Schritt 5) werden alle Metadaten enthalten.

**F: Funktioniert es offline?**  
A: Ja! Das HTML-Formular lädt lokal und benötigt keinen Internetzugang.

**F: Können mehrere Personen gleichzeitig arbeiten?**  
A: Nein. LocalStorage ist lokal pro Browser. Nutze für Team-Arbeit die Markdown-Checkliste im Ticket-System.

**F: Kann ich frühere Wartungen wiederherstellen?**  
A: Derzeit nicht. Dies ist für Phase 2 geplant (Versionshistorie).

---

**Zuletzt aktualisiert:** 30. Januar 2026  
**Autor:** GitHub Copilot  
**Status:** ✅ Production Ready
