# Maiskolbistan Militär-Defense

Tower-Defense-Spiel der Republik Maiskolbistan – **Kampagne mit 7 Karten** (6 Bundesländer + Finale Maisburg) und dauerhaftem Techbaum.

Spielen: GitHub Pages aus `main` / Root (`https://nikesieg4.github.io/MK-Militaer-Defense/`).

## Inhalt

| Datei | Inhalt |
| --- | --- |
| `index.html` | Oberfläche (Anzeige, Turmleiste, Ausbau-Panel, Overlays) |
| `spiel.js` | Spiellogik (reines JavaScript, kein Bau-Schritt) |
| `bilder/` | Karte, Türme (Draufsicht drehbar + Schrägbilder), Gegner, Effekte |
| `daten/` | Atlanten (Positionen der Einzelbilder) und Wegpunkte der Karte |

Grafiken und Generatoren liegen im Repo `nikesieg4/Maiskolbistan-Info` unter `seiten/td-ranger-sprites/`.

## Kampagne

| Nr. | Bundesland | Karte | Wellen | Leben der Gegner | Verdienstorden (erster Sieg) |
| --- | --- | --- | --- | --- | --- |
| 1 | Westkolbistan | Grenzfelder | 20 | ×1,00 | 3 |
| 2 | Paprikistan | Paprika-Plantage | 25 | ×1,08 | 3 |
| 3 | Nordkolbistan | Felsplateau (Plateaus nicht bebaubar) | 30 | ×1,16 | 4 |
| 4 | Maisdosistan | Dosenfabrik (eckige Förderbänder, Maschinen gesperrt) | 30 | ×1,24 | 4 |
| 5 | Ostkolbistan | Oase am Salzsee (See nicht bebaubar) | 35 | ×1,32 | 5 |
| 6 | Südkolbistan | Große Düne (2 Eingänge) | 40 | ×1,42 | 5 |
| 7 | Maisburg | Hauptstadt (Ziel: Regierungspalast) | 50 | ×1,55 | 6 |

- Nächste Karte wird nach einem Sieg freigeschaltet. Sterne: 3 = kein Leben verloren, 2 = mindestens die Hälfte, 1 = gewonnen.
- **Zweite Währung: Verdienstorden** (dauerhaft, nur für den Techbaum): **nur für besiegte Karten** – erster Sieg 3–6 Orden, jeder Wiederholungssieg 1 Orden, dazu +1 je neu erreichtem Stern. Niederlage/Aufgeben: 0.
- Fortschritt im Browser gespeichert (`localStorage` `mkd-fortschritt-1`).

## Techbaum (dauerhaft)

Wie im Design: Zeilen Türme / Scharfschütze / Ranger / Allgemein mit Verbindungslinien. **Nur zwischen den Runden** auf dem Weltbildschirm (Kampagne) erreichbar, bezahlt mit Verdienstorden. Ranger (frei) → **Scharfschütze 3** → (nächster Turm: bald); Ruhige Hand 2 → Maisfeld-Tarnung 4; Ranger-Drill I 2 → II 3 → Goldmagazin 4; Kriegskasse 2 (+150 Startkörner) → Erntebonus 3 → Strohbunker 3 (+20 Leben) → Mais-Reserve 5 (+1 Leben je Welle). Alte Spielstände mit Kornvorrat werden einmalig in Orden umgerechnet.

## Boss: Stahlratte (Grenzfelder, Welle 20)

Landkreuzer nach Vorbild P. 1000 (verkleinert, neutrale Lackierung). Kommt am Ende von Welle 20 auf Grenzfelder, mit Banner und Boss-Lebensleiste. Leben 1.000 × Wellenfaktor (2.200), kugelfest, Tempo 15, Belohnung 400 Körner; erreicht er das Ziel, ist die Karte verloren. Alle 8 s: steht ein Turm in 340 px Umkreis, hält er 1,8 s an und feuert eine schwere Granate auf den teuersten Turm – Türme im Umkreis 50 px sind 4 s **betäubt** (schießen nicht, Sterne darüber).

## Spielregeln (Kurz)

- Währung im Spiel: **Körner** (nicht Maisdollar).
- Türme: **Ranger** (250) und **Scharfschütze** (285, im Techbaum für 3 Verdienstorden freischalten). Werte und Ausbaukosten nach dem TDX-Wiki (Ranger/Sniper).
- Ausbau: 2 Pfade, einer bis Stufe 5, der andere höchstens bis 2. Panel erscheint auf der Seite gegenüber dem Turm und zeigt bei jedem Ausbau die **Wertänderungen** (z. B. „Nachladen 1,75 → 1,65 s“, Schaden, Feuerstoß, Reichweite, Durchschlag, Schaden/s) und neue Fähigkeiten.
- Türme drehen sich in Draufsicht zum Gegner und schießen mit Rückstoß; Zielwahl Erster/Letzter/Stärkster/Nächster; Verkaufen 70 %.
- Gegner: Soldat, Tarnsoldat (nur mit Tarn-Erkennung angreifbar), gepanzerter Soldat und Panzer (Kugeln machen nur 35 % ohne Panzerbrechend/Laser), Humvee.
- Fähigkeiten automatisch: Granaten (Ranger Sturm 4/5), Brandgranate mit Brandfläche (Sturm 5), Leuchtkugel deckt Getarnte auf (Scharfschütze Schwerkaliber 4).
- ⌂ oben rechts: Karte verlassen (Kornvorrat für geschaffte Wellen bleibt).

Balance mit einfachem Bot getestet: Karte 1 nur mit Rangern schaffbar (ca. 40 Leben übrig). Spätere Karten (bis 50 Wellen) noch nicht durchgespielt – Werte dort vorläufig.
