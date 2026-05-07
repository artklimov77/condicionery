// =============================================
// Nordic Air CMS — Frontend Content Loader
// =============================================
// Fetches content from Supabase REST API and applies it to [data-cms] elements.
// NON-BREAKING: if Supabase is not configured or unavailable, falls back silently.
// =============================================

(function () {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCMS);
  } else {
    initCMS();
  }

  async function initCMS() {
    try {
      // Check if config is available and filled in
      if (
        !window.CMS_CONFIG ||
        !window.CMS_CONFIG.supabaseUrl ||
        !window.CMS_CONFIG.supabaseKey ||
        window.CMS_CONFIG.supabaseUrl === 'YOUR_SUPABASE_PROJECT_URL'
      ) {
        return; // Not configured yet — silently skip
      }

      const { supabaseUrl, supabaseKey } = window.CMS_CONFIG;

      // Fetch all content rows via Supabase REST API (no SDK needed)
      const response = await fetch(
        `${supabaseUrl}/rest/v1/content?select=key,value,type`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        return; // API error — silently fall back
      }

      const rows = await response.json();

      if (!Array.isArray(rows) || rows.length === 0) {
        return; // No content in DB yet
      }

      // Build a map for quick lookup: key → { value, type }
      const contentMap = {};
      rows.forEach(function (row) {
        if (row.key && row.value !== null && row.value !== undefined) {
          contentMap[row.key] = { value: row.value, type: row.type || 'text' };
        }
      });

      // Apply content to DOM elements
      applyContent(contentMap);

      // Handle countdown deadline updates
      updateCountdowns(contentMap);

    } catch (err) {
      // Silent fail — page works with hardcoded HTML
      // Uncomment for debugging:
      // console.warn('[CMS] Failed to load content:', err);
    }
  }

  function applyContent(contentMap) {
    Object.keys(contentMap).forEach(function (key) {
      var item = contentMap[key];
      var value = item.value;
      var type = item.type;

      // Find all elements with matching data-cms attribute
      var elements = document.querySelectorAll('[data-cms="' + key + '"]');

      elements.forEach(function (el) {
        // Allow per-element type override via data-cms-type attribute
        var elType = el.getAttribute('data-cms-type') || type;

        try {
          switch (elType) {
            case 'html':
              el.innerHTML = value;
              break;

            case 'image':
              if (el.tagName === 'IMG') {
                el.src = value;
                // If the element has an alt placeholder, keep it
              } else {
                // Background image for div/section elements
                el.style.backgroundImage = 'url(' + value + ')';
              }
              break;

            case 'href':
              el.href = value;
              break;

            case 'countdown':
              // Update the data-countdown attribute on the closest [data-countdown] element
              var countdownEl = el.closest
                ? el.closest('[data-countdown]')
                : null;
              // If this element IS the countdown container
              if (el.hasAttribute('data-countdown')) {
                el.setAttribute('data-countdown', value);
              } else if (countdownEl) {
                countdownEl.setAttribute('data-countdown', value);
              }
              break;

            case 'text':
            default:
              el.textContent = value;
              break;
          }
        } catch (e) {
          // Per-element error — skip silently
        }
      });
    });
  }

  function updateCountdowns(contentMap) {
    // Find all promo deadline keys (e.g. promo.1.deadline, promo.2.deadline, etc.)
    var deadlineKeys = Object.keys(contentMap).filter(function (key) {
      return /^promo\.\d+\.deadline$/.test(key);
    });

    if (deadlineKeys.length === 0) return;

    deadlineKeys.forEach(function (key) {
      var deadline = contentMap[key].value;
      if (!deadline) return;

      // Find the corresponding countdown element via data-cms attribute
      var cmsEls = document.querySelectorAll('[data-cms="' + key + '"]');

      cmsEls.forEach(function (el) {
        // The countdown container might be the element itself or a nearby sibling
        var container = null;
        if (el.hasAttribute('data-countdown')) {
          container = el;
        } else {
          // Look for nearest [data-countdown] sibling or child
          var parent = el.parentElement;
          if (parent) {
            container = parent.querySelector('[data-countdown]');
            if (!container) {
              container = parent.closest('[data-countdown]');
            }
          }
        }

        if (container) {
          container.setAttribute('data-countdown', deadline);
          // Reinit the countdown if the main.js countdown function is globally accessible
          if (typeof window.initCountdown === 'function') {
            window.initCountdown(container);
          } else {
            // Trigger custom event so main.js can pick it up
            container.dispatchEvent(new CustomEvent('cms:countdown-updated', {
              bubbles: true,
              detail: { deadline: deadline }
            }));
          }
        }
      });
    });
  }

})();
