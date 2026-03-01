# Agent Group – Windows Endpoints

Shared-Konfiguration für die Agentengruppe **`windows-endpoints`**.
Wird automatisch an alle Mitglieder der Gruppe verteilt.

**Rohdatei (zum Download):** [`agent_groups/windows-endpoints.conf`](agent_groups/windows-endpoints.conf)

## Deployment

```bash
# Gruppe anlegen (falls nicht vorhanden)
/var/ossec/bin/agent_groups -a -g windows-endpoints

# Konfiguration deployen
cp docs/config-templates/manager/agent_groups/windows-endpoints.conf \
   /var/ossec/etc/shared/windows-endpoints/agent.conf

# Agent zur Gruppe hinzufügen
/var/ossec/bin/agent_groups -a -i <AGENT_ID> -g windows-endpoints
```

## Voraussetzungen (Windows GPO)

Für vollständiges PowerShell-Logging müssen folgende GPO-Einstellungen aktiv sein:

| GPO-Pfad | Einstellung | Wert |
|---|---|---|
| `Computer Configuration > Administrative Templates > Windows Components > Windows PowerShell` | Turn on Module Logging | Enabled |
| `Computer Configuration > Administrative Templates > Windows Components > Windows PowerShell` | Turn on Script Block Logging | Enabled |
| `Computer Configuration > Administrative Templates > Windows Components > Windows PowerShell` | Turn on PowerShell Transcription | Enabled |

## Template

```xml
<!--
  agent_groups/windows-endpoints.conf – Shared Config für Windows-Endpoints
  Template Version: 1.0
  Gruppe:           windows-endpoints

  Diese Datei wird auf alle Agenten der Gruppe "windows-endpoints" verteilt.
  Deployment: /var/ossec/etc/shared/windows-endpoints/agent.conf
-->
<agent_config>

  <!-- FIM – Windows-Systempfade -->
  <syscheck>
    <directories check_all="yes" realtime="yes">%WINDIR%\System32\drivers\etc</directories>
    <directories check_all="yes" realtime="yes">%WINDIR%\System32\WindowsPowerShell</directories>
    <directories check_all="yes">%PROGRAMFILES%</directories>
    <directories check_all="yes">%PROGRAMFILES(X86)%</directories>

    <!-- Registry-Überwachung -->
    <windows_registry>HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Run</windows_registry>
    <windows_registry>HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\RunOnce</windows_registry>
    <windows_registry>HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services</windows_registry>
    <windows_registry arch="both">HKEY_LOCAL_MACHINE\Software\Microsoft\Windows NT\CurrentVersion</windows_registry>

    <ignore>%WINDIR%\System32\LogFiles</ignore>
    <ignore>%WINDIR%\Temp</ignore>
    <ignore>%APPDATA%\Local\Temp</ignore>
  </syscheck>

  <!-- Windows Event Logs -->
  <localfile>
    <log_format>eventchannel</log_format>
    <location>Security</location>
    <query>Event/System[EventID != 5156 and EventID != 5157 and EventID != 5158]</query>
  </localfile>
  <localfile>
    <log_format>eventchannel</log_format>
    <location>System</location>
  </localfile>
  <localfile>
    <log_format>eventchannel</log_format>
    <location>Application</location>
  </localfile>
  <localfile>
    <log_format>eventchannel</log_format>
    <location>Microsoft-Windows-PowerShell/Operational</location>
  </localfile>
  <localfile>
    <log_format>eventchannel</log_format>
    <location>Microsoft-Windows-Windows Defender/Operational</location>
  </localfile>
  <localfile>
    <log_format>eventchannel</log_format>
    <location>Microsoft-Windows-TaskScheduler/Operational</location>
  </localfile>

  <!-- SCA – Windows CIS Policy -->
  <sca>
    <enabled>yes</enabled>
    <scan_on_start>yes</scan_on_start>
    <interval>12h</interval>
    <policies>
      <policy>etc/shared/sca/cis_win11_enterprise.yml</policy>
    </policies>
  </sca>

</agent_config>
```

## Hinweise

- Event IDs 5156/5157/5158 (Network Connection Filtering) werden gefiltert – sehr hohes Volumen
- Windows Defender Events nur relevant wenn kein EDR vorhanden
