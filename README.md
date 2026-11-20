# Santa Claus is coming to town

You better watch out, you better not cry... Eine kleine Weihnachtsanimation für Moodle 

# 🎅 Weihnachtsmann-Überflug für Moodle

Ein Rentiergespann mit Rudolph, Schlitten und Glitzerspur fliegt über die Moodle-Seite.
Der ganze Code steht in **einem Textblock**. Er kann das ganze Jahr über dort bleiben:
geflogen wird nur vom **1. bis 25. Dezember**.

## Funktionen

- Flug beim Öffnen der Seite, danach **alle 5 Minuten** erneut, jeweils **12 Sekunden** lang
- Der Flug liegt über der ganzen Seite. Er fängt keine Klicks ab und stört niemanden beim Arbeiten.
- Sichtbar auch dann, wenn die Block-Leiste rechts zugeklappt ist
- **Zeitraum:** Außerhalb vom 1. bis 25. Dezember fliegt nichts, und Besucher sehen den Block nicht.
- Im Block erscheint eine Anzeige mit Countdown („Nächster Flug in 4:12“) und dem Knopf **„Jetzt fliegen“**.
- Bei einem Tab im Hintergrund wartet der Flug, bis der Tab wieder sichtbar ist.
- Keine externen Dateien und keine Verbindung zu fremden Servern

## How to

1. **Editor umstellen:** Profil → Einstellungen → Editor einstellen → **„Einfacher Text“** → Speichern.
   (Andere Editoren können das Skript beim Speichern entfernen.)
2. Seite öffnen (Kurs, Startseite oder Dashboard) → **Bearbeiten einschalten**.
3. **Block hinzufügen → „Text“**.
4. Den **kompletten Code** kopieren und in einen Textblock einfügen.
   Ein Blocktitel ist optional.
5. Speichern. Der Schlitten startet sofort, wenn das Datum im Zeitraum liegt.
6. Danach den Editor wieder auf den gewohnten Editor zurückstellen, falls gewünscht.
   Der gespeicherte Block bleibt erhalten, **solange man ihn nicht mit einem anderen Editor erneut bearbeitet**.

## Einstellungen

Ganz oben im Code steht der Abschnitt `EINSTELLUNGEN`. Nur dort etwas ändern:

```js
const CFG = {
  intervallMinuten: 5,          // alle wie viele Minuten der Schlitten erneut fliegt
  flugdauerSekunden: 12,        // Dauer eines Überflugs
  startBeimLaden: true,         // sofort beim Öffnen der Seite losfliegen
  infoImBlock: true,            // große Karte (true) oder schmale Leiste (false)
  sternenstaub: true,           // fallender Glitzer hinter dem Schlitten
  zeitraum: ['12-01', '12-25'], // von / bis als 'MM-TT', beide Tage inklusive
  titel: 'Der Weihnachtsmann ist unterwegs'
};
```

### Zeitraum

| Wert | Wirkung |
|------|---------|
| `['12-01', '12-25']` | 1. bis 25. Dezember (Standard) |
| `['11-28', '12-26']` | ab dem 28. November bis zum 2. Weihnachtstag |
| `['12-20', '01-06']` | über den Jahreswechsel bis Dreikönig |
| `null` | ganzjährig |

Das Datum kommt vom Computer des Besuchers und wird beim Laden der Seite geprüft.

Außerhalb des Zeitraums sehen Besucher den Block nicht. Im **Bearbeitungsmodus** bleibt er sichtbar,
mit dem Hinweis *„außerhalb des Zeitraums 01.12.–25.12. – für Besucher unsichtbar“*. So findet man ihn
jederzeit wieder, um ihn zu bearbeiten oder zu löschen.

### `infoImBlock`: was im Block zu sehen ist

Der Flug über die Seite ist in beiden Fällen gleich. Die Einstellung bestimmt nur, was **im Block selbst** steht.

**`infoImBlock: true`** (Standard): eine große Nachthimmel-Karte
- kleines Gespann mit Mond und Sternen
- Titel (aus `titel`)
- Countdown bis zum nächsten Flug, während des Flugs „Gerade unterwegs – schau nach oben!“
- Knopf **„Jetzt fliegen“**: startet den Flug sofort, und der Countdown beginnt neu
- Während des Flugs verschwindet das kleine Gespann aus der Karte, als wäre es losgeflogen.

Passt gut in die Block-Leiste oder als Blickfang auf der Kursseite.

**`infoImBlock: false`**: eine schmale Leiste
- nur Titel, Countdown und Knopf, ohne Bild
- braucht wenig Platz, und der Block bleibt sichtbar und auffindbar

Umstellen: im Code `infoImBlock: true` durch `infoImBlock: false` ersetzen und speichern.
Den Text der Überschrift ändert man über `titel`, zum Beispiel `titel: 'Frohe Weihnachten, 7b!'`.

## Häufige Fragen

**Der Block zeigt nichts, und es fliegt nichts.**
Meist hat der Editor das Skript beim Speichern entfernt. Dann den Editor auf „Einfacher Text“ umstellen
(siehe Einbau), den Block bearbeiten und den Code neu einfügen.
Außerhalb des Zeitraums ist der leere Block normal.

**Ich finde den Block im Januar nicht mehr.**
Bearbeiten einschalten. Dann erscheint der Block mit einem gestrichelten Hinweis.

**Kann ich den Block zweimal auf eine Seite setzen?**
Das schadet nicht, es fliegt trotzdem nur ein Schlitten.

**Der Flug kommt bei jedem Seitenwechsel.**
Das ist so gewollt: Er startet bei jedem Öffnen einer Seite. Wer das nicht möchte, setzt
`startBeimLaden: false`. Dann fliegt der Schlitten erst nach Ablauf des Intervalls oder auf Knopfdruck.
