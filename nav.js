/* ── Shared Navigation ── */
(function() {
  const currentPage = location.pathname.split('/').pop() || 'index.html';

  const links = [
    { href: 'index.html',   label: 'Immobilie bewerten' },
    { href: 'bezirke.html', label: 'Bezirksanalyse' },
    { href: 'blog.html',    label: 'Blog' },
    { href: 'kontakt.html', label: 'Über uns' },
  ];

  const navLinks = links.map(l =>
    `<a href="${l.href}" class="nav-link${currentPage === l.href ? ' active' : ''}">${l.label}</a>`
  ).join('');

  const drawerLinks = links.map(l =>
    `<a href="${l.href}" class="nav-drawer-link${currentPage === l.href ? ' active' : ''}">${l.label}</a>`
  ).join('');

  const html = `
<style>
  nav#mainNav{position:fixed;top:0;left:0;right:0;z-index:9000;background:rgba(255,255,255,.97);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid rgba(0,0,0,.09);padding:0 5%;height:64px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 1px 16px rgba(0,0,0,.07);}
  .nav-logo{font-family:'Playfair Display',serif;font-weight:800;font-size:1.1rem;color:#1a4fd6;text-decoration:none;flex-shrink:0;}
  .nav-logo span{color:#111827;}
  .nav-links{display:flex;align-items:center;gap:2px;}
  .nav-link{font-size:.875rem;font-weight:500;color:#6b7280;text-decoration:none;padding:8px 14px;border-radius:8px;transition:all .18s;}
  .nav-link:hover{background:#f3f4f6;color:#111827;}
  .nav-link.active{color:#2563eb;background:#eff6ff;}
  .nav-pill-btn{background:#2563eb;color:white;border:none;padding:10px 22px;border-radius:100px;font-family:'Inter',sans-serif;font-size:.875rem;font-weight:500;cursor:pointer;transition:all .2s;text-decoration:none;display:inline-block;}
  .nav-pill-btn:hover{background:#1a4fd6;transform:translateY(-1px);box-shadow:0 8px 32px rgba(37,99,235,.2);}
  .nav-burger{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:8px;border:none;background:none;}
  .nav-burger span{display:block;width:22px;height:2px;background:#111827;border-radius:2px;transition:all .3s;}
  .nav-drawer{position:fixed;top:0;left:0;bottom:0;width:280px;background:white;z-index:9002;transform:translateX(-100%);transition:transform .3s cubic-bezier(.4,0,.2,1);box-shadow:4px 0 32px rgba(0,0,0,.12);padding:80px 24px 32px;display:flex;flex-direction:column;gap:4px;}
  .nav-drawer.open{transform:none;}
  .nav-drawer-link{font-size:1rem;font-weight:500;color:#374151;text-decoration:none;padding:12px 16px;border-radius:10px;transition:all .18s;display:block;}
  .nav-drawer-link:hover,.nav-drawer-link.active{background:#eff6ff;color:#2563eb;}
  .nav-drawer-pill{margin-top:16px;background:#2563eb;color:white;padding:14px 20px;border-radius:12px;text-decoration:none;font-weight:600;font-size:.95rem;display:block;text-align:center;transition:background .2s;}
  .nav-drawer-pill:hover{background:#1a4fd6;}
  .nav-overlay{position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:9001;opacity:0;pointer-events:none;transition:opacity .3s;}
  .nav-overlay.open{opacity:1;pointer-events:all;}
  @media(max-width:780px){.nav-links,.nav-pill-btn{display:none!important;}.nav-burger{display:flex!important;}}
</style>
<div class="nav-overlay" id="navOverlay" onclick="closeNavDrawer()"></div>
<div class="nav-drawer" id="navDrawer">
  ${drawerLinks}
  <a href="index.html#tool" class="nav-drawer-pill">Jetzt bewerten →</a>
</div>
<nav id="mainNav">
  <button class="nav-burger" id="navBurger" onclick="toggleNavDrawer()" aria-label="Menü öffnen">
    <span></span><span></span><span></span>
  </button>
  <a href="index.html" class="nav-logo">immowert<span>wien</span></a>
  <div class="nav-links">${navLinks}</div>
  <a href="index.html#tool" class="nav-pill-btn">Jetzt bewerten →</a>
</nav>`;

  document.currentScript.insertAdjacentHTML('beforebegin', html);

  window.toggleNavDrawer = function() {
    document.getElementById('navDrawer').classList.toggle('open');
    document.getElementById('navOverlay').classList.toggle('open');
  };
  window.closeNavDrawer = function() {
    document.getElementById('navDrawer').classList.remove('open');
    document.getElementById('navOverlay').classList.remove('open');
  };

  window.addEventListener('scroll', function() {
    const nav = document.getElementById('mainNav');
    if (nav) nav.style.boxShadow = window.scrollY > 10
      ? '0 2px 24px rgba(0,0,0,.10)'
      : '0 1px 16px rgba(0,0,0,.07)';
  });
})();
