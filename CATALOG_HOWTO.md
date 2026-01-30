# 🏗️ Katalog-Verwaltung – Neue Infrastruktur hinzufügen

Schritt-für-Schritt-Anleitung zum Hinzufügen einer neuen Wazuh-Installation im Katalog.

---

## 📋 Szenario

Du hast einen **neuen Kunden** mit einer neuen **Wazuh-Installation** bekommen.  
Du brauchst diese in den Katalog eintragen, damit Operatoren die Daten schnell finden.

---

## 🎯 SCHRITT 1: Infrastruktur-Daten sammeln

Bevor du etwas eintragst, brauchst du diese Informationen vom Kunden/Systemadmin:

### Kundeninformationen
```
Kundenname:              ________________
Kundenkürzel (für URL):  ________________
Hauptkontakt Email:      ________________
Sicherheitsrichtlinien:  ________________
```

### Wazuh-Installation
```
Installationstyp:        Ubuntu AIO (APT) / Docker / Sonstiges
Umgebung:                prod / test / dev
Haupthost (FQDN):        ________________
Management-IP:           ________________
Zeitzone:                ________________
```

### Zugriffs-URLs
```
Dashboard:               https://________________
API:                     https://________________:55000
Indexer:                 https://________________:9200
```

### Netzwerk & Ports
```
Agent-Port (TCP):        1514 / Sonstiges
Manager-API (TCP):       55000 / Sonstiges
Dashboard (HTTPS):       5601 / Sonstiges
Indexer (HTTPS):         9200 / Sonstiges
Offene Ports:            ________________
```

### Secrets/Credentials
```
⚠️ **NIEMALS direkt eintragen!**
Stattdessen: Wo sind die Secrets gespeichert?
  - Vault path?           vault://customer/wazuh/...
  - 1Password vault?
  - Keepass-Datenbank?
  - Passwordstate?
```

### Wartungs-Richtlinien
```
Wartungsfenster:         Mo-Fr 22:00-06:00 / Nur nachts? / Beliebig?
Notfall-Kontakt (24/7):  ________________
Change-Approval nötig:   ja / nein
```

---

## ✏️ SCHRITT 2: Eintrag erstellen (COPY-PASTE)

### 2a) Katalog-Datei öffnen
Datei: `Catalog/CUSTOMERS.md`

### 2b) Ans Ende der Datei gehen
Scrolle bis zum Ende und finde den letzten Kundeneintrag.

### 2c) Template kopieren

Suche in der Datei nach `---` (YAML-Trennzeichen) und kopiere einen kompletten Block:

```yaml
---
customer: "DeepCloud AG"
infrastructure: "DeepInfra"
environment: "prod"
wazuh_type: "Ubuntu AIO (APT)"
hosts:
  - role: "wazuh-aio"
    fqdn: "wazuh01.example.tld"
    mgmt_ip: "10.10.10.10"
urls:
  dashboard: "https://wazuh01.example.tld"
  api: "https://wazuh01.example.tld:55000"
  indexer: "https://wazuh01.example.tld:9200"
ports_expected:
  - "1514/tcp"
  - "1515/tcp"
  - "55000/tcp"
  - "5601/tcp"
  - "9200/tcp"
secrets_ref:
  admin_user: "vault://deepcloud/wazuh/admin_user"
  admin_password: "vault://deepcloud/wazuh/admin_password"
change_policy: "Within business hours (08:00 - 17:00 CET)"
contact_email: "siem-team@deepcloud.example.tld"
---
```

### 2d) Template an Katalog anhängen

Am **Ende der Datei**, nach dem letzten Eintrag, füge eine neue Leerzeile ein und klebst dein Template:

```markdown
...
contact_email: "siem-team@existingcustomer.example.tld"
---

---
customer: "NEUE AG"    ← DEIN NEUER EINTRAG
infrastructure: "NeueInfra"
...
---
```

---

## 🖊️ SCHRITT 3: Felder ausfüllen (mit BEISPIEL)

Jedes YAML-Feld müssen mit echten Werten gefüllt werden:

### Beispiel: VORHER (Template)
```yaml
---
customer: "DeepCloud AG"              ← TEMPLATE (noch leer)
infrastructure: "DeepInfra"
environment: "prod"
wazuh_type: "Ubuntu AIO (APT)"
...
---
```

### Beispiel: NACHHER (ausgefüllt)
```yaml
---
customer: "Acme Corporation"          ← Echter Kundenname
infrastructure: "Acme-PROD-01"        ← Infrastruktur-ID
environment: "prod"                   ← prod/test/dev
wazuh_type: "Ubuntu AIO (APT)"        ← Installationstyp
hosts:
  - role: "wazuh-aio"
    fqdn: "siem.acme.example.tld"     ← Hostname (FQDN)
    mgmt_ip: "192.168.10.50"          ← Management-IP
urls:
  dashboard: "https://siem.acme.example.tld"
  api: "https://siem.acme.example.tld:55000"
  indexer: "https://siem.acme.example.tld:9200"
ports_expected:
  - "1514/tcp"                        ← Agent-Eingehend
  - "1515/tcp"                        ← Agent-Cluster
  - "55000/tcp"                       ← Manager-API
  - "5601/tcp"                        ← Dashboard
  - "9200/tcp"                        ← Indexer/Elasticsearch
secrets_ref:
  admin_user: "vault://acme/wazuh/admin_user"      ← KEIN echtes PW!
  admin_password: "vault://acme/wazuh/admin_password"
change_policy: "Within business hours (08:00 - 18:00 CET), max 2h window"
contact_email: "siem-oncall@acme.example.tld"
---
```

