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

Die Wege führen aus der Karte hinaus (kein Kornspeicher mehr); Ostkolbistan endet im Salzsee, Maisburg am Regierungspalast. Wer das Wegende erreicht, kostet Leben.

| Nr. | Bundesland | Karte | Wellen | Leben der Gegner | Verdienstorden (erster Sieg) |
| --- | --- | --- | --- | --- | --- |
| 1 | Westkolbistan | Grenzfelder | 20 | ×1,00 | 3 |
| 2 | Paprikistan | Paprika-Plantage | 40 | ×1,08 | 3 |
| 3 | Nordkolbistan | Felsplateau (Plateaus nicht bebaubar) | 60 | ×1,16 | 4 |
| 4 | Maisdosistan | Dosenfabrik (eckige Förderbänder, Maschinen gesperrt) | 80 | ×1,24 | 4 |
| 5 | Ostkolbistan | Oase am Salzsee (See nicht bebaubar) | 100 | ×1,32 | 5 |
| 6 | Südkolbistan | Große Düne (2 Eingänge) | 120 | ×1,42 | 5 |
| 7 | Maisburg | Hauptstadt (Ziel: Regierungspalast) | 140 | ×1,55 | 6 |

- **Jede Karte hat 20 Wellen mehr als die vorige** (20, 40 … 140).
- Nächste Karte wird nach einem Sieg freigeschaltet. Sterne: 3 = kein Leben verloren, 2 = mindestens die Hälfte, 1 = gewonnen.
- **Zweite Währung: Verdienstorden** (dauerhaft, nur für den Techbaum): für besiegte Karten, Stufenaufstiege und alle 20 Freeplay-Wellen – erster Sieg 3–6 Orden, jeder Wiederholungssieg 1 Orden, dazu +1 je neu erreichtem Stern. Niederlage/Aufgeben: 0.
- Fortschritt im Browser gespeichert (`localStorage` `mkd-fortschritt-1`).

## Bedienung (Maus, Touch, Apple)

- Das Ausbau-Panel und die Turmleiste werden nur noch neu aufgebaut, wenn sich wirklich etwas ändert (Stufe, leistbar ja/nein). Vorher passierte das bei jedem Korn, also bis zu zehnmal pro Sekunde, und Klicks gingen verloren, wenn der Knopf zwischen Drücken und Loslassen ersetzt wurde. Während ein Finger oder die Maus gedrückt ist, wird gar nichts neu aufgebaut.
- Kein Zoomen auf iPhone/iPad: `maximum-scale=1, user-scalable=no`, `touch-action: manipulation` (kein Doppeltipp-Zoom), `touch-action: none` auf dem Spielfeld, Pinch-Gesten (`gesturestart`) und Doppelklick werden abgefangen, kein Textmarkieren und kein Lupen-/Kontextmenü beim langen Drücken.
- `VERSION` in spiel.js und `?v=` in index.html bei jedem Update hochzählen (gegen alten Browser-Zwischenspeicher).

## Fortsetzen und Auto

- **Fortsetzen:** Zu Beginn jeder Welle (und nach jeder Welle, jedem Bau, Ausbau, Verkauf zwischen den Wellen) wird der Stand der Runde gespeichert: Welle, Körner, Leben, Türme, Freeplay. ⌂ → „Ja, zur Kampagne“ sichert die Runde; auf der Karte erscheint **„Fortsetzen · Welle N“** (dazu „Neu starten“ mit Rückfrage). Wer mitten in einer Welle geht, startet diese Welle neu. Ein Sieg oder eine Niederlage löscht den gespeicherten Lauf. Gespeichert wird im signierten Spielstand (`laeufe`, je Karte einer).
- **Tempo:** Knopf neben Auto schaltet 1× → 2× → 4× → 6× → 10× → 1× (ab 4× gold). Das Spiel rechnet dabei mehrere kleine Schritte pro Bild, damit nichts übersprungen wird.
- **Auto:** Knopf oben rechts. Ist er an, startet die nächste Welle 1,2 s nach dem Ende der vorigen von selbst.

## Freeplay

