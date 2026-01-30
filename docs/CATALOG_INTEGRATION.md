# Katalog-Integration – Web & Markdown

Das Ta-SIEMPlus-System bietet eine **duales Katalog-System:**

1. **Web-Katalog** (`docs/catalog.html`) – Interaktiv, für digitale Workflows
2. **Markdown-Katalog** (`Catalog/CATALOG.md`) – Für Git/Change-Tickets

Beide sind **synchronisiert** und ergänzen sich gegenseitig.

---

## 🌐 Web-Katalog (docs/catalog.html)

### Features

✅ **Interaktive Kundenauswahl**
- Alle 4 Kunden mit ihren Infrastrukturen aufgelistet
- Live-Suche nach Kundennamen
- Filter nach Region (CH, DE, EU)

✅ **Automatisches Ausfüllen**
- Wähle Kunden + Infrastruktur
- Klick "Im Formular verwenden" oder "In Checkliste verwenden"
- Metadaten (Customer, Infrastructure) werden AUTOMATISCH gefüllt

✅ **Navigation**
- Nahtlose Integration mit Formular, Runbook, Checkliste, Referenz
- Alle 5 Web-Seiten untereinander verlinkt

### Kunden im Katalog

| Kunde | Infrastrukturen | Region |
|---|---|---|
| **Deepcloud AG** | DeepPay, DeepCloud, PayInfra, DeepInfra | CH 🇨🇭 |
| **Wagner International Group AG** | Altstätten, Markdorf | DE/CH 🇩🇪 |
| **Abacus Research AG** | MITO, ABA Infrastructure | CH 🇨🇭 |
| **Oro de Cacao** | Default Infrastructure | EU 🌍 |

---

## 📚 Markdown-Katalog (Catalog/CATALOG.md)

### Features

✅ **Detaillierte Kundendaten**
- Kontaktinformationen (mit Vault-Referenzen)
- Support-Level und Change-Windows
- Wazuh-Versionsinformationen
- Upgrade-Roadmap pro Kunde

✅ **Sicherheit**
- Keine echten Geheimnisse in Git
- Vault-Referenzen statt Passwords: `vault://customer/secret`
- Git-Kontrolle für Audit-Trail

✅ **Verwaltung**
- Pull-Request-basiert (1 Reviewer)
- Changelog durch Git-History
- Gemeinschaftlich wartbar

### Struktur

```
Catalog/
├── CATALOG.md              ← Kundendaten + Roadmap
├── CUSTOMERS.md            ← (Optional: YAML-Schema)
└── [Kundentemplates]       ← Pro-Kunde Details (optional)
```

---

## 🔄 Synchronisierung

### Von Web zu Markdown

Die Web-Katalog-Daten sind **hardcoded** in `catalog.html` (JavaScript):

```javascript
const customers = [
    {
        id: 'deepcloud',
        name: 'Deepcloud AG',
        region: 'CH',
        infrastructures: [
            { id: 'deeppay', name: 'DeepPay' },
            { id: 'deepcloud', name: 'DeepCloud' },
            { id: 'payinfra', name: 'PayInfra' },
            { id: 'deepinfra', name: 'DeepInfra' }
        ]
    },
    // ... weitere Kunden
];
```

**Wenn du einen Kunden oder eine Infrastruktur hinzufügst:**

1. Bearbeite die JavaScript-`customers`-Array in `docs/catalog.html`
2. Aktualisiere die Markdown-Tabelle in `Catalog/CATALOG.md`
3. Schreibe einen Pull Request mit beiden Änderungen

### Kontakt & Change-Windows in Markdown

Alle **operativen Details** (Kontakte, Change-Windows, Support-Level):

- → Gehören in `Catalog/CATALOG.md`
- Nicht in der Web-Katalog (um die HTML klein zu halten)
- Git-kontrolliert für Audit-Trail

---

## 📋 Workflow: "Neue Infrastruktur hinzufügen"

### Scenario: Deepcloud AG bekommt neue Umgebung "DeepTestLab"

**Schritt 1: Katalog.html aktualisieren** (Web)

```javascript
// In docs/catalog.html, find: customers[0] (Deepcloud AG)
{
    id: 'deepcloud',
    name: 'Deepcloud AG',
    region: 'CH',
    infrastructures: [
        { id: 'deeppay', name: 'DeepPay' },
        { id: 'deepcloud', name: 'DeepCloud' },
        { id: 'payinfra', name: 'PayInfra' },
        { id: 'deepinfra', name: 'DeepInfra' },
        { id: 'deeptestlab', name: 'DeepTestLab' }  // ← NEU
    ]
}
```

**Schritt 2: Catalog.md aktualisieren** (Markdown)