---

## 📝 Feld-Definitionen

| Feld | Format | Beispiel | Erklärung |
|------|--------|----------|-----------|
| `customer` | Text | "Acme Corp" | Kundenname |
| `infrastructure` | Text (no spaces) | "Acme-PROD-01" | Eindeutige ID für diese Installation |
| `environment` | prod/test/dev | "prod" | Umgebungstyp |
| `wazuh_type` | Text | "Ubuntu AIO (APT)" | Installationstyp |
| `fqdn` | FQDN | "siem.acme.tld" | Vollqualifizierter Hostname |
| `mgmt_ip` | IP-Adresse | "192.168.10.50" | Management-IP (für SSH) |
| `dashboard` | HTTPS URL | "https://siem.acme.tld" | Dashboard-Zugriff |
| `api` | HTTPS URL + Port | "https://siem.acme.tld:55000" | Manager-API |
| `indexer` | HTTPS URL + Port | "https://siem.acme.tld:9200" | Elasticsearch/Opensearch |
| `ports_expected` | Liste (TCP/UDP) | "1514/tcp" | Erwartete offene Ports |
| `admin_user` | Vault-Pfad | "vault://acme/wazuh/admin" | NIEMALS echte Passwörter! |
| `admin_password` | Vault-Pfad | "vault://acme/wazuh/pass" | NIEMALS echte Passwörter! |
| `change_policy` | Text (Geschäftszeiten) | "Mo-Fr 22:00-06:00" | Wann sind Änderungen erlaubt? |
| `contact_email` | Email | "siem@acme.tld" | Notfall-Kontakt |

---

## 🚨 WICHTIG: SECRETS

### ❌ FALSCH (NIEMALS!)
```yaml
secrets_ref:
  admin_password: "MySecretPassword123!"
```

### ✅ RICHTIG
```yaml
secrets_ref:
  admin_user: "vault://acme/wazuh/admin_user"
  admin_password: "vault://acme/wazuh/admin_password"
```

**Warum?**
- Die Katalog-Datei ist im Git Repository
- Git speichert die komplette Historie (auch gelöschte Secrets!)
- Secrets müssen in deinem Secret-Store sein (Vault, 1Password, etc.)

**Wie benutze ich die Secrets?**
```bash
# Passwort abrufen (z.B. mit Vault):
vault kv get acme/wazuh/admin_password
# Output: password: MySecretPassword123!
```

---

## 📤 SCHRITT 4: Änderung via Pull Request einreichen

Jetzt musst du die Änderung ins Repository bekommen. Das geht via **Git + Pull Request**:

### 4a) Feature-Branch erstellen
```bash
# Terminal-Befehl zum Kopieren:
git checkout -b add/customer-acme-corp
```

### 4b) Datei speichern & Änderung committen
```bash
# Terminal-Befehle zum Kopieren:
git add Catalog/CUSTOMERS.md
git commit -m "catalog: Add Acme Corporation infrastructure (Acme-PROD-01)"
```

### 4c) Auf GitHub pushen
```bash
# Terminal-Befehl zum Kopieren:
git push origin add/customer-acme-corp
```

### 4d) Pull Request erstellen
1. Gehe zu https://github.com/istagmbh/Ta-SIEMPlus
2. Klicke auf **"Pull requests"**
3. Klicke auf **"New Pull Request"**
4. Wähle:
   - **Base:** `main`
   - **Compare:** `add/customer-acme-corp`
5. **Title:** `catalog: Add Acme Corporation`
6. **Description:**
   ```markdown
   Adds new customer infrastructure to catalog:
   - Customer: Acme Corporation
   - Infrastructure: Acme-PROD-01
   - Environment: prod
   - Type: Ubuntu AIO (APT)
   - Dashboard: https://siem.acme.example.tld
   
   No breaking changes. Ready for review.
   ```
7. Klicke **"Create Pull Request"**

### 4e) Warte auf Review
- Mindestens 1 Reviewer muss zustimmen ✅
- Reviewer überprüft: Syntax, Secrets-Referenzen, Vollständigkeit
- Nach Approval: **Merge** (dein Eintrag ist live!)

---

## ✅ SCHRITT 5: Nach dem Merge

### 5a) Feature-Branch löschen (cleanup)
```bash
# Terminal-Befehl zum Kopieren:
git checkout main
git pull origin main
git branch -d add/customer-acme-corp
```

### 5b) Neue Einträge verwenden

