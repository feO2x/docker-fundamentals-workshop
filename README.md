# Docker Fundamentals — Workshop-Agenda

**Zur Website: [feo2x.github.io/docker-fundamentals-workshop](https://feo2x.github.io/docker-fundamentals-workshop/)**

Agenda-Seite und Folien für den vierstündigen Workshop „Docker Fundamentals“. Er baut auf dem Workshop [Linux Fundamentals](https://github.com/feO2x/linux-fundamentals-workshop) auf, dessen Repo als Vorlage dient.

Der komplette Zeitplan steht in `src/data/agenda.ts`. Uhrzeiten, Gesamtdauer und Praxisanteil werden aus den Blockdauern berechnet. Um einen Block zu verschieben oder umzutimen, ändert man also nur dieses Array.

Die Folien (`slides.html`, Quellen unter `src/slides/`) bauen auf reveal.js auf und übernehmen Titel, Fragen und Uhrzeiten der Blöcke ebenfalls aus der Agenda. Jeder Block hat eine eigene Datei unter `src/slides/blocks/`. Bisher gibt es den Einstieg und den Block „Warum Docker?“.

## Lokal starten

```bash
npm ci
npm run dev
```

`Docker.md` enthält das ursprüngliche Brainstorming zu den Inhalten.
