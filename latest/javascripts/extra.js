// Custom JavaScript for Ta-SIEMPlus documentation

// Add version badge to page title if on versioned page
document.addEventListener('DOMContentLoaded', function() {
  // Add copy confirmation for code blocks
  const copyButtons = document.querySelectorAll('.md-clipboard');
  copyButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Visual feedback for copy action
      const icon = this.querySelector('.md-clipboard__icon');
      if (icon) {
        icon.classList.add('copied');
        setTimeout(() => {
          icon.classList.remove('copied');
        }, 2000);
      }
    });
  });

  // Highlight no-go gates
  const paragraphs = document.querySelectorAll('p');
  paragraphs.forEach(p => {
    if (p.textContent.includes('STOP') || p.textContent.includes('No-Go') || p.textContent.includes('DO NOT PROCEED')) {
      p.classList.add('no-go-gate-warning');
      p.style.backgroundColor = 'rgba(244, 67, 54, 0.1)';
      p.style.padding = '10px';
      p.style.borderLeft = '4px solid #f44336';
      p.style.marginLeft = '0';
    }
  });

  // Add external link indicators
  const externalLinks = document.querySelectorAll('a[href^="http"]');
  externalLinks.forEach(link => {
    if (!link.hostname.includes(window.location.hostname)) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      
      // Add external link icon
      if (!link.querySelector('.external-link-icon')) {
        const icon = document.createElement('sup');
        icon.innerHTML = '⎋';
        icon.className = 'external-link-icon';
        icon.style.fontSize = '0.8em';
        icon.style.marginLeft = '2px';
        link.appendChild(icon);
      }
    }
  });

  // Enhanced search functionality
  const searchInput = document.querySelector('.md-search__input');
  if (searchInput) {
    searchInput.addEventListener('focus', function() {
      this.setAttribute('placeholder', 'Search documentation (e.g., "upgrade", "checklist", "runbook")');
    });
    
    searchInput.addEventListener('blur', function() {
      this.setAttribute('placeholder', 'Search');
    });
  }

  // Add keyboard shortcuts help
  document.addEventListener('keydown', function(e) {
    // Alt+H to show keyboard shortcuts
    if (e.altKey && e.key === 'h') {
      e.preventDefault();
      showKeyboardShortcuts();
    }
  });
});

// Show keyboard shortcuts modal
function showKeyboardShortcuts() {
  const shortcuts = [
    { key: 'F or /', action: 'Focus search' },
    { key: 'N', action: 'Next search result' },
    { key: 'P', action: 'Previous search result' },
    { key: 'ESC', action: 'Clear search' },
    { key: 'Alt+H', action: 'Show this help' }
  ];
  
  let message = 'Keyboard Shortcuts:\n\n';
  shortcuts.forEach(s => {
    message += `${s.key}: ${s.action}\n`;
  });
  
  alert(message);
}

// Add print-friendly version button
function addPrintButton() {
  const actions = document.querySelector('.md-content__inner');
  if (actions) {
    const printBtn = document.createElement('button');
    printBtn.textContent = '🖨️ Print';
    printBtn.className = 'md-button md-button--primary print-button';
    printBtn.style.marginBottom = '20px';
    printBtn.onclick = function() {
      window.print();
    };
    actions.insertBefore(printBtn, actions.firstChild);
  }
}

// Initialize enhancements
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addPrintButton);
} else {
  addPrintButton();
}