Nach einem Sieg: „∞ Freeplay weiterspielen“. Die Wellen gehen weiter, Gegner-Leben steigen zusätzlich um **10 % pro Freeplay-Welle** (×1,1^n). **Alle 20 Freeplay-Wellen 1 Verdienstorden – nur, wenn die Karte besiegt ist.** Rekord je Karte wird gespeichert und in der Kampagne angezeigt. Eine Niederlage im Freeplay kostet nichts.

## Spieler-Stufe

Erfahrung (EP): jeder Abschuss = Körner-Belohnung des Gegners, jede geschaffte Welle 10 + 2 × Welle. Bedarf je Stufe 3.000 × 1,35^(Stufe − 1) (3.000, 4.050, 5.450 …). **Jeder Stufenaufstieg = 1 Verdienstorden** (Meldung im Spiel). Anzeige mit Fortschrittsbalken auf dem Weltbildschirm. Test: ein voller Durchlauf von Karte 1 bringt etwa 2 Stufen.

## Techbaum (dauerhaft)

**Jeder Turm hat seinen eigenen Baum:** oben der Turm, darunter seine eigenen Verbesserungen (bauen aufeinander auf). Zweige: Start · Präzision & Logistik (Scharfschütze → Depot → Feldarzt) · Schwere Waffen (Juggernaut → Railgunner → Fahrzeugfabrik) · Explosiv & Feuer (Raketenwerfer → Flammenwerfer → Artillerie) · Energie (Laser Gunner). Die Türme stehen in Zweigen: Der erste Turm eines Zweigs braucht den Ranger, jeder weitere den Turm links daneben. Rechts steht „Allgemein“. Die Fläche scrollt waagerecht (wischen oder Mausrad). Nur zwischen den Runden auf dem Weltbildschirm, bezahlt mit Verdienstorden.

| Turm (Orden) | Zweig | Eigene Verbesserungen (Orden) |
| --- | --- | --- |
| Ranger (frei) | Start | Ranger-Drill I (2, +10 % Feuerrate) → Drill II (3, +10 %) → Goldmagazin (4, starten mit Panzerbrechend) |
| Scharfschütze (3) | Präzision & Logistik | Ruhige Hand (2, +15 % Reichweite) → Maisfeld-Tarnung (4, Phantom-Ausbauten −20 %) |
| Logistik-Depot (3) | Präzision & Logistik | Lagerverwalter (3, +10 % Körner) → Feldküche (3, Depot-Ausbauten −15 %) |
| Juggernaut (5) | Schwere Waffen | Schnellwechsel-Läufe (3, +8 % Feuerrate) → Heizweste (4, nicht einfrierbar) |
| Railgunner (6) | Schwere Waffen | Kondensatoren (3, −10 % Nachladen) → Zielrechner (4, Zielzeit −30 %) |
| Fahrzeugfabrik (6) | Schwere Waffen | Fließband (3, Fahrzeuge 15 % öfter) → Verbundpanzerung (4, +25 % Fahrzeug-HP) |
| Feldarzt (4) | Präzision & Logistik | Sanitätskurs (3, +25 % Erholung) → Ladegerät (4, Ladungen 20 % öfter) |
| Raketenwerfer (4) | Explosiv & Feuer | Leichtbau-Rohre (3, +10 % Reichweite) → Tandem-Sprengkopf (4, +25 % gegen Panzer) |
| Flammenwerfer (4) | Explosiv & Feuer | Druckluft (3, +1 Reichweite) → Klebriges Napalm (3, Brand +2 s) |
| Artillerie (6) | Explosiv & Feuer | Feuerleitstelle (3, −10 % Nachladen) → Größere Ladung (4, +15 % Radius) |
| Laser Gunner (4) | Energie | Kühlrippen (3, −8 % Nachladen) → Fokuslinse (4, +10 % Schaden) |
| Allgemein | – | Kriegskasse (2, +150 Startkörner) → Erntebonus (3, +10 % Wellenbonus) → Strohbunker (3, +20 Leben) → Mais-Reserve (5, +1 Leben je Welle) |

Alte Spielstände mit Kornvorrat werden einmalig in Orden umgerechnet.

