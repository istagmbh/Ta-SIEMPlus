# Konfigurationsvorlagen (Config Templates)

Betriebsfertige Konfigurationsvorlagen für alle Wazuh-Komponenten.
Alle Variablen sind mit `{{ VARIABLE_NAME }}` markiert – eine vollständige Referenz
aller Variablen steht in [VARIABLES.md](VARIABLES.md).

---

## Verwendung

### Schritt 1 – Variablen definieren

Lege eine Datei `vars.yml` an (wird **niemals** committed):

```yaml
# vars.yml – NICHT in Git einchecken!
MANAGER_HOST: "192.168.1.10"
CLUSTER_NAME: "wazuh-cluster"
CLUSTER_NODE_NAME: "wazuh-manager-01"
INDEXER_HOST: "127.0.0.1"
INDEXER_PORT: "9200"
CUSTOMER_ID: "kunde-ag"
```

### Schritt 2 – Template befüllen

```bash
# Mit envsubst (einfachste Methode)
export $(cat vars.yml | grep -v '#' | xargs)
envsubst < manager/ossec.conf.template > /var/ossec/etc/ossec.conf

# Oder mit sed für einzelne Variablen
sed 's/{{ MANAGER_HOST }}/192.168.1.10/g' manager/ossec.conf.template
```

### Schritt 3 – Validieren & deployen

```bash
# Wazuh-Konfiguration validieren
/var/ossec/bin/wazuh-control check-config

# Dienst neu starten
systemctl restart wazuh-manager
```

---

## Verfügbare Templates

| Datei | Komponente | Beschreibung |
|---|---|---|
| [manager/ossec.conf.template](manager/ossec.conf.template) | Manager (AIO) | Vollständige Manager-Konfiguration |
| [agent/ossec.conf.template](agent/ossec.conf.template) | Agent (Linux) | Standard Linux-Agent-Konfiguration |
| [manager/agent_groups/linux-servers.conf](manager/agent_groups/linux-servers.conf) | Agentengruppe | Shared Config für Linux-Server |
| [manager/agent_groups/windows-endpoints.conf](manager/agent_groups/windows-endpoints.conf) | Agentengruppe | Shared Config für Windows-Endpoints |
| [indexer/opensearch.yml.template](indexer/opensearch.yml.template) | Wazuh Indexer | OpenSearch/Indexer-Konfiguration |
| [filebeat/filebeat.yml.template](filebeat/filebeat.yml.template) | Filebeat | Filebeat für Wazuh-Dashboard |

---

## Variablenreferenz

Vollständige Beschreibung aller `{{ VARIABLE }}`-Platzhalter: **[VARIABLES.md](VARIABLES.md)**

---

## Hinweise

!!! warning "Secrets"
    Variablen wie `INDEXER_PASSWORD` oder `API_PASSWORD` **niemals** in Git einchecken.
    Immer über Vault oder CI/CD-Secrets befüllen:
    ```bash
    INDEXER_PASSWORD=$(vault kv get -field=password secret/wazuh/indexer)
    ```

!!! info "Wazuh-Version"
    Templates sind für **Wazuh {{ WAZUH_VERSION }}** getestet.
    Bei anderen Versionen auf strukturelle Änderungen in der Dokumentation prüfen.
