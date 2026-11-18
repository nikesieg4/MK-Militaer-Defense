# Maiskolbistan Militär-Defense

Tower-Defense-Spiel der Republik Maiskolbistan – **Kampagne mit 7 Karten** (6 Bundesländer + Finale Maisburg) und dauerhaftem Techbaum.

Spielen: GitHub Pages aus `main` / Root (`https://nikesieg4.github.io/mk-militaer-defense/`, sobald Pages aktiviert ist).

## Inhalt

| Datei | Inhalt |
| --- | --- |
| `index.html` | Oberfläche (Anzeige, Turmleiste, Ausbau-Panel, Overlays) |
| `spiel.js` | Spiellogik (reines JavaScript, kein Bau-Schritt) |
| `bilder/` | Karte, Türme (Draufsicht drehbar + Schrägbilder), Gegner, Effekte |
| `daten/` | Atlanten (Positionen der Einzelbilder) und Wegpunkte der Karte |

Grafiken und Generatoren liegen im Repo `nikesieg4/Maiskolbistan-Info` unter `seiten/td-ranger-sprites/`.

## Kampagne

| Nr. | Bundesland | Karte | Wellen | Leben der Gegner | Belohnung (Kornvorrat) |
| --- | --- | --- | --- | --- | --- |
| 1 | Westkolbistan | Grenzfelder | 20 | ×1,00 | 500 |
| 2 | Paprikistan | Paprika-Plantage | 25 | ×1,08 | 700 |
| 3 | Nordkolbistan | Felsplateau (Plateaus nicht bebaubar) | 30 | ×1,16 | 900 |
| 4 | Maisdosistan | Dosenfabrik (eckige Förderbänder, Maschinen gesperrt) | 30 | ×1,24 | 1.100 |
| 5 | Ostkolbistan | Oase am Salzsee (See nicht bebaubar) | 35 | ×1,32 | 1.400 |
| 6 | Südkolbistan | Große Düne (2 Eingänge) | 40 | ×1,42 | 1.800 |
| 7 | Maisburg | Hauptstadt (Ziel: Regierungspalast) | 50 | ×1,55 | 3.000 |

- Nächste Karte wird nach einem Sieg freigeschaltet. Sterne: 3 = kein Leben verloren, 2 = mindestens die Hälfte, 1 = gewonnen.
- **Kornvorrat** (dauerhaft, für den Techbaum): 20 je geschaffter Welle + Belohnung beim ersten Sieg (Wiederholung: ein Viertel).
- Fortschritt im Browser gespeichert (`localStorage` `mkd-fortschritt-1`).

## Techbaum (dauerhaft)

Wie im Design: Zeilen Türme / Scharfschütze / Ranger / Allgemein mit Verbindungslinien. Ranger (frei) → **Scharfschütze 1.500** → (nächster Turm: bald); Ruhige Hand 800 → Maisfeld-Tarnung 1.800; Ranger-Drill I 400 → II 900 → Goldmagazin 1.200; Kriegskasse 500 (+150 Startkörner) → Erntebonus 1.200 → Strohbunker 600 (+20 Leben) → Mais-Reserve 2.000 (+1 Leben je Welle). Erreichbar aus der Kampagne und im Spiel (pausiert).

## Spielregeln (Kurz)

- Währung im Spiel: **Körner** (nicht Maisdollar).
- Türme: **Ranger** (250) und **Scharfschütze** (285, im Techbaum für 1.500 Kornvorrat freischalten). Werte und Ausbaukosten nach dem TDX-Wiki (Ranger/Sniper).
- Ausbau: 2 Pfade, einer bis Stufe 5, der andere höchstens bis 2. Panel erscheint auf der Seite gegenüber dem Turm.
- Türme drehen sich in Draufsicht zum Gegner und schießen mit Rückstoß; Zielwahl Erster/Letzter/Stärkster/Nächster; Verkaufen 70 %.
- Gegner: Soldat, Tarnsoldat (nur mit Tarn-Erkennung angreifbar), gepanzerter Soldat und Panzer (Kugeln machen nur 35 % ohne Panzerbrechend/Laser), Humvee.
- Fähigkeiten automatisch: Granaten (Ranger Sturm 4/5), Brandgranate mit Brandfläche (Sturm 5), Leuchtkugel deckt Getarnte auf (Scharfschütze Schwerkaliber 4).
- ⌂ oben rechts: Karte verlassen (Kornvorrat für geschaffte Wellen bleibt).

Balance mit einfachem Bot getestet: Karte 1 nur mit Rangern schaffbar (ca. 40 Leben übrig). Spätere Karten (bis 50 Wellen) noch nicht durchgespielt – Werte dort vorläufig.