## Logistik-Depot (Wirtschaftsturm)

Kosten 400 Körner, im Techbaum freischalten (3 Verdienstorden, nach Scharfschütze). Schießt nicht, dreht sich nicht. **Zu Beginn jeder Welle** (Klick auf „Welle starten“) bringt es Körner, Sanitäts-Pfad zusätzlich Leben.

| Stufe | Versorgung (Körner/Welle) | Kosten | Sanität (Leben/Welle, Körner-Abzug) | Kosten |
| --- | --- | --- | --- | --- |
| 0 Feldlager | 70 | 400 | – | – |
| 1 | Mehr Kisten: 120 | 300 | Sanitätszelt: 1 Leben, −10 % | 350 |
| 2 | Lagerhalle: 200 | 700 | Feldlazarett: 3 Leben | 800 |
| 3 | Lkw-Kolonne: 350 | 1.600 | Krankenwagen: 7 Leben, −20 % | 1.800 |
| 4 | Kornsilo: 650 | 3.800 | Rettungshubschrauber: 15 Leben | 4.000 |
| 5 | Staatsreserve: 1.500 | 9.500 | Feldkrankenhaus: 30 Leben, −30 % | 9.000 |

Kreuzpfade wirken zusammen: Körner = Versorgung × (1 − Abzug), z. B. 2-2 = 200 × 0,9 = 180 Körner + 3 Leben. Mindestabstand zum Weg und zu anderen Türmen ist größer als bei Schützen.

## Sandbox (Testmodus)

Auf jeder Karte der Kampagne, auch auf noch gesperrten, gibt es den Knopf **„Sandbox · Testmodus“**. Dort hast du unendlich Körner und Leben (Anzeige ∞), unendlich Wellen (kein Sieg am Kartenende) und alle Türme ohne Techbaum. Die Verbesserungen aus dem Techbaum wirken trotzdem. **Keine Belohnungen:** keine EP, Stufen, Orden oder Sterne, kein Freeplay-Rekord, nichts wird gespeichert. Der Haus-Knopf verlässt die Sandbox ohne Speichern.

Unter der Turmauswahl (kompaktere Turmkarten) sitzt das **Spawn-Menü**: Gruppen Standard, Dschungel, Winter, Fabrik, Marine, Wüste und Bosse (alle Mini- und Endbosse). Die Anzahl ×1, ×5 oder ×10 lässt sich wählen. Antippen setzt die Gegner am Wegstart ein (Leben nach aktueller Welle). „Alle Gegner entfernen“ räumt die Karte. Normale Wellen lassen sich zusätzlich starten.

## Gegner

| Gegner | Leben | Tempo | Lohn | Schaden am Ziel | Besonderheit | ab Welle |
| --- | --- | --- | --- | --- | --- | --- |
| Soldat | 3 | 52 | 5 | 1 | – | 1 |
| Tarnsoldat | 3 | 66 | 7 | 1 | getarnt | 4 |
| Kamikaze | 2 | 135 | 6 | 15 | sehr schnell; ab Welle 30 jede 3. Welle Kamikaze-Ansturm | 7 |
| Gepanzerter Soldat | 12 | 34 | 14 | 2 | gepanzert | 6 |
| Humvee | 30 | 100 | 20 | 5 | – | 7 |
| Sanitäter | 8 | 46 | 12 | 2 | heilt alle 2,5 s Gegner im Umkreis 100 px um 20 % (nicht den Boss) | 8 |
| Motorrad | 10 | 150 | 12 | 4 | schnellstes Fahrzeug | 12 |
| Schützenpanzer | 90 | 40 | 50 | 12 | gepanzert, setzt beim Zerstören 4 Soldaten ab | 15 |
| Panzer | 180 | 24 | 100 | 20 | gepanzert | 10 |
| Stahlratte (Boss) | 1.000 | 15 | 400 | Niederlage | betäubt Türme | Grenzfelder, Welle 20 |

Genre-Gegner und Bosse der anderen Karten: siehe unten.

