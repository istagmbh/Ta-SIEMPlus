# Getting Started

## Documentation

The complete documentation is accessible directly in your browser:

**[https://istagmbh.github.io/Ta-SIEMPlus/](https://istagmbh.github.io/Ta-SIEMPlus/)**

No login, no setup – simply open the URL.

---

## Web Tools

The interactive tools are also accessible via GitHub Pages:

| Tool | Description |
|---|---|
| [Upgrade Form](webforms/upgrade-form.html) | Guided Wazuh AIO upgrade workflow with PDF export |
| [Checklist Generator](webforms/checklist-generator.html) | Generate and export maintenance checklists |
| [Agent Management](webforms/agent-management.html) | Command generator for Wazuh Agents |
| [Maintenance Log](webforms/maintenance-protocol.html) | Structured maintenance documentation |

All tools run entirely in the browser – no backend, no installation.

---

## Local development (contributors only)

For anyone who wants to make changes to the documentation:

```bash
# Clone the repo
git clone https://github.com/istagmbh/Ta-SIEMPlus.git
cd Ta-SIEMPlus

# Install dependencies
pip install mkdocs-material mike pymdown-extensions

# Start local preview
mkdocs serve
# → http://127.0.0.1:8000
```

Commit changes in a feature branch and submit via PR –
GitHub Actions deploys automatically after merging into `main`.
