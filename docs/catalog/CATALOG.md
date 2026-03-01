# Kundenkatalog – Verwaltete SIEM-Infrastrukturen

Dieses Dokument katalogisiert alle verwalteten Wazuh-Instanzen und deren Zugehörigkeiten.

**Status:** ✅ Production  
**Zuletzt aktualisiert:** 30. Januar 2026  
**Verwaltung:** Dieses Dokument wird von der Web-basierte Katalog-Funktion (dem Katalog-YAML) verwaltet.

---

## 1. Deepcloud AG

**Kunde:** Deepcloud AG  
**Region:** Schweiz (CH)  
**Kontakt:** [vault://deepcloud/contact]  
**Supportlevel:** 24/7 Premium  

### Infrastrukturen

| ID | Name | Region | Status | Wazuh-Version | Upgrade-Plan |
|---|---|---|---|---|---|
| `deeppay` | DeepPay | CH | 🟢 Active | 4.7.0 | Q2 2026 |
| `deepcloud` | DeepCloud | CH | 🟢 Active | 4.7.0 | Q2 2026 |
| `payinfra` | PayInfra | CH | 🟢 Active | 4.6.0 | Q1 2026 |
| `deepinfra` | DeepInfra | CH | 🟢 Active | 4.7.0 | Q2 2026 |

**Besonderheiten:**
- Multi-Node-Cluster (payinfra & deepinfra)
- Geoverteilte Datenzentren
- Compliance-Anforderungen: PCI-DSS, GDPR

**Kontakt-Informationen:**
```
Ansprechpartner: [vault://deepcloud/primary_contact]
Backup-Kontakt: [vault://deepcloud/secondary_contact]
Change-Window: Dienstags 02:00–06:00 UTC
```

---

## 2. Wagner International Group AG

**Kunde:** Wagner International Group AG  
**Region:** Deutschland (DE)  
**Kontakt:** [vault://wagner/contact]  
**Supportlevel:** Business Hours + Escalation  

### Infrastrukturen

| ID | Name | Region | Status | Wazuh-Version | Upgrade-Plan |
|---|---|---|---|---|---|
| `altstätten` | Altstätten | DE/CH | 🟢 Active | 4.6.0 | Q1 2026 |
| `markdorf` | Markdorf | DE | 🟢 Active | 4.5.0 | Q4 2025 |

**Besonderheiten:**
- Dual-Region-Setup
- Legacy-System (Markdorf) mit schrittweisem Upgrade-Plan
- Redundante Failover-Architektur

**Kontakt-Informationen:**
```
Ansprechpartner: [vault://wagner/primary_contact]
Change-Window: Mittwochs 22:00–02:00 UTC (Maintenance-Fenster)
Notfall-Hotline: [vault://wagner/emergency_number]
```

---

## 3. Abacus Research AG

**Kunde:** Abacus Research AG  
**Region:** Schweiz (CH)  
**Kontakt:** [vault://abacus/contact]  
**Supportlevel:** Standard Business Hours  

### Infrastrukturen

| ID | Name | Region | Status | Wazuh-Version | Upgrade-Plan |
|---|---|---|---|---|---|
| `mito` | MITO | CH | 🟢 Active | 4.7.0 | Q2 2026 |
| `aba_infra` | ABA Infrastructure | CH | 🟢 Active | 4.7.0 | Q2 2026 |

**Besonderheiten:**
- Research-fokussierte Umgebungen
- Häufige Test-Deployments
- Flexible Upgrade-Windows

**Kontakt-Informationen:**
```
Ansprechpartner: [vault://abacus/primary_contact]
IT-Lead: [vault://abacus/it_lead]
Change-Window: Freitags 15:00–19:00 UTC
```

---

## 4. Oro de Cacao

**Kunde:** Oro de Cacao  
**Region:** Sonstige EU (EU)  
**Kontakt:** [vault://orodecacao/contact]  
**Supportlevel:** Standard  

### Infrastrukturen

| ID | Name | Region | Status | Wazuh-Version | Upgrade-Plan |
|---|---|---|---|---|---|
| `default` | Default Infrastructure | EU | 🟢 Active | 4.6.0 | Q1 2026 |

**Besonderheiten:**
- Single-Node-Instanz
- Standard-Konfiguration
- Cost-optimiert

**Kontakt-Informationen:**
```
Ansprechpartner: [vault://orodecacao/primary_contact]
Change-Window: Montags 01:00–05:00 UTC
Timezone: Europe/Madrid
```

---

## Upgrade-Roadmap

### Q4 2025
- ⬜ Wagner / Markdorf: 4.5.0 → 4.6.0
- ⬜ Oro de Cacao: 4.6.0 → 4.7.0

### Q1 2026
- 🔄 Wagner / Altstätten: 4.6.0 → 4.7.0
- 🔄 Abacus / MITO & ABA: 4.7.0 → 4.8.0 (geplant)

### Q2 2026
- 🔄 Deepcloud / Alle: 4.7.0 → 4.8.0 (geplant)

---

## Verwaltungsrichtlinien

### Katalog-Aktualisierungen

1. **Kundendaten:** Updates via Pull Request auf dieses Dokument
2. **Versionsänderungen:** Nach erfolgreicher Upgrade, mit Change-Ticket-Referenz
3. **Kontaktwechsel:** SOFORT aktualisieren (Safety-Critical)
4. **Infrastruktur hinzufügen:** Neue Zeile in entsprechender Tabelle + neue Sektion falls neuer Kunde

### Geheime Daten (Vault-Referenzen)

**⚠️ NIEMALS direkt commiten:**
- Passwörter
- API-Keys
- SSH-Keys
- Private-IPs (sofern klassifiziert)

**Stattdessen:** Vault-Referenzen verwenden: `vault://customer/secret_key`

### Integration mit Web-Tools

Die Katalog-Daten werden in den YAML-Dateien gepflegt:
- Kunden und Infrastrukturen sind interaktiv selektierbar
- Auswahl wird automatisch in Formular, Checkliste und Runbook übernommen
- LocalStorage ermöglicht Persistierung während der Session

---

## Schnellerkennung: Region nach Kunde

| Kunde | Primäre Region | Failover-Region | Timezone |
|---|---|---|---|
| Deepcloud AG | CH | CH | Europe/Zurich |
| Wagner International Group AG | DE | CH | Europe/Berlin / Europe/Zurich |
| Abacus Research AG | CH | — | Europe/Zurich |
| Oro de Cacao | EU | — | Europe/Madrid |

---

## Häufige Aufgaben

### "Ich muss eine Upgrade durchführen für Kunden X"

1. Öffne [catalog/CUSTOMERS.md](CUSTOMERS.md)
2. Suche den Kunden, wähle die Infrastruktur
3. Klicke **"Im Formular verwenden"**
4. Metadaten werden automatisch gefüllt ✅
5. Öffne das **Wartungsformular** (maintenance-form.html)
6. Folge Schritt 1–5 mit der **Runbook** und **Checkliste**

### "Ich muss neue Kontaktdaten für Kunden X hinzufügen"

1. Dieses Dokument editieren (MARKDOWN)
2. Vault-Referenzen hinzufügen: `vault://kunde/secret_key`
3. Pull Request erstellen + 1 Reviewer
4. Merged → Dokumentation ist aktuell
5. **Web-Katalog wird durch JavaScript aktualisiert** (cache invalidation)

### "Welche Infrastrukturen brauchen Upgrades?"

Siehe **Upgrade-Roadmap** oben oder nutze die Web-Katalog-Suchfunktion.

---

## Feedback & Erweiterungen

Dieses Katalog-System ist **gemeinschaftlich wartbar**:

- Neue Infrastruktur? → Zeile in Tabelle + Upgrade-Plan hinzufügen
- Neue Kundin? → Neue Sektion mit Kontakt-Infos + Upgrade-Plan
- Datenfehler? → Pull Request mit Correction
- Sicherheitsbedenken? → Private Issue oder Email an Ops-Team

**Ziel:** Ein einziger Katalog, synchron zwischen Markdown und Web.

---

**Anhänge:**
- Katalog: [catalog/CUSTOMERS.md](CUSTOMERS.md)
- Upgrade-Runbook: [runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md](../runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md)
- Change-Checkliste: [checklists/CHECKLIST_WAZUH_UPGRADE_AIO.md](../checklists/CHECKLIST_WAZUH_UPGRADE_AIO.md)
