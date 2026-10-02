# Ausgaben-Auswertung (Cannanas → Google Sheet)

`Ausgaben.gs` ist ein Google-Apps-Script. Es holt die Ausgaben über die Cannanas-API
und schreibt drei Tabellenblätter in ein Google Sheet. Mit der Website hat es nichts zu tun.

## Einrichten (einmalig, ca. 5 Minuten)

1. Neues Google Sheet anlegen (z. B. „CSCN Ausgaben“).
2. **Erweiterungen → Apps Script** öffnen.
3. Den gesamten Inhalt von `Ausgaben.gs` einfügen (vorhandenen Code ersetzen) und speichern.
4. Das Sheet neu laden. Es erscheint das Menü **Cannanas**.
5. **Cannanas → Zugangsdaten eintragen**: API-Key und Club-ID einfügen.
   Beide werden nur in den Skripteigenschaften gespeichert, nie in einer Zelle.
6. **Cannanas → Ausgaben jetzt aktualisieren**. Beim ersten Mal fragt Google nach der Berechtigung
   (Zugriff auf Tabellen und externe Dienste). Der Lauf dauert etwa 1–2 Minuten.
7. Optional: **Cannanas → Tägliche Aktualisierung einschalten** (täglich gegen 22 Uhr).

## Was im Sheet steht

| Blatt | Inhalt |
| --- | --- |
| **Übersicht** | Kennzahlen, Summen je Ausgabetag (Mi/Fr/Sa/Sonstige), Summen je Monat, Öffnungszeiten |
| **Ausgabetage** | Jeder Ausgabetag in einer Zeile (neueste zuerst): Abgaben, Mitglieder, Gramm, Ø je Abgabe, Stornos. Unten **SUMME** (rechnet mit Filter) |
| **Sorten** | Gramm, Abgaben und Anteil je Sorte über den gesamten Zeitraum, mit Summe |

## Wie gerechnet wird

- Datenbasis sind die Lagerbewegungen vom Typ `dispense`.
- Der Tag richtet sich nach dem Zeitpunkt der Ausgabe in der Zeitzone Europe/Berlin.
- **Gramm (netto)** = Abgaben minus Stornos („Storno für Abgabe …“).
- **Abgabe** = ein Warenkorb (ein Mitglied, ein Besuch). Komplett stornierte Warenkörbe zählen nicht.
- Ausgaben außerhalb von Mi/Fr/Sa sind gelb markiert. Sie sind meist Nachbuchungen oder Sonderfälle.
- Mitglieder-IDs oder Namen werden **nicht** ausgegeben, nur anonyme Zählungen.

## Anpassen

Öffnungszeiten, Uhrzeit des täglichen Laufs und Farben stehen oben im Script im Block `CONFIG`.
