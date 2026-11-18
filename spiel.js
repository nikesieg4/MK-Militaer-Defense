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
    }
  };

  const GEGNER = {
    soldat: { hp: 3, tempo: 52, lohn: 5, schaden: 1, gr: 0.6 },
    tarnsoldat: { hp: 3, tempo: 66, lohn: 7, schaden: 1, gr: 0.6, tarn: true },
    panzersoldat: { hp: 12, tempo: 34, lohn: 14, schaden: 2, gr: 0.62, panzer: true },
    humvee: { hp: 30, tempo: 100, lohn: 20, schaden: 5, gr: 0.6 },
    panzer: { hp: 180, tempo: 24, lohn: 100, schaden: 20, gr: 0.6, panzer: true }
  };

  const TECH = [
    { id: 'ranger', reihe: 'Türme', n: 'Ranger', t: 'Start-Turm.', k: 0 },
    { id: 'sniper', reihe: 'Türme', n: 'Scharfschütze', t: 'Neuer Turm mit großer Reichweite.', k: 1500, req: 'ranger' },
    { id: 'drill1', reihe: 'Ranger', n: 'Ranger-Drill I', t: 'Ranger: +10 % Feuerrate.', k: 400, req: 'ranger' },
    { id: 'drill2', reihe: 'Ranger', n: 'Ranger-Drill II', t: 'Ranger: weitere +10 % Feuerrate.', k: 900, req: 'drill1' },
    { id: 'goldmag', reihe: 'Ranger', n: 'Goldmagazin', t: 'Neue Ranger starten mit Panzerbrechend (Sturm 1).', k: 1200, req: 'drill2' },
    { id: 'ruhig', reihe: 'Scharfschütze', n: 'Ruhige Hand', t: 'Scharfschützen: +15 % Reichweite.', k: 800, req: 'sniper' },
    { id: 'tarnung', reihe: 'Scharfschütze', n: 'Maisfeld-Tarnung', t: 'Phantom-Ausbauten 20 % günstiger.', k: 1800, req: 'ruhig' },
    { id: 'ernte', reihe: 'Allgemein', n: 'Erntebonus', t: '+10 % Körner pro geschaffter Welle.', k: 1200 }
  ];
  const ZIELE = ['Erster', 'Letzter', 'Stärkster', 'Nächster'];

  // ---------- Zustand ----------
  let A = {};             // Bilder + Atlanten
  let weg = null;         // abgetasteter Weg
  let S;                  // Spielzustand
  const neu = () => ({
    welle: 0, koerner: 800, leben: 100, tempo: 1, pause: false, laeuft: false, ende: false,
    tuerme: [], gegner: [], geschosse: [], effekte: [], flaechen: [], spawn: [],
    wahl: null, platzieren: null, maus: null, tech: { ranger: true }, zeit: 0
  });

  // ---------- Laden ----------
  const bild = (src) => new Promise((ok, fehler) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => fehler(new Error(src)); i.src = src; });
  const json = (src) => fetch(src).then((r) => { if (!r.ok) throw new Error(src); return r.json(); });

  async function laden() {
    const [karte, rangerTop, sniperTop, gegnerImg, effImg, gegnerAtlas, effAtlas, rangerJ, sniperJ, karten] = await Promise.all([
      bild('bilder/karte_1_westkolbistan.png'), bild('bilder/ranger_draufsicht@2x.png'), bild('bilder/scharfschuetze_draufsicht@2x.png'),
      bild('bilder/gegner_spritesheet.png'), bild('bilder/effekte_spritesheet.png'),
      json('daten/gegner_atlas.json'), json('daten/effekte_atlas.json'), json('daten/ranger_draufsicht.json'), json('daten/scharfschuetze_draufsicht.json'), json('daten/karten.json')
    ]);
    A = { karte, rangerTop, sniperTop, gegnerImg, effImg, gegnerAtlas, effAtlas, ranger: rangerJ, sniper: sniperJ, kartenInfo: karten.karten[0] };
    weg = wegAbtasten(A.kartenInfo.wege[0]);
  }

  // ---------- Weg ----------
  function wegAbtasten(p) {
    const pts = [];
    for (let i = 0; i < p.length - 1; i++) {
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
  function wegPos(d) {
    const { pts, lang } = weg;
    if (d <= 0) return { x: pts[0][0], y: pts[0][1], dx: 1 };
    let lo = 0, hi = lang.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (lang[m] < d) lo = m; else hi = m; }
    const t = (d - lang[lo]) / ((lang[hi] - lang[lo]) || 1);
    return { x: pts[lo][0] + (pts[hi][0] - pts[lo][0]) * t, y: pts[lo][1] + (pts[hi][1] - pts[lo][1]) * t, dx: pts[hi][0] - pts[lo][0] };
  }
  function abstandZumWeg(x, y) {
    let m = Infinity;
    for (let i = 0; i < weg.pts.length; i += 2) { const [px, py] = weg.pts[i]; const d = (px - x) ** 2 + (py - y) ** 2; if (d < m) m = d; }
    return Math.sqrt(m);
  }

  // ---------- Türme ----------
  function werte(t) {
    const def = TUERME[t.typ], w = { ...def.basis, pierce: 0 };
    const add = (d) => { for (const [k, v] of Object.entries(d)) w[k] = typeof v === 'number' && typeof w[k] === 'number' ? w[k] + v : v; };
    for (let i = 0; i < t.a; i++) add(def.A[i].d);
    for (let i = 0; i < t.b; i++) add(def.B[i].d);
    if (t.typ === 'ranger') { if (S.tech.drill1) w.reload *= 0.9; if (S.tech.drill2) w.reload *= 0.9; }
    if (t.typ === 'sniper' && S.tech.ruhig) w.range *= 1.15;
    if (w.dauerfeuer) { w.reload = 0.15; w.burst = 1; }
    w.rangePx = w.range * EINHEIT;
    return w;
  }
  function ausbauKosten(t, pfad) {
    const def = TUERME[t.typ], stufe = pfad === 'A' ? t.a : t.b;
    let k = def[pfad][stufe].k;
    if (t.typ === 'sniper' && pfad === 'A' && S.tech.tarnung) k = Math.round(k * 0.8);
    return k;
  }
  function turmName(t) {
    const def = TUERME[t.typ];
    if (t.a === 0 && t.b === 0) return t.typ === 'ranger' ? 'Grenzranger' : 'Grenzschütze';
    return t.a >= t.b ? def.A[t.a - 1].n : def.B[t.b - 1].n;
  }
  function platzOk(x, y) {
    if (x < 30 || x > W - 30 || y < 30 || y > H - 30) return false;
    if (x < 540 && y < 90) return false;                         // Anzeige oben links
    if (abstandZumWeg(x, y) < 33 + 22) return false;
    const z = A.kartenInfo.ziel; if (Math.hypot(x - z[0], y - z[1]) < 70) return false;
    for (const t of S.tuerme) if (Math.hypot(t.x - x, t.y - y) < 46) return false;
    return true;
  }
  function turmBauen(typ, x, y) {
    const def = TUERME[typ];
    if (S.koerner < def.kosten) return;
    S.koerner -= def.kosten;
    const t = { typ, x, y, a: 0, b: typ === 'ranger' && S.tech.goldmag ? 1 : 0, ziel: 0, winkel: -Math.PI / 2, cd: 0.3, burstRest: 0, burstCd: 0, schussT: 1, granCd: 2, brandCd: 4, leuchtCd: 1, investiert: def.kosten };
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
    if (n === 10 || n === 15 || n >= 18) add('panzer', n === 10 ? 1 : n === 15 ? 2 : n - 16, 4);
    return q;
  }
  function gegnerNeu(typ) {
    const g = GEGNER[typ], f = 1 + S.welle * 0.06;
    return { typ, hp: g.hp * f, max: g.hp * f, d: -20, t: Math.random(), brennt: 0, sichtbarBis: 0, x: -60, y: 150, links: false };
  }

  // ---------- Kampf ----------
  function sichtbar(g, t, w) { return !GEGNER[g.typ].tarn || w.tarn || g.sichtbarBis > S.zeit; }
  function zielWahl(t, w) {
    let best = null, bestWert = -Infinity;
    for (const g of S.gegner) {
      if (g.hp <= 0 || g.d < 0) continue;
      const dist = Math.hypot(g.x - t.x, g.y - t.y);
      if (dist > w.rangePx || !sichtbar(g, t, w)) continue;
      const wert = [g.d, -g.d, g.hp, -dist][t.ziel];
      if (wert > bestWert) { bestWert = wert; best = g; }
    }
    return best;
  }
  function schaden(g, menge, art, w) {
    if (g.hp <= 0) return;
    let m = menge;
    if (GEGNER[g.typ].panzer && art === 'kugel' && !(w && (w.panzerbrechend || w.laser))) m *= 0.35;
    g.hp -= m;
    if (g.hp <= 0) { S.koerner += GEGNER[g.typ].lohn; effekt('explosion', g.x, g.y - 20, 0, g.typ === 'panzer' || g.typ === 'humvee' ? 0.9 : 0.35); }
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
    const w = werte(t);
    t.schussT += dt;
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
      p.x = p.sx + (p.tx - p.sx) * k; p.y = p.sy + (p.ty - p.sy) * k - Math.sin(k * Math.PI) * 60; p.rot = k * 12;
      if (k >= 1) {
        p.weg = true;
        if (p.art === 'granate') {
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

  // ---------- Ablauf ----------
  function update(dt) {
    S.zeit += dt;
    if (S.laeuft) {
      for (const sp of S.spawn) sp.t -= dt;
      while (S.spawn.length && S.spawn[0].t <= 0) S.gegner.push(gegnerNeu(S.spawn.shift().typ));
    }
    for (const g of S.gegner) {
      const def = GEGNER[g.typ];
      g.d += def.tempo * dt; g.t += dt;
      const p = wegPos(g.d); g.x = p.x; g.y = p.y; if (Math.abs(p.dx) > 0.3) g.links = p.dx < 0;
      if (g.brennt > 0) { g.brennt -= dt; schaden(g, 4 * dt, 'feuer'); }
      if (g.d >= weg.gesamt) { g.hp = 0; g.durch = true; S.leben -= def.schaden; }
    }
    for (const f of S.flaechen) { f.t += dt; for (const g of S.gegner) if (Math.hypot(g.x - f.x, g.y - f.y) < 46) g.brennt = 0.5; }
    S.flaechen = S.flaechen.filter((f) => f.bis > S.zeit);
    for (const t of S.tuerme) turmUpdate(t, dt);
    for (const p of S.geschosse) geschossUpdate(p, dt);
    S.geschosse = S.geschosse.filter((p) => !p.weg);
    S.gegner = S.gegner.filter((g) => g.hp > 0);
    for (const e of S.effekte) e.t += dt;
    S.effekte = S.effekte.filter((e) => e.t < e.dauer);
    if (S.leben <= 0 && !S.ende) { S.leben = 0; S.ende = true; ende(false); }
    if (S.laeuft && !S.spawn.length && !S.gegner.length) {
      S.laeuft = false;
      S.koerner += Math.round((150 + S.welle * 25) * (S.tech.ernte ? 1.1 : 1));
      if (S.welle >= A.kartenInfo.wellen && !S.ende) { S.ende = true; ende(true); }
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
    const img = t.typ === 'ranger' ? A.rangerTop : A.sniperTop;
    const row = KOMBIS.indexOf(t.a + '-' + t.b);
    const fr = t.schussT < 0.04 ? 1 : t.schussT < 0.09 ? 2 : 0;
    ctx.save(); ctx.globalAlpha = alpha; ctx.translate(t.x, t.y); ctx.rotate(t.winkel);
    ctx.drawImage(img, fr * 320, row * 320, 320, 320, -TURM_GROESSE / 2, -TURM_GROESSE / 2, TURM_GROESSE, TURM_GROESSE);
    ctx.restore();
  }
  function gegnerZeichnen(g) {
    const an = A.gegnerAtlas.animationen[g.typ], def = GEGNER[g.typ];
    const f = A.gegnerAtlas.frames[an.bilder[Math.floor(g.t * an.fps) % an.bilder.length]];
    const getarnt = def.tarn && g.sichtbarBis <= S.zeit;
    ctx.save(); ctx.globalAlpha = getarnt ? 0.45 : 1;
    frameZeichnen(A.gegnerImg, f, g.x, g.y, (g.links ? -1 : 1) * def.gr, def.gr, an.anker.x, an.anker.y);
    ctx.restore();
    if (g.hp < g.max) {
      const bw = g.typ === 'panzer' ? 70 : 36, y = g.y - f.h * def.gr * 0.85;
      ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(g.x - bw / 2 - 1, y - 1, bw + 2, 6);
      ctx.fillStyle = g.hp / g.max > 0.4 ? '#7CD992' : '#FF6B5E'; ctx.fillRect(g.x - bw / 2, y, bw * Math.max(0, g.hp / g.max), 4);
    }
    if (g.brennt > 0) { const fl = effFrame('brandflaeche', S.zeit, true); frameZeichnen(A.effImg, fl, g.x, g.y - 6, 0.35, 0.35); }
  }
  function zeichnen() {
    ctx.drawImage(A.karte, 0, 0, W, H);
    for (const f of S.flaechen) frameZeichnen(A.effImg, effFrame('brandflaeche', f.t, true), f.x, f.y, 0.9, 0.9);
    const w = S.wahl ? werte(S.wahl) : null;
    if (S.wahl) { ctx.beginPath(); ctx.arc(S.wahl.x, S.wahl.y, w.rangePx, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.fill(); ctx.setLineDash([8, 6]); ctx.strokeStyle = '#E8C766'; ctx.lineWidth = 2; ctx.stroke(); ctx.setLineDash([]); }
    const dinge = [...S.gegner.map((g) => ({ y: g.y, f: () => gegnerZeichnen(g) })), ...S.tuerme.map((t) => ({ y: t.y + 20, f: () => {
      if (t === S.wahl) { ctx.save(); ctx.shadowColor = '#E8C766'; ctx.shadowBlur = 16; turmZeichnen(t); ctx.restore(); } else turmZeichnen(t);
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
    if (S.platzieren && S.maus) {
      const ok = platzOk(S.maus.x, S.maus.y), r = werte({ typ: S.platzieren, a: 0, b: 0 }).rangePx;
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
    for (const typ of ['ranger', 'sniper', null, null]) {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'turmkarte';
      if (!typ) { b.classList.add('gesperrt'); b.disabled = true; b.innerHTML = '<div class="bild" style="display:flex;align-items:center;justify-content:center;font-size:36px;color:#5A2A30;font-weight:700">?</div><span class="name">Bald</span><span class="preis">gesperrt</span>'; box.appendChild(b); continue; }
      const def = TUERME[typ], frei = !def.tech || S.tech[def.tech];
      if (!frei) b.classList.add('gesperrt');
      else if (S.koerner < def.kosten) b.classList.add('teuer');
      if (S.platzieren === typ) b.classList.add('aktiv');
      b.setAttribute('aria-label', def.name + (frei ? ` – ${def.kosten} Körner` : ' – im Techbaum freischalten'));
      b.innerHTML = `<div class="bild" style="${schraegStil(typ, 0, 0, 112)}"></div><span class="name">${def.name}</span><span class="preis">${frei ? fmt(def.kosten) + ' Körner' : 'Techbaum'}</span>` +
        (frei ? '' : '<span class="schloss"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E8C766" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg></span>');
      b.onclick = () => {
        if (!frei) { $('hinweis').textContent = 'Der Scharfschütze ist gesperrt. Schalte ihn im Techbaum frei (1.500 Körner).'; return; }
        S.platzieren = S.platzieren === typ ? null : typ; S.wahl = null;
        $('hinweis').textContent = S.platzieren ? def.info + ' Tippe auf eine freie Stelle neben dem Weg.' : 'Wähle einen Turm.';
        oberflaeche();
      };
      box.appendChild(b);
    }
  }
  let letzteLeiste = '';
  function oberflaeche() {
    $('welle').textContent = S.welle; $('wellenMax').textContent = A.kartenInfo.wellen;
    $('koerner').textContent = fmt(S.koerner); $('leben').textContent = Math.max(0, Math.ceil(S.leben));
    $('tempo').textContent = S.tempo + '×'; $('pause').textContent = S.pause ? '▶' : '❚❚';
    const wk = $('welleKnopf');
    wk.disabled = S.laeuft || S.ende;
    wk.textContent = S.laeuft ? 'Welle läuft …' : `▶ Welle ${S.welle + 1} starten`;
    const schluessel = JSON.stringify([S.platzieren, S.tech, S.koerner >= 250, S.koerner >= 285]);
    if (schluessel !== letzteLeiste) { letzteLeiste = schluessel; leisteZeichnen(); }
    panelZeichnen();
  }
  let letztesPanel = '';
  function panelZeichnen() {
    const p = $('panel'), t = S.wahl;
    if (!t) { p.style.display = 'none'; letztesPanel = ''; return; }
    const schluessel = JSON.stringify([S.tuerme.indexOf(t), t.a, t.b, t.ziel, Math.floor(S.koerner), S.tech]);
    if (schluessel === letztesPanel) return;
    letztesPanel = schluessel;
    p.style.display = 'flex';
    p.style.left = (t.x < MITTE ? W - 300 - 20 : 20) + 'px';
    const def = TUERME[t.typ], w = werte(t);
    $('pBild').setAttribute('style', schraegStil(t.typ, t.a, t.b, 84));
    $('pCode').textContent = `${def.name} ${t.a}-${t.b}`;
    $('pName').textContent = turmName(t);
    $('pWerte').textContent = `Schaden ${w.dmg} · ${w.dauerfeuer ? 'Dauerfeuer' : 'Nachladen ' + w.reload.toFixed(2) + ' s'} · Reichweite ${Math.round(w.range)}`;
    const pf = $('pPfade'); pf.innerHTML = '';
    for (const [pfad, titel] of [['A', t.typ === 'ranger' ? 'Präzision' : 'Phantom'], ['B', t.typ === 'ranger' ? 'Sturm' : 'Schwerkaliber']]) {
      const stufe = pfad === 'A' ? t.a : t.b, andere = pfad === 'A' ? t.b : t.a, max = andere >= 3 ? 2 : 5;
      const fertig = stufe >= 5, gesperrt = stufe >= max;
      const k = fertig || gesperrt ? 0 : ausbauKosten(t, pfad), kann = !fertig && !gesperrt && S.koerner >= k;
      const d = document.createElement('div'); d.className = 'pfad';
      const pips = [0, 1, 2, 3, 4].map((i) => `<span style="background:${i < stufe ? '#E8C766' : i < max ? '#5A2A30' : '#1A0306'}"></span>`).join('');
      d.innerHTML = `<div class="zeile"><span class="titel">${titel}</span><div class="pips">${pips}</div></div><span class="naechst">${fertig ? 'Höchste Stufe erreicht' : gesperrt ? 'Gesperrt durch anderen Pfad' : def[pfad][stufe].n}</span>`;
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
  $('welleKnopf').onclick = () => { if (S.laeuft || S.ende) return; S.welle++; S.spawn = welleBauen(S.welle); S.laeuft = true; oberflaeche(); };
  $('techKnopf').onclick = () => techZeigen();

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
  window.__mk = { S: () => S, update: (dt) => update(dt), welle: () => { if (!S.laeuft && !S.ende) { S.welle++; S.spawn = welleBauen(S.welle); S.laeuft = true; } } };
  window.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') { S.platzieren = null; S.wahl = null; oberflaeche(); } });

  // ---------- Overlays ----------
  function overlay(html) { $('overlayInhalt').innerHTML = html; $('overlay').style.display = 'flex'; }
  function overlayZu() { $('overlay').style.display = 'none'; }
  function techZeigen() {
    S.pauseVorTech = S.pause; S.pause = true;
    const reihen = ['Türme', 'Ranger', 'Scharfschütze', 'Allgemein'];
    let html = `<div style="display:flex;justify-content:space-between;align-items:center;gap:16px"><div><h1>Techbaum</h1><p style="margin:0">Freischaltungen und Verbesserungen für diesen Lauf. Bezahlt wird mit Körnern.</p></div><div class="chip"><div><small>Körner</small><b style="color:#E8C766">${fmt(S.koerner)}</b></div></div></div><div id="tech">`;
    for (const r of reihen) for (const n of TECH.filter((x) => x.reihe === r)) {
      const hat = !!S.tech[n.id], reqOk = !n.req || S.tech[n.req], kann = !hat && reqOk && S.koerner >= n.k;
      const req = TECH.find((x) => x.id === n.req);
      html += `<div class="knoten ${hat ? 'gekauft' : reqOk ? 'kaufbar' : ''}"><span class="reihe">${r}</span><b>${n.n}</b><span>${n.t}</span>` +
        `<button type="button" data-tech="${n.id}" ${kann ? '' : 'disabled'} style="background:${kann ? '#C9A227' : '#2B0509'};color:${kann ? '#1C1416' : hat ? '#E8C766' : '#E7D4D6'}">${hat ? (n.k ? 'Gekauft' : 'Freigeschaltet') : !reqOk ? 'Benötigt: ' + req.n : fmt(n.k) + ' Körner'}</button></div>`;
    }
    html += `</div><button class="gold" type="button" id="techZu" style="width:260px">Zurück zum Spiel</button>`;
    overlay(html);
    document.querySelectorAll('[data-tech]').forEach((b) => b.onclick = () => {
      const n = TECH.find((x) => x.id === b.dataset.tech);
      if (S.tech[n.id] || S.koerner < n.k || (n.req && !S.tech[n.req])) return;
      S.koerner -= n.k; S.tech[n.id] = true; letzteLeiste = ''; techZeigen(); oberflaeche();
    });
    $('techZu').onclick = () => { S.pause = S.pauseVorTech; overlayZu(); oberflaeche(); };
  }
  function ende(sieg) {
    overlay(`<h1>${sieg ? 'Westkolbistan ist sicher!' : 'Der Kornspeicher ist gefallen'}</h1><p>${sieg ? `Alle ${A.kartenInfo.wellen} Wellen abgewehrt mit ${Math.ceil(S.leben)} Leben übrig.` : `Du hast bis Welle ${S.welle} durchgehalten.`}</p><div class="knopfreihe" style="display:flex;gap:12px"><button class="gold" type="button" id="nochmal" style="width:260px">Nochmal spielen</button></div>`);
    $('nochmal').onclick = () => { S = neu(); letzteLeiste = ''; overlayZu(); oberflaeche(); };
  }
  function startbild() {
    overlay(`<h1>Maiskolbistan Militär-Defense</h1><p style="font-size:17px">Karte 1 · <b>Westkolbistan – Grenzfelder</b> · ${A.kartenInfo.wellen} Wellen. Verteidige den Kornspeicher gegen Soldaten, Tarnsoldaten, gepanzerte Soldaten, Humvees und Panzer.</p>
      <p>So geht's: Rechts einen Turm wählen und neben den Weg setzen. Turm antippen, um ihn auszubauen: Ein Pfad geht bis Stufe 5, der andere bis Stufe 2. Getarnte sieht nur ein Turm mit Tarn-Erkennung (Ranger Tarnblick, Scharfschütze Adlerauge). Gepanzerte brauchen Panzerbrechend, Granaten oder Laser. Den Scharfschützen schaltest du im Techbaum frei. <b>Esc</b> bricht das Platzieren ab.</p>
      <div style="display:flex;gap:12px"><button class="gold" type="button" id="los" style="width:260px">Spielen</button></div>`);
    $('los').onclick = () => { overlayZu(); };
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
    if (!S.pause) { const n = S.tempo; for (let i = 0; i < n; i++) update(dt); }
    zeichnen();
    uiT += dt; if (uiT > 0.1) { uiT = 0; oberflaeche(); }
    requestAnimationFrame(schleife);
  }

  skalieren();
  S = neu();
  laden().then(() => { oberflaeche(); startbild(); requestAnimationFrame(schleife); })
    .catch((e) => { document.body.insertAdjacentHTML('beforeend', `<p style="position:fixed;left:20px;top:20px;color:#fff;background:#7A0F1A;padding:12px;border-radius:8px">Fehler beim Laden: ${e.message}. Bitte über einen Webserver (z. B. GitHub Pages) öffnen.</p>`); });
})();
