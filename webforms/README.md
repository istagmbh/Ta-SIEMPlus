# Ta-SIEMPlus Web Forms

Interactive web-based tools for Wazuh SIEM management workflows.

## 🌐 Overview

This directory contains offline-capable web forms that provide user-friendly interfaces for operational tasks documented in the Ta-SIEMPlus runbooks and checklists.

## 📋 Available Forms

### 1. **upgrade-form.html** - Wazuh Upgrade Assistant
Interactive step-by-step guide for Wazuh AIO upgrades.

**Features:**
- 5-stage workflow with progress tracking
- Mandatory pre-flight checks (no-go gates)
- PRE/POST health snapshot collection
- PDF export for documentation
- LocalStorage auto-save
- Synchronized with `RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md`

**Use Cases:**
- Major/minor version upgrades
- Patch deployments
- Maintenance window execution

---

### 2. **checklist-generator.html** - Dynamic Checklist Creator
Create custom checklists from templates or scratch.

**Features:**
- 4 pre-configured templates (Upgrade, Agent Management, Incident, Custom)
- Dynamic task addition/removal
- Metadata fields for audit trails
- Markdown export
- Copy-to-clipboard functionality
- Real-time preview

**Use Cases:**
- Creating custom maintenance checklists
- Generating ticket templates
- Documenting procedures

---

### 3. **agent-management.html** - Agent Group Management
Command generator and reference for Wazuh agent groups.

**Features:**
- Interactive command generator (7 operations)
- 7 ready-to-use examples
- Copy-paste friendly outputs
- Complete CLI reference
- Best practices guide
- Links to runbooks and official docs

**Use Cases:**
- Creating/managing agent groups
- Assigning agents to groups
- Configuring group-specific policies
- Multi-group assignments

---

### 4. **maintenance-protocol.html** - Maintenance Documentation
Structured form for documenting maintenance work.

**Features:**
- Pre/during/post maintenance sections
- Built-in timer with start/pause/stop
- Problem tracking with resolution status
- Risk assessment fields
- PDF export for archival
- LocalStorage for WIP saving

**Use Cases:**
- Change management documentation
- Incident response logging
- Maintenance window tracking
- Post-mortem documentation

---

### 5. **warum-siem.html** - Warum ganzheitliches SIEM?
Informational page (German) explaining why holistic SIEM monitoring with Wazuh is essential.

**Sections:**
- Ganzheitliche Sicherheitsüberwachung (5 pillars: telemetry, correlation, context, detection+response, compliance)
- Antivirus vs. SIEM comparison (limitations of signature-based tools)
- Paradigm shift: from tool silo to security operations, from prevention-only to detection+response
- "Warum seit 40 Jahren" – structural root causes of recurring security failures
- Wazuh SIEM advantages (open source, agent telemetry, rules, dashboards, integrations)
- Next Steps checklist with prioritised recommended actions

**Use Cases:**
- Customer education and onboarding conversations
- Internal awareness and justification material
- Reference for proposing a SIEM project to management

---

## 🚀 Getting Started

### Opening the Forms

1. **Local Filesystem:**
   ```bash
   # Navigate to webforms directory
   cd /path/to/Ta-SIEMPlus/webforms
   
   # Open in browser
   firefox index.html
   # or
   chromium-browser index.html
   ```

2. **Web Server (Optional):**
   ```bash
   # Python 3
   python3 -m http.server 8000
   
   # Then open: http://localhost:8000
   ```

3. **MkDocs Integration:**
   Forms are accessible via the MkDocs documentation site when running:
   ```bash
   mkdocs serve
   ```

### Using the Forms

1. **Start at index.html** - Landing page with all form links
2. **Select your task** - Click the appropriate form card
3. **Fill in metadata** - All forms require operator/customer/infrastructure info
4. **Follow the workflow** - Forms guide you through each step
5. **Export/Save** - Use PDF export or LocalStorage to save your work

---

## 🎨 Design Philosophy

### Consistency
- All forms use the same color scheme (purple gradient: `#667eea` → `#764ba2`)
- Shared typography and spacing
- Consistent button styles and interactions
- Unified navigation (back to index.html)

### Offline-First
- No external dependencies except jsPDF CDN (for PDF generation)
- LocalStorage for data persistence
- Works without internet connection
- No server-side requirements

### Mobile-Responsive
- Breakpoint at 768px for mobile devices
- Touch-friendly buttons and inputs
- Optimized layouts for small screens

### Validation & Safety
- Client-side input validation
- Confirmation dialogs for destructive actions
- Required field indicators
- Helpful tooltips and instructions