Leben × (1 + 0,06 × Welle + 0,04 × Wellen über 50) × Kartenfaktor. Die Mengen wachsen bis etwa Welle 40–70 und bleiben dann gleich, danach steigt nur noch das Leben. Beim ersten Auftauchen eines neuen Gegners erklärt ihn der Hinweis rechts.

## Genres und Bosse je Karte

Jede Karte hat ein Genre. Dessen Gegner ersetzen etwa 85 % der normalen Gegner, auch die Tarnsoldaten: Buschgeist (Dschungel), Schneetarner (Winter), Tarnroboter (Fabrik, 5 Leben · 60), Kampftaucher (Marine), Sandgeist (Wüste) – alle getarnt. In Maisburg kommen alle Gegnerarten gemischt. **Endboss in der letzten Welle, Mini-Boss alle 20 Wellen** (auch im Freeplay). Leben der Bosse wachsen mit dem Wellenfaktor. Mini-Bosse kosten 40 Leben, wenn sie durchkommen; ein Endboss am Ziel = Niederlage. Auf der Kartenauswahl stehen Endboss und Mini-Boss.

| Karte | Genre | Gegner (Leben · Tempo) | Spezialgegner | Mini-Boss | Endboss |
| --- | --- | --- | --- | --- | --- |
| Grenzfelder | Militär | normale Gegner | Sanitäter | – | Stahlratte (betäubt Türme) |
| Paprika-Plantage | Guerilla | Buschkämpfer 4 · 54, Machetenläufer 3 · 95 (3 Schaden), Pickup mit MG 34 · 92 | **Rauchwerfer** 9 · 46: alle 6 s Rauch, Gegner im Umkreis 90 px 4 s getarnt | Guerilla-Kommandant 350: Kampfruf, Gegner im Umkreis 4 s +40 % Tempo | Dschungelkönig 2.600 (Monstertruck): Rauch im Umkreis 220 px alle 10 s |
| Felsplateau (verschneit, Schneefall) | Gebirgsjäger | Gebirgsjäger 5 · 46, Skijäger 3 · 125, Schneemobil 24 · 115 | **Eisgranatier** 10 · 42: friert alle 7 s den nächsten Turm 2,5 s ein | Pistenraupe 600 (gepanzert) | Lawinenbrecher 3.000 (gepanzert): Lawine, Türme im Umkreis 260 px laden 5 s lang ×1,8 langsamer |
| Dosenfabrik | Roboter | Kampfroboter 7 · 46, Spinnenroboter 3 · 110, Schwerer Mech 120 · 26 (gepanzert, zerfällt in 3 Spinnenroboter) | **Schildroboter** 16 · 40: Gegner im Umkreis 95 px nehmen halben Schaden | Werkmeister 500: repariert alle 3 s Roboter um 10 % | Schrottkoloss 3.600 (gepanzert): baut alle 6 s 2 Kampfroboter |
| Oase am Salzsee | Marine | Marinesoldat 5 · 50, Kampftaucher 4 · 64 (getarnt), Amphibienfahrzeug 60 · 50 (gepanzert) | **Funker** 10 · 44: Störsender, Türme im Umkreis 150 px −25 % Reichweite | Hovercraft 450 · 70 | Seeschlange 3.200 (Luftkissen-Landungsboot): taucht alle 10 s für 3 s ab, unangreifbar |
| Große Düne | Wüstenräuber | Wüstenräuber 5 · 64, Kamelreiter 14 · 80, Buggy 26 · 135 | **Plünderer** 9 · 58: kommt er durch, stiehlt er 10 % der Körner (max. 500) | Räuberhauptmann 650 (Halbkette, gepanzert) | Sandsturm-Khan 3.800 (Festung auf Rädern): Sandsturm, alle Türme 6 s −30 % Reichweite |
| Maisburg | alle | alle Gegnerarten gemischt | alle | alle 5 Mini-Bosse reihum | Kolbenfresser 5.000 (Hightech-Landkreuzer): betäubt Türme, Rauch, baut Roboter, Lawine, taucht ab, Sandsturm |

Das Felsplateau ist verschneit (Tannen, vereiste Tümpel, Schnee-Plateaus) und hat einen durchgehenden Schneefall-Effekt (170 Flocken in 3 Ebenen, leichter Wind).

