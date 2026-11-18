// Maiskolbistan Militär-Defense – Testkarte 1 (Westkolbistan)
// Reines JavaScript, kein Bau-Schritt. Grafiken aus dem Maiskolbistan-Info-Repo (seiten/td-ranger-sprites).
'use strict';

(() => {
  const W = 1140, H = 810, MITTE = 570;
  const EINHEIT = 14;           // 1 Reichweiten-Einheit (TDX-Wiki) = 14 px
  const TURM_GROESSE = 120;     // Draufsicht-Turm auf der Karte
  const fmt = (n) => Math.round(n).toLocaleString('de-DE');
  const $ = (id) => document.getElementById(id);

  // ---------- Daten ----------
  const KOMBIS = [];
  for (let a = 0; a <= 5; a++) for (let b = 0; b <= 2; b++) KOMBIS.push(a + '-' + b);
  for (let b = 3; b <= 5; b++) for (let a = 0; a <= 2; a++) KOMBIS.push(a + '-' + b);

  // Werte nach dem TDX-Wiki (Ranger, Sniper), Reichweite in Einheiten
  const TUERME = {
    ranger: {
      name: 'Ranger', kosten: 250, sheet: 'rangerTop', schraeg: 'bilder/ranger_schraeg.png', json: 'ranger',
      basis: { dmg: 1, reload: 1.75, burst: 2, range: 9 },
      A: [
        { n: 'Laservisier', k: 165, d: { burst: 1, range: 3 } },
        { n: 'Eliteausbildung', k: 350, d: { dmg: 0.5, reload: -0.1, burst: 1, range: 1 } },
        { n: 'Tarnblick', k: 750, d: { reload: -0.4, burst: 1, tarn: true } },
        { n: 'Schweres Kaliber', k: 2500, d: { dmg: 6, range: 2 } },
        { n: 'Kolbenhagel-MG', k: 8750, d: { dmg: 8, range: 3, dauerfeuer: true } }
      ],
      B: [
        { n: 'Panzerbrechend', k: 250, d: { dmg: 1.5 } },
        { n: 'Feinschliff', k: 425, d: { reload: -0.25, range: 2 } },
        { n: 'Sturmausrüstung', k: 1400, d: { dmg: 3, reload: -0.25, burst: 1, range: 1, panzerbrechend: true } },
        { n: 'Sprengspitzen', k: 2400, d: { dmg: 3, burst: 3, range: 2, granate: 1 } },
        { n: 'Frontalangriff', k: 7250, d: { dmg: 7, burst: 1, granate: 2, brand: true } }
      ],
      info: 'Ranger: Feuerstöße mit dem Sturmgewehr. Erkennt Getarnte ab Tarnblick (Präzision 3), durchschlägt Panzerung ab Sturmausrüstung (Sturm 3).'
    },
    sniper: {
      name: 'Scharfschütze', kosten: 285, sheet: 'sniperTop', schraeg: 'bilder/scharfschuetze_schraeg.png', json: 'sniper', tech: 'sniper',
      basis: { dmg: 8, reload: 2.75, burst: 1, range: 21 },
      A: [
        { n: 'Feldausbildung', k: 300, d: { reload: -0.75, range: 4 } },
        { n: 'Adlerauge', k: 425, d: { range: 6, tarn: true } },
        { n: 'Durchschlag', k: 2800, d: { dmg: 21, reload: -0.2, range: 5, pierce: 1 } },
        { n: 'Tarnanzug', k: 3450, d: { dmg: 35, reload: 0.3, range: 3, panzerbrechend: true } },
        { n: 'Maisfeld-Phantom', k: 14250, d: { dmg: 150, reload: 0.6, range: 3, pierce: 1 } }
      ],
      B: [
        { n: 'Hochgeschwindigkeit', k: 300, d: { dmg: 4 } },
        { n: 'Kaliber .50', k: 1250, d: { dmg: 12 } },
        { n: 'Scharfschütze', k: 2850, d: { dmg: 5, reload: -1, range: 5 } },
        { n: 'Leuchtauge', k: 4350, d: { dmg: 18, range: 18, leuchtkugel: true } },
        { n: 'Kolbenbrecher', k: 17250, d: { dmg: 120, reload: 0.25, range: 22, pierce: 1, laser: true } }
      ],
      info: 'Scharfschütze: riesige Reichweite, langsame, starke Schüsse. Erkennt Getarnte ab Adlerauge (Phantom 2).'
    },
    depot: {
      name: 'Logistik-Depot', kosten: 400, schraeg: 'bilder/depot.png', tech: 'depot', depot: true,
      pfade: ['Versorgung', 'Sanität'],
      basis: { geld: 70, leben: 0, faktor: 1, dmg: 0, reload: 1, burst: 1, range: 0 },
      A: [
        { n: 'Mehr Kisten', k: 300, d: { geld: 50 } },
        { n: 'Lagerhalle', k: 700, d: { geld: 80 } },
        { n: 'Lkw-Kolonne', k: 1600, d: { geld: 150 } },
        { n: 'Kornsilo', k: 3800, d: { geld: 300 } },
        { n: 'Staatsreserve', k: 9500, d: { geld: 850 } }
      ],
      B: [
        { n: 'Sanitätszelt', k: 350, d: { leben: 1, faktor: -0.1 } },
        { n: 'Feldlazarett', k: 800, d: { leben: 2 } },
        { n: 'Krankenwagen', k: 1800, d: { leben: 4, faktor: -0.1 } },
        { n: 'Rettungshubschrauber', k: 4000, d: { leben: 8 } },
        { n: 'Feldkrankenhaus', k: 9000, d: { leben: 15, faktor: -0.1 } }
      ],
      info: 'Logistik-Depot: schießt nicht, bringt zu Beginn jeder Welle Körner. Versorgung = mehr Körner, Sanität = etwas weniger Körner, dafür Leben.'
    }
  };

  const GEGNER = {
    soldat: { hp: 3, tempo: 52, lohn: 5, schaden: 1, gr: 0.6 },
    tarnsoldat: { hp: 3, tempo: 66, lohn: 7, schaden: 1, gr: 0.6, tarn: true },
    panzersoldat: { hp: 12, tempo: 34, lohn: 14, schaden: 2, gr: 0.62, panzer: true },
    humvee: { hp: 30, tempo: 100, lohn: 20, schaden: 5, gr: 0.6 },
    panzer: { hp: 180, tempo: 24, lohn: 100, schaden: 20, gr: 0.6, panzer: true },
    ratte: { hp: 1000, tempo: 15, lohn: 400, schaden: 1000, gr: 0.55, panzer: true, boss: true, name: 'Stahlratte' }
  };

  // Techbaum wie im Design: Spalte c, Zeile r; dauerhaft, bezahlt mit Verdienstorden (nur zwischen den Runden)
  const TECH = [
    { id: 'ranger', n: 'Ranger', t: 'Start-Turm. Feuerstöße, zwei Ausbaupfade.', c: 0, r: 0, k: 0, bild: 'ranger' },
    { id: 'sniper', n: 'Scharfschütze', t: 'Neuer Turm: große Reichweite, Phantom- und Schwerkaliber-Pfad.', c: 1, r: 0, k: 3, req: 'ranger', bild: 'sniper' },
    { id: 'depot', n: 'Logistik-Depot', t: 'Wirtschaftsturm: Körner zu Beginn jeder Welle, Sanität auch Leben.', c: 2, r: 0, k: 3, req: 'sniper', bild: 'depot' },
    { id: 'ruhig', n: 'Ruhige Hand', t: 'Scharfschützen: +15 % Reichweite.', c: 2, r: 1, k: 2, req: 'sniper' },
    { id: 'tarnung', n: 'Maisfeld-Tarnung', t: 'Phantom-Ausbauten 20 % günstiger.', c: 3, r: 1, k: 4, req: 'ruhig' },
    { id: 'drill1', n: 'Ranger-Drill I', t: 'Ranger: +10 % Feuerrate.', c: 1, r: 2, k: 2, req: 'ranger' },
    { id: 'drill2', n: 'Ranger-Drill II', t: 'Ranger: weitere +10 % Feuerrate.', c: 2, r: 2, k: 3, req: 'drill1' },
    { id: 'goldmag', n: 'Goldmagazin', t: 'Neue Ranger starten mit Panzerbrechend.', c: 3, r: 2, k: 4, req: 'drill2' },
    { id: 'kasse', n: 'Kriegskasse', t: '+150 Körner Startgeld.', c: 0, r: 3, k: 2 },
    { id: 'ernte', n: 'Erntebonus', t: '+10 % Körner pro geschaffter Welle.', c: 1, r: 3, k: 3, req: 'kasse' },
    { id: 'bunker', n: 'Strohbunker', t: '+20 Leben zu Spielbeginn.', c: 2, r: 3, k: 3, req: 'ernte' },
    { id: 'reserve', n: 'Mais-Reserve', t: '+1 Leben nach jeder Welle.', c: 3, r: 3, k: 5, req: 'bunker' }
  ];
  const REIHEN = ['Türme', 'Scharfschütze', 'Ranger', 'Allgemein'];
  const ORDEN = [3, 3, 4, 4, 5, 5, 6];   // Verdienstorden beim ersten Sieg je Karte (+1 je neuem Stern; Wiederholung: 1)
  const HP_KARTE = [1, 1.08, 1.16, 1.24, 1.32, 1.42, 1.55];
  const SPEICHER = 'mkd-fortschritt-1';
  const SPIEL_ID = 'mk-militaer-defense', STAND_VERSION = 1;

  // ---------- Prüfsumme (HMAC-SHA-256, synchron) ----------
  // Schützt Spielstände gegen nachträgliches Ändern: Wer die Datei oder den Browser-Speicher bearbeitet,
  // erzeugt eine falsche Prüfsumme und der Stand wird abgelehnt. (Hinweis: Der Schlüssel steckt zwangsläufig
  // im Spiel selbst – gegen jemanden, der den Quellcode nachbaut, hilft das nicht, gegen normales Bearbeiten schon.)
  function sha256(bytes) {
    const K = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
    const H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    const l = bytes.length, n = (((l + 8) >> 6) + 1) * 64, m = new Uint8Array(n);
    m.set(bytes); m[l] = 0x80;
    const bits = l * 8; for (let i = 0; i < 4; i++) m[n - 1 - i] = (bits >>> (8 * i)) & 0xff;
    const w = new Uint32Array(64), r = (x, k) => (x >>> k) | (x << (32 - k));
    for (let o = 0; o < n; o += 64) {
      for (let i = 0; i < 16; i++) w[i] = (m[o + 4 * i] << 24) | (m[o + 4 * i + 1] << 16) | (m[o + 4 * i + 2] << 8) | m[o + 4 * i + 3];
      for (let i = 16; i < 64; i++) { const s0 = r(w[i - 15], 7) ^ r(w[i - 15], 18) ^ (w[i - 15] >>> 3), s1 = r(w[i - 2], 17) ^ r(w[i - 2], 19) ^ (w[i - 2] >>> 10); w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0; }
      let [a, b, c, d, e, f, g, h] = H;
      for (let i = 0; i < 64; i++) {
        const t1 = (h + (r(e, 6) ^ r(e, 11) ^ r(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + w[i]) | 0, t2 = ((r(a, 2) ^ r(a, 13) ^ r(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
      }
      H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0; H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
    }
    const out = new Uint8Array(32); H.forEach((v, i) => { out[4 * i] = v >>> 24; out[4 * i + 1] = (v >>> 16) & 255; out[4 * i + 2] = (v >>> 8) & 255; out[4 * i + 3] = v & 255; });
    return out;
  }
  const SCHLUESSEL = new TextEncoder().encode(['Mais', 'kolbistan', '·Militär-Defense·', 'Korn', 'speicher·2026'].join(''));
  function pruefsumme(text) {
    const key = new Uint8Array(64); key.set(SCHLUESSEL.length > 64 ? sha256(SCHLUESSEL) : SCHLUESSEL);
    const msg = new TextEncoder().encode(text), ip = new Uint8Array(64 + msg.length), op = new Uint8Array(96);
    for (let i = 0; i < 64; i++) { ip[i] = key[i] ^ 0x36; op[i] = key[i] ^ 0x5c; }
    ip.set(msg, 64); op.set(sha256(ip), 64);
    return Array.from(sha256(op), (b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Feste Schlüsselreihenfolge, damit dieselben Daten immer dieselbe Prüfsumme ergeben
  const kanonisch = (v) => Array.isArray(v) ? '[' + v.map(kanonisch).join(',') + ']'
    : v && typeof v === 'object' ? '{' + Object.keys(v).sort().map((k) => JSON.stringify(k) + ':' + kanonisch(v[k])).join(',') + '}' : JSON.stringify(v);
  const signieren = (daten, gespeichert) => { const c = { spiel: SPIEL_ID, version: STAND_VERSION, gespeichert, daten }; return { ...c, pruefsumme: pruefsumme(kanonisch(c)) }; };
  const signaturOk = (o) => o && typeof o === 'object' && typeof o.pruefsumme === 'string' &&
    o.pruefsumme === pruefsumme(kanonisch({ spiel: o.spiel, version: o.version, gespeichert: o.gespeichert, daten: o.daten }));
  // Inhalt prüfen: nur bekannte Felder und sinnvolle Werte
  const TECH_IDS = ['ranger', 'sniper', 'depot', 'ruhig', 'tarnung', 'drill1', 'drill2', 'goldmag', 'kasse', 'ernte', 'bunker', 'reserve'];
  const KARTEN_IDS = ['westkolbistan', 'paprikistan', 'nordkolbistan', 'maisdosistan', 'ostkolbistan', 'suedkolbistan', 'maisburg'];
  const ganz = (v, a, b) => Number.isInteger(v) && v >= a && v <= b;
  function standPruefen(d) {
    if (!d || typeof d !== 'object' || Array.isArray(d)) return null;
    if (!ganz(d.orden, 0, 1e6) || !ganz(d.stufe, 1, 1e4) || !(typeof d.xp === 'number' && d.xp >= 0 && d.xp < 1e9)) return null;
    if (!d.tech || typeof d.tech !== 'object' || !Object.entries(d.tech).every(([k, v]) => TECH_IDS.includes(k) && v === true) || !d.tech.ranger) return null;
    if (!d.sterne || typeof d.sterne !== 'object' || !Object.entries(d.sterne).every(([k, v]) => KARTEN_IDS.includes(k) && ganz(v, 1, 3))) return null;
    if (d.rekord != null && (typeof d.rekord !== 'object' || !Object.entries(d.rekord).every(([k, v]) => KARTEN_IDS.includes(k) && ganz(v, 0, 1e5)))) return null;
    return { orden: d.orden, stufe: d.stufe, xp: d.xp, tech: { ...d.tech }, sterne: { ...d.sterne }, rekord: { ...(d.rekord || {}) } };
  }
  const NEUSTAND = () => ({ orden: 0, stufe: 1, xp: 0, tech: { ranger: true }, sterne: {}, rekord: {} });
  let ladeHinweis = '';
  const P = (() => {
    try {
      const roh = JSON.parse(localStorage.getItem(SPEICHER) || 'null');
      if (!roh) return NEUSTAND();
      if (roh.pruefsumme) {                       // signierter Stand
        if (roh.spiel === SPIEL_ID && signaturOk(roh) && standPruefen(roh.daten)) return standPruefen(roh.daten);
        localStorage.setItem(SPEICHER + '-verworfen', JSON.stringify(roh));
        ladeHinweis = 'Der gespeicherte Spielstand wurde verändert und wird nicht akzeptiert. Du startest neu.';
        return NEUSTAND();
      }
      if (roh.tech) return roh;                   // alter, noch unsignierter Stand: einmalig übernehmen (wird beim nächsten Speichern signiert)
    } catch (e) {}
    return NEUSTAND();
  })();
  const sichern = () => { try { localStorage.setItem(SPEICHER, JSON.stringify(signieren(P, new Date().toISOString()))); } catch (e) {} };

  const ZIELE = ['Erster', 'Letzter', 'Stärkster', 'Nächster'];

  // ---------- Zustand ----------
  let A = {};             // Bilder + Atlanten
  let wege = [];          // abgetastete Wege der aktuellen Karte
  let K = null;           // aktuelle Karte (aus karten.json)
  let S;                  // Spielzustand
  const neu = () => ({
    welle: 0, koerner: 800 + (P.tech.kasse ? 150 : 0), leben: 100 + (P.tech.bunker ? 20 : 0), tempo: 1, pause: false, laeuft: false, ende: false,
    tuerme: [], gegner: [], geschosse: [], effekte: [], flaechen: [], spawn: [], spawnNr: 0, texte: [],
    wahl: null, platzieren: null, maus: null, tech: P.tech, zeit: 0, startLeben: 100 + (P.tech.bunker ? 20 : 0)
  });

  // ---------- Laden ----------
  const bild = (src) => new Promise((ok, fehler) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => fehler(new Error(src)); i.src = src; });
  const json = (src) => fetch(src).then((r) => { if (!r.ok) throw new Error(src); return r.json(); });

  async function laden() {
    const [depot, rangerTop, sniperTop, gegnerImg, effImg, gegnerAtlas, effAtlas, rangerJ, sniperJ, karten] = await Promise.all([
      bild('bilder/depot.png'), bild('bilder/ranger_draufsicht@2x.png'), bild('bilder/scharfschuetze_draufsicht@2x.png'),
      bild('bilder/gegner_spritesheet.png'), bild('bilder/effekte_spritesheet.png'),
      json('daten/gegner_atlas.json'), json('daten/effekte_atlas.json'), json('daten/ranger_draufsicht.json'), json('daten/scharfschuetze_draufsicht.json'), json('daten/karten.json')
    ]);
    A = { depot, rangerTop, sniperTop, gegnerImg, effImg, gegnerAtlas, effAtlas, ranger: rangerJ, sniper: sniperJ, karten: karten.karten, bilder: {} };
    if (typeof P.stufe !== 'number') { P.stufe = 1; P.xp = 0; }
    if (!P.rekord) P.rekord = {};
    if (typeof P.orden !== 'number') {   // alter Spielstand mit Kornvorrat -> in Orden umrechnen
      let o = 0;
      A.karten.forEach((k, i) => { if (P.sterne[k.id]) o += ORDEN[i] + P.sterne[k.id]; });
      for (const t of TECH) if (P.tech[t.id]) o -= t.k;
      P.orden = Math.max(0, o); delete P.vorrat; sichern();
    }
  }
  async function karteLaden(i) {
    const k = A.karten[i];
    if (!A.bilder[i]) A.bilder[i] = await bild('bilder/' + k.bild);
    wege = k.wege.map((w) => wegAbtasten(w, k.eckig));
    K = k;
  }

  // ---------- Weg ----------
  function wegAbtasten(p, eckig) {
    const pts = [];
    for (let i = 0; i < p.length - 1; i++) {
      if (eckig) { for (let t = 0; t < 1; t += 0.02) pts.push([p[i][0] + (p[i + 1][0] - p[i][0]) * t, p[i][1] + (p[i + 1][1] - p[i][1]) * t]); continue; }
      const p0 = p[Math.max(0, i - 1)], p1 = p[i], p2 = p[i + 1], p3 = p[Math.min(p.length - 1, i + 2)];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      for (let t = 0; t < 1; t += 0.01) {
        const u = 1 - t;
        pts.push([u * u * u * p1[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * p2[0], u * u * u * p1[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * p2[1]]);
      }
    }
    pts.push(p[p.length - 1]);
    const lang = [0];
    for (let i = 1; i < pts.length; i++) lang.push(lang[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    return { pts, lang, gesamt: lang[lang.length - 1] };
  }
  function wegPos(w, d) {
    const { pts, lang } = wege[w];
    if (d <= 0) return { x: pts[0][0], y: pts[0][1], dx: 1 };
    let lo = 0, hi = lang.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (lang[m] < d) lo = m; else hi = m; }
    const t = (d - lang[lo]) / ((lang[hi] - lang[lo]) || 1);
    return { x: pts[lo][0] + (pts[hi][0] - pts[lo][0]) * t, y: pts[lo][1] + (pts[hi][1] - pts[lo][1]) * t, dx: pts[hi][0] - pts[lo][0] };
  }
  function abstandZumWeg(x, y) {
    let m = Infinity;
    for (const weg of wege) for (let i = 0; i < weg.pts.length; i += 2) { const [px, py] = weg.pts[i]; const d = (px - x) ** 2 + (py - y) ** 2; if (d < m) m = d; }
    return Math.sqrt(m);
  }

  // ---------- Spieler-Stufe (Erfahrung) ----------
  const XP_BEDARF = (stufe) => Math.round((3000 * Math.pow(1.35, stufe - 1)) / 50) * 50;   // 3.000, 4.050, 5.450, …
  let xpSichern = 0;
  function erfahrung(n) {
    P.xp += n;
    while (P.xp >= XP_BEDARF(P.stufe)) {
      P.xp -= XP_BEDARF(P.stufe); P.stufe++; P.orden++;
      toast(`Stufe ${P.stufe} erreicht! +1 Verdienstorden`);
      sichern();
    }
    if (++xpSichern % 25 === 0) sichern();
  }
  let toastT = null;
  function toast(text) {
    const el = $('toast'); el.textContent = text; el.style.display = 'block';
    clearTimeout(toastT); toastT = setTimeout(() => { el.style.display = 'none'; }, 3200);
  }

  // ---------- Türme ----------
  function werte(t) {
    const def = TUERME[t.typ], w = { ...def.basis, pierce: 0 };
    const add = (d) => { for (const [k, v] of Object.entries(d)) w[k] = typeof v === 'number' && typeof w[k] === 'number' ? w[k] + v : v; };
    for (let i = 0; i < t.a; i++) add(def.A[i].d);
    for (let i = 0; i < t.b; i++) add(def.B[i].d);
    if (t.typ === 'ranger') { if (P.tech.drill1) w.reload *= 0.9; if (P.tech.drill2) w.reload *= 0.9; }
    if (t.typ === 'sniper' && P.tech.ruhig) w.range *= 1.15;
    if (w.dauerfeuer) { w.reload = 0.15; w.burst = 1; }
    w.rangePx = w.range * EINHEIT;
    if (def.depot) { w.koernerProWelle = Math.round(w.geld * w.faktor); w.depot = true; }
    return w;
  }
  function ausbauKosten(t, pfad) {
    const def = TUERME[t.typ], stufe = pfad === 'A' ? t.a : t.b;
    let k = def[pfad][stufe].k;
    if (t.typ === 'sniper' && pfad === 'A' && P.tech.tarnung) k = Math.round(k * 0.8);
    return k;
  }
  const zahl = (n) => (Math.round(n * 100) / 100).toLocaleString('de-DE');
  // Liste der Wertänderungen zwischen zwei Stufen, z. B. "Nachladen 1,75 → 1,65 s"
  function aenderungen(alt, neu) {
    const z = [];
    if (alt.depot) {
      if (neu.koernerProWelle !== alt.koernerProWelle) z.push(['Körner pro Welle', fmt(alt.koernerProWelle), fmt(neu.koernerProWelle)]);
      if (neu.leben !== alt.leben) z.push(['Leben pro Welle', String(alt.leben), String(neu.leben)]);
      return { zeilen: z, neu: neu.faktor < alt.faktor ? ['Depot bringt insgesamt ' + Math.round((1 - neu.faktor) * 100) + ' % weniger Körner'] : [] };
    }
    const nach = (w) => (w.dauerfeuer ? 'Dauerfeuer' : zahl(w.reload) + ' s');
    if (neu.dmg !== alt.dmg) z.push(['Schaden', zahl(alt.dmg), zahl(neu.dmg)]);
    if (nach(neu) !== nach(alt)) z.push(['Nachladen', nach(alt), nach(neu)]);
    if (!neu.dauerfeuer && neu.burst !== alt.burst) z.push(['Feuerstoß', alt.burst + ' Schuss', neu.burst + ' Schuss']);
    if (Math.abs(neu.range - alt.range) > 0.01) z.push(['Reichweite', zahl(alt.range), zahl(neu.range)]);
    if ((neu.pierce || 0) !== (alt.pierce || 0)) z.push(['Durchschlag', String(alt.pierce || 0), String(neu.pierce || 0)]);
    const dps = (w) => (w.dmg * (w.dauerfeuer ? 1 : w.burst)) / w.reload;
    z.push(['Schaden/s', zahl(dps(alt)), zahl(dps(neu))]);
    const neuF = [];
    if (neu.tarn && !alt.tarn) neuF.push('erkennt Getarnte');
    if (neu.panzerbrechend && !alt.panzerbrechend) neuF.push('durchschlägt Panzerung');
    if (neu.granate && neu.granate !== alt.granate) neuF.push(neu.granate >= 2 ? 'Granate 100 Schaden alle 5 s' : 'Granate 75 Schaden alle 8 s');
    if (neu.brand && !alt.brand) neuF.push('Brandgranate alle 10 s');
    if (neu.leuchtkugel && !alt.leuchtkugel) neuF.push('Leuchtkugel deckt Getarnte auf');
    if (neu.laser && !alt.laser) neuF.push('Laser-Munition (voller Schaden gegen Panzer)');
    return { zeilen: z, neu: neuF };
  }
  function turmName(t) {
    const def = TUERME[t.typ];
    if (t.a === 0 && t.b === 0) return { ranger: 'Grenzranger', sniper: 'Grenzschütze', depot: 'Feldlager' }[t.typ];
    return t.a >= t.b ? def.A[t.a - 1].n : def.B[t.b - 1].n;
  }
  function platzOk(x, y, typ = S.platzieren) {
    const gross = typ === 'depot';
    if (x < 30 || x > W - 30 || y < 30 || y > H - 30) return false;
    if (x < 540 && y < 90) return false;                         // Anzeige oben links
    if (abstandZumWeg(x, y) < K.wegbreite / 2 + 3 + (gross ? 48 : 22)) return false;
    const z = K.ziel; if (Math.hypot(x - z[0], y - z[1]) < 70) return false;
    for (const e of K.sperren || []) if (((x - e.x) / e.rx) ** 2 + ((y - e.y) / e.ry) ** 2 < 1) return false;
    for (const t of S.tuerme) if (Math.hypot(t.x - x, t.y - y) < (gross || t.typ === 'depot' ? 80 : 46)) return false;
    return true;
  }
  function turmBauen(typ, x, y) {
    const def = TUERME[typ];
    if (S.koerner < def.kosten) return;
    S.koerner -= def.kosten;
    const t = { typ, x, y, a: 0, b: typ === 'ranger' && P.tech.goldmag ? 1 : 0, ziel: 0, winkel: -Math.PI / 2, cd: 0.3, burstRest: 0, burstCd: 0, schussT: 1, granCd: 2, brandCd: 4, leuchtCd: 1, investiert: def.kosten };
    S.tuerme.push(t);
    S.wahl = t;
  }

  // ---------- Gegner und Wellen ----------
  function welleBauen(n) {
    const q = [];
    let t = 0;
    const add = (typ, anzahl, abstand) => { for (let i = 0; i < anzahl; i++) { q.push({ t, typ }); t += abstand; } t += 1.2; };
    add('soldat', 5 + Math.round(n * 1.6), Math.max(0.35, 0.9 - n * 0.025));
    if (n >= 4) add('tarnsoldat', Math.floor((n - 2) * 1.1), 0.8);
    if (n >= 6) add('panzersoldat', Math.floor((n - 4) * 0.8), 1.1);
    if (n >= 7) add('humvee', Math.floor((n - 5) * 0.5), 1.4);
    if (n >= 9) add('soldat', Math.round(n * 1.5), 0.3);
    if (n >= 10 && n % 5 === 0) add('panzer', n / 5 - 1, 4);
    if (n >= 18) add('panzer', Math.min(8, Math.floor((n - 14) / 2)), 3);
    if (n >= 25) add('humvee', Math.floor((n - 20) / 2), 0.9);
    if (K.id === 'westkolbistan' && n === K.wellen) { t += 4; add('ratte', 1, 0); }
    return q;
  }
  function gegnerNeu(typ) {
    const g = GEGNER[typ], f = (1 + S.welle * 0.06) * HP_KARTE[K.stufe - 1] * (S.welle > K.wellen ? Math.pow(1.1, S.welle - K.wellen) : 1);
    const w = S.spawnNr++ % wege.length, p = wegPos(w, 0);
    if (g.boss) { S.bannerBis = S.zeit + 4; $('hinweis').textContent = 'Achtung: Die Stahlratte rollt an! Sie hält an und betäubt Türme mit ihren Geschützen. Panzerbrechende Munition, Granaten und Laser helfen.'; }
    return { typ, w, hp: g.hp * f, max: g.hp * f, d: -20, t: Math.random(), brennt: 0, sichtbarBis: 0, x: p.x, y: p.y, links: false, schussCd: 6, stopp: 0, feuerT: 99, geschossen: true };
  }

  // ---------- Kampf ----------
  function sichtbar(g, t, w) { return !GEGNER[g.typ].tarn || w.tarn || g.sichtbarBis > S.zeit; }
  function zielWahl(t, w) {
    let best = null, bestWert = -Infinity;
    for (const g of S.gegner) {
      if (g.hp <= 0 || g.d < 0) continue;
      const dist = Math.hypot(g.x - t.x, g.y - t.y);
      if (dist > w.rangePx || !sichtbar(g, t, w)) continue;
      const fort = g.d / wege[g.w].gesamt;
      const wert = [fort, -fort, g.hp, -dist][t.ziel];
      if (wert > bestWert) { bestWert = wert; best = g; }
    }
    return best;
  }
  function schaden(g, menge, art, w) {
    if (g.hp <= 0) return;
    let m = menge;
    if (GEGNER[g.typ].panzer && art === 'kugel' && !(w && (w.panzerbrechend || w.laser))) m *= 0.35;
    g.hp -= m;
    if (g.hp <= 0) { S.koerner += GEGNER[g.typ].lohn; erfahrung(GEGNER[g.typ].lohn); effekt('explosion', g.x, g.y - 20, 0, g.typ === 'ratte' ? 1.8 : g.typ === 'panzer' || g.typ === 'humvee' ? 0.9 : 0.35); }
  }
  function muendung(t) {
    const code = t.a + '-' + t.b, info = A[t.typ].frames[code].bilder[0].muendung;
    const k = TURM_GROESSE / 160, mx = (info.x - 80) * k, my = (info.y - 80) * k, c = Math.cos(t.winkel), s = Math.sin(t.winkel);
    return { x: t.x + mx * c - my * s, y: t.y + mx * s + my * c };
  }
  function geschossArt(t, w) {
    if (t.typ === 'ranger') return t.a === 5 ? 'leuchtspur' : t.a === 4 ? 'kugel_schwer' : t.b >= 1 ? 'kugel_ap' : 'kugel';
    return t.b === 5 ? 'laserkugel' : t.b >= 2 ? 'kugel_50' : 'kugel_scharf';
  }
  function schiessen(t, w, ziel) {
    const m = muendung(t);
    S.geschosse.push({ art: geschossArt(t, w), x: m.x, y: m.y, ziel, tx: ziel.x, ty: ziel.y - 18, tempo: t.typ === 'sniper' ? 1800 : 1100, dmg: w.dmg, w, pierce: w.pierce || 0 });
    effekt('muendungsfeuer', m.x, m.y, t.winkel, t.typ === 'sniper' ? 0.75 : 0.55);
    t.schussT = 0;
  }
  function werfen(t, ziel, art) {
    const m = muendung(t);
    S.geschosse.push({ art, x: m.x, y: m.y, sx: m.x, sy: m.y, tx: ziel.x, ty: ziel.y - 10, flug: 0, dauer: 0.6, wurf: true, stufe: art === 'granate' ? (werte(t).granate || 1) : 0 });
  }
  function effekt(name, x, y, rot = 0, gr = 1, dauer = null) {
    const an = A.effAtlas.animationen[name];
    S.effekte.push({ name, x, y, rot, gr, t: 0, dauer: dauer || (an.fps ? an.bilder.length / an.fps : 0.15) });
  }

  function turmUpdate(t, dt) {
    if (TUERME[t.typ].depot) return;
    const w = werte(t);
    t.schussT += dt;
    if (t.betaeubtBis > S.zeit) { t.burstRest = 0; return; }
    const ziel = zielWahl(t, w);
    if (ziel) {
      const soll = Math.atan2(ziel.y - 18 - t.y, ziel.x - t.x);
      let diff = Math.atan2(Math.sin(soll - t.winkel), Math.cos(soll - t.winkel));
      const max = (t.typ === 'sniper' ? 6 : 9) * dt;
      t.winkel += Math.max(-max, Math.min(max, diff));
      diff = Math.atan2(Math.sin(soll - t.winkel), Math.cos(soll - t.winkel));
      t.cd -= dt;
      if (t.burstRest > 0) { t.burstCd -= dt; if (t.burstCd <= 0 && Math.abs(diff) < 0.35) { schiessen(t, w, ziel); t.burstRest--; t.burstCd = 0.15; } }
      else if (t.cd <= 0 && Math.abs(diff) < 0.3) { schiessen(t, w, ziel); t.burstRest = w.burst - 1; t.burstCd = 0.15; t.cd = w.reload; }
      if (w.granate) { t.granCd -= dt; if (t.granCd <= 0) { werfen(t, ziel, 'granate'); t.granCd = w.granate >= 2 ? 5 : 8; } }
      if (w.brand) { t.brandCd -= dt; if (t.brandCd <= 0) { werfen(t, ziel, 'brandgranate'); t.brandCd = 10; } }
    } else t.cd = Math.max(0, t.cd - dt);
    if (w.leuchtkugel) {
      t.leuchtCd -= dt;
      if (t.leuchtCd <= 0) {
        const getarnt = S.gegner.filter((g) => GEGNER[g.typ].tarn && g.hp > 0 && Math.hypot(g.x - t.x, g.y - t.y) < w.rangePx);
        if (getarnt.length) {
          const z = getarnt[0];
          for (const g of S.gegner) if (Math.hypot(g.x - t.x, g.y - t.y) < w.rangePx) g.sichtbarBis = S.zeit + 8;
          effekt('leuchtkugel', z.x, z.y - 60, 0, 1, 3);
          t.leuchtCd = 10;
        } else t.leuchtCd = 0.5;
      }
    }
  }

  function geschossUpdate(p, dt) {
    if (p.wurf) {
      p.flug += dt;
      const k = Math.min(1, p.flug / p.dauer);
      p.x = p.sx + (p.tx - p.sx) * k; p.y = p.sy + (p.ty - p.sy) * k - Math.sin(k * Math.PI) * (p.boss ? 110 : 60);
      p.rot = p.boss ? Math.atan2((p.ty - p.sy) - Math.cos(k * Math.PI) * Math.PI * 110, p.tx - p.sx) : k * 12;
      if (k >= 1) {
        p.weg = true;
        if (p.boss) {
          effekt('explosion', p.tx, p.ty, 0, 0.75);
          for (const t of S.tuerme) if (Math.hypot(t.x - p.tx, t.y - p.ty) < 50) t.betaeubtBis = S.zeit + 4;
        } else if (p.art === 'granate') {
          const r = p.stufe >= 2 ? 4 * EINHEIT : 3 * EINHEIT, dmg = p.stufe >= 2 ? 100 : 75;
          effekt('explosion', p.tx, p.ty, 0, r / 70);
          for (const g of S.gegner) if (Math.hypot(g.x - p.tx, g.y - 15 - p.ty) < r) schaden(g, dmg * 0.25, 'explosion');
        } else {
          S.flaechen.push({ x: p.tx, y: p.ty + 10, bis: S.zeit + 5, t: 0 });
        }
      }
      return;
    }
    if (p.ziel && p.ziel.hp > 0) { p.tx = p.ziel.x; p.ty = p.ziel.y - 18; }
    const dx = p.tx - p.x, dy = p.ty - p.y, d = Math.hypot(dx, dy), s = p.tempo * dt;
    p.rot = Math.atan2(dy, dx);
    if (d <= s) {
      p.weg = true;
      if (p.ziel && p.ziel.hp > 0) {
        schaden(p.ziel, p.dmg, 'kugel', p.w);
        effekt('treffer', p.tx, p.ty, 0, 0.6);
        let rest = p.pierce;
        if (rest > 0) for (const g of S.gegner) { if (rest <= 0) break; if (g !== p.ziel && g.hp > 0 && Math.hypot(g.x - p.ziel.x, g.y - p.ziel.y) < 60) { schaden(g, p.dmg, 'kugel', p.w); rest--; } }
      }
    } else { p.x += (dx / d) * s; p.y += (dy / d) * s; }
  }

  function bossSchuss(g) {
    const def = GEGNER[g.typ], z = g.bossZiel; if (!z) return;
    const mx = g.x + (380 - 192) * def.gr * (g.links ? -1 : 1), my = g.y + (62 - 206) * def.gr;
    effekt('muendungsfeuer', mx, my, g.links ? Math.PI : 0, 1.4);
    S.geschosse.push({ art: 'granate_gross', x: mx, y: my, sx: mx, sy: my, tx: z.x, ty: z.y, flug: 0, dauer: 1.0, wurf: true, boss: true, ziel: z });
  }

  // ---------- Ablauf ----------
  function update(dt) {
    S.zeit += dt;
    if (S.laeuft) {
      for (const sp of S.spawn) sp.t -= dt;
      while (S.spawn.length && S.spawn[0].t <= 0) S.gegner.push(gegnerNeu(S.spawn.shift().typ));
    }
    for (const g of S.gegner) {
      const def = GEGNER[g.typ];
      if (def.boss) {
        g.feuerT += dt; g.schussCd -= dt;
        if (g.stopp > 0) {
          g.stopp -= dt;
          if (!g.geschossen && g.stopp < 1.3) { g.geschossen = true; g.feuerT = 0; bossSchuss(g); }
        } else if (g.schussCd <= 0 && g.d > 30) {
          let ziel = null;
          for (const t of S.tuerme) if (Math.hypot(t.x - g.x, t.y - g.y) < 340 && !(t.betaeubtBis > S.zeit) && (!ziel || t.investiert > ziel.investiert)) ziel = t;
          if (ziel) { g.stopp = 1.8; g.geschossen = false; g.bossZiel = ziel; g.schussCd = 8; } else g.schussCd = 1;
        }
      }
      if (!(def.boss && g.stopp > 0)) { g.d += def.tempo * dt; g.t += dt; }
      const p = wegPos(g.w, g.d); g.x = p.x; g.y = p.y; if (Math.abs(p.dx) > 0.3) g.links = p.dx < 0;
      if (g.brennt > 0) { g.brennt -= dt; schaden(g, 4 * dt, 'feuer'); }
      if (g.d >= wege[g.w].gesamt) { g.hp = 0; g.durch = true; S.leben -= def.schaden; }
    }
    for (const f of S.flaechen) { f.t += dt; for (const g of S.gegner) if (Math.hypot(g.x - f.x, g.y - f.y) < 46) g.brennt = 0.5; }
    S.flaechen = S.flaechen.filter((f) => f.bis > S.zeit);
    for (const t of S.tuerme) turmUpdate(t, dt);
    for (const p of S.geschosse) geschossUpdate(p, dt);
    S.geschosse = S.geschosse.filter((p) => !p.weg);
    S.gegner = S.gegner.filter((g) => g.hp > 0);
    for (const e of S.effekte) e.t += dt;
    for (const tx of S.texte) tx.t += dt;
    S.texte = S.texte.filter((tx) => tx.t < 1.8);
    S.effekte = S.effekte.filter((e) => e.t < e.dauer);
    if (S.leben <= 0 && !S.ende) { S.leben = 0; S.ende = true; ende(false); }
    if (S.laeuft && !S.spawn.length && !S.gegner.length) {
      S.laeuft = false;
      S.koerner += Math.round((150 + S.welle * 25) * (P.tech.ernte ? 1.1 : 1));
      if (P.tech.reserve) S.leben += 1;
      erfahrung(10 + S.welle * 2);
      if (S.freeplay) {
        const fp = S.welle - K.wellen;
        P.rekord[K.id] = Math.max(P.rekord[K.id] || 0, S.welle);
        if (fp > 0 && fp % 20 === 0) { P.orden++; toast(`${fp} Freeplay-Wellen geschafft! +1 Verdienstorden`); }
        sichern();
      } else if (S.welle >= K.wellen && !S.ende) { S.ende = true; ende(true); }
    }
  }

  // ---------- Zeichnen ----------
  const cv = $('feld'), ctx = cv.getContext('2d');
  function frameZeichnen(img, f, x, y, sx = 1, sy = 1, ax = f.w / 2, ay = f.h / 2) {
    ctx.save(); ctx.translate(x, y); ctx.scale(sx, sy);
    ctx.drawImage(img, f.x, f.y, f.w, f.h, -ax, -ay, f.w, f.h);
    ctx.restore();
  }
  function effFrame(name, t, schleife) {
    const an = A.effAtlas.animationen[name];
    const i = an.fps ? Math.floor(t * an.fps) : 0;
    const n = schleife ? i % an.bilder.length : Math.min(an.bilder.length - 1, i);
    return A.effAtlas.frames[an.bilder[n]];
  }
  function turmZeichnen(t, alpha = 1) {
    if (TUERME[t.typ].depot) {
      const i = KOMBIS.indexOf(t.a + '-' + t.b), k = 150 / 256;
      ctx.save(); ctx.globalAlpha = alpha;
      ctx.drawImage(A.depot, (i % 9) * 256, Math.floor(i / 9) * 256, 256, 256, t.x - 128 * k, t.y - 150 * k, 256 * k, 256 * k);
      ctx.restore(); return;
    }
    const img = t.typ === 'ranger' ? A.rangerTop : A.sniperTop;
    const row = KOMBIS.indexOf(t.a + '-' + t.b);
    const fr = t.schussT < 0.04 ? 1 : t.schussT < 0.09 ? 2 : 0;
    ctx.save(); ctx.globalAlpha = alpha; ctx.translate(t.x, t.y); ctx.rotate(t.winkel);
    ctx.drawImage(img, fr * 320, row * 320, 320, 320, -TURM_GROESSE / 2, -TURM_GROESSE / 2, TURM_GROESSE, TURM_GROESSE);
    ctx.restore();
  }
  function gegnerZeichnen(g) {
    const def = GEGNER[g.typ], feuer = def.boss && g.feuerT < 0.375;
    const an = A.gegnerAtlas.animationen[feuer ? 'ratte_feuer' : g.typ];
    const f = A.gegnerAtlas.frames[an.bilder[feuer ? Math.min(2, Math.floor(g.feuerT * 8)) : Math.floor(g.t * an.fps) % an.bilder.length]];
    const getarnt = def.tarn && g.sichtbarBis <= S.zeit;
    ctx.save(); ctx.globalAlpha = getarnt ? 0.45 : 1;
    frameZeichnen(A.gegnerImg, f, g.x, g.y, (g.links ? -1 : 1) * def.gr, def.gr, an.anker.x, an.anker.y);
    ctx.restore();
    if (g.hp < g.max && !def.boss) {
      const bw = g.typ === 'panzer' ? 70 : 36, y = g.y - f.h * def.gr * 0.85;
      ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(g.x - bw / 2 - 1, y - 1, bw + 2, 6);
      ctx.fillStyle = g.hp / g.max > 0.4 ? '#7CD992' : '#FF6B5E'; ctx.fillRect(g.x - bw / 2, y, bw * Math.max(0, g.hp / g.max), 4);
    }
    if (g.brennt > 0) { const fl = effFrame('brandflaeche', S.zeit, true); frameZeichnen(A.effImg, fl, g.x, g.y - 6, 0.35, 0.35); }
  }
  function zeichnen() {
    ctx.drawImage(A.bilder[A.karten.indexOf(K)], 0, 0, W, H);
    for (const f of S.flaechen) frameZeichnen(A.effImg, effFrame('brandflaeche', f.t, true), f.x, f.y, 0.9, 0.9);
    const w = S.wahl ? werte(S.wahl) : null;
    if (S.wahl && w.rangePx > 0) { ctx.beginPath(); ctx.arc(S.wahl.x, S.wahl.y, w.rangePx, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.fill(); ctx.setLineDash([8, 6]); ctx.strokeStyle = '#E8C766'; ctx.lineWidth = 2; ctx.stroke(); ctx.setLineDash([]); }
    const dinge = [...S.gegner.map((g) => ({ y: g.y, f: () => gegnerZeichnen(g) })), ...S.tuerme.map((t) => ({ y: t.y + 20, f: () => {
      if (t === S.wahl) { ctx.save(); ctx.shadowColor = '#E8C766'; ctx.shadowBlur = 16; turmZeichnen(t); ctx.restore(); } else turmZeichnen(t);
      if (t.betaeubtBis > S.zeit) frameZeichnen(A.effImg, effFrame('betaeubt', S.zeit, true), t.x, t.y - 46, 1, 1);
    } }))];
    dinge.sort((p, q) => p.y - q.y).forEach((d) => d.f());
    for (const p of S.geschosse) {
      const an = A.effAtlas.animationen[p.art], fr = A.effAtlas.frames[an.bilder[0]];
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot || 0); const k = p.wurf ? 0.7 : 0.8;
      ctx.drawImage(A.effImg, fr.x, fr.y, fr.w, fr.h, -fr.w * k / 2, -fr.h * k / 2, fr.w * k, fr.h * k); ctx.restore();
    }
    for (const e of S.effekte) {
      const fr = effFrame(e.name, e.t, e.name === 'leuchtkugel');
      ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(e.rot); ctx.scale(e.gr, e.gr);
      const ax = e.name === 'muendungsfeuer' ? 3 : fr.w / 2;
      ctx.drawImage(A.effImg, fr.x, fr.y, fr.w, fr.h, -ax, -fr.h / 2, fr.w, fr.h); ctx.restore();
    }
    for (const tx of S.texte) {
      ctx.save(); ctx.globalAlpha = Math.min(1, (1.8 - tx.t) / 0.6); ctx.font = '800 22px "Space Grotesk", sans-serif'; ctx.textAlign = 'center';
      ctx.lineWidth = 5; ctx.strokeStyle = '#1A0306'; ctx.strokeText(tx.text, tx.x, tx.y - tx.t * 30); ctx.fillStyle = tx.farbe; ctx.fillText(tx.text, tx.x, tx.y - tx.t * 30); ctx.restore();
    }
    const boss = S.gegner.find((g) => GEGNER[g.typ].boss);
    if (boss) {
      const x0 = 430, bw = 480;
      ctx.fillStyle = 'rgba(43,5,9,0.92)'; ctx.strokeStyle = '#C9A227'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(x0, 20, bw, 52, 12); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#E8C766'; ctx.font = '700 13px Inter, sans-serif'; ctx.fillText('BOSS · ' + GEGNER[boss.typ].name.toUpperCase(), x0 + 14, 40);
      ctx.fillStyle = '#E7D4D6'; ctx.textAlign = 'right'; ctx.fillText(fmt(Math.max(0, boss.hp)) + ' / ' + fmt(boss.max), x0 + bw - 14, 40); ctx.textAlign = 'left';
      ctx.fillStyle = '#1A0306'; ctx.fillRect(x0 + 14, 48, bw - 28, 12);
      ctx.fillStyle = '#E0361C'; ctx.fillRect(x0 + 14, 48, (bw - 28) * Math.max(0, boss.hp / boss.max), 12);
    }
    if (S.bannerBis > S.zeit) {
      const a = Math.min(1, (S.bannerBis - S.zeit) / 0.5);
      ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(26,3,6,0.85)'; ctx.fillRect(0, 340, W, 110);
      ctx.fillStyle = '#C9A227'; ctx.fillRect(0, 340, W, 3); ctx.fillRect(0, 447, W, 3);
      ctx.textAlign = 'center'; ctx.fillStyle = '#E8C766'; ctx.font = '700 16px Inter, sans-serif'; ctx.fillText('BOSS-WELLE', W / 2, 376);
      ctx.fillStyle = '#FFFFFF'; ctx.font = '700 44px "Space Grotesk", sans-serif'; ctx.fillText('Die Stahlratte rollt an!', W / 2, 424); ctx.restore(); ctx.textAlign = 'left';
    }
    if (S.platzieren && S.maus) {
      const ok = platzOk(S.maus.x, S.maus.y), r = werte({ typ: S.platzieren, a: 0, b: 0 }).rangePx || 70;
      ctx.beginPath(); ctx.arc(S.maus.x, S.maus.y, r, 0, Math.PI * 2); ctx.fillStyle = ok ? 'rgba(124,217,146,0.18)' : 'rgba(255,80,60,0.22)'; ctx.fill();
      ctx.strokeStyle = ok ? '#7CD992' : '#FF6B5E'; ctx.lineWidth = 2; ctx.stroke();
      turmZeichnen({ typ: S.platzieren, x: S.maus.x, y: S.maus.y, a: 0, b: 0, winkel: -Math.PI / 2, schussT: 1 }, 0.75);
    }
  }

  // ---------- Oberfläche ----------
  function schraegStil(typ, a, b, groesse) {
    const i = KOMBIS.indexOf(a + '-' + b), k = groesse / 256;
    return `background-image:url(${TUERME[typ].schraeg});background-size:${2304 * k}px ${768 * k}px;background-position:-${(i % 9) * groesse}px -${Math.floor(i / 9) * groesse}px`;
  }
  function leisteZeichnen() {
    const box = $('tuerme');
    box.innerHTML = '';
    for (const typ of ['ranger', 'sniper', 'depot', null]) {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'turmkarte';
      if (!typ) { b.classList.add('gesperrt'); b.disabled = true; b.innerHTML = '<div class="bild" style="display:flex;align-items:center;justify-content:center;font-size:36px;color:#5A2A30;font-weight:700">?</div><span class="name">Bald</span><span class="preis">gesperrt</span>'; box.appendChild(b); continue; }
      const def = TUERME[typ], frei = !def.tech || P.tech[def.tech];
      if (!frei) b.classList.add('gesperrt');
      else if (S.koerner < def.kosten) b.classList.add('teuer');
      if (S.platzieren === typ) b.classList.add('aktiv');
      b.setAttribute('aria-label', def.name + (frei ? ` – ${def.kosten} Körner` : ' – im Techbaum freischalten'));
      b.innerHTML = `<div class="bild" style="${schraegStil(typ, 0, 0, 112)}"></div><span class="name">${def.name}</span><span class="preis">${frei ? fmt(def.kosten) + ' Körner' : 'Techbaum'}</span>` +
        (frei ? '' : '<span class="schloss"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E8C766" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg></span>');
      b.onclick = () => {
        if (!frei) { $('hinweis').textContent = `${def.name} ist gesperrt. Schalte es zwischen den Runden im Techbaum auf dem Weltbildschirm frei (Verdienstorden gibt es für besiegte Karten).`; return; }
        S.platzieren = S.platzieren === typ ? null : typ; S.wahl = null;
        $('hinweis').textContent = S.platzieren ? def.info + ' Tippe auf eine freie Stelle neben dem Weg.' : 'Wähle einen Turm.';
        oberflaeche();
      };
      box.appendChild(b);
    }
  }
  let letzteLeiste = '';
  function oberflaeche() {
    $('welle').textContent = S.welle; $('wellenMax').textContent = S.freeplay ? '∞ Freeplay' : K.wellen;
    $('koerner').textContent = fmt(S.koerner); $('leben').textContent = Math.max(0, Math.ceil(S.leben));
    $('tempo').textContent = S.tempo + '×'; $('pause').textContent = S.pause ? '▶' : '❚❚';
    const wk = $('welleKnopf');
    wk.disabled = S.laeuft || S.ende;
    wk.textContent = S.laeuft ? 'Welle läuft …' : `▶ Welle ${S.welle + 1} starten`;
    const schluessel = JSON.stringify([S.platzieren, P.tech, S.koerner >= 250, S.koerner >= 285, S.koerner >= 400]);
    if (schluessel !== letzteLeiste) { letzteLeiste = schluessel; leisteZeichnen(); }
    panelZeichnen();
  }
  let letztesPanel = '';
  function panelZeichnen() {
    const p = $('panel'), t = S.wahl;
    if (!t) { p.style.display = 'none'; letztesPanel = ''; return; }
    const schluessel = JSON.stringify([S.tuerme.indexOf(t), t.a, t.b, t.ziel, Math.floor(S.koerner), P.tech]);
    if (schluessel === letztesPanel) return;
    letztesPanel = schluessel;
    p.style.display = 'flex';
    p.style.left = (t.x < MITTE ? W - 300 - 20 : 20) + 'px';
    const def = TUERME[t.typ], w = werte(t);
    $('pBild').setAttribute('style', schraegStil(t.typ, t.a, t.b, 84));
    $('pCode').textContent = `${def.name} ${t.a}-${t.b}`;
    $('pName').textContent = turmName(t);
    $('pWerte').textContent = def.depot ? `${fmt(w.koernerProWelle)} Körner${w.leben ? ' und ' + w.leben + ' Leben' : ''} zu Beginn jeder Welle` : `Schaden ${zahl(w.dmg)} · ${w.dauerfeuer ? 'Dauerfeuer' : 'Nachladen ' + zahl(w.reload) + ' s'} · Reichweite ${zahl(w.range)}`;
    $('pZiel').parentElement.style.display = def.depot ? 'none' : 'flex';
    const pf = $('pPfade'); pf.innerHTML = '';
    const titel2 = def.pfade || (t.typ === 'ranger' ? ['Präzision', 'Sturm'] : ['Phantom', 'Schwerkaliber']);
    for (const [pfad, titel] of [['A', titel2[0]], ['B', titel2[1]]]) {
      const stufe = pfad === 'A' ? t.a : t.b, andere = pfad === 'A' ? t.b : t.a, max = andere >= 3 ? 2 : 5;
      const fertig = stufe >= 5, gesperrt = stufe >= max;
      const k = fertig || gesperrt ? 0 : ausbauKosten(t, pfad), kann = !fertig && !gesperrt && S.koerner >= k;
      const d = document.createElement('div'); d.className = 'pfad';
      const pips = [0, 1, 2, 3, 4].map((i) => `<span style="background:${i < stufe ? '#E8C766' : i < max ? '#5A2A30' : '#1A0306'}"></span>`).join('');
      let liste = '';
      if (!fertig && !gesperrt) {
        const ae = aenderungen(w, werte({ ...t, a: t.a + (pfad === 'A' ? 1 : 0), b: t.b + (pfad === 'B' ? 1 : 0) }));
        liste = '<div class="aend">' + ae.zeilen.map(([n, x, y]) => `<span>${n} <b>${x} → ${y}</b></span>`).join('') + ae.neu.map((x) => `<span class="neu">+ ${x}</span>`).join('') + '</div>';
      }
      d.innerHTML = `<div class="zeile"><span class="titel">${titel}</span><div class="pips">${pips}</div></div><span class="naechst">${fertig ? 'Höchste Stufe erreicht' : gesperrt ? 'Gesperrt durch anderen Pfad' : def[pfad][stufe].n}</span>${liste}`;
      const b = document.createElement('button'); b.type = 'button';
      b.textContent = fertig ? 'Fertig' : gesperrt ? 'Gesperrt' : fmt(k) + ' Körner';
      b.disabled = !kann; b.style.background = kann ? '#C9A227' : '#2B0509'; b.style.color = kann ? '#1C1416' : '#E7D4D6';
      b.onclick = () => { if (!kann) return; S.koerner -= k; t.investiert += k; if (pfad === 'A') t.a++; else t.b++; oberflaeche(); };
      d.appendChild(b); pf.appendChild(d);
    }
    $('pZiel').textContent = ZIELE[t.ziel] + ' ⟳';
    $('pVerkauf').textContent = `Verkaufen · ${fmt(t.investiert * 0.7)} Körner`;
  }
  $('pZiel').onclick = () => { if (S.wahl) { S.wahl.ziel = (S.wahl.ziel + 1) % ZIELE.length; oberflaeche(); } };
  $('pVerkauf').onclick = () => { const t = S.wahl; if (!t) return; S.koerner += Math.round(t.investiert * 0.7); S.tuerme = S.tuerme.filter((x) => x !== t); S.wahl = null; oberflaeche(); };
  $('pZu').onclick = () => { S.wahl = null; oberflaeche(); };
  $('tempo').onclick = () => { S.tempo = S.tempo === 1 ? 2 : 1; oberflaeche(); };
  $('pause').onclick = () => { S.pause = !S.pause; oberflaeche(); };
  function welleStarten() {
    if (S.laeuft || S.ende) return;
    S.welle++; S.spawn = welleBauen(S.welle); S.laeuft = true;
    for (const t of S.tuerme) {
      if (!TUERME[t.typ].depot) continue;
      const w = werte(t);
      S.koerner += w.koernerProWelle; S.leben += w.leben;
      S.texte.push({ x: t.x, y: t.y - 70, text: '+' + fmt(w.koernerProWelle), farbe: '#E8C766', t: 0 });
      if (w.leben) S.texte.push({ x: t.x, y: t.y - 46, text: '+' + w.leben + ' ♥', farbe: '#FF8A7A', t: 0 });
    }
    oberflaeche();
  }
  $('welleKnopf').onclick = () => welleStarten();

  function feldPunkt(ev) {
    const r = cv.getBoundingClientRect();
    return { x: ((ev.clientX - r.left) / r.width) * W, y: ((ev.clientY - r.top) / r.height) * H };
  }
  cv.addEventListener('pointermove', (ev) => { S.maus = feldPunkt(ev); });
  cv.addEventListener('pointerleave', () => { S.maus = null; });
  cv.addEventListener('pointerdown', (ev) => {
    const p = feldPunkt(ev); S.maus = p;
    if (S.platzieren) {
      if (platzOk(p.x, p.y) && S.koerner >= TUERME[S.platzieren].kosten) { turmBauen(S.platzieren, p.x, p.y); S.platzieren = null; $('hinweis').textContent = 'Turm gebaut. Tippe ihn an, um ihn auszubauen.'; }
      else $('hinweis').textContent = S.koerner < TUERME[S.platzieren].kosten ? 'Zu wenig Körner.' : 'Hier kann nicht gebaut werden (zu nah am Weg, am Speicher oder an einem anderen Turm).';
      oberflaeche(); return;
    }
    let treffer = null, best = 34;
    for (const t of S.tuerme) { const d = Math.hypot(t.x - p.x, t.y - p.y); if (d < best) { best = d; treffer = t; } }
    S.wahl = treffer; oberflaeche();
  });
  window.__mk = { S: () => S, P: () => P, update: (dt) => update(dt), platzOk: (x, y) => platzOk(x, y), abstand: (x, y) => abstandZumWeg(x, y), laden: async (i) => { await karteLaden(i); S = neu(); }, welle: () => welleStarten() };
  window.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') { S.platzieren = null; S.wahl = null; oberflaeche(); } });

  // ---------- Overlays ----------
  function overlay(html, voll) { const o = $('overlayInhalt'); o.className = voll ? 'karte voll' : 'karte'; o.innerHTML = html; $('overlay').style.display = 'flex'; }
  function overlayZu() { $('overlay').style.display = 'none'; }
  const SCHLOSS = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
  const KORN_ALT = '<svg width="22" height="26" viewBox="0 0 22 26" aria-hidden="true"><ellipse cx="11" cy="12" rx="6" ry="10" fill="#E8C766" stroke="#7A5A10" stroke-width="1.4"/><path d="M8 6v13M11 3v18M14 6v13" stroke="#C9A227" stroke-width="1.2"/><path d="M5 25Q4 15 8 9M17 25Q18 15 14 9" stroke="#2E9E4F" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>';
  const ORDEN_SVG = '<svg width="24" height="28" viewBox="0 0 24 28" aria-hidden="true"><path d="M6 1h5l3 9H9z" fill="#7A0F1A" stroke="#2B0509" stroke-width="1"/><path d="M13 1h5l-3 9h-5z" fill="#A3343C" stroke="#2B0509" stroke-width="1"/><circle cx="12" cy="18" r="8.5" fill="#E8C766" stroke="#7A5A10" stroke-width="1.6"/><circle cx="12" cy="18" r="5.5" fill="none" stroke="#C9A227" stroke-width="1.4"/><path d="M12 14.2l1.2 2.4 2.6.4-1.9 1.8.5 2.6-2.4-1.3-2.4 1.3.5-2.6-1.9-1.8 2.6-.4z" fill="#7A5A10"/></svg>';
  const stufeChip = () => `<div class="chip" style="min-width:150px"><div style="width:100%"><small>Spieler-Stufe</small><b>${P.stufe}</b><div style="height:6px;border-radius:3px;background:#1A0306;margin-top:4px;overflow:hidden" title="${fmt(P.xp)} / ${fmt(XP_BEDARF(P.stufe))} Erfahrung"><div style="height:6px;width:${Math.round((P.xp / XP_BEDARF(P.stufe)) * 100)}%;background:#7CD992"></div></div><small style="letter-spacing:0;text-transform:none">${fmt(P.xp)} / ${fmt(XP_BEDARF(P.stufe))} EP</small></div></div>`;
  const vorratChip = () => `<div class="chip" style="border-color:#C9A227">${ORDEN_SVG}<div><small>Verdienstorden</small><b style="color:#E8C766">${fmt(P.orden)}</b></div></div>`;

  // Techbaum wie im Design (Knoten + Verbindungslinien), dauerhaft
  let techZurueck = null;
  function techZeigen(zurueck) {
    if (zurueck) techZurueck = zurueck;
    const NW = 270, NH = 120, X = [60, 380, 700, 1020], Y = [150, 310, 470, 630], byId = {};
    TECH.forEach((d) => { byId[d.id] = d; });
    let linien = '', knoten = '', zahl = 0;
    for (const d of TECH) {
      if (!d.req) continue;
      const p = byId[d.req], c = P.tech[p.id] ? '#C9A227' : '#5A2A30';
      const x1 = X[p.c], y1 = Y[p.r], x2 = X[d.c], y2 = Y[d.r];
      const seg = (x, y, w, h) => `<div aria-hidden="true" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:${c};border-radius:2px"></div>`;
      if (p.r === d.r) linien += seg(x1 + NW, y1 + NH / 2 - 2, x2 - x1 - NW, 4);
      else { const cx = x1 + NW / 2 - 2; linien += seg(cx, y1 + NH, 4, y2 + NH / 2 - y1 - NH) + seg(cx, y2 + NH / 2 - 2, x2 - cx, 4); }
    }
    for (const d of TECH) {
      const hat = !!P.tech[d.id]; if (hat) zahl++;
      const reqOk = !d.req || !!P.tech[d.req], frei = !hat && reqOk && !d.bald, kann = frei && P.orden >= d.k;
      let btn = hat ? (d.k ? 'Gekauft' : 'Freigeschaltet') : d.bald ? 'Bald' : !reqOk ? 'Benötigt: ' + byId[d.req].n : kann ? (d.bild ? 'Freischalten · ' : 'Kaufen · ') + d.k + ' Orden' : d.k + ' Orden · zu wenig';
      const rand = hat ? '#E8C766' : frei ? '#C9A227' : '#5A2A30';
      const img = d.bild ? `<div style="width:86px;height:96px;flex-shrink:0;border-radius:10px;background:#1A0306;overflow:hidden"><div style="${schraegStil(d.bild, 0, 0, 120)};width:120px;height:120px;margin:-14px 0 0 -18px;opacity:${hat ? 1 : 0.4}"></div></div>` : '';
      knoten += `<div style="position:absolute;left:${X[d.c]}px;top:${Y[d.r]}px;width:${NW}px;height:${NH}px;box-sizing:border-box;border-radius:14px;border:2px solid ${rand};background:${hat ? '#4A0810' : '#2B0509'};display:flex;gap:10px;padding:10px 12px;opacity:${d.bald ? 0.55 : 1}">${img}
        <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:3px"><div style="display:flex;justify-content:space-between;gap:6px"><span style="font-size:15px;font-weight:800">${d.n}</span>${hat ? '<span style="color:#E8C766;font-weight:800" aria-label="gekauft">✓</span>' : !reqOk || d.bald ? `<span style="color:#E7D4D6" aria-label="gesperrt">${SCHLOSS}</span>` : ''}</div>
        <span style="font-size:12px;line-height:1.35;color:#E7D4D6;flex:1">${d.t}</span>
        <button type="button" data-tech="${d.id}" ${kann ? '' : 'disabled'} style="height:34px;border-radius:8px;border:none;background:${kann ? '#C9A227' : hat ? '#2B0509' : '#3A0A10'};color:${kann ? '#1C1416' : hat ? '#E8C766' : '#E7D4D6'};font-size:13px;font-weight:800;cursor:${kann ? 'pointer' : 'default'}">${btn}</button></div></div>`;
    }
    const labels = REIHEN.map((r, k) => `<div style="position:absolute;left:40px;top:${Y[k] - 24}px;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#E8C766">${r}</div>`).join('');
    overlay(`<div style="position:absolute;left:0;top:0;width:1440px;height:96px;box-sizing:border-box;padding:0 40px;display:flex;align-items:center;justify-content:space-between;background:#2B0509;border-bottom:2px solid #C9A227">
        <div style="display:flex;align-items:center;gap:18px"><button type="button" id="techZu" class="knopf" aria-label="Zurück" style="width:48px">‹</button>
          <div><h1 style="margin:0;font-size:34px;line-height:1">Techbaum</h1><span style="font-size:14px;color:#E7D4D6">Türme freischalten und dauerhafte Verbesserungen kaufen – bezahlt mit Verdienstorden für besiegte Karten</span></div></div>
        <div style="display:flex;align-items:center;gap:14px"><span style="font-size:14px;color:#E7D4D6">${zahl - 1} von ${TECH.length - 1} erforscht</span>${vorratChip()}</div></div>
      ${labels}${linien}${knoten}
      <div style="position:absolute;left:1320px;top:150px;width:110px;display:flex;flex-direction:column;gap:10px;font-size:12px;color:#E7D4D6"><span style="font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#E8C766">Legende</span>
        <span style="display:flex;align-items:center;gap:8px"><span style="width:16px;height:16px;border-radius:4px;border:2px solid #E8C766;background:#4A0810"></span>gekauft</span>
        <span style="display:flex;align-items:center;gap:8px"><span style="width:16px;height:16px;border-radius:4px;border:2px solid #C9A227;background:#2B0509"></span>kaufbar</span>
        <span style="display:flex;align-items:center;gap:8px"><span style="width:16px;height:16px;border-radius:4px;border:2px solid #5A2A30;background:#2B0509"></span>gesperrt</span></div>`, true);
    document.querySelectorAll('[data-tech]').forEach((b) => b.onclick = () => {
      const d = byId[b.dataset.tech];
      if (P.tech[d.id] || P.orden < d.k || (d.req && !P.tech[d.req]) || d.bald) return;
      P.orden -= d.k; P.tech[d.id] = true; sichern();
      letzteLeiste = ''; letztesPanel = ''; techZeigen();
    });
    $('techZu').onclick = () => {
      kampagne();
    };
  }

  // Kampagne: Karte von Bir Tawil, Fortschritt, Auswahl
  let kWahl = null;
  const POLY = [
    '30,203 508,203 443,350 443,422 443,516', '508,203 555,203 620,358 558,438 443,422 443,350', '555,203 1046,203 1050,242 1007,293 930,380 620,358',
    '1046,203 1283,203 1085,352 1007,293 1050,242', '1283,203 1355,203 1263,497 1228,433 1181,428 1140,402 1085,352',
    '620,358 930,380 1007,293 1085,352 1140,402 1181,428 1228,433 1263,497 1243,560 593,630 483,546 558,438', '1140,402 1181,428 1187,452 1172,479 1141,485 1108,472 1099,446 1114,416'
  ];
  const PUNKTE = [[300, 318], [532, 326], [800, 282], [1150, 250], [1236, 345], [880, 500], [1143, 448]];
  const freiKarte = (i) => i === 0 || P.sterne[A.karten[i - 1].id] > 0;
  function kampagne() {
    techZurueck = 'kampagne';
    const L = A.karten, aktuell = L.findIndex((k, i) => freiKarte(i) && !P.sterne[k.id]);
    if (kWahl === null) kWahl = aktuell >= 0 ? aktuell : L.length - 1;
    const sx = 1020 / 1400, oy = 175, diffC = { Leicht: '#7CD992', Mittel: '#E8C766', Schwer: '#FF8A1F', Finale: '#FF6B5E' };
    const zustand = (i) => (P.sterne[L[i].id] ? 'fertig' : freiKarte(i) ? 'offen' : 'zu');
    const fill = (i) => ({ fertig: '#7A5A10', offen: '#7A0F1A', zu: '#3A0A10' })[zustand(i)];
    let svg = `<svg width="1020" height="360" viewBox="0 175 1400 494" role="img" aria-label="Kampagnenkarte von Bir Tawil mit den sechs Bundesländern und Maisburg" style="display:block">
      <defs><pattern id="sperr" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)"><rect width="16" height="16" fill="#3A0A10"/><rect width="6" height="16" fill="#7A0F1A"/></pattern></defs>
      <rect x="0" y="120" width="1400" height="600" fill="#2B0509"/>`;
    POLY.slice(0, 6).forEach((pts, i) => { svg += `<polygon points="${pts}" fill="${fill(i)}" stroke="#1A0306" stroke-width="3"/>`; });
    svg += `<polygon points="443,422 558,438 483,546 443,516" fill="url(#sperr)" stroke="#A3343C" stroke-width="2"/><polygon points="${POLY[6]}" fill="${fill(6)}" stroke="#C9A227" stroke-width="3"/>
      <polygon points="30,203 1355,203 1243,560 593,630" fill="none" stroke="#C9A227" stroke-width="5" stroke-linejoin="round"/>
      <polyline points="${PUNKTE.map((p) => p.join(',')).join(' ')}" fill="none" stroke="#E8C766" stroke-width="4" stroke-dasharray="4 12" stroke-linecap="round" opacity="0.8"/>
      <text x="499" y="490" text-anchor="middle" fill="#E7D4D6" font-size="18" font-weight="700" font-family="Inter,sans-serif">Sperrgebiet</text>
      <text x="760" y="192" text-anchor="middle" fill="#E7D4D6" font-size="16" font-family="Inter,sans-serif">Ägypten</text><text x="900" y="660" text-anchor="middle" fill="#E7D4D6" font-size="16" font-family="Inter,sans-serif">Sudan</text></svg>`;
    const marker = L.map((k, i) => { const z = zustand(i), sel = i === kWahl;
      return `<button type="button" data-karte="${i}" aria-label="Karte ${i + 1}: ${k.land} – ${z === 'zu' ? 'gesperrt' : z === 'fertig' ? 'gewonnen' : 'verfügbar'}" style="position:absolute;left:${Math.round(PUNKTE[i][0] * sx - 24)}px;top:${Math.round((PUNKTE[i][1] - oy) * sx - 24)}px;width:48px;height:48px;border-radius:24px;border:3px solid ${sel ? '#FFFFFF' : z === 'fertig' ? '#7A5A10' : z === 'offen' ? '#E8C766' : '#5A2A30'};background:${z === 'fertig' ? '#C9A227' : z === 'offen' ? '#7A0F1A' : '#2B0509'};color:${z === 'fertig' ? '#1C1416' : '#FFFFFF'};font-family:'Space Grotesk',sans-serif;font-size:20px;font-weight:700;cursor:pointer;box-shadow:${z === 'offen' ? '0 0 0 6px rgba(232,199,102,0.25)' : 'none'}">${z === 'fertig' ? '✓' : i + 1}</button>`; }).join('');
    const karten = L.map((k, i) => { const z = zustand(i), st = P.sterne[k.id] || 0;
      return `<button type="button" data-karte="${i}" aria-label="Karte ${i + 1}: ${k.land}, ${k.titel}" style="display:flex;flex-direction:column;padding:0;border-radius:12px;border:2px solid ${i === kWahl ? '#E8C766' : '#5A2A30'};background:#2B0509;color:#fff;overflow:hidden;cursor:pointer;text-align:left">
        <div style="position:relative;width:100%;aspect-ratio:1140/810;background:#3A0A10"><img src="bilder/vorschau_${k.bild.replace('.png', '.jpg')}" alt="" style="width:100%;height:100%;display:block;opacity:${z === 'zu' ? 0.35 : 1}">${z === 'zu' ? `<span style="position:absolute;left:50%;top:50%;width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:17px;background:#1A0306;color:#E8C766;display:flex;align-items:center;justify-content:center">${SCHLOSS}</span>` : ''}</div>
        <div style="display:flex;flex-direction:column;gap:2px;padding:8px 9px 10px"><span style="font-size:12px;font-weight:700;color:#E8C766">${i + 1} · ${k.land}</span><span style="font-size:13px;font-weight:700">${k.titel}</span>
        <span style="font-size:12px;color:#E7D4D6;letter-spacing:.1em">${z === 'fertig' ? '★'.repeat(st) + '☆'.repeat(3 - st) : z === 'offen' ? 'Jetzt spielen' : 'Gesperrt'}</span></div></button>`; }).join('');
    const k = L[kWahl], z = zustand(kWahl), st = P.sterne[k.id] || 0;
    const gesamtSterne = Object.values(P.sterne).reduce((a, b) => a + b, 0), gewonnen = Object.keys(P.sterne).length;
    overlay(`<div style="position:absolute;left:40px;top:28px;display:flex;flex-direction:column;gap:4px"><div style="font-size:13px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#E8C766">Kampagne · Bir Tawil</div>
        <h1 style="margin:0;font-size:34px;line-height:1">Verteidige die Bundesländer</h1><span style="font-size:14px;color:#E7D4D6">Jeder Sieg schaltet die nächste Karte frei.</span></div>
      <div style="position:absolute;left:520px;top:28px;display:flex;gap:8px;align-items:center">${stufeChip()}${vorratChip()}<button type="button" class="rand" id="zumTech" style="height:58px;padding:0 16px">Techbaum</button><button type="button" class="rand" id="zuEinst" aria-label="Einstellungen" style="height:58px;width:58px;font-size:24px">⚙</button></div>
      <div style="position:absolute;left:20px;top:140px;width:1020px;height:360px;border-radius:16px;background:#2B0509;border:1px solid #5A2A30;overflow:hidden">${svg}${marker}</div>
      <div style="position:absolute;left:20px;top:516px;width:1020px;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:10px">${karten}</div>
      <div style="position:absolute;left:20px;top:770px;width:1020px;display:flex;justify-content:space-between;font-size:12px;color:#E7D4D6"><span>Gewonnen: ${gewonnen} von 7 · Sterne: ${gesamtSterne} von 21</span><span>Das Sperrgebiet ist militärisch und nicht spielbar. Der Anspruch auf Bir Tawil ist völkerrechtlich nicht anerkannt.</span></div>
      <div style="position:absolute;right:20px;top:28px;width:360px;height:754px;box-sizing:border-box;border-radius:16px;background:#2B0509;border:2px solid #C9A227;display:flex;flex-direction:column;overflow:hidden">
        <div style="position:relative;width:100%;height:256px;background:#3A0A10"><img src="bilder/vorschau_${k.bild.replace('.png', '.jpg')}" alt="Vorschau ${k.titel}" style="width:100%;height:100%;object-fit:cover;display:block;opacity:${z === 'zu' ? 0.45 : 1}">
          <span style="position:absolute;left:12px;top:12px;padding:4px 10px;border-radius:8px;background:#1A0306;font-size:12px;font-weight:800;color:${diffC[k.schwierigkeit]}">${k.schwierigkeit}</span></div>
        <div style="flex:1;display:flex;flex-direction:column;gap:12px;padding:18px 20px 20px">
          <div><span style="font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#E8C766">Karte ${kWahl + 1} · ${k.land}</span><h2 style="margin:0;font-family:'Space Grotesk',sans-serif;font-size:30px">${k.titel}</h2></div>
          <p style="margin:0;font-size:14px;line-height:1.5;color:#E7D4D6">${k.text}</p>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            <div style="background:#3A0A10;border-radius:10px;padding:10px 12px"><small style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#E7D4D6">Wellen</small><div style="font-family:'Space Grotesk',sans-serif;font-size:22px;font-weight:700">${k.wellen}</div></div>
            <div style="background:#3A0A10;border-radius:10px;padding:10px 12px"><small style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#E7D4D6">Belohnung</small><div style="font-family:'Space Grotesk',sans-serif;font-size:22px;font-weight:700;color:#E8C766">+${st ? 1 : ORDEN[kWahl]} Orden</div></div></div>
          <div style="font-size:26px;letter-spacing:.1em;color:#E8C766">${'★'.repeat(st)}<span style="color:#5A2A30">${'★'.repeat(3 - st)}</span> <span style="font-size:13px;letter-spacing:0;color:#E7D4D6">${st ? st + ' von 3 Sternen' : '3 Sterne: kein Leben verlieren'}</span></div>
          ${P.rekord[k.id] ? `<div style="font-size:13px;color:#E7D4D6">∞ Freeplay-Rekord: <b style="color:#fff">Welle ${P.rekord[k.id]}</b></div>` : st ? '<div style="font-size:13px;color:#E7D4D6">∞ Freeplay: nach dem Sieg weiterspielen</div>' : ''}
          <div style="flex:1"></div>
          ${z === 'zu' ? `<div style="height:60px;border-radius:14px;border:2px dashed #5A2A30;color:#E7D4D6;display:flex;align-items:center;justify-content:center;gap:10px;font-size:15px;font-weight:700">${SCHLOSS} Erst ${L[kWahl - 1].land} gewinnen</div>`
            : `<button type="button" class="gold" id="spielen">▶ ${st ? 'Nochmal spielen' : 'Spielen'}</button>`}
        </div></div>`, true);
    document.querySelectorAll('[data-karte]').forEach((b) => b.onclick = () => { kWahl = +b.dataset.karte; kampagne(); });
    $('zumTech').onclick = () => techZeigen('kampagne');
    $('zuEinst').onclick = () => einstellungen();
    if ($('spielen')) $('spielen').onclick = () => spielen(kWahl);
  }
  async function spielen(i) {
    $('spielen').textContent = 'Lädt …';
    await karteLaden(i);
    S = neu(); letzteLeiste = ''; letztesPanel = ''; techZurueck = 'spiel';
    overlayZu(); oberflaeche();
    $('hinweis').textContent = `${K.land} – ${K.titel}: ${K.text} Wähle einen Turm und tippe neben den Weg.`;
  }
  function ende(sieg, aufgegeben) {
    if (S.freeplay) {
      S.ende = true; S.pause = true; P.rekord[K.id] = Math.max(P.rekord[K.id] || 0, S.welle - 1); sichern();
      const fp = Math.max(0, S.welle - 1 - K.wellen);
      overlay(`<h1>Freeplay beendet</h1><p style="font-size:17px">${K.land}: Welle ${S.welle - 1} erreicht, ${fp} Freeplay-Wellen geschafft. Rekord: Welle ${P.rekord[K.id]}.</p>
        <p>Alle 20 Freeplay-Wellen gab es 1 Verdienstorden. Stufe ${P.stufe} · Verdienstorden: ${fmt(P.orden)}.</p>
        <div style="display:flex;gap:12px;margin-top:16px"><button class="gold" type="button" id="zurKampagne" style="width:260px">Zur Kampagne</button><button class="rand" type="button" id="nochmal" style="width:220px">Nochmal spielen</button></div>`);
      $('zurKampagne').onclick = () => kampagne();
      $('nochmal').onclick = () => { overlayZu(); spielenDirekt(); };
      return;
    }
    const geschafft = sieg ? K.wellen : Math.max(0, S.welle - 1);
    const erstSieg = sieg && !P.sterne[K.id];
    const sterne = sieg ? (S.leben >= S.startLeben ? 3 : S.leben >= S.startLeben / 2 ? 2 : 1) : 0;
    const alteSterne = P.sterne[K.id] || 0;
    const lohn = sieg ? (erstSieg ? ORDEN[K.stufe - 1] : 1) + Math.max(0, sterne - alteSterne) : 0;
    P.orden += lohn; if (sieg) P.sterne[K.id] = Math.max(alteSterne, sterne); sichern();
    S.ende = true; S.pause = true;
    const naechste = A.karten.indexOf(K) + 1;
    overlay(`<h1>${sieg ? K.land + ' ist sicher!' : aufgegeben ? 'Karte verlassen' : (K.palast ? 'Der Regierungspalast ist gefallen' : 'Der Kornspeicher ist gefallen')}</h1>
      <p style="font-size:17px">${sieg ? `Alle ${K.wellen} Wellen abgewehrt mit ${Math.ceil(S.leben)} Leben übrig. <span style="color:#E8C766;letter-spacing:.1em">${'★'.repeat(sterne)}${'☆'.repeat(3 - sterne)}</span>` : `${geschafft} von ${K.wellen} Wellen geschafft.`}</p>
      <p>${sieg ? `Verdienstorden für den Techbaum: <b style="color:#E8C766">+${lohn}</b> (jetzt ${fmt(P.orden)}). Ausgeben kannst du sie auf dem Weltbildschirm.` : 'Verdienstorden gibt es nur für besiegte Karten.'}${sieg && naechste < A.karten.length && erstSieg ? ` Neue Karte freigeschaltet: <b>${A.karten[naechste].land}</b>.` : ''}</p>
      <div style="display:flex;gap:12px;margin-top:16px"><button class="gold" type="button" id="zurKampagne" style="width:260px">Zur Kampagne</button><button class="rand" type="button" id="nochmal" style="width:220px">Nochmal spielen</button>${sieg ? '<button class="rand" type="button" id="freeplay" style="width:260px">∞ Freeplay weiterspielen</button>' : ''}</div>
      ${sieg ? '<p class="klein" style="margin-top:12px">Freeplay: Die Wellen gehen weiter, die Gegner werden jede Welle 10 % zäher. Alle 20 Freeplay-Wellen gibt es 1 Verdienstorden.</p>' : ''}`);
    $('zurKampagne').onclick = () => { if (sieg && naechste < A.karten.length) kWahl = naechste; kampagne(); };
    if ($('freeplay')) $('freeplay').onclick = () => { S.freeplay = true; S.ende = false; S.pause = false; overlayZu(); toast('Freeplay! Die Gegner werden jede Welle stärker.'); oberflaeche(); };
    $('nochmal').onclick = () => { overlayZu(); spielenDirekt(); };
  }
  function spielenDirekt() { S = neu(); letzteLeiste = ''; letztesPanel = ''; techZurueck = 'spiel'; overlayZu(); oberflaeche(); }
  $('heim').onclick = () => {
    if (!S || S.ende) { kampagne(); return; }
    const vorPause = S.pause; S.pause = true;
    overlay(`<h1>Karte verlassen?</h1><p>Die laufende Runde endet. Verdienstorden gibt es nur, wenn du die Karte besiegst.</p>
      <div style="display:flex;gap:12px;margin-top:16px"><button class="gold" type="button" id="jaWeg" style="width:220px">Ja, zur Kampagne</button><button class="rand" type="button" id="neinBleib" style="width:220px">Weiterspielen</button></div>`);
    $('jaWeg').onclick = () => ende(false, true);
    $('neinBleib').onclick = () => { S.pause = vorPause; overlayZu(); };
  };

  // ---------- Einstellungen: Spielstand speichern, herunterladen, hochladen, zurücksetzen ----------
  function einstellungen(meldung, farbe) {
    const gewonnen = Object.keys(P.sterne).length, sterne = Object.values(P.sterne).reduce((a, b) => a + b, 0);
    const zeile = (titel, text, knopf, id, gefahr) => `<div style="display:flex;align-items:center;justify-content:space-between;gap:16px;background:#3A0A10;border-radius:12px;padding:14px 16px">
      <div><b style="font-size:16px">${titel}</b><div class="klein" style="font-size:13px;margin-top:2px">${text}</div></div>
      <button type="button" id="${id}" class="${gefahr ? 'rand' : 'gold'}" style="height:48px;min-width:200px;font-size:15px;${gefahr ? 'border-color:#A3343C;color:#FF8A7A' : ''}">${knopf}</button></div>`;
    overlay(`<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px"><div><h1>Einstellungen</h1><p style="margin:0 0 14px">Spielstand: Stufe ${P.stufe} · ${fmt(P.orden)} Verdienstorden · ${gewonnen} von 7 Karten · ${sterne} Sterne</p></div>
        <button type="button" class="zu" id="einstZu" aria-label="Schließen">✕</button></div>
      ${meldung ? `<div role="status" style="margin:0 0 12px;padding:10px 14px;border-radius:10px;background:${farbe === 'rot' ? '#4A0810' : '#1E3A24'};border:1px solid ${farbe === 'rot' ? '#FF6B5E' : '#7CD992'};color:#fff;font-weight:700">${meldung}</div>` : ''}
      <div style="display:flex;flex-direction:column;gap:10px">
        ${zeile('Im Browser speichern', 'Der Fortschritt wird nach jeder Welle und jedem Kauf automatisch gesichert – hier sofort speichern.', 'Jetzt speichern', 'eSpeichern')}
        ${zeile('Spielstand herunterladen', 'Datei mit Prüfsumme. Wird die Datei verändert, wird sie beim Hochladen abgelehnt.', 'Herunterladen', 'eRunter')}
        ${zeile('Spielstand hochladen', 'Eine heruntergeladene Datei laden. Ersetzt den aktuellen Stand (mit Rückfrage).', 'Datei wählen …', 'eHoch')}
        ${zeile('Alles zurücksetzen', 'Verdienstorden, Techbaum, Stufe, Sterne und Rekorde löschen. Kann nicht rückgängig gemacht werden.', 'Zurücksetzen …', 'eReset', true)}
      </div>`);
    $('einstZu').onclick = () => kampagne();
    $('eSpeichern').onclick = () => { sichern(); einstellungen('Spielstand im Browser gespeichert.'); };
    $('eRunter').onclick = () => {
      const jetzt = new Date(), tag = jetzt.toISOString().slice(0, 10);
      const datei = JSON.stringify(signieren(P, jetzt.toISOString()), null, 1);
      const url = URL.createObjectURL(new Blob([datei], { type: 'application/json' }));
      const a = document.createElement('a'); a.href = url; a.download = `militaer-defense-${tag}-stufe-${P.stufe}.json`;
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000);
      sichern(); einstellungen('Spielstand heruntergeladen.');
    };
    $('eHoch').onclick = () => {
      const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.json,application/json'; inp.style.display = 'none';
      document.body.appendChild(inp);
      inp.onchange = () => {
        const f = inp.files && inp.files[0]; inp.remove(); if (!f) return;
        if (f.size > 200000) { einstellungen('Datei zu groß – das ist kein Spielstand.', 'rot'); return; }
        const fr = new FileReader();
        fr.onload = () => {
          let o = null; try { o = JSON.parse(fr.result); } catch (e) { o = null; }
          if (!o || o.spiel !== SPIEL_ID) { einstellungen('Keine Spielstand-Datei von Militär-Defense.', 'rot'); return; }
          if (!signaturOk(o)) { einstellungen('Datei wurde verändert – die Prüfsumme stimmt nicht. Spielstand nicht übernommen.', 'rot'); return; }
          const d = standPruefen(o.daten);
          if (!d) { einstellungen('Spielstand ist beschädigt oder ungültig. Nicht übernommen.', 'rot'); return; }
          bestaetigen(`Spielstand vom ${new Date(o.gespeichert).toLocaleString('de-DE')} laden?`, `Stufe ${d.stufe} · ${fmt(d.orden)} Verdienstorden · ${Object.keys(d.sterne).length} von 7 Karten. Dein aktueller Stand wird ersetzt.`, 'Laden', () => {
            for (const k of Object.keys(P)) delete P[k]; Object.assign(P, d); sichern(); kWahl = null; einstellungen('Spielstand geladen.');
          });
        };
        fr.onerror = () => einstellungen('Datei konnte nicht gelesen werden.', 'rot');
        fr.readAsText(f);
      };
      inp.click();
    };
    $('eReset').onclick = () => bestaetigen('Wirklich alles zurücksetzen?', 'Verdienstorden, Techbaum, Stufe, Sterne und Freeplay-Rekorde werden gelöscht. Lade vorher deinen Spielstand herunter, wenn du ihn behalten willst.', 'Ja, zurücksetzen', () => {
      for (const k of Object.keys(P)) delete P[k]; Object.assign(P, NEUSTAND()); sichern(); kWahl = null; einstellungen('Alles zurückgesetzt.');
    }, true);
  }
  function bestaetigen(titel, text, knopf, ok, gefahr) {
    overlay(`<h1>${titel}</h1><p>${text}</p><div style="display:flex;gap:12px;margin-top:16px">
      <button type="button" class="gold" id="bJa" style="width:240px;${gefahr ? 'background:#B3261E;color:#fff' : ''}">${knopf}</button><button type="button" class="rand" id="bNein" style="width:200px">Abbrechen</button></div>`);
    $('bJa').onclick = ok; $('bNein').onclick = () => einstellungen();
  }

  // ---------- Bühne skalieren ----------
  function skalieren() {
    const k = Math.min(window.innerWidth / 1440, window.innerHeight / 810);
    $('buehne').style.transform = `translate(-50%, -50%) scale(${k})`;
    $('buehne').style.transformOrigin = 'center center';
  }
  window.addEventListener('resize', skalieren);

  // ---------- Schleife ----------
  let vorher = 0, uiT = 0;
  function schleife(ts) {
    const dt = Math.min(0.05, (ts - vorher) / 1000 || 0); vorher = ts;
    if (K && !S.pause && !S.ende) { const n = S.tempo; for (let i = 0; i < n; i++) update(dt); }
    if (K) zeichnen();
    uiT += dt; if (uiT > 0.1) { uiT = 0; oberflaeche(); }
    requestAnimationFrame(schleife);
  }

  skalieren();
  S = neu();
  laden().then(() => karteLaden(0)).then(() => { oberflaeche(); kampagne(); if (ladeHinweis) toast(ladeHinweis); sichern(); requestAnimationFrame(schleife); })
    .catch((e) => { document.body.insertAdjacentHTML('beforeend', `<p style="position:fixed;left:20px;top:20px;color:#fff;background:#7A0F1A;padding:12px;border-radius:8px">Fehler beim Laden: ${e.message}. Bitte über einen Webserver (z. B. GitHub Pages) öffnen.</p>`); });
})();