```markdown
### Infrastrukturen

| ID | Name | Region | Status | Wazuh-Version | Upgrade-Plan |
|---|---|---|---|---|---|
| ... bestehende ...
| `deeptestlab` | DeepTestLab | CH | 🟢 Active | 4.7.0 | Q2 2026 |
```

**Schritt 3: PR erstellen & mergen**

```bash
git checkout -b feature/add-deepcloud-testlab
git add docs/catalog.html Catalog/CATALOG.md
git commit -m "feat: Add DeepTestLab infrastructure to Deepcloud AG"
git push origin feature/add-deepcloud-testlab
# → Pull Request erstellen (1 Reviewer erforderlich)
```

**Schritt 4: Web-Katalog nutzen**

Nach dem Merge:
1. Gehe zu docs/catalog.html (aktualisiert)
2. Suche "Deepcloud AG"
3. Wähle "DeepTestLab" 
4. Klick "Im Formular verwenden"
5. Los geht's! 🚀

---

## 🔐 Geheime Daten Management

### ✅ Richtig: Vault-Referenzen

```markdown
**Kontakt-Informationen:**
```
Ansprechpartner: [vault://deepcloud/primary_contact]
Backup-Kontakt: [vault://deepcloud/secondary_contact]
API-Key: [vault://deepcloud/api_key]
```
```

### ❌ Falsch: Direktes Commiten

```markdown
❌ DON'T DO THIS:
Passwort: admin123
SSH-Key: ssh-rsa AAAA...
```

---

## 🎯 Verwendungsszenarien

### Szenario 1: "Ich will eine Upgrade für Deepcloud/DeepPay durchführen"

1. **Web-Katalog öffnen:** [docs/catalog.html](../docs/catalog.html)
2. **Kunden & Infra wählen:** "Deepcloud AG" → "DeepPay"
3. **"Im Formular verwenden"** klicken
4. **Maintenance-Form.html öffnet sich** mit auto-gefüllten Metadaten
5. **Runbook & Checkliste** nutzen für die Durchführung
6. **PDF exportieren** für Change-Ticket

### Szenario 2: "Ich muss Kontaktinfos aktualisieren"

1. **Markdown editieren:** [Catalog/CATALOG.md](../Catalog/CATALOG.md)
2. **Vault-Referenzen aktualisieren:** z.B. `vault://deepcloud/primary_contact`
3. **Commit + PR:** "docs: Update Deepcloud primary contact"
4. **Reviewer genehmigt** (Safety-Critical!)
5. **Merged** → Dokumentation ist aktuell
6. Web zeigt trotzdem alte Namen → Das ist OK (Basis-Infos sind im Web hardcoded, Details in MD)

### Szenario 3: "Ich suche alle Infrastrukturen in der Schweiz"

1. **Web-Katalog öffnen:** [docs/catalog.html](../docs/catalog.html)
2. **Region-Filter:** "Schweiz (CH)" wählen
3. **Angezeigt:** 
   - Deepcloud AG: alle 4 (CH)
   - Wagner: Altstätten (CH)
   - Abacus: beide (CH)
4. **Markdorf & Oro werden gefiltert** (nicht CH)

---

## 📈 Künftige Erweiterungen

### Phase 2: YAML-Schema für Kundendaten

```yaml
# Catalog/customers.yaml (optional)
customers:
  - id: deepcloud
    name: Deepcloud AG
    region: CH
    contact:
      primary: vault://deepcloud/primary_contact
      backup: vault://deepcloud/secondary_contact
    support_level: 24/7 Premium
    change_window: "Tuesdays 02:00–06:00 UTC"
    infrastructures:
      - id: deeppay
        name: DeepPay
        version: 4.7.0
        upgrade_planned: Q2 2026
```

*Nutzen:* Web-Katalog könnte diese YAML laden statt hardcodiert zu sein.

### Phase 3: Automatische Versionsverwaltung

- Git-Tag pro Upgrade
- Automatische CATALOG.md-Aktualisierung nach erfolgreichem Upgrade
- Audit-Log mit Timestamps und Operator-Namen

---

## Links

- **Web-Katalog:** [docs/catalog.html](../docs/catalog.html)
- **Web-Formular:** [docs/maintenance-form.html](../docs/maintenance-form.html)
- **Markdown-Katalog:** [Catalog/CATALOG.md](../Catalog/CATALOG.md)
- **Runbook:** [runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md](../runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md)
- **Checkliste:** [checklists/CHECKLIST_WAZUH_UPGRADE_AIO.md](../checklists/CHECKLIST_WAZUH_UPGRADE_AIO.md)

---

**Erstellt:** 30. Januar 2026  
**Status:** ✅ Production Ready
