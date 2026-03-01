# Katalog

Kunden- und Infrastruktur-Registry für verwaltete Wazuh SIEM Installationen.

<div class="grid cards" markdown>

-   **Kunden-Registry**

    ---

    Vollständige Liste aller Kunden mit Infrastrukturkonfiguration,
    Zugangsdaten-Referenzen und Wartungsfenstern.

    [:octicons-arrow-right-24: Kunden ansehen](CUSTOMERS.md)

-   **Katalog-Verwaltung**

    ---

    Schema-Referenz, Pflege-Prozesse und Anleitung für neue Kunden-Einträge.

    [:octicons-arrow-right-24: Verwaltungsanleitung](CATALOG.md)

</div>

---

## Katalog im Workflow

| Wann | Wozu |
|---|---|
| **Vor dem Upgrade** | Hostname, IP, aktuelle Version und Vault-Referenz nachschlagen |
| **In der Checkliste** | `customer` und `infrastructure` Felder befüllen |
| **Im Change-Ticket** | Kunden-ID und Infrastruktur-Name referenzieren |
| **Nach dem Upgrade** | Versionsfelder im Katalog aktualisieren |

---

## Schnellsuche

```bash
# Alle Kunden auflisten
grep "customer_name:" CUSTOMERS.md

# Kunden nach Name suchen
grep -A 20 "customer_name: \"Beispiel\"" CUSTOMERS.md

# Infrastruktur suchen
grep -A 30 "name: \"wazuh-prod-01\"" CUSTOMERS.md
```

---

## Secrets-Regel

Niemals Klartext-Passwörter im Katalog. Immer Vault-Referenz verwenden:

```yaml
secrets_ref: "vault://kundenname/wazuh-prod"  # Richtig ✓
password: "geheimesPasswort123"                # Falsch ✗ – NIEMALS SO
```

---

## Kunden-Eintrag Schema

```yaml
customer_name: "Beispiel AG"
customer_id: "CUST-001"
contact:
  primary: "Max Muster <max.muster@beispiel.ch>"
  technical: "Lisa Muster <lisa.muster@beispiel.ch>"
  phone: "+41 XX XXX XX XX"

infrastructure:
  - name: "wazuh-prod-01"
    type: "All-in-One"
    environment: "Production"
    access:
      hostname: "wazuh.beispiel.ch"
      ip_address: "10.0.1.10"
      ssh_port: 22
      secrets_ref: "vault://beispiel-ag/wazuh-prod"
    components:
      wazuh_manager: { version: "4.12.0" }
      wazuh_indexer:  { version: "4.12.0" }
      wazuh_dashboard: { version: "4.12.0" }
      filebeat: { version: "7.10.2" }
    agents:
      count: 150
    maintenance:
      window: "Samstag 02:00–06:00 CET"
      next_scheduled: "2026-04-05"
```
