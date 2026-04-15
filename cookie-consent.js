/**
 * ImmowertWien – DSGVO Cookie Consent
 * GA wird erst nach Zustimmung geladen.
 * Einwilligung wird in localStorage gespeichert.
 */
(function(){
  const GA_ID = 'G-NHSR9FR9XM';
  const KEY = 'iw_cookie_consent';

  function loadGA(){
    if(window._gaLoaded) return;
    window._gaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, {anonymize_ip: true});
  }

  function hideBanner(){
    var b = document.getElementById('iw-cookie-banner');
    if(b) b.style.display = 'none';
  }

  function accept(){
    localStorage.setItem(KEY, 'accepted');
    hideBanner();
    loadGA();
  }

  function decline(){
    localStorage.setItem(KEY, 'declined');
    hideBanner();
  }

  function showBanner(){
    var banner = document.createElement('div');
    banner.id = 'iw-cookie-banner';
    banner.innerHTML = `
      <div style="max-width:680px">
        <div style="font-weight:600;font-size:.92rem;margin-bottom:6px;color:#0a1628">Diese Website verwendet Cookies</div>
        <div style="font-size:.82rem;color:#374151;line-height:1.6">Wir nutzen Google Analytics um zu verstehen wie Besucher unsere Seite nutzen – damit wir sie laufend verbessern können. Deine Daten werden anonymisiert übertragen. Du kannst jederzeit ablehnen.</div>
      </div>
      <div style="display:flex;gap:10px;flex-shrink:0;flex-wrap:wrap">
        <button onclick="window._iwConsent.decline()" style="background:none;border:1.5px solid #d1d5db;border-radius:8px;padding:9px 18px;font-size:.83rem;font-weight:500;color:#6b7280;cursor:pointer;font-family:'Inter',sans-serif;white-space:nowrap">Ablehnen</button>
        <button onclick="window._iwConsent.accept()" style="background:#0a1628;border:none;border-radius:8px;padding:9px 20px;font-size:.83rem;font-weight:600;color:white;cursor:pointer;font-family:'Inter',sans-serif;white-space:nowrap">Akzeptieren</button>
      </div>
    `;
    banner.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:99999;background:white;border-top:1.5px solid #e5e7eb;padding:16px 5%;display:flex;align-items:center;justify-content:space-between;gap:20px;box-shadow:0 -4px 24px rgba(0,0,0,.08);flex-wrap:wrap;font-family:Inter,sans-serif';
    document.body.appendChild(banner);
  }

  window._iwConsent = {accept: accept, decline: decline};

  var stored = localStorage.getItem(KEY);
  if(stored === 'accepted'){
    loadGA();
  } else if(!stored){
    // Show banner after DOM ready
    if(document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }
  // If 'declined': do nothing, no GA
})();
