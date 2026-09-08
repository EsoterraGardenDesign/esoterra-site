(function () {
  if (window.__stcmLoaded) return;
  window.__stcmLoaded = true;

  // Global gtag shim so any page can send GA4 events. Calls made before the
  // GA4 library loads (or before consent) queue in dataLayer and are processed
  // once gtag/js runs its config.
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function () { window.dataLayer.push(arguments); };
  }

  var vars = {
    '--boxShadow': '-5px 5px 10px 0px #00000012, 0px 0px 50px 0px #0000001a',
    '--fontFamily': "'Work Sans', Helvetica Neue, Segoe UI, Arial, sans-serif",
    '--primaryColor': '#2E3A26',
    '--backgroundColor': '#ffffff',
    '--textColor': '#4b494b',
    '--backdropBackgroundColor': '#00000033',
    '--backdropBackgroundBlur': '0px',
    '--iconColor': '#2E3A26',
    '--iconBackgroundColor': '#FFFFFF'
  };

  function applyVars() {
    var w = document.querySelector('#stcm-wrapper');
    if (!w) return false;
    for (var k in vars) w.style.setProperty(k, vars[k]);
    hideIcon();
    return true;
  }

  // Hide the floating icon permanently via a stylesheet rule (survives the
  // manager re-rendering the icon after a consent choice); a "Cookie
  // preferences" link in the footer opens it instead.
  (function injectHideRule() {
    var s = document.createElement('style');
    s.textContent = '#stcm-icon,#stcm-icon *{display:none!important;visibility:hidden!important;pointer-events:none!important}';
    (document.head || document.documentElement).appendChild(s);
  })();

  function hideIcon() {
    demoteHeadings();
    var icon = document.querySelector('#stcm-icon');
    if (!icon) return false;
    icon.style.setProperty('display', 'none', 'important');
    return true;
  }

  // The library renders its panel titles as <h1>/<h2>; the page already has its
  // own heading outline, so render them as plain styled text instead.
  function demoteHeadings() {
    var hs = document.querySelectorAll('#stcm-wrapper h1, #stcm-wrapper h2, #stcm-wrapper h3');
    for (var i = 0; i < hs.length; i++) {
      var h = hs[i];
      var d = document.createElement('div');
      d.className = h.className;
      d.setAttribute('style', 'font: inherit; font-size: 1.15em; font-weight: 700; margin: 0 0 8px');
      d.innerHTML = h.innerHTML;
      h.parentNode.replaceChild(d, h);
    }
  }

  document.addEventListener('click', function (ev) {
    var trigger = ev.target.closest && ev.target.closest('[data-stcm-open]');
    if (!trigger) return;
    ev.preventDefault();
    var icon = document.querySelector('#stcm-icon');
    if (icon) icon.click();
  });

  function watchVars() {
    if (applyVars()) return;
    var mo = new MutationObserver(function () { hideIcon(); if (applyVars()) mo.disconnect(); });
    mo.observe(document.body, { childList: true, subtree: true });
    setTimeout(function () { mo.disconnect(); }, 10000);
  }

  function start() {
    if (window.__stcmInit || !window.silktideConsentManager) return;
    window.__stcmInit = true;
    watchVars();
    window.silktideConsentManager.init({
      backdrop: { show: false },
      icon: { position: 'bottomLeft' },
      prompt: { position: 'bottomRight' },
      consentTypes: [
        {
          id: 'essential',
          label: 'Essential',
          description: '<p>These cookies are necessary for the website to function properly and cannot be switched off. They help with things like logging in and setting your privacy preferences.</p>',
          required: true
        },
        {
          id: 'analytics',
          label: 'Analytics',
          description: '<p>These cookies help us improve the site by tracking which pages are most popular and how visitors move around the site.</p>',
          required: false,
          gtag: 'analytics_storage',
          scripts: [
            { url: 'https://www.googletagmanager.com/gtag/js?id=G-Y82DL96GQF', load: 'async' }
          ],
          onAccept: function () {
            window.gtag('js', new Date());
            window.gtag('config', 'G-Y82DL96GQF');
            // Events pushed before config are discarded, so let pages know
            // GA4 is configured and safe to send to.
            window.__ga4Ready = true;
            window.dispatchEvent(new Event('ga4ready'));
          }
        },
        {
          id: 'marketing',
          label: 'Marketing',
          description: '<p>These cookies are used by us and our advertising partners to show you relevant ads on this site and elsewhere, and to measure how those campaigns perform.</p>',
          required: false,
          gtag: ['ad_storage', 'ad_user_data', 'ad_personalization']
        }
      ],
      text: {
        prompt: {
          description: '<p>We use cookies on our site to enhance your user experience, provide personalized content, and analyze our traffic.</p>',
          acceptAllButtonText: 'Accept',
          acceptAllButtonAccessibleLabel: 'Accept all cookies',
          rejectNonEssentialButtonText: 'No thanks',
          rejectNonEssentialButtonAccessibleLabel: 'Reject all non-essential cookies',
          preferencesButtonText: 'Preferences',
          preferencesButtonAccessibleLabel: 'Toggle preferences'
        },
        preferences: {
          title: 'Customize your cookie preferences',
          description: '<p>We respect your right to privacy. You can choose not to allow some types of cookies. Your cookie preferences will apply across our website.</p>',
          saveButtonText: 'Save and close',
          saveButtonAccessibleLabel: 'Save your cookie preferences',
          creditLinkText: 'Get this banner for free',
          creditLinkAccessibleLabel: 'Get this banner for free'
        }
      }
    });
  }

  var s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/gh/silktide/consent-manager@v2.0.1/silktide-consent-manager.js';
  s.integrity = 'sha384-5Pt34uiIbCsvfiiZXoLi4HRf/YBXjr9c8e+gYeVo9smUaInNHYVtc8NZ8wUnXJIq';
  s.crossOrigin = 'anonymous';
  s.onload = start;
  document.head.appendChild(s);
})();
