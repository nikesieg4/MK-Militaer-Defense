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
    juggernaut: {
      name: 'Juggernaut', kosten: 3200, schraeg: 'bilder/juggernaut_schraeg.png', json: 'juggernaut', tech: 'juggernaut', groesse: 150, platz: 30,
      pfade: ['Feuerwalze', 'Doppelfeuer'],
      basis: { dmg: 8, reload: 0.1, burst: 1, range: 15, dauerfeuer: true },
      A: [
        { n: 'Kraft-Handschuhe', k: 425, d: { reload: -0.01, range: 1 } },
        { n: 'Gelenkdämpfer', k: 800, d: { reload: -0.01 } },
        { n: 'Langer Lauf', k: 3100, d: { dmg: 5, range: 2 } },
        { n: 'Power-Minigun', k: 4500, d: { dmg: 4, reload: 0.01, range: 4, panzerbrechend: true } },
        { n: 'Feuerwalze', k: 33500, d: { dmg: 26, range: 4, he: true } }
      ],
      B: [
        { n: 'Bessere Handhabung', k: 300, d: { range: 2 } },
        { n: 'AP-Munition', k: 1800, d: { dmg: 3 } },
        { n: 'Doppel-Minigun', k: 3750, d: { dmg: 5, tarn: true } },
        { n: 'Kybernetischer Puls', k: 7000, d: { dmg: 12 } },
        { n: 'Volle Leistung', k: 60000, d: { dmg: 59, zielzeit: 1.2, stunImmun: true, overcharge: true } }
      ],
      info: 'Juggernaut: Minigun im Dauerfeuer, enormer Schaden pro Sekunde. Feuerwalze durchschlägt ab Stufe 4 Panzerung, Doppelfeuer erkennt ab Stufe 3 Getarnte.'
    },
    railgun: {
      name: 'Railgunner', kosten: 1600, schraeg: 'bilder/railgun_schraeg.png', json: 'railgun', tech: 'railgun', groesse: 150, platz: 30,
      pfade: ['Schienen-Soldat', 'Geschützstellung'],
      basis: { dmg: 150, reload: 5, burst: 1, range: 22, laser: true },
      A: [
        { n: 'Kühlzellen', k: 525, d: { reload: -0.75, range: 1 } },
        { n: 'Erweiterte Optik', k: 1250, d: { reload: -0.75, range: 4 } },
        { n: 'Schienen-Soldat', k: 2500, d: { reload: -0.25, range: 1, tarn: true } },
        { n: 'Kampfanzug', k: 6000, d: { dmg: 125, reload: -0.5, range: 2, pierce: 1 } },
        { n: 'Super-Schienen-Soldat', k: 13500, d: { dmg: 100, reload: -1, range: 7 } }
      ],
      B: [
        { n: 'Proto-Munition', k: 925, d: { dmg: 75 } },
        { n: 'Blitzzellen', k: 1600, d: { dmg: 100, range: 1 } },
        { n: 'Geschützstellung', k: 4000, d: { dmg: 300, reload: 2, range: 8 } },
        { n: 'Doppelrohr', k: 8500, d: { dmg: 385, reload: -0.5, range: 12 } },
        { n: 'XRT-9000', k: 100000, d: { dmg: 18000, zielzeit: 10, reloadSetzen: 0.85, range: 25, stunImmun: true } }
      ],
      info: 'Railgunner: langsamer, sehr starker Laserstrahl – voller Schaden gegen Panzer. Schienen-Soldat schießt schneller und erkennt Getarnte, Geschützstellung wird zur riesigen Kanone.'
    },
    fabrik: {
      name: 'Fahrzeugfabrik', kosten: 900, schraeg: 'bilder/fahrzeug_schraeg.png', json: 'fabrik', tech: 'fabrik', fabrik: true, gross: true, groesse: 110,
      pfade: ['Rammkolonne', 'Panzerstellung'],
      basis: { kraft: 10, intervall: 7, fahrTempo: 170, dmg: 3, reload: 0.3, burst: 1, range: 15, splash: 0 },
      A: [
        { n: 'Rammbügel', k: 300, d: { kraft: 10, range: 1 } },
        { n: 'Panzerplatten', k: 650, d: { kraft: 20, intervall: -1, reload: -0.05 } },
        { n: 'MRAP', k: 1900, d: { kraft: 60, intervall: -1, fahrTempo: -20, panzerbrechend: true } },
        { n: 'Räumschild', k: 4200, d: { kraft: 160, intervall: -0.5 } },
        { n: 'Keiler', k: 15000, d: { kraft: 900, fahrTempo: -40, fraese: true } }
      ],
      B: [
        { n: 'Schweres MG', k: 400, d: { reload: -0.1, range: 2, kraft: 10 } },
        { n: 'Spähwagen', k: 1100, d: { dmg: 3, range: 2, tarn: true, intervall: -1, kraft: 30 } },
        { n: 'Schützenpanzer', k: 3200, d: { dmg: 10, reload: 0.15, range: 2, splash: 1.5, panzerbrechend: true, kraft: 80, intervall: 1, fahrTempo: -30 } },
        { n: 'Leopard 2A4', k: 7800, d: { dmg: 90, reload: 1.15, range: 6, splash: 3, kraft: 250, intervall: 2, fahrTempo: -20 } },
        { n: 'Leopard 2A7', k: 24000, d: { dmg: 260, reload: -0.4, range: 4, splash: 4, stunImmun: true, kraft: 700, intervall: 1 } }
      ],
      info: 'Fahrzeugfabrik: schickt Fahrzeuge vom Wegende rückwärts in die Gegner – jedes Fahrzeug hat HP und gibt sie beim Rammen an die Gegner ab: Ein Gegner mit weniger Leben stirbt, der Rest bleibt dem Fahrzeug; reicht es nicht, explodiert das Fahrzeug. Rammkolonne: Humvee, MRAP, Minenräumpanzer Keiler. Panzerstellung: die Fahrzeuge fahren genauso los, halten aber an, sobald Gegner in Reichweite sind, und schießen – bis zum Leopard 2A7. Laufen Gegner in sie hinein, verlieren sie HP wie beim Rammen.'
    },
    depot: {
      name: 'Logistik-Depot', kosten: 400, schraeg: 'bilder/depot.png', tech: 'depot', depot: true, gross: true,
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
    kamikaze: { hp: 2, tempo: 135, lohn: 6, schaden: 15, gr: 0.6, name: 'Kamikaze' },
    sanitaeter: { hp: 8, tempo: 46, lohn: 12, schaden: 2, gr: 0.6, heiler: true, name: 'Sanitäter' },
    motorrad: { hp: 10, tempo: 150, lohn: 12, schaden: 4, gr: 0.55, name: 'Motorrad' },
    schuetzenpanzer: { hp: 90, tempo: 40, lohn: 50, schaden: 12, gr: 0.6, panzer: true, absetzen: 4, name: 'Schützenpanzer' },
    ratte: { hp: 1000, tempo: 15, lohn: 400, schaden: 1000, gr: 0.55, panzer: true, boss: true, betaeuben: true, name: 'Stahlratte', hinweis: 'Die Stahlratte hält an und betäubt Türme mit ihren Geschützen. Panzerbrechende Munition, Granaten und Laser helfen.' },
    // Dschungel (Paprikistan)
    buschkaempfer: { hp: 4, tempo: 54, lohn: 5, schaden: 1, gr: 0.6, name: 'Buschkämpfer' },
    machetenlaeufer: { hp: 3, tempo: 95, lohn: 6, schaden: 3, gr: 0.6, name: 'Machetenläufer', info: 'Machetenläufer: sehr schnell, aber wenig Leben.' },
    rauchwerfer: { hp: 9, tempo: 46, lohn: 12, schaden: 2, gr: 0.6, name: 'Rauchwerfer', faehig: { rauch: { cd: 6, r: 90, dauer: 4 } }, info: 'Rauchwerfer: hüllt Gegner in seiner Nähe in Rauch – sie sind dann getarnt. Nur Türme mit Tarn-Erkennung treffen sie.' },
    pickup: { hp: 34, tempo: 92, lohn: 22, schaden: 5, gr: 0.6, fahrzeug: true, name: 'Pickup mit MG' },
    kommandant: { hp: 350, tempo: 30, lohn: 150, schaden: 40, gr: 0.85, boss: true, mini: true, name: 'Guerilla-Kommandant', faehig: { kampfruf: { cd: 8, r: 160, dauer: 4 } }, hinweis: 'Der Kommandant feuert seine Kämpfer an: Gegner in seiner Nähe laufen kurz schneller.' },
    dschungelkoenig: { hp: 2600, tempo: 14, lohn: 600, schaden: 1000, gr: 0.55, boss: true, fahrzeug: true, name: 'Dschungelkönig', faehig: { rauch: { cd: 10, r: 220, dauer: 5 } }, hinweis: 'Der Dschungelkönig wirft Rauchtöpfe: Alle Gegner im großen Umkreis sind getarnt. Türme mit Tarn-Erkennung sind jetzt Gold wert.' },
    // Winter (Nordkolbistan)
    gebirgsjaeger: { hp: 5, tempo: 46, lohn: 6, schaden: 1, gr: 0.6, name: 'Gebirgsjäger' },
    skijaeger: { hp: 3, tempo: 125, lohn: 7, schaden: 2, gr: 0.6, name: 'Skijäger', info: 'Skijäger: rasen sehr schnell den Hang hinunter.' },
    eisgranatier: { hp: 10, tempo: 42, lohn: 14, schaden: 2, gr: 0.6, name: 'Eisgranatier', faehig: { frost: { cd: 7, r: 170, dauer: 2.5 } }, info: 'Eisgranatier: friert alle 7 s den nächsten Turm für 2,5 s ein.' },
    schneemobil: { hp: 24, tempo: 115, lohn: 18, schaden: 4, gr: 0.6, fahrzeug: true, name: 'Schneemobil' },
    pistenraupe: { hp: 600, tempo: 22, lohn: 160, schaden: 40, gr: 0.6, panzer: true, boss: true, mini: true, fahrzeug: true, name: 'Pistenraupe', hinweis: 'Die Pistenraupe ist schwer gepanzert – panzerbrechende Munition hilft.' },
    lawinenbrecher: { hp: 3000, tempo: 12, lohn: 700, schaden: 1000, gr: 0.55, panzer: true, boss: true, fahrzeug: true, name: 'Lawinenbrecher', faehig: { lawine: { cd: 12, r: 260, dauer: 5 } }, hinweis: 'Der Lawinenbrecher löst Lawinen aus: Türme in seiner Nähe laden 5 s lang viel langsamer nach.' },
    // Fabrik (Maisdosistan)
    kampfroboter: { hp: 7, tempo: 46, lohn: 7, schaden: 1, gr: 0.6, roboter: true, name: 'Kampfroboter' },
    spinnenroboter: { hp: 3, tempo: 110, lohn: 6, schaden: 2, gr: 0.6, roboter: true, name: 'Spinnenroboter', info: 'Spinnenroboter: schnelle Krabbler mit wenig Leben.' },
    schildroboter: { hp: 16, tempo: 40, lohn: 16, schaden: 2, gr: 0.6, roboter: true, schild: 95, name: 'Schildroboter', info: 'Schildroboter: sein Energieschild halbiert den Schaden an allen Gegnern in der Nähe – zuerst ausschalten.' },
    mech: { hp: 120, tempo: 26, lohn: 60, schaden: 10, gr: 0.6, panzer: true, roboter: true, fahrzeug: true, absetzen: 3, absetzTyp: 'spinnenroboter', name: 'Schwerer Mech', info: 'Schwerer Mech: gepanzert, zerfällt beim Zerstören in 3 Spinnenroboter.' },
    werkmeister: { hp: 500, tempo: 26, lohn: 160, schaden: 40, gr: 0.7, roboter: true, boss: true, mini: true, name: 'Werkmeister', faehig: { reparatur: { cd: 3, r: 140, anteil: 0.1 } }, hinweis: 'Der Werkmeister repariert alle 3 s Roboter in seiner Nähe.' },
    schrottkoloss: { hp: 3600, tempo: 12, lohn: 800, schaden: 1000, gr: 0.55, panzer: true, roboter: true, boss: true, name: 'Schrottkoloss', faehig: { bauen: { cd: 6, typ: 'kampfroboter', n: 2 } }, hinweis: 'Der Schrottkoloss baut unterwegs ständig neue Kampfroboter.' },
    // Marine (Ostkolbistan)
    marinesoldat: { hp: 5, tempo: 50, lohn: 6, schaden: 1, gr: 0.6, name: 'Marinesoldat' },
    kampftaucher: { hp: 4, tempo: 64, lohn: 8, schaden: 1, gr: 0.6, tarn: true, name: 'Kampftaucher', info: 'Kampftaucher: getarnt – nur Türme mit Tarn-Erkennung sehen sie.' },
    funker: { hp: 10, tempo: 44, lohn: 14, schaden: 2, gr: 0.6, stoeren: 150, name: 'Funker', info: 'Funker: sein Störsender senkt die Reichweite von Türmen in der Nähe um 25 %.' },
    amphibienfahrzeug: { hp: 60, tempo: 50, lohn: 40, schaden: 10, gr: 0.6, panzer: true, fahrzeug: true, name: 'Amphibienfahrzeug' },
    hovercraft: { hp: 450, tempo: 70, lohn: 160, schaden: 40, gr: 0.6, boss: true, mini: true, fahrzeug: true, name: 'Hovercraft', hinweis: 'Das Hovercraft ist schnell – Türme weit vorne am Weg fangen es ab.' },
    seeschlange: { hp: 3200, tempo: 16, lohn: 800, schaden: 1000, gr: 0.55, boss: true, fahrzeug: true, name: 'Seeschlange', faehig: { abtauchen: { cd: 10, dauer: 3 } }, hinweis: 'Die Seeschlange taucht alle 10 s für 3 s ab und ist dann nicht angreifbar.' },
    // Wüste (Südkolbistan)
    raeuber: { hp: 5, tempo: 64, lohn: 6, schaden: 1, gr: 0.6, name: 'Wüstenräuber' },
    kamelreiter: { hp: 14, tempo: 80, lohn: 12, schaden: 3, gr: 0.6, name: 'Kamelreiter' },
    buggy: { hp: 26, tempo: 135, lohn: 18, schaden: 4, gr: 0.6, fahrzeug: true, name: 'Buggy' },
    pluenderer: { hp: 9, tempo: 58, lohn: 12, schaden: 1, gr: 0.6, stehlen: 0.1, name: 'Plünderer', info: 'Plünderer: kommt er durch, stiehlt er 10 % deiner Körner (höchstens 500).' },
    raeuberhauptmann: { hp: 650, tempo: 30, lohn: 170, schaden: 40, gr: 0.6, panzer: true, boss: true, mini: true, fahrzeug: true, name: 'Räuberhauptmann', hinweis: 'Der Räuberhauptmann fährt ein gepanzertes Halbkettenfahrzeug.' },
    sandsturmkhan: { hp: 3800, tempo: 12, lohn: 900, schaden: 1000, gr: 0.55, boss: true, fahrzeug: true, name: 'Sandsturm-Khan', faehig: { sandsturm: { cd: 12, dauer: 6 } }, hinweis: 'Der Sandsturm-Khan ruft Sandstürme: Alle Türme haben 6 s lang 30 % weniger Reichweite.' },
    // Getarnte Einheiten je Genre (ersetzen den Tarnsoldaten)
    buschgeist: { hp: 3, tempo: 66, lohn: 7, schaden: 1, gr: 0.6, tarn: true, name: 'Buschgeist', info: 'Buschgeist: im Dschungel getarnt – nur Türme mit Tarn-Erkennung sehen ihn.' },
    schneetarner: { hp: 3, tempo: 66, lohn: 7, schaden: 1, gr: 0.6, tarn: true, name: 'Schneetarner', info: 'Schneetarner: im Schnee getarnt – nur Türme mit Tarn-Erkennung sehen ihn.' },
    tarnroboter: { hp: 5, tempo: 60, lohn: 8, schaden: 1, gr: 0.6, tarn: true, roboter: true, name: 'Tarnroboter', info: 'Tarnroboter: unsichtbar durch sein Tarnfeld – nur Türme mit Tarn-Erkennung sehen ihn.' },
    sandgeist: { hp: 3, tempo: 66, lohn: 7, schaden: 1, gr: 0.6, tarn: true, name: 'Sandgeist', info: 'Sandgeist: im Sand getarnt – nur Türme mit Tarn-Erkennung sehen ihn.' },
    // Maisburg
    kolbenfresser: { hp: 5000, tempo: 13, lohn: 1500, schaden: 1000, gr: 0.55, panzer: true, boss: true, betaeuben: true, fahrzeug: true, name: 'Kolbenfresser', faehig: { rauch: { cd: 14, r: 220, dauer: 5 }, bauen: { cd: 9, typ: 'kampfroboter', n: 2 }, lawine: { cd: 16, r: 260, dauer: 5 }, abtauchen: { cd: 13, dauer: 3 }, sandsturm: { cd: 18, dauer: 6 } }, hinweis: 'Der Kolbenfresser kann alles: Türme betäuben, Rauch, Roboter bauen, Lawinen, abtauchen und Sandsturm.' }
  };

  // Techbaum wie im Design: Spalte c, Zeile r; dauerhaft, bezahlt mit Verdienstorden (nur zwischen den Runden)
  const TECH = [
    { id: 'ranger', n: 'Ranger', t: 'Start-Turm. Feuerstöße, zwei Ausbaupfade.', c: 0, r: 0, k: 0, bild: 'ranger' },
    { id: 'sniper', n: 'Scharfschütze', t: 'Große Reichweite, Tarn- und Schwerkaliber-Pfad.', c: 1, r: 0, k: 3, req: 'ranger', bild: 'sniper' },
    { id: 'depot', n: 'Logistik-Depot', t: 'Körner zu Beginn jeder Welle, Sanität auch Leben.', c: 2, r: 0, k: 3, req: 'sniper', bild: 'depot' },
    { id: 'juggernaut', n: 'Juggernaut', t: 'Minigun-Turm mit enormem Dauerfeuer.', c: 1, r: 2, k: 5, req: 'ranger', bild: 'juggernaut' },
    { id: 'railgun', n: 'Railgunner', t: 'Laser-Schienenkanone gegen Bosse und Panzer.', c: 2, r: 2, k: 6, req: 'juggernaut', bild: 'railgun' },
    { id: 'fabrik', n: 'Fahrzeugfabrik', t: 'Rammfahrzeuge oder ein stehender Panzer.', c: 3, r: 2, k: 6, req: 'railgun', bild: 'fabrik' },
    { id: 'ruhig', n: 'Ruhige Hand', t: 'Scharfschützen: +15 % Reichweite.', c: 2, r: 1, k: 2, req: 'sniper' },
    { id: 'tarnung', n: 'Maisfeld-Tarnung', t: 'Phantom-Ausbauten 20 % günstiger.', c: 3, r: 1, k: 4, req: 'ruhig' },
    { id: 'drill1', n: 'Ranger-Drill I', t: 'Ranger: +10 % Feuerrate.', c: 1, r: 3, k: 2, req: 'ranger' },
    { id: 'drill2', n: 'Ranger-Drill II', t: 'Ranger: weitere +10 % Feuerrate.', c: 2, r: 3, k: 3, req: 'drill1' },
    { id: 'goldmag', n: 'Goldmagazin', t: 'Neue Ranger starten mit Panzerbrechend.', c: 3, r: 3, k: 4, req: 'drill2' },
    { id: 'kasse', n: 'Kriegskasse', t: '+150 Körner Startgeld.', c: 0, r: 4, k: 2 },
    { id: 'ernte', n: 'Erntebonus', t: '+10 % Körner pro geschaffter Welle.', c: 1, r: 4, k: 3, req: 'kasse' },
    { id: 'bunker', n: 'Strohbunker', t: '+20 Leben zu Spielbeginn.', c: 2, r: 4, k: 3, req: 'ernte' },
    { id: 'reserve', n: 'Mais-Reserve', t: '+1 Leben nach jeder Welle.', c: 3, r: 4, k: 5, req: 'bunker' }
  ];
  // Genre je Karte: Genre-Gegner ersetzen die normalen größtenteils (85 %); Maisburg mischt alle Genres
  const GENRE = { paprikistan: 'dschungel', nordkolbistan: 'winter', maisdosistan: 'fabrik', ostkolbistan: 'marine', suedkolbistan: 'wueste', maisburg: 'alle' };
  const ERSATZ = {
    dschungel: { tarnsoldat: 'buschgeist', soldat: 'buschkaempfer', kamikaze: 'machetenlaeufer', humvee: 'pickup', motorrad: 'pickup', sanitaeter: 'rauchwerfer' },
    winter: { tarnsoldat: 'schneetarner', soldat: 'gebirgsjaeger', kamikaze: 'skijaeger', humvee: 'schneemobil', motorrad: 'schneemobil', sanitaeter: 'eisgranatier' },
    fabrik: { tarnsoldat: 'tarnroboter', soldat: 'kampfroboter', panzersoldat: 'kampfroboter', kamikaze: 'spinnenroboter', motorrad: 'spinnenroboter', humvee: 'kampfroboter', sanitaeter: 'schildroboter', schuetzenpanzer: 'mech', panzer: 'mech' },
    marine: { soldat: 'marinesoldat', tarnsoldat: 'kampftaucher', schuetzenpanzer: 'amphibienfahrzeug', humvee: 'amphibienfahrzeug', sanitaeter: 'funker' },
    wueste: { tarnsoldat: 'sandgeist', soldat: 'raeuber', humvee: 'buggy', motorrad: 'kamelreiter', panzersoldat: 'kamelreiter', sanitaeter: 'pluenderer' }
  };
  const BOSSE = {
    westkolbistan: { ende: 'ratte' }, paprikistan: { ende: 'dschungelkoenig', mini: ['kommandant'] }, nordkolbistan: { ende: 'lawinenbrecher', mini: ['pistenraupe'] },
    maisdosistan: { ende: 'schrottkoloss', mini: ['werkmeister'] }, ostkolbistan: { ende: 'seeschlange', mini: ['hovercraft'] }, suedkolbistan: { ende: 'sandsturmkhan', mini: ['raeuberhauptmann'] },
    maisburg: { ende: 'kolbenfresser', mini: ['kommandant', 'pistenraupe', 'werkmeister', 'hovercraft', 'raeuberhauptmann'] }
  };
  const REIHEN = ['Zweig Präzision & Logistik', 'Scharfschütze', 'Zweig Schwere Waffen', 'Ranger', 'Allgemein'];
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
  const TECH_IDS = ['ranger', 'sniper', 'depot', 'juggernaut', 'railgun', 'fabrik', 'ruhig', 'tarnung', 'drill1', 'drill2', 'goldmag', 'kasse', 'ernte', 'bunker', 'reserve'];
  const KARTEN_IDS = ['westkolbistan', 'paprikistan', 'nordkolbistan', 'maisdosistan', 'ostkolbistan', 'suedkolbistan', 'maisburg'];
  const ganz = (v, a, b) => Number.isInteger(v) && v >= a && v <= b;
  function standPruefen(d) {
    if (!d || typeof d !== 'object' || Array.isArray(d)) return null;
    if (!ganz(d.orden, 0, 1e6) || !ganz(d.stufe, 1, 1e4) || !(typeof d.xp === 'number' && d.xp >= 0 && d.xp < 1e9)) return null;
    if (!d.tech || typeof d.tech !== 'object' || !Object.entries(d.tech).every(([k, v]) => TECH_IDS.includes(k) && v === true) || !d.tech.ranger) return null;
    if (!d.sterne || typeof d.sterne !== 'object' || !Object.entries(d.sterne).every(([k, v]) => KARTEN_IDS.includes(k) && ganz(v, 1, 3))) return null;
    if (d.rekord != null && (typeof d.rekord !== 'object' || !Object.entries(d.rekord).every(([k, v]) => KARTEN_IDS.includes(k) && ganz(v, 0, 1e5)))) return null;
    const laeufe = {};
    if (d.laeufe != null) {
      if (typeof d.laeufe !== 'object' || Array.isArray(d.laeufe)) return null;
      for (const [k, l] of Object.entries(d.laeufe)) {
        if (!KARTEN_IDS.includes(k) || !l || typeof l !== 'object') return null;
        if (!ganz(l.welle, 0, 1e5) || !ganz(l.koerner, 0, 1e9) || !ganz(l.leben, 1, 1e7) || !ganz(l.startLeben, 1, 1e4) || typeof l.freeplay !== 'boolean' || !Array.isArray(l.tuerme) || l.tuerme.length > 300) return null;
        const ok = l.tuerme.every((t) => t && ['ranger', 'sniper', 'depot', 'juggernaut', 'railgun', 'fabrik'].includes(t.typ) && ganz(t.x, 0, 1140) && ganz(t.y, 0, 810) && ganz(t.a, 0, 5) && ganz(t.b, 0, 5)
          && (Math.min(t.a, t.b) <= 2) && ganz(t.ziel, 0, 3) && ganz(t.investiert, 0, 1e7));
        if (!ok) return null;
        laeufe[k] = { welle: l.welle, koerner: l.koerner, leben: l.leben, startLeben: l.startLeben, freeplay: l.freeplay, tuerme: l.tuerme.map((t) => ({ ...t })) };
      }
    }
    return { orden: d.orden, stufe: d.stufe, xp: d.xp, tech: { ...d.tech }, sterne: { ...d.sterne }, rekord: { ...(d.rekord || {}) }, laeufe };
  }
  const NEUSTAND = () => ({ orden: 0, stufe: 1, xp: 0, tech: { ranger: true }, sterne: {}, rekord: {}, laeufe: {} });
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
    tuerme: [], gegner: [], geschosse: [], effekte: [], flaechen: [], spawn: [], spawnNr: 0, texte: [], strahlen: [], neu: [], schilde: [], wolken: [],
    wahl: null, platzieren: null, maus: null, tech: P.tech, fahrzeuge: [], zeit: 0, startLeben: 100 + (P.tech.bunker ? 20 : 0)
  });

  // ---------- Laden ----------
  const bild = (src) => new Promise((ok, fehler) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => fehler(new Error(src)); i.src = src; });
  const json = (src) => fetch(src).then((r) => { if (!r.ok) throw new Error(src); return r.json(); });

  async function laden() {
    const [fahrTop, fahrJ, fabrikImg] = await Promise.all([bild('bilder/fahrzeug_draufsicht@2x.png'), json('daten/fahrzeug_draufsicht.json'), bild('bilder/fabrik@2x.png')]);
    const [depot, jugTop, railTop, jugJ, railJ, rangerTop, sniperTop, gegnerImg, effImg, gegnerAtlas, effAtlas, rangerJ, sniperJ, karten] = await Promise.all([
      bild('bilder/depot.png'), bild('bilder/juggernaut_draufsicht@2x.png'), bild('bilder/railgun_draufsicht@2x.png'), json('daten/juggernaut_draufsicht.json'), json('daten/railgun_draufsicht.json'), bild('bilder/ranger_draufsicht@2x.png'), bild('bilder/scharfschuetze_draufsicht@2x.png'),
      bild('bilder/gegner_spritesheet.png'), bild('bilder/effekte_spritesheet.png'),
      json('daten/gegner_atlas.json'), json('daten/effekte_atlas.json'), json('daten/ranger_draufsicht.json'), json('daten/scharfschuetze_draufsicht.json'), json('daten/karten.json')
    ]);
    A = { fahrTop, fabrik: fahrJ, fabrikImg, depot, jugTop, railTop, juggernaut: jugJ, railgun: railJ, rangerTop, sniperTop, gegnerImg, effImg, gegnerAtlas, effAtlas, ranger: rangerJ, sniper: sniperJ, karten: karten.karten, bilder: {} };
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
    if (d <= 0) return { x: pts[0][0], y: pts[0][1], dx: pts[1][0] - pts[0][0], dy: pts[1][1] - pts[0][1] };
    let lo = 0, hi = lang.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (lang[m] < d) lo = m; else hi = m; }
    const t = (d - lang[lo]) / ((lang[hi] - lang[lo]) || 1);
    return { x: pts[lo][0] + (pts[hi][0] - pts[lo][0]) * t, y: pts[lo][1] + (pts[hi][1] - pts[lo][1]) * t, dx: pts[hi][0] - pts[lo][0], dy: pts[hi][1] - pts[lo][1] };
  }
  function naechsterWegpunkt(x, y) {
    let best = [x + 1, y], bd = Infinity;
    for (const wg of wege) for (const p of wg.pts) { const d = Math.hypot(p[0] - x, p[1] - y); if (d < bd) { bd = d; best = p; } }
    return best;
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
    if (w.dauerfeuer && t.typ !== 'juggernaut') { w.reload = 0.15; w.burst = 1; }
    if (w.reloadSetzen) w.reload = w.reloadSetzen;
    if (S && t.heBis > S.zeit) { w.range += 6; w.heAktiv = true; }
    if (S && t.overBis > S.zeit) { w.dmg *= 1.25; w.range += 6; w.overAktiv = true; }
    if (S && t.gestoert) w.range *= 0.75;
    if (S && S.sandBis > S.zeit) w.range *= 0.7;
    if (S && t.langsamBis > S.zeit) w.reload *= 1.8;
    w.reload = Math.max(0.05, w.reload);
    w.rangePx = w.range * EINHEIT;
    if (def.fabrik) { w.fabrik = true; w.stand = t.b > t.a; if (!w.stand) { w.range = 0; w.rangePx = 0; } w.intervall = Math.max(2, w.intervall); }
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
    if (alt.fabrik && !neu.stand) {
      if (neu.kraft !== alt.kraft) z.push(['Fahrzeug-HP', zahl(alt.kraft), zahl(neu.kraft)]);
      if (neu.intervall !== alt.intervall) z.push(['Fahrzeug alle', zahl(alt.intervall) + ' s', zahl(neu.intervall) + ' s']);
      if (neu.fahrTempo !== alt.fahrTempo) z.push(['Tempo', zahl(alt.fahrTempo), zahl(neu.fahrTempo)]);
      const nf = [];
      if (neu.panzerbrechend && !alt.panzerbrechend) nf.push('rammt gepanzerte Gegner mit voller Kraft');
      if (neu.fraese && !alt.fraese) nf.push('Fräswalze: wirft Gegner zurück');
      return { zeilen: z, neu: nf };
    }
    const standNeu = neu.stand && !alt.stand;
    const nach = (w) => (w.dauerfeuer ? 'Dauerfeuer' : zahl(w.reload) + ' s');
    if (neu.dmg !== alt.dmg) z.push(['Schaden', zahl(alt.dmg), zahl(neu.dmg)]);
    if (nach(neu) !== nach(alt)) z.push(['Nachladen', nach(alt), nach(neu)]);
    if (!neu.dauerfeuer && neu.burst !== alt.burst) z.push(['Feuerstoß', alt.burst + ' Schuss', neu.burst + ' Schuss']);
    if (Math.abs(neu.range - alt.range) > 0.01) z.push(['Reichweite', zahl(alt.range), zahl(neu.range)]);
    if ((neu.pierce || 0) !== (alt.pierce || 0)) z.push(['Durchschlag', String(alt.pierce || 0), String(neu.pierce || 0)]);
    const dps = (w) => (w.dmg * (w.dauerfeuer ? 1 : w.burst)) / w.reload;
    z.push(['Schaden/s', zahl(dps(alt)), zahl(dps(neu))]);
    const neuF = [];
    if (standNeu) neuF.push('Fahrzeuge halten bei Gegnern in Reichweite an und schießen');
    if (neu.fabrik) { if (neu.kraft !== alt.kraft) z.push(['Fahrzeug-HP', zahl(alt.kraft), zahl(neu.kraft)]); if (neu.intervall !== alt.intervall) z.push(['Fahrzeug alle', zahl(alt.intervall) + ' s', zahl(neu.intervall) + ' s']); }
    if ((neu.splash || 0) !== (alt.splash || 0)) z.push(['Explosionsradius', zahl(alt.splash || 0), zahl(neu.splash || 0)]);
    if (neu.tarn && !alt.tarn) neuF.push('erkennt Getarnte');
    if (neu.panzerbrechend && !alt.panzerbrechend) neuF.push('durchschlägt Panzerung');
    if (neu.granate && neu.granate !== alt.granate) neuF.push(neu.granate >= 2 ? 'Granate 100 Schaden alle 5 s' : 'Granate 75 Schaden alle 8 s');
    if (neu.brand && !alt.brand) neuF.push('Brandgranate alle 10 s');
    if (neu.leuchtkugel && !alt.leuchtkugel) neuF.push('Leuchtkugel deckt Getarnte auf');
    if (neu.laser && !alt.laser) neuF.push('Laser-Munition (voller Schaden gegen Panzer)');
    if ((neu.zielzeit || 0) !== (alt.zielzeit || 0)) z.push(['Zielzeit', zahl(alt.zielzeit || 0) + ' s', zahl(neu.zielzeit || 0) + ' s']);
    if (neu.he && !alt.he) neuF.push('HE-Munition: alle 20 s für 6 s explosive Kugeln und mehr Reichweite');
    if (neu.overcharge && !alt.overcharge) neuF.push('Overcharge: alle 30 s für 8 s +25 % Schaden und mehr Reichweite');
    if (neu.stunImmun && !alt.stunImmun) neuF.push('immun gegen Betäubung');
    if (standNeu) for (const r of z) r[1] = '–';
    return { zeilen: z, neu: neuF };
  }
  function turmName(t) {
    const def = TUERME[t.typ];
    if (t.a === 0 && t.b === 0) return { ranger: 'Grenzranger', sniper: 'Grenzschütze', depot: 'Feldlager', fabrik: 'Humvee', juggernaut: 'Juggernaut', railgun: 'Railgunner' }[t.typ];
    return t.a >= t.b ? def.A[t.a - 1].n : def.B[t.b - 1].n;
  }
  function platzOk(x, y, typ = S.platzieren) {
    const gross = !!(TUERME[typ] && TUERME[typ].gross), extra = (TUERME[typ] && TUERME[typ].platz) || 0;
    if (x < 30 || x > W - 30 || y < 30 || y > H - 30) return false;
    if (x < 540 && y < 90) return false;                         // Anzeige oben links
    if (abstandZumWeg(x, y) < K.wegbreite / 2 + 3 + (gross ? 48 : 22 + extra * 0.4)) return false;
    const z = K.ziel; if (Math.hypot(x - z[0], y - z[1]) < 70) return false;
    for (const e of K.sperren || []) if (((x - e.x) / e.rx) ** 2 + ((y - e.y) / e.ry) ** 2 < 1) return false;
    for (const t of S.tuerme) if (Math.hypot(t.x - x, t.y - y) < (gross || TUERME[t.typ].gross ? 80 : 46 + extra * 0.5 + ((TUERME[t.typ].platz || 0) * 0.5))) return false;
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
    // Mengen wachsen bis zu einer Obergrenze, danach steigt vor allem das Leben der Gegner
    const q = [], m = (g) => Math.min(n, g);
    let t = 0;
    const add = (typ, anzahl, abstand) => { for (let i = 0; i < anzahl; i++) { q.push({ t, typ }); t += abstand; } if (anzahl > 0) t += 1.2; };
    add('soldat', 5 + Math.round(m(40) * 1.6), Math.max(0.3, 0.9 - n * 0.025));
    if (n >= 6) add('kamikaze', Math.floor((m(50) - 4) * 0.45), 0.55);
    if (n >= 4) add('tarnsoldat', Math.floor((m(45) - 2) * 1.1), 0.8);
    if (n >= 8) add('sanitaeter', 1 + Math.floor(m(60) / 8), 2);
    if (n >= 6) add('panzersoldat', Math.floor((m(45) - 4) * 0.8), 1.1);
    if (n >= 7) add('humvee', Math.floor((m(50) - 5) * 0.5), 1.4);
    if (n >= 12) add('motorrad', Math.floor((m(60) - 9) * 0.6), 0.6);
    if (n >= 9) add('soldat', Math.round(m(40) * 1.5), 0.3);
    if (n >= 15) add('schuetzenpanzer', 1 + Math.floor((m(70) - 15) / 5), 3);
    if (n >= 10 && n % 5 === 0) add('panzer', Math.min(10, n / 5 - 1), 4);
    if (n >= 18) add('panzer', Math.min(8, Math.floor((n - 14) / 2)), 3);
    if (n >= 25) add('humvee', Math.min(20, Math.floor((n - 20) / 2)), 0.9);
    if (n >= 30 && n % 3 === 0) add('kamikaze', Math.min(30, Math.floor(n / 3)), 0.25);   // Kamikaze-Ansturm
    const genre = GENRE[K.id];
    if (genre) q.forEach((e, i) => {
      if ((i * 37 + n * 11) % 100 >= 85) return;                         // 15 % bleiben normale Gegner
      const g = genre === 'alle' ? ['dschungel', 'winter', 'fabrik', 'marine', 'wueste'][(i * 7 + n) % 5] : genre;
      if (genre === 'alle' && (i * 13 + n) % 100 >= 55) return;          // Maisburg: gut die Hälfte aus anderen Genres
      if (ERSATZ[g][e.typ]) e.typ = ERSATZ[g][e.typ];
    });
    const bo = BOSSE[K.id];
    if (n === K.wellen) { t += 4; add(bo.ende, 1, 0); }                      // Endboss in der letzten Welle
    else if (bo.mini && n % 20 === 0) { t += 3; add(bo.mini[(n / 20 - 1) % bo.mini.length], 1, 0); }   // Mini-Boss alle 20 Wellen
    return q;
  }
  function gegnerNeu(typ) {
    const g = GEGNER[typ], f = (1 + S.welle * 0.06 + Math.max(0, S.welle - 50) * 0.04) * HP_KARTE[K.stufe - 1] * (S.welle > K.wellen ? Math.pow(1.1, S.welle - K.wellen) : 1);
    const w = S.spawnNr++ % wege.length, p = wegPos(w, 0);
    const NEU_INFO = { kamikaze: 'Kamikaze! Sehr schnell und wenig Leben – kommt er durch, kostet er 15 Leben.', sanitaeter: 'Sanitäter: heilt alle 2,5 s Gegner in der Nähe – zuerst ausschalten.', motorrad: 'Motorräder sind die schnellsten Gegner.', schuetzenpanzer: 'Schützenpanzer: gepanzert, setzt beim Zerstören 4 Soldaten ab.' };
    S.gesehen = S.gesehen || {};
    const info = NEU_INFO[typ] || g.info;
    if (info && !S.gesehen[typ]) { S.gesehen[typ] = true; $('hinweis').textContent = info; }
    if (g.boss) { S.bannerBis = S.zeit + 4; S.bannerText = g.name + (g.mini ? ' greift an!' : ' rollt an!'); S.bannerMini = !!g.mini; $('hinweis').textContent = 'Achtung: ' + g.name + '! ' + (g.hinweis || ''); }
    return { typ, w, hp: g.hp * f, max: g.hp * f, d: -20, t: Math.random(), brennt: 0, sichtbarBis: 0, x: p.x, y: p.y, links: false, schussCd: 6, stopp: 0, feuerT: 99, geschossen: true };
  }

  // ---------- Kampf ----------
  const getarnt = (g) => (GEGNER[g.typ].tarn || g.rauchBis > S.zeit) && !(g.sichtbarBis > S.zeit);
  const abgetaucht = (g) => g.untenBis > S.zeit;
  function sichtbar(g, t, w) { return !abgetaucht(g) && (!getarnt(g) || w.tarn); }
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
    if (g.hp <= 0 || abgetaucht(g)) return;
    let m = menge;
    if (art !== 'ramm' && S.schilde.length && !GEGNER[g.typ].boss && S.schilde.some((sr) => Math.hypot(sr.x - g.x, sr.y - g.y) < sr.r)) m *= 0.5;
    if (GEGNER[g.typ].panzer && art === 'kugel' && !(w && (w.panzerbrechend || w.laser))) m *= 0.35;
    g.hp -= m;
    if (g.hp <= 0) {
      const def = GEGNER[g.typ];
      S.koerner += def.lohn; erfahrung(def.lohn);
      effekt('explosion', g.x, g.y - 20, 0, def.boss ? (def.mini ? 1.2 : 1.8) : def.fahrzeug || (def.panzer && g.typ !== 'panzersoldat') || g.typ === 'humvee' ? 0.9 : g.typ === 'kamikaze' ? 0.7 : g.typ === 'motorrad' ? 0.6 : 0.35);
      if (def.absetzen && !g.durch) for (let i = 0; i < def.absetzen; i++) { const n = gegnerNeu(def.absetzTyp || 'soldat'); n.w = g.w; n.d = Math.max(0, g.d - i * 14); S.neu.push(n); }
    }
  }
  function muendung(t) {
    const code = t.a + '-' + t.b, info = A[t.typ].frames[code].bilder[0].muendung;
    const k = (t.gr || TUERME[t.typ].groesse || TURM_GROESSE) / 160, mx = (info.x - 80) * k, my = (info.y - 80) * k, c = Math.cos(t.winkel), s = Math.sin(t.winkel);
    return { x: t.x + mx * c - my * s, y: t.y + mx * s + my * c };
  }
  function geschossArt(t, w) {
    if (t.typ === 'fabrik') return t.b >= 4 ? 'leuchtspur' : t.b >= 3 ? 'kugel_schwer' : 'kugel_50';
    if (t.typ === 'juggernaut') return w.heAktiv ? 'leuchtspur' : t.a >= 4 ? 'kugel_schwer' : t.b >= 2 ? 'kugel_ap' : 'kugel';
    if (t.typ === 'ranger') return t.a === 5 ? 'leuchtspur' : t.a === 4 ? 'kugel_schwer' : t.b >= 1 ? 'kugel_ap' : 'kugel';
    return t.b === 5 ? 'laserkugel' : t.b >= 2 ? 'kugel_50' : 'kugel_scharf';
  }
  function strahl(t, w, ziel) {
    // Railgun: sofortiger Laserstrahl, trifft das Ziel und bei Durchschlag weitere Gegner auf der Linie
    const m = muendung(t), dx = ziel.x - m.x, dy = ziel.y - 18 - m.y, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
    const ende = { x: m.x + ux * (w.rangePx + 40), y: m.y + uy * (w.rangePx + 40) };
    const treffer = S.gegner.filter((g) => g.hp > 0 && sichtbar(g, t, w)).map((g) => {
      const gx = g.x - m.x, gy = g.y - 18 - m.y, along = gx * ux + gy * uy, quer = Math.abs(gx * uy - gy * ux);
      return { g, along, quer };
    }).filter((h) => h.along > 0 && h.along < w.rangePx + 40 && h.quer < 22).sort((p, q) => p.along - q.along).slice(0, 1 + (w.pierce || 0));
    if (!treffer.some((h) => h.g === ziel)) treffer.unshift({ g: ziel });
    for (const h of treffer.slice(0, 1 + (w.pierce || 0))) { schaden(h.g, w.dmg, 'laser', w); effekt('treffer', h.g.x, h.g.y - 18, 0, 0.8); }
    S.strahlen.push({ x1: m.x, y1: m.y, x2: ende.x, y2: ende.y, t: 0, dick: t.b >= 5 ? 16 : t.b >= 3 ? 10 : 6 });
    effekt('muendungsfeuer', m.x, m.y, t.winkel, t.b >= 5 ? 1.4 : 0.9);
    t.schussT = 0;
  }
  function schiessen(t, w, ziel) {
    if (t.typ === 'railgun') { strahl(t, w, ziel); return; }
    const m = muendung(t);
    S.geschosse.push({ art: geschossArt(t, w), x: m.x, y: m.y, ziel, tx: ziel.x, ty: ziel.y - 18, tempo: t.typ === 'sniper' ? 1800 : t.typ === 'juggernaut' || t.typ === 'fabrik' ? 1500 : 1100, splash: (w.splash || 0) * EINHEIT, dmg: w.dmg, w, pierce: w.pierce || 0, he: !!w.heAktiv, klein: t.typ === 'juggernaut' });
    if (t.typ !== 'juggernaut' || Math.random() < 0.5) effekt('muendungsfeuer', m.x, m.y, t.winkel, t.typ === 'sniper' ? 0.75 : t.typ === 'fabrik' && t.b >= 4 ? 1.3 : 0.55);
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
    if (w.fabrik) return;
    t.schussT += dt;
    if (t.betaeubtBis > S.zeit) { t.burstRest = 0; return; }
    if (w.he) { t.heCd = (t.heCd ?? 8) - dt; if (t.heCd <= 0) { t.heBis = S.zeit + 6; t.heCd = 20; S.texte.push({ x: t.x, y: t.y - 60, text: 'HE-Munition!', farbe: '#FF8A1F', t: 0 }); } }
    if (w.overcharge) { t.overCd = (t.overCd ?? 10) - dt; if (t.overCd <= 0) { t.overBis = S.zeit + 8; t.overCd = 30; S.texte.push({ x: t.x, y: t.y - 60, text: 'Overcharge!', farbe: '#5EE6FF', t: 0 }); } }
    const ziel = zielWahl(t, w);
    if (ziel !== t.zielRef) { t.zielRef = ziel; t.zielT = 0; } else t.zielT = (t.zielT || 0) + dt;
    const zielBereit = !w.zielzeit || t.zielT >= w.zielzeit;
    if (ziel) {
      const soll = Math.atan2(ziel.y - 18 - t.y, ziel.x - t.x);
      let diff = Math.atan2(Math.sin(soll - t.winkel), Math.cos(soll - t.winkel));
      const max = (t.typ === 'fabrik' ? 4 : t.typ === 'sniper' || t.typ === 'railgun' ? 6 : t.typ === 'juggernaut' ? 7 : 9) * dt;
      t.winkel += Math.max(-max, Math.min(max, diff));
      diff = Math.atan2(Math.sin(soll - t.winkel), Math.cos(soll - t.winkel));
      t.cd -= dt;
      if (t.burstRest > 0) { t.burstCd -= dt; if (t.burstCd <= 0 && Math.abs(diff) < 0.35) { schiessen(t, w, ziel); t.burstRest--; t.burstCd = 0.15; } }
      else if (t.cd <= 0 && zielBereit && Math.abs(diff) < 0.3) { schiessen(t, w, ziel); t.burstRest = w.burst - 1; t.burstCd = 0.15; t.cd = w.reload; }
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
          for (const t of S.tuerme) if (Math.hypot(t.x - p.tx, t.y - p.ty) < 50 && !werte(t).stunImmun) t.betaeubtBis = S.zeit + 4;
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
        if (p.splash) { for (const g of S.gegner) if (g.hp > 0 && Math.hypot(g.x - p.tx, g.y - 18 - p.ty) < p.splash) schaden(g, p.dmg, 'kugel', p.w); effekt('explosion', p.tx, p.ty, 0, p.splash / 60); }
        else if (p.he) { for (const g of S.gegner) if (g.hp > 0 && Math.hypot(g.x - p.tx, g.y - 18 - p.ty) < 3 * EINHEIT) schaden(g, p.dmg, 'explosion'); effekt('explosion', p.tx, p.ty, 0, 0.3); }
        else schaden(p.ziel, p.dmg, 'kugel', p.w);
        effekt('treffer', p.tx, p.ty, 0, 0.6);
        let rest = p.pierce;
        if (rest > 0) for (const g of S.gegner) { if (rest <= 0) break; if (g !== p.ziel && g.hp > 0 && Math.hypot(g.x - p.ziel.x, g.y - p.ziel.y) < 60) { schaden(g, p.dmg, 'kugel', p.w); rest--; } }
      }
    } else { p.x += (dx / d) * s; p.y += (dy / d) * s; }
  }

  // ---------- Fahrzeugfabrik: Rammfahrzeuge fahren den Weg rückwärts ----------
  function fahrzeugeUpdate(dt) {
    if (S.laeuft) for (const t of S.tuerme) {
      if (t.typ !== 'fabrik') continue;
      const w = werte(t);
      t.fahrCd = (t.fahrCd ?? 1.5) - dt;
      if (t.fahrCd > 0 || !S.gegner.some((g) => g.d > 0)) continue;
      if (S.fahrzeuge.filter((v) => v.turm === t).length >= 3) continue;
      t.fahrNr = (t.fahrNr || 0) + 1;
      const wi = t.fahrNr % wege.length;
      S.fahrzeuge.push({ turm: t, typ: 'fabrik', a: t.a, b: t.b, ziel: t.ziel || 0, gr: 96, code: t.a + '-' + t.b, w: wi, d: wege[wi].gesamt, kraft: w.kraft, max: w.kraft, tempo: w.fahrTempo, werte: w, stand: !!w.stand, getroffen: new Set(), winkel: 0, tw: null, cd: 0.3, schussT: 1, x: 0, y: 0 });
      t.fahrCd = w.intervall;
    }
    for (const v of S.fahrzeuge) {
      // Panzerstellung: hält an, sobald ein Gegner in Reichweite ist, und schießt mit dem Turm
      let ziel = null;
      if (v.stand) {
        v.schussT += dt; v.cd -= dt;
        const rumpf = v.winkel, wt = v.tw ?? rumpf;
        ziel = zielWahl({ x: v.x, y: v.y, ziel: v.ziel }, v.werte);
        if (ziel) {
          const soll = Math.atan2(ziel.y - 18 - v.y, ziel.x - v.x);
          let diff = Math.atan2(Math.sin(soll - wt), Math.cos(soll - wt));
          v.tw = wt + Math.max(-4 * dt, Math.min(4 * dt, diff));
          diff = Math.atan2(Math.sin(soll - v.tw), Math.cos(soll - v.tw));
          if (v.cd <= 0 && Math.abs(diff) < 0.3) { const sch = { ...v, winkel: v.tw }; schiessen(sch, v.werte, ziel); v.schussT = 0; v.cd = v.werte.reload; }
        } else v.tw = wt + Math.atan2(Math.sin(rumpf - wt), Math.cos(rumpf - wt)) * Math.min(1, 3 * dt);
      }
      const blockiert = v.stand && S.fahrzeuge.some((o) => o !== v && o.w === v.w && o.d < v.d && v.d - o.d < 55);   // Abstand zum Vordermann
      if (!ziel && !blockiert) v.d -= v.tempo * dt;
      const p = wegPos(v.w, Math.max(0, v.d)); v.x = p.x; v.y = p.y;
      if (!ziel && (p.dx || p.dy)) v.winkel = Math.atan2(-p.dy, -p.dx);
      for (const g of S.gegner) {
        if (v.kraft <= 0) break;
        if (g.hp <= 0 || g.w !== v.w || g.d < 0 || abgetaucht(g) || v.getroffen.has(g) || Math.abs(g.d - v.d) > 26) continue;
        v.getroffen.add(g);
        // HP-Tausch: das Fahrzeug gibt so viele HP ab, wie der Gegner noch Leben hat.
        // Gepanzerte Gegner (ohne MRAP-Panzerbrechen) und Gegner im Schild kosten entsprechend mehr HP.
        let wirkung = 1;
        if (GEGNER[g.typ].panzer && !v.werte.panzerbrechend) wirkung *= 0.35;
        if (S.schilde.length && !GEGNER[g.typ].boss && S.schilde.some((sr) => Math.hypot(sr.x - g.x, sr.y - g.y) < sr.r)) wirkung *= 0.5;
        const noetig = g.hp / wirkung;
        if (v.kraft >= noetig) { v.kraft -= noetig; schaden(g, g.hp + 1, 'ramm'); }
        else { schaden(g, v.kraft * wirkung, 'ramm'); v.kraft = 0; }
        effekt('treffer', g.x, g.y - 16, 0, 0.9);
        if (v.werte.fraese && g.hp > 0) g.d = Math.max(0, g.d - 35);
      }
      if (v.kraft <= 0) { v.weg = true; effekt('explosion', v.x, v.y - 10, 0, 0.5); }
      if (v.d <= 0) v.weg = true;
    }
    S.fahrzeuge = S.fahrzeuge.filter((v) => !v.weg);
  }

  function bossSchuss(g) {
    const def = GEGNER[g.typ], z = g.bossZiel; if (!z) return;
    const mx = g.x + (380 - 192) * def.gr * (g.links ? -1 : 1), my = g.y + (62 - 206) * def.gr;
    effekt('muendungsfeuer', mx, my, g.links ? Math.PI : 0, 1.4);
    S.geschosse.push({ art: 'granate_gross', x: mx, y: my, sx: mx, sy: my, tx: z.x, ty: z.y, flug: 0, dauer: 1.0, wurf: true, boss: true, ziel: z });
  }

  // ---------- Fähigkeiten der Genre-Gegner und Bosse ----------
  function faehigkeiten(g, def, dt) {
    g.cds = g.cds || {};
    const bereit = (k, cd) => { g.cds[k] = (g.cds[k] ?? cd * 0.5) - dt; if (g.cds[k] <= 0) { g.cds[k] = cd; return true; } return false; };
    const text = (tx, farbe) => S.texte.push({ x: g.x, y: g.y - 80, text: tx, farbe, t: 0 });
    const F = def.faehig;
    if (F.rauch && bereit('rauch', F.rauch.cd)) {
      for (const o of S.gegner) if (o.hp > 0 && Math.hypot(o.x - g.x, o.y - g.y) < F.rauch.r) o.rauchBis = S.zeit + F.rauch.dauer;
      S.wolken.push({ x: g.x, y: g.y - 10, r: F.rauch.r, bis: S.zeit + F.rauch.dauer, dauer: F.rauch.dauer, farbe: '200,200,192' });
      text('Rauch!', '#E7E4DC');
    }
    if (F.kampfruf && bereit('ruf', F.kampfruf.cd)) {
      for (const o of S.gegner) if (o.hp > 0 && Math.hypot(o.x - g.x, o.y - g.y) < F.kampfruf.r) o.eilBis = S.zeit + F.kampfruf.dauer;
      text('Kampfruf!', '#FF8A1F');
    }
    if (F.reparatur && bereit('rep', F.reparatur.cd)) {
      let ok = false;
      for (const o of S.gegner) if (o !== g && o.hp > 0 && o.hp < o.max && GEGNER[o.typ].roboter && !GEGNER[o.typ].boss && Math.hypot(o.x - g.x, o.y - g.y) < F.reparatur.r) { o.hp = Math.min(o.max, o.hp + o.max * F.reparatur.anteil); ok = true; }
      if (ok) text('Reparatur', '#7CD992');
    }
    if (F.frost && bereit('frost', F.frost.cd)) {
      let ziel = null, best = F.frost.r;
      for (const t of S.tuerme) { const d = Math.hypot(t.x - g.x, t.y - g.y); if (d < best && !TUERME[t.typ].depot && !werte(t).stunImmun) { best = d; ziel = t; } }
      if (ziel) { ziel.betaeubtBis = Math.max(ziel.betaeubtBis || 0, S.zeit + F.frost.dauer); ziel.frostBis = S.zeit + F.frost.dauer; S.texte.push({ x: ziel.x, y: ziel.y - 60, text: 'Eingefroren!', farbe: '#9FE0FF', t: 0 }); }
      else g.cds.frost = 0.5;
    }
    if (F.lawine && bereit('lawine', F.lawine.cd)) {
      for (const t of S.tuerme) if (Math.hypot(t.x - g.x, t.y - g.y) < F.lawine.r && !werte(t).stunImmun) t.langsamBis = S.zeit + F.lawine.dauer;
      S.wolken.push({ x: g.x, y: g.y - 10, r: F.lawine.r, bis: S.zeit + 1.5, dauer: 1.5, farbe: '240,246,252' });
      text('Lawine!', '#E8F4FF');
    }
    if (F.bauen && bereit('bauen', F.bauen.cd)) {
      for (let i = 0; i < F.bauen.n; i++) { const n = gegnerNeu(F.bauen.typ); n.w = g.w; n.d = Math.max(0, g.d - 30 - i * 18); S.neu.push(n); }
      text('Roboter gebaut', '#E8B820');
    }
    if (F.abtauchen && bereit('ab', F.abtauchen.cd)) { g.untenBis = S.zeit + F.abtauchen.dauer; text('Abgetaucht!', '#7AC0E0'); }
    if (F.sandsturm && bereit('sand', F.sandsturm.cd)) { S.sandBis = S.zeit + F.sandsturm.dauer; text('Sandsturm!', '#E0C898'); }
  }

  // ---------- Ablauf ----------
  function update(dt) {
    S.zeit += dt;
    if (S.laeuft) {
      for (const sp of S.spawn) sp.t -= dt;
      while (S.spawn.length && S.spawn[0].t <= 0) S.gegner.push(gegnerNeu(S.spawn.shift().typ));
    }
    S.neu = [];
    S.schilde = []; const stoerer = [];
    for (const g of S.gegner) { const d = GEGNER[g.typ]; if (g.hp > 0 && g.d > 0) { if (d.schild) S.schilde.push({ x: g.x, y: g.y, r: d.schild }); if (d.stoeren) stoerer.push({ x: g.x, y: g.y, r: d.stoeren }); } }
    for (const t of S.tuerme) t.gestoert = stoerer.some((st) => Math.hypot(st.x - t.x, st.y - t.y) < st.r);
    for (const g of S.gegner) {
      const def = GEGNER[g.typ];
      if (def.faehig && g.d > 0) faehigkeiten(g, def, dt);
      if (def.heiler && g.d > 0) {
        g.heilCd = (g.heilCd ?? 1.5) - dt;
        if (g.heilCd <= 0) {
          g.heilCd = 2.5; let geheilt = false;
          for (const o of S.gegner) if (o !== g && o.hp > 0 && o.hp < o.max && !GEGNER[o.typ].boss && Math.hypot(o.x - g.x, o.y - g.y) < 100) { o.hp = Math.min(o.max, o.hp + o.max * 0.2); geheilt = true; }
          if (geheilt) S.texte.push({ x: g.x, y: g.y - 70, text: '+', farbe: '#7CD992', t: 0 });
        }
      }
      if (def.betaeuben) {
        g.feuerT += dt; g.schussCd -= dt;
        if (g.stopp > 0) {
          g.stopp -= dt;
          if (!g.geschossen && g.stopp < 1.3) { g.geschossen = true; g.feuerT = 0; bossSchuss(g); }
        } else if (g.schussCd <= 0 && g.d > 30) {
          let ziel = null;
          for (const t of S.tuerme) if (Math.hypot(t.x - g.x, t.y - g.y) < 340 && !(t.betaeubtBis > S.zeit) && !werte(t).stunImmun && (!ziel || t.investiert > ziel.investiert)) ziel = t;
          if (ziel) { g.stopp = 1.8; g.geschossen = false; g.bossZiel = ziel; g.schussCd = 8; } else g.schussCd = 1;
        }
      }
      if (!(def.betaeuben && g.stopp > 0)) { g.d += def.tempo * (g.eilBis > S.zeit ? 1.4 : 1) * dt; g.t += dt; }
      const p = wegPos(g.w, g.d); g.x = p.x; g.y = p.y; if (Math.abs(p.dx) > 0.3) g.links = p.dx < 0;
      if (g.brennt > 0) { g.brennt -= dt; schaden(g, 4 * dt, 'feuer'); }
      if (g.d >= wege[g.w].gesamt) {
        g.hp = 0; g.durch = true; S.leben -= def.schaden;
        if (def.stehlen) { const weg = Math.min(500, Math.floor(S.koerner * def.stehlen)); S.koerner -= weg; if (weg) S.texte.push({ x: g.x, y: g.y - 60, text: '−' + fmt(weg) + ' Körner', farbe: '#FF6B5E', t: 0 }); }
      }
    }
    S.wolken = S.wolken.filter((w) => w.bis > S.zeit);
    for (const f of S.flaechen) { f.t += dt; for (const g of S.gegner) if (Math.hypot(g.x - f.x, g.y - f.y) < 46) g.brennt = 0.5; }
    S.flaechen = S.flaechen.filter((f) => f.bis > S.zeit);
    for (const t of S.tuerme) turmUpdate(t, dt);
    fahrzeugeUpdate(dt);
    for (const p of S.geschosse) geschossUpdate(p, dt);
    S.geschosse = S.geschosse.filter((p) => !p.weg);
    S.gegner = S.gegner.filter((g) => g.hp > 0);
    if (S.neu.length) S.gegner.push(...S.neu);
    for (const e of S.effekte) e.t += dt;
    for (const tx of S.texte) tx.t += dt;
    for (const st of S.strahlen) st.t += dt;
    S.strahlen = S.strahlen.filter((st) => st.t < 0.3);
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
        // Freeplay-Orden nur, wenn die Karte wirklich besiegt ist (Sterne gespeichert)
        if (fp > 0 && fp % 20 === 0) {
          if (P.sterne[K.id] > 0) { P.orden++; toast(`${fp} Freeplay-Wellen geschafft! +1 Verdienstorden`); }
          else toast(`${fp} Freeplay-Wellen geschafft – Orden gibt es erst, wenn die Karte besiegt ist.`);
        }
        sichern();
      } else if (S.welle >= K.wellen && !S.ende) { S.ende = true; ende(true); }
      if (!S.ende) laufSichern();
    }
    // Auto: nächste Welle startet von selbst
    if (S.auto && !S.laeuft && !S.ende) { S.autoT = (S.autoT || 0) + dt; if (S.autoT > 1.2) welleStarten(); }
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
  function fahrzeugBild(code, x, y, winkel, turmWinkel, fr, gr) {
    const info = A.fabrik.frames[code], k = 2;
    ctx.save(); ctx.translate(x, y); ctx.rotate(winkel);
    ctx.drawImage(A.fahrTop, info.rumpf.x * k, info.rumpf.y * k, 160 * k, 160 * k, -gr / 2, -gr / 2, gr, gr);
    ctx.restore();
    if (info.modus === 'stand') {
      const b = info.bilder[fr];
      ctx.save(); ctx.translate(x, y); ctx.rotate(turmWinkel);
      ctx.drawImage(A.fahrTop, b.x * k, b.y * k, 160 * k, 160 * k, -gr / 2, -gr / 2, gr, gr);
      ctx.restore();
    }
  }
  function turmZeichnen(t, alpha = 1) {
    if (t.typ === 'fabrik') {
      const k = 0.7, code = t.a + '-' + t.b;
      ctx.save(); ctx.globalAlpha = alpha;
      ctx.drawImage(A.fabrikImg, t.x - 110 * k, t.y - 140 * k, 220 * k, 220 * k);
      if (t.rumpf === undefined) t.rumpf = S && K ? Math.atan2(naechsterWegpunkt(t.x, t.y)[1] - t.y, naechsterWegpunkt(t.x, t.y)[0] - t.x) : 0;
      const bereit = !S.laeuft || (t.fahrCd ?? 0) < 2;
      if (bereit) fahrzeugBild(code, t.x, t.y, t.rumpf, t.winkel, t.schussT < 0.06 ? 1 : t.schussT < 0.14 ? 2 : 0, TUERME.fabrik.groesse);
      ctx.restore(); return;
    }
    if (TUERME[t.typ].depot) {
      const i = KOMBIS.indexOf(t.a + '-' + t.b), k = 150 / 256;
      ctx.save(); ctx.globalAlpha = alpha;
      ctx.drawImage(A.depot, (i % 9) * 256, Math.floor(i / 9) * 256, 256, 256, t.x - 128 * k, t.y - 150 * k, 256 * k, 256 * k);
      ctx.restore(); return;
    }
    const img = { ranger: A.rangerTop, sniper: A.sniperTop, juggernaut: A.jugTop, railgun: A.railTop }[t.typ];
    const GR = TUERME[t.typ].groesse || TURM_GROESSE;
    const row = KOMBIS.indexOf(t.a + '-' + t.b);
    const fr = t.schussT < 0.04 ? 1 : t.schussT < 0.09 ? 2 : 0;
    ctx.save(); ctx.globalAlpha = alpha; ctx.translate(t.x, t.y); ctx.rotate(t.winkel);
    ctx.drawImage(img, fr * 320, row * 320, 320, 320, -GR / 2, -GR / 2, GR, GR);
    ctx.restore();
  }
  function gegnerZeichnen(g) {
    const def = GEGNER[g.typ], feuer = def.betaeuben && g.feuerT < 0.375;
    const an = A.gegnerAtlas.animationen[feuer ? g.typ + '_feuer' : g.typ];
    const f = A.gegnerAtlas.frames[an.bilder[feuer ? Math.min(2, Math.floor(g.feuerT * 8)) : Math.floor(g.t * an.fps) % an.bilder.length]];
    ctx.save(); ctx.globalAlpha = abgetaucht(g) ? 0.25 : getarnt(g) ? 0.45 : 1;
    frameZeichnen(A.gegnerImg, f, g.x, g.y, (g.links ? -1 : 1) * def.gr, def.gr, an.anker.x, an.anker.y);
    ctx.restore();
    if (g.hp < g.max && !def.boss) {
      const bw = Math.max(36, Math.min(80, f.w * def.gr * 0.45)), y = g.y - f.h * def.gr * 0.85;
      ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(g.x - bw / 2 - 1, y - 1, bw + 2, 6);
      ctx.fillStyle = g.hp / g.max > 0.4 ? '#7CD992' : '#FF6B5E'; ctx.fillRect(g.x - bw / 2, y, bw * Math.max(0, g.hp / g.max), 4);
    }
    if (g.brennt > 0) { const fl = effFrame('brandflaeche', S.zeit, true); frameZeichnen(A.effImg, fl, g.x, g.y - 6, 0.35, 0.35); }
  }
  // Schneefall auf dem Felsplateau: 3 Ebenen (nah = groß und schnell), leichter Wind
  const FLOCKEN = Array.from({ length: 170 }, (_, i) => {
    const r = (n) => { const x = Math.sin(i * 127.1 + n * 311.7) * 43758.5453; return x - Math.floor(x); };
    const ebene = i % 3;
    return { x: r(1) * W, y: r(2) * H, gr: [1.2, 2, 3][ebene] + r(3) * 0.8, tempo: [28, 46, 70][ebene] + r(4) * 14, wackel: 6 + r(5) * 10, ph: r(6) * 6.28, a: [0.55, 0.75, 0.9][ebene] };
  });
  function schneeZeichnen() {
    const z = performance.now() / 1000;
    ctx.save(); ctx.fillStyle = '#FFFFFF';
    for (const fl of FLOCKEN) {
      const y = (fl.y + z * fl.tempo) % (H + 20) - 10;
      const x = ((fl.x + z * fl.tempo * 0.35 + Math.sin(z * 0.9 + fl.ph) * fl.wackel) % (W + 20) + W + 20) % (W + 20) - 10;
      ctx.globalAlpha = fl.a; ctx.beginPath(); ctx.arc(x, y, fl.gr, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
  function zeichnen() {
    ctx.drawImage(A.bilder[A.karten.indexOf(K)], 0, 0, W, H);
    for (const f of S.flaechen) frameZeichnen(A.effImg, effFrame('brandflaeche', f.t, true), f.x, f.y, 0.9, 0.9);
    const w = S.wahl ? werte(S.wahl) : null;
    if (S.wahl && S.wahl.typ === 'fabrik') { for (const v of S.fahrzeuge) if (v.turm === S.wahl && v.stand) { ctx.beginPath(); ctx.arc(v.x, v.y, v.werte.rangePx, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fill(); ctx.setLineDash([8, 6]); ctx.strokeStyle = '#E8C766'; ctx.lineWidth = 2; ctx.stroke(); ctx.setLineDash([]); } }
    else if (S.wahl && w.rangePx > 0) { ctx.beginPath(); ctx.arc(S.wahl.x, S.wahl.y, w.rangePx, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.fill(); ctx.setLineDash([8, 6]); ctx.strokeStyle = '#E8C766'; ctx.lineWidth = 2; ctx.stroke(); ctx.setLineDash([]); }
    const dinge = [...S.gegner.map((g) => ({ y: g.y, f: () => gegnerZeichnen(g) })), ...S.tuerme.map((t) => ({ y: t.y + 20, f: () => {
      if (t === S.wahl) { ctx.save(); ctx.shadowColor = '#E8C766'; ctx.shadowBlur = 16; turmZeichnen(t); ctx.restore(); } else turmZeichnen(t);
      if (t.betaeubtBis > S.zeit) frameZeichnen(A.effImg, effFrame('betaeubt', S.zeit, true), t.x, t.y - 46, 1, 1);
    } }))];
    for (const v of S.fahrzeuge) dinge.push({ y: v.y, f: () => {
      fahrzeugBild(v.code, v.x, v.y, v.winkel, v.tw ?? v.winkel, v.schussT < 0.06 ? 1 : v.schussT < 0.14 ? 2 : 0, 96);
      const bw = 40, y = v.y - 34, k = Math.max(0, v.kraft / v.max);
      ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(v.x - bw / 2 - 1, y - 1, bw + 2, 6);
      ctx.fillStyle = k > 0.4 ? '#E8C766' : '#FF8A1F'; ctx.fillRect(v.x - bw / 2, y, bw * k, 4);
    } });
    dinge.sort((p, q) => p.y - q.y).forEach((d) => d.f());
    for (const wo of S.wolken) {
      const a = Math.min(1, (wo.bis - S.zeit) / 0.8) * 0.45, gr = ctx.createRadialGradient(wo.x, wo.y, 0, wo.x, wo.y, wo.r);
      gr.addColorStop(0, `rgba(${wo.farbe},${a})`); gr.addColorStop(0.7, `rgba(${wo.farbe},${a * 0.6})`); gr.addColorStop(1, `rgba(${wo.farbe},0)`);
      ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(wo.x, wo.y, wo.r, 0, Math.PI * 2); ctx.fill();
    }
    for (const t of S.tuerme) {
      if (t.frostBis > S.zeit) { ctx.fillStyle = 'rgba(160,224,255,0.45)'; ctx.beginPath(); ctx.arc(t.x, t.y, 34, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#E8F8FF'; ctx.lineWidth = 2; ctx.stroke(); }
      if (t.langsamBis > S.zeit) { ctx.strokeStyle = 'rgba(232,244,255,0.9)'; ctx.setLineDash([4, 4]); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(t.x, t.y, 30, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]); }
      if (t.gestoert) { ctx.strokeStyle = '#FF6B5E'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(t.x - 10, t.y - 44); ctx.lineTo(t.x - 4, t.y - 52); ctx.lineTo(t.x + 2, t.y - 44); ctx.lineTo(t.x + 8, t.y - 52); ctx.stroke(); }
    }
    if (K.id === 'nordkolbistan') schneeZeichnen();
    if (S.sandBis > S.zeit) { ctx.fillStyle = `rgba(216,192,138,${Math.min(0.3, (S.sandBis - S.zeit) * 0.3)})`; ctx.fillRect(0, 0, W, H); }
    for (const p of S.geschosse) {
      const an = A.effAtlas.animationen[p.art], fr = A.effAtlas.frames[an.bilder[0]];
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot || 0); const k = p.wurf ? 0.7 : p.klein ? 0.55 : 0.8;
      ctx.drawImage(A.effImg, fr.x, fr.y, fr.w, fr.h, -fr.w * k / 2, -fr.h * k / 2, fr.w * k, fr.h * k); ctx.restore();
    }
    for (const e of S.effekte) {
      const fr = effFrame(e.name, e.t, e.name === 'leuchtkugel');
      ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(e.rot); ctx.scale(e.gr, e.gr);
      const ax = e.name === 'muendungsfeuer' ? 3 : fr.w / 2;
      ctx.drawImage(A.effImg, fr.x, fr.y, fr.w, fr.h, -ax, -fr.h / 2, fr.w, fr.h); ctx.restore();
    }
    for (const st of S.strahlen) {
      const a = 1 - st.t / 0.3;
      ctx.save(); ctx.lineCap = 'round';
      ctx.globalAlpha = a * 0.35; ctx.strokeStyle = '#5EE6FF'; ctx.lineWidth = st.dick * 2.2; ctx.beginPath(); ctx.moveTo(st.x1, st.y1); ctx.lineTo(st.x2, st.y2); ctx.stroke();
      ctx.globalAlpha = a; ctx.lineWidth = st.dick * 0.6; ctx.strokeStyle = '#E8FBFF'; ctx.beginPath(); ctx.moveTo(st.x1, st.y1); ctx.lineTo(st.x2, st.y2); ctx.stroke();
      ctx.restore();
    }
    for (const tx of S.texte) {
      ctx.save(); ctx.globalAlpha = Math.min(1, (1.8 - tx.t) / 0.6); ctx.font = '800 22px "Space Grotesk", sans-serif'; ctx.textAlign = 'center';
      ctx.lineWidth = 5; ctx.strokeStyle = '#1A0306'; ctx.strokeText(tx.text, tx.x, tx.y - tx.t * 30); ctx.fillStyle = tx.farbe; ctx.fillText(tx.text, tx.x, tx.y - tx.t * 30); ctx.restore();
    }
    const boss = S.gegner.find((g) => GEGNER[g.typ].boss);
    if (boss) {
      const x0 = 420, bw = 380;
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
      ctx.textAlign = 'center'; ctx.fillStyle = '#E8C766'; ctx.font = '700 16px Inter, sans-serif'; ctx.fillText(S.bannerMini ? 'MINI-BOSS' : 'BOSS-WELLE', W / 2, 376);
      ctx.fillStyle = '#FFFFFF'; ctx.font = '700 44px "Space Grotesk", sans-serif'; ctx.fillText(S.bannerText || 'Die Stahlratte rollt an!', W / 2, 424); ctx.restore(); ctx.textAlign = 'left';
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
    for (const typ of ['ranger', 'sniper', 'depot', 'juggernaut', 'railgun', 'fabrik']) {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'turmkarte';
      if (!typ) { b.classList.add('gesperrt'); b.disabled = true; b.innerHTML = '<div class="bild" style="display:flex;align-items:center;justify-content:center;font-size:36px;color:#5A2A30;font-weight:700">?</div><span class="name">Bald</span><span class="preis">gesperrt</span>'; box.appendChild(b); continue; }
      const def = TUERME[typ], frei = !def.tech || P.tech[def.tech];
      if (!frei) b.classList.add('gesperrt');
      else if (S.koerner < def.kosten) b.classList.add('teuer');
      if (S.platzieren === typ) b.classList.add('aktiv');
      b.setAttribute('aria-label', def.name + (frei ? ` – ${def.kosten} Körner` : ' – im Techbaum freischalten'));
      b.innerHTML = `<div class="bild" style="${schraegStil(typ, 0, 0, 96)}"></div><span class="name">${def.name}</span><span class="preis">${frei ? fmt(def.kosten) + ' Körner' : 'Techbaum'}</span>` +
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
    $('auto').textContent = S.auto ? 'Auto an' : 'Auto'; $('auto').setAttribute('aria-pressed', S.auto ? 'true' : 'false'); $('auto').style.background = S.auto ? '#C9A227' : ''; $('auto').style.color = S.auto ? '#1C1416' : '';
    const pfadTyp = S.platzieren || (S.wahl && S.wahl.typ);
    $('pfadeKnopf').style.display = pfadTyp ? 'block' : 'none'; $('leisteTipp').style.display = pfadTyp ? 'none' : 'inline';
    $('welle').textContent = S.welle; $('wellenMax').textContent = S.freeplay ? '∞ Freeplay' : K.wellen;
    $('koerner').textContent = fmt(S.koerner); $('leben').textContent = Math.max(0, Math.ceil(S.leben));
    $('tempo').textContent = S.tempo + '×'; $('pause').textContent = S.pause ? '▶' : '❚❚';
    const wk = $('welleKnopf');
    wk.disabled = S.laeuft || S.ende;
    wk.textContent = S.laeuft ? 'Welle läuft …' : `▶ Welle ${S.welle + 1} starten`;
    const schluessel = JSON.stringify([S.platzieren, P.tech, S.koerner >= 250, S.koerner >= 285, S.koerner >= 400, S.koerner >= 900, S.koerner >= 1600, S.koerner >= 3200]);
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
    $('pWerte').textContent = w.fabrik && !w.stand ? `Fahrzeug-HP ${zahl(w.kraft)} · alle ${zahl(w.intervall)} s ein Fahrzeug` : w.fabrik ? `Schaden ${zahl(w.dmg)} · Nachladen ${zahl(w.reload)} s · Reichweite ${zahl(w.range)} · HP ${zahl(w.kraft)}` : def.depot ? `${fmt(w.koernerProWelle)} Körner${w.leben ? ' und ' + w.leben + ' Leben' : ''} zu Beginn jeder Welle` : `Schaden ${zahl(w.dmg)} · ${w.dauerfeuer ? 'Dauerfeuer' : 'Nachladen ' + zahl(w.reload) + ' s'} · Reichweite ${zahl(w.range)}`;
    $('pZiel').parentElement.style.display = def.depot || (w.fabrik && !w.stand) ? 'none' : 'flex';
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
      b.onclick = () => { if (!kann) return; S.koerner -= k; t.investiert += k; if (pfad === 'A') t.a++; else t.b++; if (!S.laeuft) laufSichern(); oberflaeche(); };
      d.appendChild(b); pf.appendChild(d);
    }
    $('pZiel').textContent = ZIELE[t.ziel] + ' ⟳';
    $('pVerkauf').textContent = `Verkaufen · ${fmt(t.investiert * 0.7)} Körner`;
  }
  $('pZiel').onclick = () => { if (S.wahl) { S.wahl.ziel = (S.wahl.ziel + 1) % ZIELE.length; oberflaeche(); } };
  $('pVerkauf').onclick = () => { const t = S.wahl; if (!t) return; S.koerner += Math.round(t.investiert * 0.7); S.tuerme = S.tuerme.filter((x) => x !== t); S.wahl = null; if (!S.laeuft) laufSichern(); oberflaeche(); };
  $('pZu').onclick = () => { S.wahl = null; oberflaeche(); };
  $('auto').onclick = () => { if (!S) return; S.auto = !S.auto; S.autoT = 0; oberflaeche(); };
  $('tempo').onclick = () => { S.tempo = S.tempo === 1 ? 2 : 1; oberflaeche(); };
  $('pause').onclick = () => { S.pause = !S.pause; oberflaeche(); };
  // Laufender Durchgang: Stand zwischen den Wellen (Türme, Körner, Leben) – zum Fortsetzen
  function laufStand() {
    return { welle: S.welle, koerner: Math.floor(S.koerner), leben: Math.max(1, Math.ceil(S.leben)), startLeben: S.startLeben, freeplay: !!S.freeplay,
      tuerme: S.tuerme.map((t) => ({ typ: t.typ, x: Math.round(t.x), y: Math.round(t.y), a: t.a, b: t.b, ziel: t.ziel || 0, investiert: Math.round(t.investiert) })) };
  }
  function laufSichern() { if (!K || !S || S.ende) return; if (!P.laeufe) P.laeufe = {}; P.laeufe[K.id] = laufStand(); sichern(); }
  function laufLoeschen() { if (P.laeufe && K) delete P.laeufe[K.id]; sichern(); }
  function welleStarten() {
    if (S.laeuft || S.ende) return;
    laufSichern();   // Stand vor der Welle: wird beim Fortsetzen wiederhergestellt
    S.welle++; S.spawn = welleBauen(S.welle); S.laeuft = true; S.autoT = 0;
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
      if (platzOk(p.x, p.y) && S.koerner >= TUERME[S.platzieren].kosten) { turmBauen(S.platzieren, p.x, p.y); S.platzieren = null; if (!S.laeuft) laufSichern(); $('hinweis').textContent = 'Turm gebaut. Tippe ihn an, um ihn auszubauen.'; }
      else $('hinweis').textContent = S.koerner < TUERME[S.platzieren].kosten ? 'Zu wenig Körner.' : 'Hier kann nicht gebaut werden (zu nah am Weg, auf Wasser, Felsen oder an einem anderen Turm).';
      oberflaeche(); return;
    }
    let treffer = null, best = 34;
    for (const t of S.tuerme) { const d = Math.hypot(t.x - p.x, t.y - p.y); if (d < best) { best = d; treffer = t; } }
    S.wahl = treffer; oberflaeche();
  });
  window.__mk = { S: () => S, P: () => P, update: (dt) => update(dt), platzOk: (x, y) => platzOk(x, y), abstand: (x, y) => abstandZumWeg(x, y), laden: async (i) => { await karteLaden(i); S = neu(); }, welle: () => welleStarten(), boss: (g) => !!GEGNER[g.typ].boss };
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
    const NW = 250, NH = 108, X = [40, 315, 590, 865, 1140], Y = [128, 266, 404, 542, 680], byId = {};
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
      let btn = hat ? (d.k ? 'Gekauft' : 'Freigeschaltet') : d.bald ? 'Bald' : !reqOk ? 'Benötigt: ' + byId[d.req].n : kann ? (d.bild ? 'Freischalten · ' : 'Kaufen · ') + d.k + (d.bild ? '' : ' Orden') : d.k + ' Orden · zu wenig';
      const rand = hat ? '#E8C766' : frei ? '#C9A227' : '#5A2A30';
      const img = d.bild ? `<div style="width:72px;height:84px;flex-shrink:0;border-radius:10px;background:#1A0306;overflow:hidden"><div style="${schraegStil(d.bild, 0, 0, 120)};width:120px;height:120px;margin:-20px 0 0 -24px;opacity:${hat ? 1 : 0.4}"></div></div>` : '';
      knoten += `<div style="position:absolute;left:${X[d.c]}px;top:${Y[d.r]}px;width:${NW}px;height:${NH}px;box-sizing:border-box;border-radius:14px;border:2px solid ${rand};background:${hat ? '#4A0810' : '#2B0509'};display:flex;gap:10px;padding:8px 12px;opacity:${d.bald ? 0.55 : 1}">${img}
        <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:3px"><div style="display:flex;justify-content:space-between;gap:6px"><span style="font-size:${d.bild ? 14 : 15}px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${d.n}</span>${hat ? '<span style="color:#E8C766;font-weight:800" aria-label="gekauft">✓</span>' : !reqOk || d.bald ? `<span style="color:#E7D4D6" aria-label="gesperrt">${SCHLOSS}</span>` : ''}</div>
        <span style="font-size:${d.bild ? 11 : 12}px;line-height:1.3;color:#E7D4D6;flex:1;min-height:0;overflow:hidden">${d.t}</span>
        <button type="button" data-tech="${d.id}" ${kann ? '' : 'disabled'} style="height:34px;flex-shrink:0;border-radius:8px;border:none;background:${kann ? '#C9A227' : hat ? '#2B0509' : '#3A0A10'};color:${kann ? '#1C1416' : hat ? '#E8C766' : '#E7D4D6'};font-size:13px;font-weight:800;cursor:${kann ? 'pointer' : 'default'}">${btn}</button></div></div>`;
    }
    const labels = REIHEN.map((r, k) => `<div style="position:absolute;left:${X[Math.min(...TECH.filter((d) => d.r === k).map((d) => d.c))]}px;top:${Y[k] - 22}px;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#E8C766">${r}</div>`).join('');
    overlay(`<div style="position:absolute;left:0;top:0;width:1440px;height:96px;box-sizing:border-box;padding:0 40px;display:flex;align-items:center;justify-content:space-between;background:#2B0509;border-bottom:2px solid #C9A227">
        <div style="display:flex;align-items:center;gap:18px"><button type="button" id="techZu" class="knopf" aria-label="Zurück" style="width:48px">‹</button>
          <div><h1 style="margin:0;font-size:34px;line-height:1">Techbaum</h1><span style="font-size:14px;color:#E7D4D6">Türme freischalten und dauerhafte Verbesserungen kaufen – bezahlt mit Verdienstorden für besiegte Karten</span></div></div>
        <div style="display:flex;align-items:center;gap:14px"><span style="font-size:14px;color:#E7D4D6">${zahl - 1} von ${TECH.length - 1} erforscht</span>${vorratChip()}</div></div>
      ${labels}${linien}${knoten}
      <div style="position:absolute;left:1140px;top:266px;width:250px;display:flex;flex-direction:column;gap:10px;font-size:12px;color:#E7D4D6"><span style="font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#E8C766">Legende</span>
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
        <span style="font-size:12px;color:#E7D4D6;letter-spacing:.1em">${P.laeufe && P.laeufe[k.id] ? '▶ Welle ' + (P.laeufe[k.id].welle + 1) : z === 'fertig' ? '★'.repeat(st) + '☆'.repeat(3 - st) : z === 'offen' ? 'Jetzt spielen' : 'Gesperrt'}</span></div></button>`; }).join('');
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
            <div style="background:#3A0A10;border-radius:10px;padding:10px 12px"><small style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#E7D4D6">Belohnung</small><div style="font-family:'Space Grotesk',sans-serif;font-size:22px;font-weight:700;color:#E8C766">+${st ? 1 : ORDEN[kWahl]} Orden</div></div>
            <div style="grid-column:1 / -1;background:#3A0A10;border-radius:10px;padding:10px 12px"><small style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#E7D4D6">Endboss${BOSSE[k.id].mini ? ' · Mini-Boss alle 20 Wellen' : ''}</small><div style="font-size:15px;font-weight:700;color:#FF8A7A">${GEGNER[BOSSE[k.id].ende].name}${BOSSE[k.id].mini ? `<span style="color:#E7D4D6;font-weight:600"> · ${BOSSE[k.id].mini.length > 1 ? 'alle Mini-Bosse' : GEGNER[BOSSE[k.id].mini[0]].name}</span>` : ''}</div></div></div>
          <div style="font-size:26px;letter-spacing:.1em;color:#E8C766">${'★'.repeat(st)}<span style="color:#5A2A30">${'★'.repeat(3 - st)}</span> <span style="font-size:13px;letter-spacing:0;color:#E7D4D6">${st ? st + ' von 3 Sternen' : '3 Sterne: kein Leben verlieren'}</span></div>
          ${P.rekord[k.id] ? `<div style="font-size:13px;color:#E7D4D6">∞ Freeplay-Rekord: <b style="color:#fff">Welle ${P.rekord[k.id]}</b></div>` : st ? '<div style="font-size:13px;color:#E7D4D6">∞ Freeplay: nach dem Sieg weiterspielen</div>' : ''}
          <div style="flex:1"></div>
          ${z === 'zu' ? `<div style="height:60px;border-radius:14px;border:2px dashed #5A2A30;color:#E7D4D6;display:flex;align-items:center;justify-content:center;gap:10px;font-size:15px;font-weight:700">${SCHLOSS} Erst ${L[kWahl - 1].land} gewinnen</div>`
            : P.laeufe && P.laeufe[k.id] ? `<div style="display:flex;flex-direction:column;gap:8px"><button type="button" class="gold" id="fortsetzen">▶ Fortsetzen · Welle ${P.laeufe[k.id].welle + 1}${P.laeufe[k.id].freeplay ? ' (Freeplay)' : ''}</button><button type="button" class="rand" id="spielen" style="height:46px">Neu starten</button></div>`
            : `<button type="button" class="gold" id="spielen">▶ ${st ? 'Nochmal spielen' : 'Spielen'}</button>`}
        </div></div>`, true);
    document.querySelectorAll('[data-karte]').forEach((b) => b.onclick = () => { kWahl = +b.dataset.karte; kampagne(); });
    $('zumTech').onclick = () => techZeigen('kampagne');
    $('zuEinst').onclick = () => einstellungen();
    if ($('fortsetzen')) {
      $('fortsetzen').onclick = () => spielen(kWahl, true);
      $('spielen').onclick = () => bestaetigen('Neu starten?', `Deine gespeicherte Runde auf ${k.land} (ab Welle ${P.laeufe[k.id].welle + 1}) wird dabei verworfen.`, 'Neu starten', () => { delete P.laeufe[k.id]; sichern(); spielen(kWahl); }, true, () => kampagne());
    } else if ($('spielen')) $('spielen').onclick = () => spielen(kWahl);
  }
  async function spielen(i, fortsetzen) {
    const knopf = $(fortsetzen ? 'fortsetzen' : 'spielen'); if (knopf) knopf.textContent = 'Lädt …';
    await karteLaden(i);
    S = neu(); letzteLeiste = ''; letztesPanel = ''; techZurueck = 'spiel';
    const l = fortsetzen && P.laeufe && P.laeufe[K.id];
    if (l) {
      Object.assign(S, { welle: l.welle, koerner: l.koerner, leben: l.leben, startLeben: l.startLeben, freeplay: l.freeplay });
      S.tuerme = l.tuerme.map((t) => ({ ...t, winkel: -Math.PI / 2, cd: 0.3, burstRest: 0, burstCd: 0, schussT: 1, granCd: 2, brandCd: 4, leuchtCd: 1 }));
    }
    overlayZu(); oberflaeche();
    $('hinweis').textContent = l ? `Fortgesetzt: ${K.land}, weiter mit Welle ${l.welle + 1}.` : `${K.land} – ${K.titel}: ${K.text} Wähle einen Turm und tippe neben den Weg.`;
  }
  function ende(sieg, aufgegeben) {
    laufLoeschen();
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
    overlay(`<h1>${sieg ? K.land + ' ist sicher!' : aufgegeben ? 'Karte verlassen' : (K.ende === 'palast' ? 'Der Regierungspalast ist gefallen' : K.ende === 'see' ? 'Die Gegner haben den Salzsee erreicht' : 'Die Gegner sind durchgebrochen')}</h1>
      <p style="font-size:17px">${sieg ? `Alle ${K.wellen} Wellen abgewehrt mit ${Math.ceil(S.leben)} Leben übrig. <span style="color:#E8C766;letter-spacing:.1em">${'★'.repeat(sterne)}${'☆'.repeat(3 - sterne)}</span>` : `${geschafft} von ${K.wellen} Wellen geschafft.`}</p>
      <p>${sieg ? `Verdienstorden für den Techbaum: <b style="color:#E8C766">+${lohn}</b> (jetzt ${fmt(P.orden)}). Ausgeben kannst du sie auf dem Weltbildschirm.` : 'Verdienstorden gibt es nur für besiegte Karten.'}${sieg && naechste < A.karten.length && erstSieg ? ` Neue Karte freigeschaltet: <b>${A.karten[naechste].land}</b>.` : ''}</p>
      <div style="display:flex;gap:12px;margin-top:16px"><button class="gold" type="button" id="zurKampagne" style="width:260px">Zur Kampagne</button><button class="rand" type="button" id="nochmal" style="width:220px">Nochmal spielen</button>${sieg ? '<button class="rand" type="button" id="freeplay" style="width:260px">∞ Freeplay weiterspielen</button>' : ''}</div>
      ${sieg ? '<p class="klein" style="margin-top:12px">Freeplay: Die Wellen gehen weiter, die Gegner werden jede Welle 10 % zäher. Alle 20 Freeplay-Wellen gibt es 1 Verdienstorden.</p>' : ''}`);
    $('zurKampagne').onclick = () => { if (sieg && naechste < A.karten.length) kWahl = naechste; kampagne(); };
    if ($('freeplay')) $('freeplay').onclick = () => { if (!(P.sterne[K.id] > 0)) return; S.freeplay = true; S.ende = false; S.pause = false; overlayZu(); toast('Freeplay! Die Gegner werden jede Welle stärker.'); oberflaeche(); };
    $('nochmal').onclick = () => { overlayZu(); spielenDirekt(); };
  }
  function spielenDirekt() { laufLoeschen(); S = neu(); letzteLeiste = ''; letztesPanel = ''; techZurueck = 'spiel'; overlayZu(); oberflaeche(); }
  $('heim').onclick = () => {
    if (!S || S.ende) { kampagne(); return; }
    const vorPause = S.pause; S.pause = true;
    const ab = S.laeuft ? S.welle : S.welle + 1;
    overlay(`<h1>Karte verlassen?</h1><p>Deine Runde wird gespeichert. Auf der Karte kannst du sie mit <b>„Fortsetzen“</b> weiterspielen – ab Welle ${ab}${S.laeuft ? ' (die laufende Welle startet neu)' : ''}.</p>
      <div style="display:flex;gap:12px;margin-top:16px"><button class="gold" type="button" id="jaWeg" style="width:220px">Ja, zur Kampagne</button><button class="rand" type="button" id="neinBleib" style="width:220px">Weiterspielen</button></div>`);
    $('jaWeg').onclick = () => { if (!S.laeuft) laufSichern(); S.ende = true; S.auto = false; kWahl = A.karten.indexOf(K); kampagne(); };
    $('neinBleib').onclick = () => { S.pause = vorPause; overlayZu(); };
  };

  // ---------- Ausbaupfade ansehen (wie BTD6: Bilder + Kurzbeschreibung je Stufe) ----------
  function pfadeZeigen(typ) {
    const def = TUERME[typ], vorPause = S.pause; S.pause = true;
    const titel = def.pfade || (typ === 'ranger' ? ['Präzision', 'Sturm'] : ['Phantom', 'Schwerkaliber']);
    const kurz = (alt, neu) => {
      const ae = aenderungen(werte(alt), werte(neu));
      return ae.zeilen.filter((z) => z[0] !== 'Schaden/s').map(([n, x, y]) => `${n} ${x} → ${y}`).concat(ae.neu).join(' · ') || '–';
    };
    const karte = (a, b, name, kosten, text) => `<div style="flex:1;min-width:0;display:flex;flex-direction:column;background:#3A0A10;border-radius:12px;overflow:hidden">
        <div style="${schraegStil(typ, a, b, 120)};width:120px;height:120px;align-self:center"></div>
        <div style="padding:6px 10px 10px;display:flex;flex-direction:column;gap:3px"><b style="font-size:13px;line-height:1.2">${name}</b>
        <span style="font-size:12px;font-weight:800;color:#E8C766">${kosten}</span><span style="font-size:11px;line-height:1.35;color:#E7D4D6">${text}</span></div></div>`;
    let html = `<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px"><div><h1 style="font-size:32px">${def.name} – Ausbaupfade</h1>
      <p style="margin:0 0 12px;font-size:14px">${def.info} Grundturm: ${fmt(def.kosten)} Körner. Ein Pfad bis Stufe 5, der andere höchstens bis Stufe 2.</p></div>
      <button type="button" class="zu" id="pfadeZu" aria-label="Schließen">✕</button></div>`;
    for (const pfad of ['A', 'B']) {
      html += `<div style="font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#E8C766;margin:10px 0 6px">${pfad === 'A' ? 'Oberer' : 'Unterer'} Pfad · ${titel[pfad === 'A' ? 0 : 1]}</div><div style="display:flex;gap:8px">`;
      for (let i = 1; i <= 5; i++) {
        const alt = { typ, a: pfad === 'A' ? i - 1 : 0, b: pfad === 'B' ? i - 1 : 0 }, neu = { typ, a: pfad === 'A' ? i : 0, b: pfad === 'B' ? i : 0 };
        html += karte(neu.a, neu.b, `${i} · ${def[pfad][i - 1].n}`, fmt(def[pfad][i - 1].k) + ' Körner', kurz(alt, neu));
      }
      html += '</div>';
    }
    overlay(html);
    $('pfadeZu').onclick = () => { S.pause = vorPause; overlayZu(); oberflaeche(); };
  }
  $('pfadeKnopf').onclick = () => { const typ = S.platzieren || (S.wahl && S.wahl.typ); if (typ) pfadeZeigen(typ); };

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
  function bestaetigen(titel, text, knopf, ok, gefahr, zurueck) {
    overlay(`<h1>${titel}</h1><p>${text}</p><div style="display:flex;gap:12px;margin-top:16px">
      <button type="button" class="gold" id="bJa" style="width:240px;${gefahr ? 'background:#B3261E;color:#fff' : ''}">${knopf}</button><button type="button" class="rand" id="bNein" style="width:200px">Abbrechen</button></div>`);
    $('bJa').onclick = ok; $('bNein').onclick = zurueck || (() => einstellungen());
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
