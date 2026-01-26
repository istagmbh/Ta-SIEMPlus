# Testing the Maintenance Form

This document describes how to test the web-based maintenance form.

## Prerequisites

- A modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Internet connection (for loading the jsPDF library from CDN)

## Testing Steps

### 1. Open the Form

Open `maintenance-form.html` in your web browser:

**Option A: File Protocol**
```bash
# On Linux/Mac:
open docs/maintenance-form.html

# On Windows:
start docs/maintenance-form.html

# Or simply double-click the file in your file explorer
```

**Option B: Local HTTP Server (Recommended)**
```bash
cd docs
python3 -m http.server 8080
# Then open http://localhost:8080/maintenance-form.html in your browser
```

### 2. Fill Out the Form

The form includes pre-filled default values for date/time fields. Try filling out the form with sample data:

**Required Fields:**
- **System/Asset Name**: `wazuh-prod-01`
- **Environment**: Select `Production`
- **Maintenance Type**: Select `Routine Maintenance`
- **Change/Ticket ID**: `CHG-2026-00123`
- **Start Date & Time**: (pre-filled with current time)
- **End Date & Time**: (pre-filled with current time + 2 hours)
- **Responsible Person**: `David Dutler`
- **Step-by-Step Checklist**:
  ```
  - Create VM snapshot (ID: snap-20260126-001)
  - Stop filebeat and wazuh-dashboard services
  - Backup security configuration
  - Set shard allocation to primaries
  - Upgrade wazuh-indexer package
  - Re-apply security configuration
  - Upgrade wazuh-manager package
  - Update filebeat module and templates
  - Upgrade wazuh-dashboard package
  - Verify all services are running
  - Test dashboard login
  - Confirm data flow
  - Document versions
  ```
- **Result/Status**: Select `Success`
- **Post-Maintenance Validation**:
  ```
  - Dashboard accessible via HTTPS ✓
  - Login successful with admin credentials ✓
  - New events visible in dashboard ✓
  - All services status: active (running) ✓
  - No errors in systemctl or journalctl ✓
  ```
- **Backout/Rollback Plan**:
  ```
  If issues occur:
  1. Restore from VM snapshot: snap-20260126-001
  2. Verify all services start correctly
  3. Confirm data flow resumes
  4. Alternative: Use apt package downgrade (document risk in ticket)
  ```
- **Approver/Reviewer Name**: `Ivan Stricker`
- **Approval Date**: (pre-filled with current time)

**Optional Fields:**
- **Affected Systems/Logs**: `wazuh-indexer, wazuh-manager, wazuh-dashboard, filebeat`
- **Notes/Attachments**: `Upgrade from 4.9.0 to 4.12.0. All pre-checks passed. No breaking changes identified in release notes.`

### 3. Test Form Validation

Try clicking "Generate PDF" without filling required fields to see validation in action:
- Empty required fields will be highlighted in red
- Error messages will appear below invalid fields
- The form will automatically focus on the first invalid field

### 4. Generate PDF

Once all required fields are filled:
1. Click "Generate PDF"
2. A success message will appear briefly
3. The PDF will be automatically downloaded with filename format: `maintenance-report-{ticketId}-{date}.pdf`

Example filename: `maintenance-report-CHG-2026-00123-2026-01-26.pdf`

### 5. Verify PDF Content

Open the generated PDF and verify it contains:
- Title: "Wazuh SIEM Maintenance Report"
- Generation timestamp
- All sections properly formatted:
  - Basic Information
  - Maintenance Schedule
  - Maintenance Details
  - Approval & Review
  - Optional Information (if provided)
- Page numbers in footer
- Professional formatting and layout

### 6. Test Clear Form Button

Click "Clear Form" to reset all fields to default values. A confirmation dialog will appear.

## Expected Behavior

### Form Rendering
- Professional gradient background (purple/blue)
- White form container with rounded corners
- Responsive layout (works on mobile and desktop)
- Clear section headings
- Proper field labels with required indicators (*)

### Validation
- HTML5 native validation for required fields
- Custom validation for date range (end must be after start)
- Visual feedback (red borders) for invalid fields
- Error messages below invalid fields

### PDF Generation
- Clean, professional PDF layout
- Multi-page support with automatic page breaks
- All form data included in structured format
- Page numbers on all pages
- Proper text wrapping for long content

## Troubleshooting

### PDF Not Generating
- **Issue**: "jsPDF is not defined" error in browser console
- **Cause**: CDN blocked or no internet connection
- **Solution**: Ensure internet connection is available for CDN access

### Form Not Loading Properly
- **Issue**: Styles not applied or form looks broken
- **Cause**: Browser compatibility issue
- **Solution**: Use a modern browser (Chrome, Firefox, Edge, Safari)

### Date Fields Not Working
- **Issue**: Date/time picker not appearing
- **Cause**: Browser doesn't support `datetime-local` input type
- **Solution**: Use a modern browser with HTML5 support

## Integration with Existing Workflows

The maintenance form complements the existing markdown-based workflow:

1. **Before Maintenance**: Use the form to document the maintenance plan
2. **During Maintenance**: Follow the existing runbooks (`runbooks/RUNBOOK_WAZUH_UPGRADE_AIO_UBUNTU.md`)
3. **After Maintenance**: Update the form with results and generate PDF for documentation
4. **Archiving**: Store the generated PDF with the change ticket

The form captures the same information as the markdown checklists but provides:
- Guided input with validation
- Professional PDF output for customer/management reporting
- Consistent formatting across all maintenance reports
- Easy archival and sharing

## Browser Compatibility Notes

Tested and confirmed working in:
- ✅ Chrome 120+ (Desktop & Mobile)
- ✅ Firefox 120+ (Desktop & Mobile)
- ✅ Safari 17+ (Desktop & Mobile)
- ✅ Edge 120+ (Desktop)

Features used:
- HTML5 form validation
- CSS Grid and Flexbox
- datetime-local input type
- ES6 JavaScript features
- jsPDF library (loaded from CDN)

The form uses modern web standards but degrades gracefully in older browsers with basic HTML5 support.
