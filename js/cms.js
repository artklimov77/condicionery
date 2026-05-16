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
          cache: 'no-store',
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

      // Apply page builder block config
      applyBlockConfig(contentMap);

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

  // Dynamic block template renderers (for blocks added via library)
  var DYN_TEMPLATES = {
    cta: function(data, blockId) {
      var s = document.createElement('section');
      s.className = 'section';
      s.setAttribute('data-block-id', blockId);
      var inner = document.createElement('div');
      inner.className = 'container';
      var banner = document.createElement('div');
      banner.className = 'cta-banner';
      var content = document.createElement('div');
      content.className = 'cta-content';
      var h2 = document.createElement('h2');
      h2.className = 'cta-title';
      h2.textContent = data.title || '';
      var p = document.createElement('p');
      p.className = 'cta-desc';
      p.textContent = data.desc || '';
      content.appendChild(h2);
      content.appendChild(p);
      var actions = document.createElement('div');
      actions.className = 'cta-actions';
      if (data.btn_text) {
        var a = document.createElement('a');
        a.className = 'btn btn-white btn-lg';
        a.href = data.btn_href || 'contacts.html';
        a.textContent = data.btn_text;
        actions.appendChild(a);
      }
      banner.appendChild(content);
      banner.appendChild(actions);
      inner.appendChild(banner);
      s.appendChild(inner);
      return s;
    },
    gallery: function(data, blockId) {
      var s = document.createElement('section');
      s.className = 'section section--gray';
      s.setAttribute('data-block-id', blockId);
      var inner = document.createElement('div');
      inner.className = 'container';
      if (data.title) {
        var hdr = document.createElement('div');
        hdr.className = 'section-header reveal';
        var h2 = document.createElement('h2');
        h2.className = 'section-title';
        h2.textContent = data.title;
        hdr.appendChild(h2);
        inner.appendChild(hdr);
      }
      var grid = document.createElement('div');
      grid.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:32px;';
      ['photo1','photo2','photo3','photo4','photo5','photo6'].forEach(function(k) {
        if (!data[k]) return;
        var img = document.createElement('img');
        img.src = data[k];
        img.alt = 'Фото работы';
        img.loading = 'lazy';
        img.style.cssText = 'width:100%;height:220px;object-fit:cover;border-radius:8px;';
        grid.appendChild(img);
      });
      inner.appendChild(grid);
      s.appendChild(inner);
      return s;
    },
    'text-image': function(data, blockId) {
      var s = document.createElement('section');
      s.className = 'section';
      s.setAttribute('data-block-id', blockId);
      var inner = document.createElement('div');
      inner.className = 'container';
      var grid = document.createElement('div');
      grid.className = 'info-grid';
      var content = document.createElement('div');
      content.className = 'info-content reveal';
      var h2 = document.createElement('h2');
      h2.className = 'section-title';
      h2.style.textAlign = 'left';
      h2.textContent = data.title || '';
      var p = document.createElement('p');
      p.style.cssText = 'color:var(--gray-600);line-height:1.8;margin-bottom:24px;';
      p.textContent = data.text || '';
      content.appendChild(h2);
      content.appendChild(p);
      if (data.btn_text) {
        var a = document.createElement('a');
        a.className = 'btn btn-primary btn-lg';
        a.href = data.btn_href || 'contacts.html';
        a.textContent = data.btn_text;
        content.appendChild(a);
      }
      var imgDiv = document.createElement('div');
      imgDiv.className = 'info-img reveal reveal-delay-1';
      if (data.image) imgDiv.style.cssText = 'background:url("' + data.image + '") center/cover no-repeat;';
      grid.appendChild(content);
      grid.appendChild(imgDiv);
      inner.appendChild(grid);
      s.appendChild(inner);
      return s;
    },
    stats: function(data, blockId) {
      var s = document.createElement('section');
      s.setAttribute('data-block-id', blockId);
      s.style.cssText = 'background:var(--white);padding-block:32px;border-bottom:1px solid var(--gray-200);';
      var inner = document.createElement('div');
      inner.className = 'container';
      var row = document.createElement('div');
      row.className = 'stats-inner';
      [['stat1_num','stat1_label'],['stat2_num','stat2_label'],['stat3_num','stat3_label'],['stat4_num','stat4_label']].forEach(function(pair) {
        if (!data[pair[0]] && !data[pair[1]]) return;
        var item = document.createElement('div');
        item.className = 'stat-item reveal';
        var num = document.createElement('div');
        num.className = 'stat-num';
        num.textContent = data[pair[0]] || '';
        var lbl = document.createElement('div');
        lbl.className = 'stat-label';
        lbl.textContent = data[pair[1]] || '';
        item.appendChild(num);
        item.appendChild(lbl);
        row.appendChild(item);
      });
      inner.appendChild(row);
      s.appendChild(inner);
      return s;
    },
    faq: function(data, blockId) {
      var s = document.createElement('section');
      s.className = 'section section--gray';
      s.setAttribute('data-block-id', blockId);
      var inner = document.createElement('div');
      inner.className = 'container';
      if (data.title) {
        var hdr = document.createElement('div');
        hdr.className = 'section-header reveal';
        var h2 = document.createElement('h2');
        h2.className = 'section-title';
        h2.textContent = data.title;
        hdr.appendChild(h2);
        inner.appendChild(hdr);
      }
      var list = document.createElement('div');
      list.className = 'faq-list reveal';
      list.style.marginTop = '32px';
      [['q1','a1'],['q2','a2'],['q3','a3']].forEach(function(pair) {
        if (!data[pair[0]]) return;
        var item = document.createElement('details');
        item.className = 'faq-item';
        var sum = document.createElement('summary');
        sum.className = 'faq-question';
        sum.textContent = data[pair[0]];
        var ans = document.createElement('div');
        ans.className = 'faq-answer';
        ans.textContent = data[pair[1]] || '';
        item.appendChild(sum);
        item.appendChild(ans);
        list.appendChild(item);
      });
      inner.appendChild(list);
      s.appendChild(inner);
      return s;
    },
    reviews: function(data, blockId) {
      var s = document.createElement('section');
      s.className = 'section';
      s.setAttribute('data-block-id', blockId);
      var inner = document.createElement('div');
      inner.className = 'container';
      if (data.title) {
        var hdr = document.createElement('div');
        hdr.className = 'section-header reveal';
        var h2 = document.createElement('h2');
        h2.className = 'section-title';
        h2.textContent = data.title;
        hdr.appendChild(h2);
        inner.appendChild(hdr);
      }
      var grid = document.createElement('div');
      grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;margin-top:32px;';
      [['r1_text','r1_name'],['r2_text','r2_name'],['r3_text','r3_name']].forEach(function(pair) {
        if (!data[pair[0]] && !data[pair[1]]) return;
        var card = document.createElement('div');
        card.className = 'review-card reveal';
        var txt = document.createElement('p');
        txt.className = 'review-text';
        txt.textContent = '«' + (data[pair[0]] || '') + '»';
        var name = document.createElement('div');
        name.className = 'review-author';
        name.textContent = data[pair[1]] || '';
        card.appendChild(txt);
        card.appendChild(name);
        grid.appendChild(card);
      });
      inner.appendChild(grid);
      s.appendChild(inner);
      return s;
    }
  };

  function applyBlockConfig(contentMap) {
    // Detect page ID
    var path = window.location.pathname;
    var filename = path.split('/').pop() || '';
    var pageId = 'index';
    if (filename.indexOf('conditioners') !== -1) pageId = 'conditioners';
    else if (filename.indexOf('heat-pumps') !== -1) pageId = 'heat-pumps';
    else if (filename.indexOf('ventilation') !== -1) pageId = 'ventilation';
    else if (filename.indexOf('about') !== -1) pageId = 'about';
    else if (filename.indexOf('portfolio') !== -1) pageId = 'portfolio';

    var configEntry = contentMap['blocks.' + pageId];
    if (!configEntry || !configEntry.value) return;

    var config;
    try { config = JSON.parse(configEntry.value); } catch (e) { return; }
    if (!Array.isArray(config) || config.length === 0) return;

    var main = document.querySelector('main');
    if (!main) return;

    var sorted = config.slice().sort(function(a, b) { return a.order - b.order; });
    sorted.forEach(function(block) {
      // Try to find existing section
      var section = document.querySelector('[data-block-id="' + block.id + '"]');

      // If not found, check if it's a dynamic block and render it
      if (!section) {
        var dynKey = 'dblock.' + pageId + '.' + block.id;
        var dynEntry = contentMap[dynKey];
        if (dynEntry && dynEntry.value) {
          var dynData = null;
          try { dynData = JSON.parse(dynEntry.value); } catch(e) {}
          if (dynData && dynData._template && DYN_TEMPLATES[dynData._template]) {
            section = DYN_TEMPLATES[dynData._template](dynData, block.id);
          }
        }
      }

      if (!section) return;
      section.style.display = block.visible ? '' : 'none';
      main.appendChild(section);
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