Anzeige im Spiel: Rauch-, Lawinen- und Sandsturmwolken, eingefrorene Türme (blau), verlangsamte Türme (weißer Ring), gestörte Türme (rotes Zickzack), Schildblase um Schildroboter, abgetauchte Bosse halb durchsichtig.

## Grafikstil (Umstellung läuft)

Der **Ranger** ist im neuen, detaillierteren Stil gezeichnet (nach Fotovorlagen): vorgelehnter Anschlag, Plattenträger, Helm mit Headset, Gewehr in M4-Bauart, Stofftextur und Tarnmuster, Licht von oben links. Stufen: Präzision 1 Laservisier (Strahl) · 2 Elite (Zielfernrohr, goldene Winkel) · 3 Nachtsichtgerät · 4 schweres Gewehr (langer Lauf, Zweibein) · 5 leichtes MG mit Patronenkasten. Sturm 1 Goldspitzen-Munition · 2 Waffenlicht · 3 Schulter-, Hals- und Leistenschutz · 4 Granatwerfer und Handgranaten · 5 Sturmhaube mit Visier. Der **Scharfschütze** ist ebenfalls umgestellt (kniender Anschlag, Ellbogen auf dem Knie, Gewehr in M110-Bauart): Phantom 1 Buschhut + Tarnschminke · 2 Wärmebild-Vorsatz · 3 Schalldämpfer · 4 Ghillie-Kapuze und Tarnstreifen · 5 voller Ghillie mit Maisblättern; Schwerkaliber 1 längerer Lauf · 2 .50-Gewehr mit Mündungsbremse · 3 Helm und Panzerung · 4 Leuchtpistole · 5 Laser-Gewehr. Die übrigen Türme folgen nacheinander.

## Turm-Paket 1 (nach TDX-Wiki)

Werte und Ausbaupfade aus dem TDX-Wiki (Quelltexte im Info-Repo unter `seiten/td-ranger-sprites/tdx-quellen/`), Körnerpreise ×0,5. Reichweite und Explosionsradius in TDX-Einheiten (1 Einheit = 14 px). Die Turmleiste scrollt jetzt (11 Türme).

| Turm (TDX-Vorbild) | Kosten | Grundwerte | Oberer Pfad | Unterer Pfad |
| --- | --- | --- | --- | --- |
| **Artillerie** (Artillery) | 925 | 65 Schaden, 11 s, Reichweite 65 (fast die ganze Karte), Radius 4 | Geübte Mannschaft 275 · M119+ 500 · Schnellfeuer 1.000 · Größere Granaten 3.250 · Dreifachrohr 9.250 (3er-Salve) | HE-Granaten 600 · Schwere Granaten 1.500 · M198-Haubitze 5.125 · Langes Rohr 6.000 · Himmelsfalke 50.000 (2.080 Schaden, Radius 13, erkennt Getarnte, betäubungsimmun) |
| **Raketenwerfer** (Missile Trooper) | 425 | 40 Schaden, 7,5 s, Reichweite 16, Radius 2 | HE-Raketen 425 · Zielfernrohr 150 · SMAW+ 900 (Tarn) · Großer Sprengkopf 1.625 · Javelin 6.250 (×3 gegen Panzer, Zielzeit 3 s) | Schnelle Hände 120 · Ladetraining 130 · M2 Carl 1.200 · Großer Splitterradius 1.825 · Mehrfachwerfer 11.000 (alle 0,6 s eine Rakete) |
| **Flammenwerfer** (Flame Trooper) | 425 | 2 Schaden alle 0,2 s im Kegel, Reichweite 6, Brand 1/s für 5 s | Heißere Flamme 575 · Größerer Werfer 1.125 · Napalm 2.625 · M3-Flammenwerfer 5.250 (brennende Gegner +5 % Schaden, betäubungsimmun) · Exo-Flammenanzug 15.250 (Feuerring: 500 Schaden + 100/s Brand) | *eigener Pfad „Brandsatz“* (TDX hat nur einen Pfad): Zündflaschen 400 · Brandlache 900 · Phosphor 2.400 (Tarn) · Feuerwand 5.000 · Inferno-Werfer 16.000 |
| **Feldarzt** (Medic) | 250 | Erholung 50 %/s, Reichweite 12 | Heilzellen 200 · Stärkerer Strahl 415 · Medigun II 1.500 · Schutzladung 4.000 · Volle Schutzladung 14.500 | Mehr Reichweite 75 · Ausdauerzellen 225 · Weitstrahl 1.400 · Kraftladung 4.625 · Volle Kraftladung 14.000 |
| **Laser Gunner** | 465 | 4 Schaden, 0,7 s, Reichweite 14, erkennt Getarnte, Laser voll gegen Panzer | Laser-Wissen 240 · Energiezellen 525 · Laser-Gewehr 2.100 (Durchschlag) · Verstärkte Technik 3.250 (Schockmunition) · Laser-Minigun 14.375 | Bessere Sensoren 75 · Erweiterte Technik 200 · Laser-MP 1.640 (Tarn-Sensor I) · Laser-MP+ 3.500 (II) · Doppel-MP 8.175 (III) |

