# 🌐 Web-Prozess Integration – Saubere HTML-Seiten

## Überblick

Die Ta-SIEMPlus Web-Formulare haben jetzt **saubere, dedizierte HTML-Seiten** für alle wichtigen Prozesse. **Keine Markdown-Links mehr!**

---

## 📊 Neue Web-Seiten im `docs/` Verzeichnis

### 1. **maintenance-form.html** 🔧
**Schritt 0: Metadaten-Konfiguration**
- Kunde, Infrastruktur, Ticket, Versionen, Zeitfenster
- Auto-Save in LocalStorage
- Auto-Ausfüllen aller Schritte 1–5

**Schritte 1–5:** Kompletter Upgrade-Prozess
- Stammdaten + Validierung
- Pre-Go Checks
- Durchführung-Dokumentation
- Post-Go Validierung
- Abschluss & Rollback
- PDF-Export aller Daten

### 2. **runbook.html** 📖
**Detaillierte Schritt-für-Schritt Anleitung**
- Abschnitt 0: Nicht verhandelbare Regeln (No-Go Gates)
- Abschnitte 1–6: Upgrade-Prozess mit Befehlen
- Alle Befehle: Copy-Paste Buttons
- Inhaltsverzeichnis mit Navigations-Links
- Responsive Design (Mobile-friendly)

### 3. **checklist.html** ✅
**Interaktive Checkliste mit Fortschritt**
- Metadaten-Panel am Anfang (Operator, Kunde, Infrastruktur, etc.)
- 28 interaktive Checkboxen für alle Upgrade-Schritte
- Live-Fortschrittsanzeige (%)
- Download-Button (Text-Datei mit Ergebnissen)
- LocalStorage für Persistenz

### 4. **reference.html** ⚡
**Schnell-Referenz: Copy-Paste Befehle**
- 6 Kategorien: Pre-Checks, Upgrade, Services, Validierung, Troubleshooting, Snapshot
- 30+ Befehle mit Click-to-Copy
- Live-Suchfeld
- Responsive Grid-Layout
- Befehle nach Kategorie farblich gekennzeichnet

### 5. **index.html** 🏠
**Hauptseite – Web-Prozess Übersicht**
- 4 Schnellzugriff-Karten (Formular, Runbook, Checkliste, Referenz)
- Links zu Markdown-Dokumentationen (Root-Verzeichnis)
- Repository-Struktur-Info
- Responsive Navigation

---

## 🔄 Workflow: Komplett im Web!

```
START → index.html (Übersicht)
   ↓
OPTION A: maintenance-form.html (Schritt 0 → Formular)
   ├─→ Metadaten eingeben
   ├─→ "Speichern & Vorausfüllen"
   ├─→ Schritt 1–5 ausfüllen
   └─→ PDF exportieren ✅

OPTION B: checklist.html (Interaktive Checkliste)
   ├─→ Metadaten eintragen
   ├─→ Checkboxen abhaken während Arbeit
   ├─→ Fortschritt sehen (%)
   └─→ Text-Datei herunterladen ✅

OPTION C: runbook.html → reference.html
   ├─→ Runbook für Details
   ├─→ Reference für schnelle Befehle
   └─→ Nebeneinander arbeiten ✅

ALLE OPTIONEN:
   → Keine MD-Datei-Verlinkung
   → Alles im Browser
   → Saubere HTML-Seiten
   → Responsive Design (Mobile + Desktop)
```

---

## ✅ Keine Markdown-Links mehr

### Vorher ❌
```html
<a href="../runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md">Runbook</a>
<a href="../checklists/CHECKLIST_WAZUH_UPGRADE_AIO.md">Checkliste</a>
<a href="../templates/CHANGE_NOTE_TEMPLATE.md">Template</a>
```

### Nachher ✅
```html
<a href="runbook.html">Runbook</a>
<a href="checklist.html">Checkliste</a>
<a href="reference.html">Schnell-Referenz</a>
```

---

## 📁 Datei-Struktur (docs/)

