(function () {
  if (window.__stcmLoaded) return;
  window.__stcmLoaded = true;

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

  // Hide the floating icon; a "Cookie preferences" link in the footer opens it instead.
  function hideIcon() {
    var icon = document.querySelector('#stcm-icon');
    if (!icon) return false;
    icon.style.setProperty('display', 'none', 'important');
    return true;
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
            window.dataLayer = window.dataLayer || [];
            function gtag() { window.dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', 'G-Y82DL96GQF');
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