---

## 🔗 Integration with Ta-SIEMPlus

### Runbook References
Forms reference specific runbook sections:
- **upgrade-form.html** ↔ `runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md`
- **agent-management.html** ↔ `runbooks/RUNBOOK_WAZUH_AGENT_GROUP_MANAGEMENT.md`

### Checklist Synchronization
Generated checklists follow the same structure as:
- `checklists/CHECKLIST-TEMPLATE.md`
- `checklists/CHECKLIST_WAZUH_UPGRADE_AIO.md`

### Catalog Integration
Forms use metadata fields matching:
- `Catalog/CUSTOMERS.md` schema
- Change ticket references
- Infrastructure identifiers

---

## 📦 Dependencies

### External (CDN)
- **jsPDF** (v2.5.1) - Used by `upgrade-form.html` and `maintenance-protocol.html`
  - CDN: `https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js`
  - Purpose: PDF generation
  - Fallback: Manual export as text if CDN unavailable

### Browser APIs
- **LocalStorage** - Data persistence
- **Clipboard API** - Copy-to-clipboard functionality
- **FormData** - Form handling

### Browser Requirements
- Modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- JavaScript enabled
- LocalStorage enabled
- ~5MB storage space (for LocalStorage)

---

## 🔒 Security & Privacy

### Data Storage
- **All data stored locally** in browser LocalStorage
- **No data transmitted** to external servers
- **User controls data** - clear anytime via browser settings

### Secrets Management
- Forms prompt for references to secrets (e.g., `vault://...`)
- **Never store actual credentials** in forms
- Follow Ta-SIEMPlus secret management guidelines

### PDF Exports
- Generated client-side via jsPDF
- No data sent to external services
- PDFs contain only user-entered information

---

## 🛠️ Customization

### Modifying Forms
Forms are standalone HTML files with embedded CSS and JavaScript.

**To customize:**
1. Edit the HTML file directly
2. Modify inline `<style>` for appearance changes
3. Update `<script>` sections for functionality changes
4. Test in browser before committing

### Adding New Forms
1. Create new HTML file in `webforms/` directory
2. Use existing forms as template
3. Match design language (colors, fonts, layout)
4. Add entry in `index.html`
5. Update this README

### Color Scheme Variables
```css
/* Primary gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Accent colors */
--primary: #667eea;
--secondary: #764ba2;
--success: #28a745;
--danger: #dc3545;
--warning: #ffc107;
--info: #17a2b8;
```

---

## 📚 Related Documentation

- **[GETTING_STARTED.md](../GETTING_STARTED.md)** - Project overview
- **[NAVIGATION.md](../NAVIGATION.md)** - Repository structure
- **[QUICK_REFERENCE.md](../QUICK_REFERENCE.md)** - Command reference
- **[runbooks/](../runbooks/)** - Detailed procedures
- **[checklists/](../checklists/)** - Markdown checklists
- **[Catalog/](../Catalog/)** - Customer infrastructure registry

---

## 🐛 Troubleshooting

### Forms Not Loading
- Ensure JavaScript is enabled in browser
- Check browser console for errors (F12)
- Verify file path is correct
- Try opening from `index.html` first

### PDF Export Not Working
- Check internet connection (jsPDF requires CDN)
- Verify browser allows scripts from CDN
- Check browser console for errors
- Alternative: Copy text and save manually

### LocalStorage Issues
- Check browser storage settings
- Clear old data: Browser settings → Storage → Clear
- Verify ~5MB storage available
- Try incognito/private mode to test

### Mobile Display Issues
- Rotate device to landscape if needed
- Zoom out if elements overlap
- Some features work better on desktop
- Use latest browser version

---

## 🤝 Contributing

When modifying or adding forms:

1. **Follow existing patterns** - Match design and structure
2. **Test thoroughly** - All browsers, mobile, offline mode
3. **Document changes** - Update this README
4. **Validate HTML** - Use W3C validator
5. **Check accessibility** - ARIA labels, keyboard navigation
6. **Update index.html** - Add links to new forms

---

## 📄 License

MIT License - Same as Ta-SIEMPlus project.

See [LICENSE](../LICENSE) for details.

---

## 🙏 Acknowledgments

- **jsPDF** library for client-side PDF generation
- **Wazuh** for comprehensive SIEM platform
- **Ta-SIEMPlus** team for operational excellence

---

**Last Updated:** 2024-02-18  
**Version:** 1.0.0  
**Maintainer:** Ta-SIEMPlus Team