Anpassungen an unser Spiel:
- **Artillerie:** Die Granate fliegt im Bogen und zielt dorthin, wo der Gegner bei der Landung sein wird. Explosionen wirken voll gegen Panzerung.
- **Raketen:** Explosionsschaden wird mit dem Panzer-Faktor (×1 bis ×3) gegen gepanzerte Gegner und Fahrzeuge multipliziert.
- **Flammenwerfer:** trifft alle Gegner im Kegel. Feuer wirkt voll gegen Panzerung. Die Reichweite ist 6 statt 5, weil Türme bei uns einen Mindestabstand zum Weg haben. Brandlachen: alle 5 s / 3 s / 2 s eine brennende Fläche am Ziel (Radius 40 / 56 / 76 px).
- **Feldarzt:** In TDX heilt er Turm-Leben, die es bei uns nicht gibt. Hier lässt die „Erholung“ Betäubung, Einfrieren und Lawinen-Verlangsamung von Türmen in Reichweite schneller enden (50 %/s = Betäubung läuft 1,5× so schnell ab). Schutzladung: alle 20 s ein Turm 5 s (voll: 8 s, auch der Arzt selbst) immun gegen Betäubung, Frost, Lawine und Störsender. Kraftladung: alle 25 s der teuerste Turm in Reichweite 8 s doppelter (voll: 10 s dreifacher) Schaden.
- **Laser Gunner:** Schockmunition alle 20 s für 6 s (+30 % Schaden, Treffer bremsen Gegner 2 s um 30 %). Tarn-Sensor I/II/III alle 12/10/8 s: deckt Getarnte in Reichweite 6 s auf und trifft sie mit 4/6/8-fachem Schaden.

## Fahrzeugfabrik

900 Körner, im Techbaum nach dem Railgunner (6 Orden). Große Halle mit Vorplatz, braucht Platz wie das Depot. Die Stufe 0-0 ist ein Humvee.

- **Rammkolonne (oberer Pfad):** Während einer Welle fährt alle *Intervall* Sekunden ein Fahrzeug vom Wegende rückwärts zum Start (höchstens 3 je Fabrik, bei 2 Wegen abwechselnd). **Jedes Fahrzeug hat HP und gibt sie beim Rammen an die Gegner ab:** Hat der Gegner weniger Leben als das Fahrzeug HP, stirbt er und das Fahrzeug behält den Rest (10 HP gegen 7 Leben → Gegner tot, Fahrzeug 3 HP). Reicht es nicht, verliert der Gegner so viele Leben, wie das Fahrzeug noch HP hat, und das Fahrzeug explodiert (3 HP gegen 4 Leben → Gegner 1 Leben, Fahrzeug kaputt). Gepanzerte Gegner kosten ohne MRAP-Stufe das 1/0,35-fache an HP, Gegner im Schild eines Schildroboters das Doppelte; abgetauchte Bosse werden nicht getroffen. HP-Leiste über jedem Fahrzeug.
  Fahrzeug-HP: Humvee 10 · Rammbügel 300 (20) · Panzerplatten 650 (40, alle 6 s) · MRAP 1.900 (100, rammt Panzerung voll, alle 5 s) · Räumschild 4.200 (260, alle 4,5 s) · **Keiler** 15.000 (Minenräumpanzer nach Vorbild: M48-Wanne ohne Turm, flacher Aufbau, Schlegelwalze an zwei Armen mit Ketten und Schlagfüßen, Spurmarkiersystem am Heck; 1.160 HP, die Walze wirbelt Staub auf und wirft überlebende Gegner 35 px zurück).
