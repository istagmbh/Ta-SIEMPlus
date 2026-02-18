---
# T-Alpha GmbH – Berichts-Header Template
# Verwendung: In Report-Dateien einbinden oder kopieren
report_template_version: "1.0"
brand: "T-Alpha GmbH"
---

<!-- T-Alpha Corporate Header für Reports -->
<div style="background: linear-gradient(135deg, #3b3e90, #2d3070); color: white; padding: 24px 32px; border-radius: 8px; margin-bottom: 24px; font-family: Inter, Segoe UI, sans-serif;">
  <h1 style="margin: 0 0 6px 0; font-size: 1.5em; color: white;">{{report_title | default("Report")}}</h1>
  <p style="margin: 0; opacity: 0.85; font-size: 0.9em;">T-Alpha GmbH &middot; IT Security &middot; <a href="https://www.t-alpha.ch" style="color: #c8caff;">www.t-alpha.ch</a></p>
</div>

| **Feld** | **Wert** |
|----------|----------|
| Kunde | `{{customer}}` |
| Operator | `{{operator}}` |
| Datum | `{{date}}` |
| Dokument-Version | `{{version \| default("1.0")}}` |
| Vertraulichkeit | `{{confidentiality \| default("Intern")}}` |

---
