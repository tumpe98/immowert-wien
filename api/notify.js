const SUPABASE_URL = 'https://gxpzbhwgnsczikggdqvz.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'sb_publishable_Ef3Rz4GQgYTyMoEBJ-hNLA_gv3KVySw';
const BREVO_KEY    = process.env.BREVO_API_KEY;
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'oskar@tumnitz.com';
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'hallo@immobilienwert-wien.at';
const SENDER_NAME  = 'immowertwien';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const {
    name, email, phone,
    bezirk, flaeche, zimmer, baujahr, condition,
    aussenflaeche, address, valueMin, valueMax,
    source = 'tool'
  } = req.body;

  if (!name || !email) return res.status(400).json({ error: 'Name und E-Mail erforderlich' });

  // 1. Supabase insert
  try {
    const sbRes = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        name, email, phone,
        type: 'wohnung',
        bezirk: bezirk || null,
        flaeche: flaeche || null,
        zimmer: zimmer || null,
        baujahr: baujahr || null,
        condition: condition || null,
        aussenflaeche: aussenflaeche || null,
        address: address || null,
        nutzungsart: null, ubahn: null, nahversorgung: null
      })
    });
    if (!sbRes.ok) {
      const msg = await sbRes.text().catch(() => '');
      console.error('Supabase error:', sbRes.status, msg);
    }
  } catch (e) {
    console.error('Supabase insert failed:', e);
  }

  // 2. Brevo emails
  if (!BREVO_KEY) {
    console.warn('BREVO_API_KEY nicht gesetzt – E-Mails werden nicht gesendet');
    return res.status(200).json({ ok: true, warning: 'no brevo key' });
  }

  const valueStr = valueMin && valueMax
    ? `€ ${valueMin.toLocaleString('de-AT')} – € ${valueMax.toLocaleString('de-AT')}`
    : 'wird ermittelt';

  const details = [
    ['Bezirk', bezirk],
    ['Adresse', address],
    ['Fläche', flaeche ? `${flaeche} m²` : null],
    ['Zimmer', zimmer],
    ['Baujahr', baujahr],
    ['Zustand', condition],
    ['Außenfläche', aussenflaeche],
    ['Telefon', phone],
    ['Geschätzter Marktwert', valueStr],
  ].filter(([, v]) => v).map(([k, v]) =>
    `<tr><td style="color:#6b7280;padding:6px 16px 6px 0;font-size:14px;white-space:nowrap">${k}</td><td style="font-size:14px;font-weight:600;color:#111827;padding:6px 0">${v}</td></tr>`
  ).join('');

  const emails = [
    // --- Notification an Oskar ---
    {
      to: [{ email: NOTIFY_EMAIL, name: 'Oskar' }],
      subject: `Neuer Lead: ${name} – ${bezirk || 'unbekannter Bezirk'}`,
      htmlContent: `
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f3f4f6;font-family:Inter,sans-serif">
<div style="max-width:560px;margin:32px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
  <div style="background:#0a1628;padding:28px 32px">
    <span style="font-size:18px;font-weight:800;color:white;letter-spacing:-.01em">immowert<span style="color:#93c5fd">wien</span></span>
    <p style="color:rgba(255,255,255,.5);font-size:13px;margin:6px 0 0">Neuer Lead eingegangen</p>
  </div>
  <div style="padding:32px">
    <h2 style="font-size:20px;font-weight:700;color:#111827;margin:0 0 4px">${name}</h2>
    <a href="mailto:${email}" style="color:#2563eb;font-size:14px;text-decoration:none">${email}</a>
    <table style="margin-top:24px;border-collapse:collapse;width:100%">${details}</table>
    <div style="margin-top:28px;display:flex;gap:12px">
      <a href="mailto:${email}" style="display:inline-block;background:#2563eb;color:white;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none">E-Mail schreiben</a>
      ${phone ? `<a href="tel:${phone}" style="display:inline-block;background:#f3f4f6;color:#111827;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none">Anrufen</a>` : ''}
    </div>
  </div>
  <div style="background:#f9fafb;padding:16px 32px;font-size:12px;color:#9ca3af;border-top:1px solid #e5e7eb">
    Source: ${source} · immobilienwert-wien.at
  </div>
</div>
</body></html>`
    },

    // --- Bestätigung an Lead ---
    {
      to: [{ email, name }],
      subject: `Dein Marktüberblick ist unterwegs, ${name.split(' ')[0]}`,
      htmlContent: `
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f3f4f6;font-family:Inter,sans-serif">
<div style="max-width:560px;margin:32px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
  <div style="background:#0a1628;padding:28px 32px">
    <span style="font-size:18px;font-weight:800;color:white;letter-spacing:-.01em">immowert<span style="color:#93c5fd">wien</span></span>
  </div>
  <div style="padding:36px 32px">
    <h2 style="font-size:22px;font-weight:800;color:#111827;margin:0 0 12px;line-height:1.2">Danke, ${name.split(' ')[0]}.</h2>
    <p style="font-size:15px;color:#6b7280;line-height:1.7;margin:0 0 28px">Wir haben deine Anfrage erhalten. Ein lokaler Experte für <strong style="color:#111827">${bezirk || 'deinen Bezirk'}</strong> meldet sich innerhalb von <strong style="color:#111827">24 Stunden</strong> bei dir – kostenlos und unverbindlich.</p>
    <div style="background:#f3f4f6;border-radius:12px;padding:20px 24px;margin-bottom:28px">
      <p style="font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#9ca3af;margin:0 0 12px">Deine Angaben</p>
      <table style="border-collapse:collapse;width:100%">${details}</table>
    </div>
    <p style="font-size:13px;color:#9ca3af;line-height:1.6;margin:0">Keine Verpflichtung, kein Vertrag. Du entscheidest nach dem Gespräch frei, wie du weitermachst.<br>Fragen? Schreib uns: <a href="mailto:${NOTIFY_EMAIL}" style="color:#2563eb">${NOTIFY_EMAIL}</a></p>
  </div>
  <div style="background:#f9fafb;padding:16px 32px;font-size:12px;color:#9ca3af;border-top:1px solid #e5e7eb">
    © 2026 immowertwien · immobilienwert-wien.at · <a href="https://immobilienwert-wien.at/datenschutz" style="color:#9ca3af">Datenschutz</a>
  </div>
</div>
</body></html>`
    }
  ];

  const results = await Promise.allSettled(emails.map(mail =>
    fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': BREVO_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: { name: SENDER_NAME, email: SENDER_EMAIL },
        ...mail
      })
    }).then(async r => {
      if (!r.ok) throw new Error(await r.text());
      return r.json();
    })
  ));

  results.forEach((r, i) => {
    if (r.status === 'rejected') console.error(`Brevo email ${i} failed:`, r.reason);
  });

  return res.status(200).json({ ok: true });
}