- **Panzerstellung (unterer Pfad):** Die Fahrzeuge fahren genauso vom Wegende los und haben HP wie die Rammkolonne. Sobald ein Gegner in ihrer Reichweite ist, **halten sie an**, drehen den Turm und schießen; ist niemand mehr in Reichweite, fahren sie weiter. Laufen Gegner in ein stehendes Fahrzeug hinein, gilt derselbe HP-Tausch wie beim Rammen. Hintereinander halten sie 55 px Abstand. Die Fabrik selbst schießt nicht; ist sie angewählt, wird die Reichweite um ihre Fahrzeuge gezeichnet.
  Schweres MG 400 (Humvee mit MG, Schaden 3, 0,2 s, Reichweite 17, 20 HP) · Spähwagen 1.100 (Schaden 6, erkennt Getarnte, 50 HP, alle 6 s) · Schützenpanzer 3.200 (Maschinenkanone 16, Explosionsradius 1,5, durchschlägt Panzerung, 130 HP, alle 7 s) · Leopard 2A4 7.800 (Kanone 106, 1,5 s, Radius 4,5, 380 HP, alle 9 s) · **Leopard 2A7** 24.000 (Kanone 366, 1,1 s, Reichweite 31, Radius 8,5, 1.080 HP, alle 10 s, immun gegen Betäubung).
- Kreuzpfade: A 1–2 geben der Panzerstellung +1 Reichweite und schnelleres Nachladen, B 1–2 der Rammkolonne +10 bzw. +40 Fahrzeug-HP und ein Fahrzeug 1 s früher (Spähwagen-Stufe).

## Juggernaut und Railgunner (nach TDX)

Werte nach dem TDX-Wiki, Körnerpreise ×0,5. Größere Türme (Bildgröße 150, mehr Platzbedarf).

**Juggernaut** – 3.200 Körner, Minigun im Dauerfeuer (Schaden 8, Nachladen 0,1 s, Reichweite 15).
- Oberer Pfad *Feuerwalze*: Kraft-Handschuhe 425 · Gelenkdämpfer 800 · Langer Lauf 3.100 · Power-Minigun 4.500 (durchschlägt Panzerung) · Feuerwalze 33.500 (alle 20 s für 6 s HE-Munition: explosive Kugeln, mehr Reichweite).
- Unterer Pfad *Doppelfeuer*: Bessere Handhabung 300 · AP-Munition 1.800 · Doppel-Minigun 3.750 (erkennt Getarnte) · Kybernetischer Puls 7.000 · Volle Leistung 60.000 (Zielzeit 1,2 s, alle 30 s für 8 s Overcharge +25 % Schaden und Reichweite, immun gegen Betäubung).

**Railgunner** – 1.600 Körner, sofortiger Laserstrahl (Schaden 150, Nachladen 5 s, Reichweite 22), Laserschaden voll gegen Panzerung.
- Oberer Pfad *Schienen-Soldat*: Kühlzellen 525 · Erweiterte Optik 1.250 · Schienen-Soldat 2.500 (erkennt Getarnte) · Kampfanzug 6.000 (Durchschlag +1) · Super-Schienen-Soldat 13.500.
- Unterer Pfad *Geschützstellung*: Proto-Munition 925 · Blitzzellen 1.600 · Geschützstellung 4.000 (Sandsack-Stellung) · Doppelrohr 8.500 · XRT-9000 100.000 (Schaden 19.010, Nachladen 0,85 s, Zielzeit 10 s, immun gegen Betäubung).