```
docs/
├── index.html                    ← 🏠 Hauptseite
├── maintenance-form.html         ← 🔧 Formular mit Metadaten-Setup
├── runbook.html                  ← 📖 Detaillierte Anleitung (NEU)
├── checklist.html                ← ✅ Interaktive Checkliste (NEU)
├── reference.html                ← ⚡ Schnell-Referenz (NEU)
├── README.md                     ← 📄 Docs-Dokumentation
└── maintenance-form.html.backup  ← 🔒 Original (optional)
```

---

## 🎯 Features pro Seite

### maintenance-form.html
| Feature | Ja/Nein | Details |
|---------|---------|---------|
| Metadaten-Setup (Schritt 0) | ✅ | Kunde, Infrastruktur, Ticket, Versionen |
| LocalStorage Auto-Save | ✅ | Daten bleiben beim Neuladen |
| Auto-Ausfüllen | ✅ | Schritt 1–5 werden populiert |
| PDF-Export | ✅ | Alle Daten in PDF |
| Validierung | ✅ | Pflichtfelder prüfen |
| Responsive | ✅ | Mobile + Desktop |

### runbook.html
| Feature | Ja/Nein | Details |
|---------|---------|---------|
| Copy-Paste Buttons | ✅ | Alle Befehle copybar |
| Inhaltsverzeichnis | ✅ | Navigation zwischen Abschnitten |
| No-Go Gates | ✅ | Abschnitt 0 prominent |
| 7 Abschnitte | ✅ | 0–6 + Troubleshooting |
| Code-Blocks | ✅ | Syntax-Highlighting |
| Responsive | ✅ | Mobile + Desktop |

### checklist.html
| Feature | Ja/Nein | Details |
|---------|---------|---------|
| Metadaten-Eingabe | ✅ | 9 Felder (Operator, Kunde, etc.) |
| 28 Checkboxen | ✅ | Alle Upgrade-Schritte |
| Fortschrittsanzeige | ✅ | Live-% (0–100%) |
| Download | ✅ | Text-Datei mit Ergebnissen |
| LocalStorage | ✅ | Daten persistent |
| Responsive | ✅ | Mobile + Desktop |

### reference.html
| Feature | Ja/Nein | Details |
|---------|---------|---------|
| 30+ Befehle | ✅ | Pre-Checks bis Troubleshooting |
| Live-Suche | ✅ | Befehl nach Keyword filtern |
| Click-to-Copy | ✅ | Mit Rückmeldung |
| 6 Kategorien | ✅ | Farblich gekennzeichnet |
| Grid-Layout | ✅ | Responsive 2 Spalten |
| Responsive | ✅ | Mobile + Desktop |

### index.html
| Feature | Ja/Nein | Details |
|---------|---------|---------|
| 4 Schnellzugriff-Karten | ✅ | Formular, Runbook, Checkliste, Referenz |
| Links zu MD-Docs | ✅ | GETTING_STARTED, CONTRIBUTING, etc. |
| Repository-Struktur | ✅ | Übersicht aller Ordner |
| Responsive Navigation | ✅ | Mobile-freundlich |
| Hover-Effekte | ✅ | Visuelle Rückmeldung |

---

## 🌍 URL-Strukturen

### Lokal (Datei-System)
```
file:///Users/.../docs/index.html
file:///Users/.../docs/maintenance-form.html
file:///Users/.../docs/runbook.html
file:///Users/.../docs/checklist.html
file:///Users/.../docs/reference.html
```

### HTTP-Server (empfohlen)
```bash
cd /Users/i.stricker/docker/dev/Ta-SIEMPlus
python3 -m http.server 8000
```

Dann öffnen:
```
http://localhost:8000/docs/index.html
http://localhost:8000/docs/maintenance-form.html
http://localhost:8000/docs/runbook.html
http://localhost:8000/docs/checklist.html
http://localhost:8000/docs/reference.html
```

---

## 🎨 Design & UX

### Farbschema
- **Formular (Blau):** `#667eea → #764ba2` (Gradient)
- **Runbook (Dunkelblau):** `#2c3e50 → #34495e`
- **Checkliste (Grün):** `#27ae60` (Akzent)
- **Referenz (Orange):** `#f39c12` (Schnell-Zugriff)

### Responsive Breakpoints
- **Desktop:** Full layout, 2–4 Spalten
- **Tablet (768px):** 1–2 Spalten
- **Mobile (<480px):** 1 Spalte, Stack-Layout

