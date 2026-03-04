# Agent Group – Windows Endpoints

Shared configuration for the agent group **`windows-endpoints`**.
Automatically distributed to all group members.

**Raw file (for download):** [`agent_groups/windows-endpoints.conf`](agent_groups/windows-endpoints.conf)

## Deployment

```bash
# Create group (if not already present)
/var/ossec/bin/agent_groups -a -g windows-endpoints

# Deploy configuration
cp docs/config-templates/manager/agent_groups/windows-endpoints.conf \
   /var/ossec/etc/shared/windows-endpoints/agent.conf

# Add agent to group
/var/ossec/bin/agent_groups -a -i <AGENT_ID> -g windows-endpoints
```

## Prerequisites (Windows GPO)

For full PowerShell logging, the following GPO settings must be active:

| GPO Path | Setting | Value |
|---|---|---|
| `Computer Configuration > Administrative Templates > Windows Components > Windows PowerShell` | Turn on Module Logging | Enabled |
| `Computer Configuration > Administrative Templates > Windows Components > Windows PowerShell` | Turn on Script Block Logging | Enabled |
| `Computer Configuration > Administrative Templates > Windows Components > Windows PowerShell` | Turn on PowerShell Transcription | Enabled |

## Template

```xml
<!--
  agent_groups/windows-endpoints.conf – Shared config for Windows endpoints
  Template Version: 1.0
  Group:            windows-endpoints

  This file is distributed to all agents in the "windows-endpoints" group.
  Deployment: /var/ossec/etc/shared/windows-endpoints/agent.conf
-->
<agent_config>

  <!-- FIM – Windows system paths -->
  <syscheck>
    <directories check_all="yes" realtime="yes">%WINDIR%\System32\drivers\etc</directories>
    <directories check_all="yes" realtime="yes">%WINDIR%\System32\WindowsPowerShell</directories>
    <directories check_all="yes">%PROGRAMFILES%</directories>
    <directories check_all="yes">%PROGRAMFILES(X86)%</directories>

    <!-- Registry monitoring -->
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

## Notes

- Event IDs 5156/5157/5158 (Network Connection Filtering) are filtered out – very high volume
- Windows Defender events are only relevant if no EDR solution is present