Zielzeit = so lange muss ein Ziel anvisiert sein, bevor der erste Schuss fällt.

## Ausbaupfade-Knopf

Wie in BTD6: Sobald ein Turm im Laden oder auf der Karte angetippt ist, erscheint rechts oben über der Turmauswahl „ⓘ Ausbaupfade“. Er zeigt beide Pfade mit Bild, Name, Preis und kurzer Wirkung jeder Stufe (pausiert das Spiel).

## Boss: Stahlratte (Grenzfelder, Welle 20)

Landkreuzer nach Vorbild P. 1000 (verkleinert, neutrale Lackierung). Kommt am Ende von Welle 20 auf Grenzfelder, mit Banner und Boss-Lebensleiste. Leben 1.000 × Wellenfaktor (2.200), kugelfest, Tempo 15, Belohnung 400 Körner; erreicht er das Ziel, ist die Karte verloren. Alle 8 s: steht ein Turm in 340 px Umkreis, hält er 1,8 s an und feuert eine schwere Granate auf den teuersten Turm – Türme im Umkreis 50 px sind 4 s **betäubt** (schießen nicht, Sterne darüber).

## Einstellungen und Spielstand

Weltbildschirm → ⚙ **Einstellungen**:

- **Im Browser speichern** (passiert sonst automatisch nach jeder Welle und jedem Kauf), `localStorage` `mkd-fortschritt-1`.
- **Herunterladen**: `militaer-defense-<datum>-stufe-<n>.json` = `{ spiel, version, gespeichert, daten, pruefsumme }`.
- **Hochladen**: Prüfsumme und Inhalt werden geprüft (nur bekannte Felder und Werte); bei Erfolg Rückfrage, dann wird der Stand ersetzt.
- **Zurücksetzen** (mit Rückfrage).

**Schutz gegen Änderungen:** `pruefsumme` = HMAC-SHA-256 über die Daten (feste Schlüsselreihenfolge). Wird die Datei **oder** der Browser-Speicher verändert, stimmt die Prüfsumme nicht mehr: Datei wird abgelehnt; ein veränderter Browser-Stand wird verworfen (Kopie unter `mkd-fortschritt-1-verworfen`), man startet neu. Alte, noch unsignierte Stände werden einmalig übernommen und dann signiert. Hinweis: Der Schlüssel steckt im Spiel – das schützt gegen normales Bearbeiten, nicht gegen jemanden, der den Quellcode nachbaut.

## Spielregeln (Kurz)

- Währung im Spiel: **Körner** (nicht Maisdollar).
- Türme: **Ranger** (250) und **Scharfschütze** (285, im Techbaum für 3 Verdienstorden freischalten). Werte und Ausbaukosten nach dem TDX-Wiki (Ranger/Sniper).
- Ausbau: 2 Pfade, einer bis Stufe 5, der andere höchstens bis 2. Panel erscheint auf der Seite gegenüber dem Turm und zeigt bei jedem Ausbau die **Wertänderungen** (z. B. „Nachladen 1,75 → 1,65 s“, Schaden, Feuerstoß, Reichweite, Durchschlag, Schaden/s) und neue Fähigkeiten.
- Türme drehen sich in Draufsicht zum Gegner und schießen mit Rückstoß; Zielwahl Erster/Letzter/Stärkster/Nächster; Verkaufen 70 %.
- Gegner: Soldat, Tarnsoldat (nur mit Tarn-Erkennung angreifbar), gepanzerter Soldat und Panzer (Kugeln machen nur 35 % ohne Panzerbrechend/Laser), Humvee.
- Fähigkeiten automatisch: Granaten (Ranger Sturm 4/5), Brandgranate mit Brandfläche (Sturm 5), Leuchtkugel deckt Getarnte auf (Scharfschütze Schwerkaliber 4).
- ⌂ oben rechts: Karte verlassen (Kornvorrat für geschaffte Wellen bleibt).

Balance mit einfachem Bot getestet: Karte 1 nur mit Rangern schaffbar (ca. 40 Leben übrig). Spätere Karten (bis 50 Wellen) noch nicht durchgespielt – Werte dort vorläufig.
