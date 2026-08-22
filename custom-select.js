/**
 * Urartoo Universal Custom Select Dropdown
 * Auto-upgrades all <select> elements into styled custom dropdowns.
 * Excludes admin panel selects (inside #admin-sec-*).
 */
(function () {
  'use strict';

  function initCustomSelects() {
    var selects = document.querySelectorAll('select');

    selects.forEach(function (sel) {
      // Skip if already converted
      if (sel.dataset.uraConverted === 'true') return;

      // Skip admin panel selects
      if (sel.closest('[id^="admin-sec-"]') || sel.closest('.admin-card') || sel.closest('#product-editor-modal') || sel.closest('#stone-editor-modal')) return;

      // Skip hidden selects
      if (sel.offsetParent === null && !sel.closest('form')) return;

      convertSelect(sel);
    });
  }

  function convertSelect(sel) {
    sel.dataset.uraConverted = 'true';
    sel.style.display = 'none';

    // Build wrapper
    var wrapper = document.createElement('div');
    wrapper.className = 'ura-custom-select';
    if (sel.style.maxWidth) wrapper.style.maxWidth = sel.style.maxWidth;
    if (sel.className) wrapper.dataset.originalClass = sel.className;

    // Match parent width
    wrapper.style.width = '100%';

    // Build trigger button
    var trigger = document.createElement('div');
    trigger.className = 'ura-select-trigger';

    var triggerText = document.createElement('span');
    triggerText.className = 'ura-select-text';
    var selectedOpt = sel.options[sel.selectedIndex];
    triggerText.textContent = selectedOpt ? selectedOpt.textContent : '';

    var arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    arrow.setAttribute('class', 'ura-select-arrow');
    arrow.setAttribute('width', '14');
    arrow.setAttribute('height', '14');
    arrow.setAttribute('viewBox', '0 0 24 24');
    arrow.setAttribute('fill', 'none');
    arrow.setAttribute('stroke', 'currentColor');
    arrow.setAttribute('stroke-width', '2');
    arrow.setAttribute('stroke-linecap', 'round');
    arrow.setAttribute('stroke-linejoin', 'round');
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M6 9l6 6 6-6');
    arrow.appendChild(path);

    trigger.appendChild(triggerText);
    trigger.appendChild(arrow);

    // Build dropdown menu
    var menu = document.createElement('div');
    menu.className = 'ura-select-menu';

    Array.from(sel.options).forEach(function (opt, idx) {
      var item = document.createElement('div');
      item.className = 'ura-select-option';
      if (idx === sel.selectedIndex) item.classList.add('selected');
      item.textContent = opt.textContent;
      item.dataset.value = opt.value;

      item.addEventListener('click', function (e) {
        e.stopPropagation();

        // Update native select
        sel.value = opt.value;
        sel.selectedIndex = idx;

        // Trigger change event
        var evt = new Event('change', { bubbles: true });
        sel.dispatchEvent(evt);

        // Also trigger input event
        var inputEvt = new Event('input', { bubbles: true });
        sel.dispatchEvent(inputEvt);

        // Update UI
        triggerText.textContent = opt.textContent;
        menu.querySelectorAll('.ura-select-option').forEach(function (o) {
          o.classList.remove('selected');
        });
        item.classList.add('selected');

        // Close dropdown
        wrapper.classList.remove('active');
      });

      menu.appendChild(item);
    });

    wrapper.appendChild(trigger);
    wrapper.appendChild(menu);

    // Insert after the native select
    sel.parentNode.insertBefore(wrapper, sel.nextSibling);

    // Toggle dropdown on trigger click
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();

      // Close all other custom selects
      document.querySelectorAll('.ura-custom-select.active').forEach(function (other) {
        if (other !== wrapper) other.classList.remove('active');
      });

      wrapper.classList.toggle('active');
    });

    // Keep in sync if native select changes externally
    sel.addEventListener('change', function () {
      var val = sel.value;
      var text = sel.options[sel.selectedIndex] ? sel.options[sel.selectedIndex].textContent : val;
      triggerText.textContent = text;
      menu.querySelectorAll('.ura-select-option').forEach(function (o) {
        o.classList.toggle('selected', o.dataset.value === val);
      });
    });
  }

  // Close all custom selects on outside click
  document.addEventListener('click', function () {
    document.querySelectorAll('.ura-custom-select.active').forEach(function (el) {
      el.classList.remove('active');
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.ura-custom-select.active').forEach(function (el) {
        el.classList.remove('active');
      });
    }
  });

  // Init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCustomSelects);
  } else {
    initCustomSelects();
  }

  // Re-init after a delay to catch dynamically rendered selects
  setTimeout(initCustomSelects, 1500);

  // Expose for manual re-init
  window.initCustomSelects = initCustomSelects;
})();
