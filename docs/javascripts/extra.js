// Ta-SIEMPlus – MkDocs custom JavaScript

document.addEventListener('DOMContentLoaded', function () {

  // ── Copy button visual feedback ──────────────────────
  document.querySelectorAll('.md-clipboard').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var icon = this.querySelector('.md-clipboard__icon');
      if (icon) {
        icon.classList.add('copied');
        setTimeout(function () { icon.classList.remove('copied'); }, 2000);
      }
    });
  });

  // ── No-Go Gate highlighting ──────────────────────────
  // Uses the .no-go-gate-warning class defined in extra.css
  document.querySelectorAll('p, li').forEach(function (el) {
    var text = el.textContent;
    if (text.includes('STOP') || text.includes('No-Go') || text.includes('DO NOT PROCEED')) {
      el.classList.add('no-go-gate-warning');
    }
  });

  // ── External links: new tab + accessible label ───────
  document.querySelectorAll('a[href^="http"]').forEach(function (link) {
    try {
      var url = new URL(link.href);
      if (url.hostname && url.hostname !== window.location.hostname) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
        if (!link.getAttribute('aria-label')) {
          link.setAttribute('aria-label', link.textContent.trim() + ' (öffnet in neuem Tab)');
        }
      }
    } catch (_) { /* ignore malformed URLs */ }
  });

  // ── German search placeholder ────────────────────────
  var searchInput = document.querySelector('.md-search__input');
  if (searchInput) {
    searchInput.addEventListener('focus', function () {
      this.setAttribute('placeholder', 'Suchen (z.B. "upgrade", "checklist", "agent")');
    });
    searchInput.addEventListener('blur', function () {
      this.setAttribute('placeholder', 'Suchen');
    });
  }

  // ── Keyboard shortcut modal (Alt+H) ─────────────────
  var modal = createShortcutModal();
  document.body.appendChild(modal);

  document.addEventListener('keydown', function (e) {
    if (e.altKey && e.key === 'h') {
      e.preventDefault();
      modal.style.display = 'flex';
    }
    if (e.key === 'Escape') {
      modal.style.display = 'none';
    }
  });

  // ── Section progress indicator ───────────────────────
  addReadingProgress();
});

// ── Keyboard shortcut modal builder ─────────────────────
function createShortcutModal() {
  var shortcuts = [
    { key: 'F  /  S', action: 'Suche öffnen' },
    { key: 'N', action: 'Nächstes Suchergebnis' },
    { key: 'P', action: 'Vorheriges Suchergebnis' },
    { key: 'ESC', action: 'Suche schliessen / Modal schliessen' },
    { key: 'Alt + H', action: 'Diese Übersicht anzeigen' }
  ];

  var overlay = document.createElement('div');
  overlay.id = 'shortcut-modal';
  overlay.style.cssText = [
    'display:none', 'position:fixed', 'inset:0', 'z-index:9999',
    'background:rgba(0,0,0,0.5)', 'align-items:center', 'justify-content:center'
  ].join(';');

  var box = document.createElement('div');
  box.style.cssText = [
    'background:#fff', 'border-radius:10px', 'padding:28px 32px',
    'max-width:420px', 'width:90%', 'box-shadow:0 8px 32px rgba(0,0,0,0.2)'
  ].join(';');

  var title = document.createElement('h3');
  title.textContent = 'Tastaturkürzel';
  title.style.cssText = 'margin:0 0 16px;color:#3b3e90;font-size:1.1em;';
  box.appendChild(title);

  var table = document.createElement('table');
  table.style.cssText = 'width:100%;border-collapse:collapse;font-size:0.9em;';
  shortcuts.forEach(function (s) {
    var tr = document.createElement('tr');
    tr.innerHTML = '<td style="padding:6px 12px 6px 0;font-family:monospace;background:#f0f1f8;border-radius:4px;padding:4px 8px;font-size:0.85em;white-space:nowrap;">' + s.key + '</td><td style="padding:6px 0 6px 14px;color:#555;">' + s.action + '</td>';
    table.appendChild(tr);
  });
  box.appendChild(table);

  var closeBtn = document.createElement('button');
  closeBtn.textContent = 'Schliessen';
  closeBtn.style.cssText = [
    'margin-top:20px', 'padding:8px 20px', 'background:#3b3e90', 'color:#fff',
    'border:none', 'border-radius:6px', 'cursor:pointer', 'font-size:0.9em', 'font-family:inherit'
  ].join(';');
  closeBtn.onclick = function () { overlay.style.display = 'none'; };
  box.appendChild(closeBtn);

  overlay.appendChild(box);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) overlay.style.display = 'none';
  });
  return overlay;
}

// ── Slim reading-progress bar at page top ───────────────
function addReadingProgress() {
  var bar = document.createElement('div');
  bar.style.cssText = [
    'position:fixed', 'top:0', 'left:0', 'height:3px', 'width:0',
    'background:#3b3e90', 'z-index:10000', 'transition:width 0.1s linear',
    'pointer-events:none'
  ].join(';');
  document.body.appendChild(bar);

  window.addEventListener('scroll', function () {
    var doc = document.documentElement;
    var scrolled = doc.scrollTop || document.body.scrollTop;
    var total = doc.scrollHeight - doc.clientHeight;
    bar.style.width = total > 0 ? Math.min(100, (scrolled / total) * 100) + '%' : '0';
  }, { passive: true });
}
