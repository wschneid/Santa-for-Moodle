# Themenwahl: Modelle der sozialen Differenzierung

Datenbank-Vorlage (Vorlagensatz / Preset) für die Moodle-Aktivität **Datenbank**.
Schülerinnen und Schüler wählen ein Thema für die Gruppenarbeit. 20 Personen, 4 Themen, **je 5 Plätze**.

| Thema | Plätze |
|-------|--------|
| Klassenmodell nach Karl Marx | 5 |
| Schichtungstheorien (Dahrendorf und Geißler) | 5 |
| Soziale Milieus (Sinus) | 5 |
| Exklusion und Inklusion | 5 |

## Funktionen

- **Ein Eintrag pro Person:** Jede Person wählt genau ein Thema, ändern ist über das Menü am eigenen Eintrag möglich.
- **Platzbegrenzung:** Volle Themen werden im Formular ausgegraut („voll (5 von 5)“). Direkt vor dem Speichern
  wird die Belegung noch einmal geprüft. Wählen zwei Personen gleichzeitig den letzten Platz, bekommt die zweite
  den Hinweis „… ist inzwischen voll. Bitte wähle ein anderes Thema.“
- **Übersicht:** Über der Liste steht für jedes Thema eine Karte mit Kurzbeschreibung, Belegung („4 von 5“),
  Fortschrittsbalken und den Namen der Gruppenmitglieder.
- **Wunschteam (freiwillig):** Freitextfeld „Mit wem möchtest du zusammenarbeiten?“
- Liste nach Thema sortiert, jedes Thema hat eine eigene Farbe.

## Einrichten

1. Datei **`Themenwahl_Soziale_Differenzierung.zip`** herunterladen (nicht entpacken).
2. Im Kurs **Bearbeiten einschalten → Aktivität anlegen → Datenbank**. Name z. B. „Themenwahl Gruppenarbeit“, speichern.
3. In der Datenbank den Reiter **Vorlagensätze** (engl. *Presets*) öffnen → **Importieren** →
   ZIP-Datei hochladen → **Vorlagensatz anwenden**.
4. **Einstellungen prüfen** (Zahnrad bzw. „Einstellungen“ der Aktivität → Abschnitt *Einträge*).
   Je nach Moodle-Version übernimmt der Import diese Werte nicht automatisch:
   - **Maximale Anzahl Einträge:** `1`
   - **Genehmigung erforderlich:** Nein
   - **Kommentare:** Nein
   - optional unter *Verfügbarkeit*: **Nur lesbar ab** = Ende der Wahl. Danach kann niemand mehr wählen oder ändern.
5. Optional: den Einführungstext der Aktivität setzen, z. B.
   *„Wähle bis Freitag dein Thema für die Gruppenarbeit. Pro Thema gibt es 5 Plätze, wer zuerst speichert, hat den Platz.“*

Fertig. Ein Test als Schüler (**Rolle wechseln → Schüler/in**) zeigt die Ansicht der Klasse.

## Anpassen

**Andere Platzzahl:** Datenbank → **Vorlagen → JavaScript-Vorlage**, ganz oben:

```js
var PLAETZE_PRO_THEMA = 5;
```

Mit 4 × 5 = 20 Plätzen haben die letzten Personen keine Auswahl mehr. Wer Spielraum lassen will, stellt `6` ein.

**Themen umbenennen oder ergänzen:** an **zwei** Stellen gleich ändern:
1. Datenbank → **Felder** → Feld „Thema“ → Optionen (eine pro Zeile)
2. JavaScript-Vorlage → Liste `THEMEN` (Name und Kurzbeschreibung)

Die Namen müssen buchstabengenau übereinstimmen, sonst wird das Thema nicht gezählt.
Die Farben für ein 5. oder 6. Thema werden in der CSS-Vorlage ergänzt (`.tw-t5`, `.tw-t6`).

## Gruppen in Moodle anlegen (optional)

Nach Abschluss der Wahl: Datenbank → **Export → CSV**. Die Liste zeigt für jede Person ihr Thema.
Damit lassen sich unter **Teilnehmer/innen → Gruppen** vier Gruppen anlegen, z. B. für eine spätere Abgabe als Gruppe.

## Häufige Fragen

**Ein Thema hat 6 Personen.**
Die Sperre läuft im Browser der Schüler. Lehrkräfte können Einträge immer anlegen, und sehr alte Browser
überspringen die Prüfung. In der Übersicht steht dann „überbelegt“ in Rot. Die Lehrkraft verschiebt eine Person über
das Menü am Eintrag → *Bearbeiten*.

**Die Übersicht zeigt „Die Belegung konnte nicht geladen werden“.**
Seite neu laden. Bleibt der Hinweis, prüfen, ob die JavaScript-Vorlage vollständig ist.

**Schüler sehen nur die Einträge ihrer Gruppe.**
Die Datenbank steht im Gruppenmodus „Getrennte Gruppen“. Für die Themenwahl auf „Keine Gruppen“ stellen.

**Moodle-Version?**
Gebaut für Moodle 4.1 und neuer (Aktionsmenü `##actionsmenu##`). In älteren Versionen fehlt das Menü am Eintrag.

## Inhalt des Vorlagensatzes

| Datei | Zweck |
|-------|-------|
| `preset.xml` | Felder „Thema“ (Optionsfelder, Pflicht) und „Wunschteam“ (Text) sowie Einstellungen |
| `addtemplate.html` | Formular „Eintrag hinzufügen“ |
| `listtemplate*.html` | Listenansicht mit Übersicht im Kopf |
| `singletemplate.html` | Einzelansicht |
| `asearchtemplate.html` | Erweiterte Suche |
| `rsstemplate.html`, `rsstitletemplate.html` | RSS |
| `csstemplate.css` | Gestaltung |
| `jstemplate.js` | Platzbegrenzung und Übersicht |

Die Quelldateien liegen im Ordner `vorlage/`. Die ZIP-Datei neu bauen:

```bash
cd vorlage && rm -f ../Themenwahl_Soziale_Differenzierung.zip && zip -X ../Themenwahl_Soziale_Differenzierung.zip *
```

Lizenz: MIT (siehe Haupt-README).