### Accessibility
- ✅ Semantisches HTML (`<nav>`, `<section>`, etc.)
- ✅ Farbkontrast (WCAG AA)
- ✅ Keyboard Navigation (Tab, Enter)
- ✅ Alt-Text für Icons (Emojis + Titel)

---

## 📝 Verwendungsbeispiele

### Szenario 1: Schnelles Upgrade (10 Min)
```
1. Öffne index.html
2. Klick auf "Schnell-Referenz"
3. Suche nach "systemctl status"
4. Copy-Paste Befehle
5. Done!
```

### Szenario 2: Dokumentiertes Upgrade (1 Stunde)
```
1. Öffne maintenance-form.html
2. Schritt 0: Metadaten eingeben + speichern
3. Schritt 1–5: Formular ausfüllen (auto-gefüllt!)
4. Klick "PDF generieren"
5. Ticket + PDF archivieren
```

### Szenario 3: Team-Arbeit
```
Operator A: runbook.html (Details)
Operator B: reference.html (Befehle)
Manager: checklist.html (Fortschritt)
→ Alle arbeiten im Browser, kein Markdown!
```

---

## 🔒 Sicherheit & Datenschutz

### LocalStorage
- ✅ Daten nur im Browser (Client-side)
- ✅ Nicht auf Server synchronisiert
- ✅ Lokal löschbar (`localStorage.clear()`)
- ⚠️ Sensible Daten (Passwörter) **NICHT** speichern!

### PDF-Export
- ✅ Client-side Generierung (jsPDF)
- ✅ Keine Server-Kommunikation
- ✅ Heruntergeladen ins lokale Verzeichnis
- ✅ Dateiname mit Ticket-ID

---

## 📊 Implementierungs-Status

| Komponente | Status | Notizen |
|------------|--------|---------|
| maintenance-form.html | ✅ Fertig | Metadaten-Setup + 5 Schritte |
| runbook.html | ✅ Fertig | 7 Abschnitte + 30+ Befehle |
| checklist.html | ✅ Fertig | 28 Items + Fortschritt |
| reference.html | ✅ Fertig | 30+ Befehle + Suche |
| index.html | ✅ Aktualisiert | 4 Karten + MD-Links |
| Navigation | ✅ Integriert | Alle Seiten verlinkt |
| Responsive Design | ✅ Alle | Mobile-tested |
| LocalStorage | ✅ Form + Checklist | Auto-Persistenz |

---

## 🚀 Nächste Schritte (Optional)

### Phase 2 (Geplant)
- [ ] Katalog-Integration (JSON-Import)
- [ ] Dropdown-Auswahl statt Freitextfelder
- [ ] Benutzer-Authentifizierung
- [ ] Change-Ticket-API-Integration (Jira/Azure)
- [ ] Versions-Verlauf (frühere Upgrades)
- [ ] Video-Tutorials für jede Seite

### Phase 3 (Geplant)
- [ ] Echtzeit-Statusdashboard
- [ ] Slack-Integrationen
- [ ] Multi-Benutzer-Support
- [ ] Cloud-Synchronisation
- [ ] Audit-Trail-Export

---

## 💬 FAQ

**F: Wo sind die Markdown-Dateien?**  
A: Im Root-Verzeichnis (`../README.md`, `../GETTING_STARTED.md`, etc.). Web-Seiten sind separate HTML-Dateien im `docs/`-Verzeichnis.

**F: Kann ich HTML + Markdown mischen?**  
A: Ja! Markdown für Ticket-System (Git-tracked), HTML für digitale Workflows. Siehe NAVIGATION.md für die Kombinationsmöglichkeiten.

**F: Wo wird meine Eingebung gespeichert?**  
A: Im Browser-LocalStorage (Client-side). Nicht auf einem Server!

**F: Wie exportiere ich die Ergebnisse?**  
A: maintenance-form.html → PDF, checklist.html → Text-Datei. Beide downloadbar.

**F: Funktioniert es offline?**  
A: Ja! HTML + CSS + JS sind lokal. Nur jsPDF-Bibliothek braucht Internet (für PDF-Export).

---

**Status:** ✅ **Production Ready**  
**Zuletzt aktualisiert:** 30. Januar 2026  
**Dokumentation sauber integriert:** 🎉
