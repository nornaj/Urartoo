/**
 * Urartoo Universal Custom Select Dropdown
 * Replaces native <select> elements with styled custom dropdowns.
 * Excludes admin panel selects.
 */
(function () {
  'use strict';

  function initCustomSelects() {
    var selects = document.querySelectorAll('select');

    selects.forEach(function (sel) {
      if (sel.dataset.uraConverted === 'true') return;

      // Skip admin panel selects
      if (
        sel.closest('[id^="admin-sec-"]') ||
        sel.closest('.admin-card') ||
        sel.closest('#product-editor-modal') ||
        sel.closest('#stone-editor-modal') ||
        sel.classList.contains('admin-input')
      ) {
        return;
      }

      // Skip hidden selects (unless part of a form that might become visible)
      if (sel.offsetParent === null && !sel.closest('form')) return;

      convertSelect(sel);
    });
  }

  function convertSelect(sel) {
    sel.dataset.uraConverted = 'true';
    sel.style.setProperty('display', 'none', 'important');

    // Build wrapper
    var wrapper = document.createElement('div');
    wrapper.className = 'ura-custom-select';
    wrapper.tabIndex = 0;
    if (sel.style.maxWidth) wrapper.style.maxWidth = sel.style.maxWidth;
    if (sel.style.width) wrapper.style.width = sel.style.width;
    if (sel.style.minWidth) wrapper.style.minWidth = sel.style.minWidth;
    if (sel.style.flex) wrapper.style.flex = sel.style.flex;
    if (sel.className) wrapper.dataset.originalClass = sel.className;

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

    function renderOptions() {
      menu.innerHTML = '';
      Array.from(sel.options).forEach(function (opt, idx) {
        var item = document.createElement('div');
        item.className = 'ura-select-option';
        if (idx === sel.selectedIndex) item.classList.add('selected');
        item.textContent = opt.textContent;
        item.dataset.value = opt.value;

        item.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();

          // Update native select
          sel.value = opt.value;
          sel.selectedIndex = idx;

          // Dispatch change & input events
          sel.dispatchEvent(new Event('change', { bubbles: true }));
          sel.dispatchEvent(new Event('input', { bubbles: true }));

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
    }

    renderOptions();

    wrapper.appendChild(trigger);
    wrapper.appendChild(menu);

    // If the select is inside a <label>, prevent label activation
    var parentLabel = sel.closest('label');
    if (parentLabel) {
      parentLabel.addEventListener('click', function (e) {
        if (e.target.closest('.ura-custom-select')) {
          e.preventDefault();
        }
      });
    }

    // Insert after the native select
    sel.parentNode.insertBefore(wrapper, sel.nextSibling);

    // Toggle dropdown on trigger click
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      var isCurrentlyActive = wrapper.classList.contains('active');

      // Close all other custom selects first
      document.querySelectorAll('.ura-custom-select.active').forEach(function (other) {
        if (other !== wrapper) other.classList.remove('active');
      });

      if (isCurrentlyActive) {
        wrapper.classList.remove('active');
      } else {
        renderOptions();
        wrapper.classList.add('active');
      }
    });

    // Prevent clicks inside menu from closing or bubbling
    menu.addEventListener('click', function (e) {
      e.stopPropagation();
    });

    // Keyboard support on wrapper
    wrapper.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        wrapper.classList.toggle('active');
      } else if (e.key === 'Escape') {
        wrapper.classList.remove('active');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!wrapper.classList.contains('active')) {
          wrapper.classList.add('active');
        } else if (sel.selectedIndex < sel.options.length - 1) {
          sel.selectedIndex++;
          sel.dispatchEvent(new Event('change', { bubbles: true }));
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (sel.selectedIndex > 0) {
          sel.selectedIndex--;
          sel.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    });

    // Keep in sync if native select changes externally
    sel.addEventListener('change', function () {
      var val = sel.value;
      var opt = sel.options[sel.selectedIndex];
      var text = opt ? opt.textContent : val;
      triggerText.textContent = text;
      menu.querySelectorAll('.ura-select-option').forEach(function (o) {
        o.classList.toggle('selected', o.dataset.value === val);
      });
    });
  }

  // Close all custom selects when clicking outside
  document.addEventListener('click', function (e) {
    if (e.target && e.target.closest && e.target.closest('.ura-custom-select')) {
      return;
    }
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

  setTimeout(initCustomSelects, 500);
  setTimeout(initCustomSelects, 1500);

  window.initCustomSelects = initCustomSelects;
})();
