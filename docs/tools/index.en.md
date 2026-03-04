---
hide:
  - toc
---

# Web Tools

Interactive browser tools for all operational Ta-SIEMPlus workflows.
No server, no installation – everything runs directly in the browser.

<div style="text-align: center; margin: 24px 0">
  <a href="../webforms/index.html" style="display:inline-block; background:#3b3e90; color:#fff; padding:12px 28px; border-radius:6px; font-weight:600; text-decoration:none; font-size:1em;">Open all tools in the portal ↗</a>
</div>

---

## Upgrade & Maintenance

<div class="grid cards" markdown>

-   **Wazuh Upgrade Form**

    ---

    Guided upgrade workflow for Wazuh AIO. Automatically generates all commands
    and creates checklists for pre- and post-checks.

    - Pre-flight checks & no-go gates
    - Step-by-step guidance
    - Health snapshots (pre & post)
    - PDF export for ticketing system

    [:octicons-arrow-right-24: Open Upgrade Form](../webforms/upgrade-form.html)

-   **Checklist Generator**

    ---

    Generate, fill out and export individual checklists for maintenance windows.

    - Customisable templates
    - Metadata management
    - Markdown export
    - Copy to ticket

    [:octicons-arrow-right-24: Open Checklist Generator](../webforms/checklist-generator.html)

-   **Maintenance Log**

    ---

    Structured recording of maintenance activities with local storage (LocalStorage).

    - Structured data capture
    - Time tracking
    - Document troubleshooting steps
    - PDF archiving

    [:octicons-arrow-right-24: Open Maintenance Log](../webforms/maintenance-protocol.html)

</div>

---
## Administration

<div class="grid cards" markdown>

-   **Agent Management**

    ---

    Command generator for Wazuh Agent groups, registration and configuration distribution.

    - Create & edit groups
    - Assign agents
    - Command generator
    - Multi-group support

    [:octicons-arrow-right-24: Open Agent Management](../webforms/agent-management.html)

-   **Alert Rule Editor**

    ---

    Visually create, validate and export Wazuh custom detection rules as XML.

    - Visual rule builder (no XML required)
    - 8 templates (brute force, Mimikatz, PowerShell, ...)
    - Live XML preview with validation
    - MITRE ATT&CK mapping, rule library

    [:octicons-arrow-right-24: Open Alert Rule Editor](../webforms/alert-regeleditor.html)

-   **Agent Group Planner**

    ---

    Plan group structures using a modular catalog and automatically analyse inventory data.

    - Group building blocks (OS, role, network zone, compliance)
    - Inventory analysis: CSV/JSON → automatic group suggestions
    - Hostname pattern detection (dc-, web-, db-, dmz-, ...)
    - CLI commands + agent.conf XML + Markdown documentation

    [:octicons-arrow-right-24: Open Agent Group Planner](../webforms/agent-group-planner.html)

</div>

---

## Configuration & Planning

<div class="grid cards" markdown>

-   **Configuration Generator**

    ---

    Generate Wazuh configuration files via form – no manual editing required.

    - Manager, Agent (Linux/Windows), Indexer, Filebeat
    - Live preview with syntax highlighting
    - ossec.conf validator (legacy configs & diffs)
    - Copy + download as file

    [:octicons-arrow-right-24: Open Configuration Generator](../webforms/config-generator.html)

-   **Patch Planner**

    ---

    Coordinate maintenance windows for multiple customers and avoid conflicts.

    - Monthly calendar (100% browser/offline)
    - Manage customers, types, versions and durations
    - JSON import/export for team sharing
    - PDF export for ticketing system

    [:octicons-arrow-right-24: Open Patch Planner](../webforms/patch-planner.html)

</div>

---

## Information

<div class="grid cards" markdown>

-   **Why holistic SIEM?**

    ---

    Explains why antivirus alone is not sufficient and what added value
    a holistic SIEM with Wazuh provides.

    - Antivirus vs. SIEM comparison
    - Holistic security monitoring
    - Paradigm shift explained
    - Recommended next steps

    [:octicons-arrow-right-24: Learn more](../webforms/warum-siem.html)

</div>

---

## Notes

- All tools run **entirely in the browser** – no server processes, no backend
- Data is stored locally in the browser's **LocalStorage**
- Work **offline** after the first load (fonts are cached)
- **PDF export** available in the upgrade form, maintenance log and patch planner