Jetzt können Operatoren deine Daten verwenden:

```bash
# Zum Beispiel in einer Checkliste:
customer: "Acme Corporation"
infrastructure: "Acme-PROD-01"
# → Alle Daten aus Catalog/CUSTOMERS.md werden automatisch verwendet!
```

---

## 🔍 VALIDIERUNG: Vor dem Commit prüfen

Bevor du git commit machst, überprüfe:

### Checkliste:
- [ ] **Alle Felder ausgefüllt?** (nichts "UNSET" lassen)
- [ ] **YAML-Syntax korrekt?** (keine Tabulatoren, nur Spaces!)
- [ ] **Secrets nur als Vault-Pfade?** (kein echtes Passwort!)
- [ ] **URLs erreichbar?** (zumindest Dashboard + API testen)
- [ ] **Keine Duplikate?** (grep -n "customer: \"Acme\"" Catalog/CUSTOMERS.md)
- [ ] **Commit-Message aussagekräftig?** (kurz + präzise)

### YAML-Syntax testen
Öffne die Datei in einem YAML-Validator:
- Online: https://jsoncrack.com/editor
- Lokal: `python -c "import yaml; yaml.safe_load(open('Catalog/CUSTOMERS.md'))"`

Falls Fehler: Fix vor dem Commit!

---

## 📚 Vollständiges Beispiel

### Vorher (Template)
Datei: `Catalog/CUSTOMERS.md`, Zeile 100+

```yaml
---
customer: "UNSET"
infrastructure: "UNSET"
environment: "UNSET"
...
---
```

### Nachher (Ausgefüllt)
```yaml
---
customer: "TechVision AG"
infrastructure: "TechVision-Security-01"
environment: "prod"
wazuh_type: "Ubuntu AIO (APT)"
hosts:
  - role: "wazuh-aio"
    fqdn: "wazuh-prod.techvision.internal"
    mgmt_ip: "10.50.100.5"
urls:
  dashboard: "https://wazuh-prod.techvision.internal"
  api: "https://wazuh-prod.techvision.internal:55000"
  indexer: "https://wazuh-prod.techvision.internal:9200"
ports_expected:
  - "1514/tcp"
  - "1515/tcp"
  - "55000/tcp"
  - "5601/tcp"
  - "9200/tcp"
secrets_ref:
  admin_user: "vault://techvision/wazuh/admin_user"
  admin_password: "vault://techvision/wazuh/admin_password"
change_policy: "Weekdays 22:00-06:00 CET, no change Fri evening to Sun"
contact_email: "security-oncall@techvision.internal"
---
```

Git Commit:
```bash
git add Catalog/CUSTOMERS.md
git commit -m "catalog: Add TechVision AG infrastructure (prod environment)"
git push origin add/customer-techvision-ag
```

---

## 🆘 Häufige Fehler

| Fehler | Symptom | Fix |
|--------|---------|-----|
| YAML-Syntax falsch | `yaml.scanner.ScannerError` | Überprüfe Einrückung (2 Spaces, keine Tabs) |
| Feld vergessen | `infrastructure: UNSET` bleibt leer | Alle Felder ausfüllen! |
| Secret als Plaintext | `admin_password: "MyPassword123"` | Nur `vault://...` Referenzen! |
| Doppelter Eintrag | Zwei Kunden mit gleichem Namen | Überprüfe mit `grep` |
| URL falsch | `http://` statt `https://` | HTTPS verwenden! |
| Port in URLs | `https://siem.tld:5601` (falsch) | Port nur in indexer/api, nicht dashboard |

---

## 💡 Pro-Tipps

### Tip 1: Schnell einen Kunden finden
```bash
grep -A 5 "customer: \"Acme" Catalog/CUSTOMERS.md
```

### Tip 2: Alle Kunden auflisten
```bash
grep "^customer:" Catalog/CUSTOMERS.md | sort
```

### Tip 3: YAML validieren (schnell)
```bash
python3 -c "import yaml; yaml.safe_load(open('Catalog/CUSTOMERS.md'))"
# Kein Output = ✅ OK!
```

### Tip 4: Secrets-Pfade überprüfen (sicher!)
```bash
grep "secrets_ref:" -A 3 Catalog/CUSTOMERS.md | grep -v "vault://"
# Keine Ausgabe = ✅ Alle sicher!
```

---

## 📞 Support

| Frage | Antwort |
|-------|--------|
| Wo finde ich Beispiel-Einträge? | In `Catalog/CUSTOMERS.md` selbst (suche nach `---`) |
| Wie teste ich YAML? | Online: https://jsoncrack.com/editor |
| Wer kann Änderungen genehmigen? | 1 Reviewer (siehe CONTRIBUTING.md) |
| Kann ich URLs als HTTP (nicht HTTPS)? | Nein – immer HTTPS aus Sicherheit |
| Darf ich Ports hinzufügen? | Ja, wenn notwendig. Dokumentiere im Kommentar. |

---

✅ **Du bist bereit!** Viel Erfolg beim Hinzufügen neuer Infrastrukturen! 🚀
