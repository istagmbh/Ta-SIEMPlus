# Documentation and Tools

This directory contains supplementary documentation and tools for the Managed SIEM Service (Wazuh).

## Web-Based Maintenance Form

The `maintenance-form.html` file provides an interactive, browser-based alternative to the markdown-based runbooks and checklists.

### Features

- **Comprehensive Form**: Captures all essential maintenance workflow information based on Wazuh best practices
- **Client-Side PDF Generation**: Generates professional PDF reports directly in the browser without server dependencies
- **Validation**: Built-in form validation ensures all required fields are completed
- **Responsive Design**: Works on desktop and mobile devices
- **No Installation Required**: Simply open the HTML file in any modern web browser

### Required Fields

The form includes the following required fields:
- System/Asset name
- Environment (Production/Test/Development)
- Maintenance type (Routine/Ad-hoc/Emergency)
- Start and end date/time
- Responsible person
- Change/Ticket ID
- Step-by-step checklist (multi-line)
- Result/Status (Success/Failure/Partial Success/Rolled Back)
- Post-maintenance validation/check
- Backout/Rollback plan
- Approval/Review (name + date)

### Optional Fields

- Affected systems/logs
- Notes/attachments

### Usage

1. Open `maintenance-form.html` in a web browser (Chrome, Firefox, Edge, Safari)
2. Fill in all required fields (marked with *)
3. Add optional information as needed
4. Click "Generate PDF" to create a downloadable maintenance report
5. The PDF will be automatically downloaded with a filename including the ticket ID and date

### Browser Compatibility

The form works in all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Integration with Runbooks

While this form provides a convenient digital workflow, it complements rather than replaces the existing markdown runbooks and checklists:

- **Runbooks** (`../runbooks/`): Provide detailed step-by-step technical procedures
- **Checklists** (`../checklists/`): Offer copy-paste templates for change tickets
- **Maintenance Form**: Provides a guided digital interface for documentation and PDF export

Use the approach that best fits your workflow and change management requirements.

## Future Enhancements

Potential future improvements:
- Auto-save to browser local storage
- Import/export form data as JSON
- Integration with ticketing systems
- Additional PDF styling options
- Pre-fill from checklist templates
