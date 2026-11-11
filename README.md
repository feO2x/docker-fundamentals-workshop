# Docker Fundamentals — Workshop-Agenda

**Zur Website: [feo2x.github.io/docker-fundamentals-workshop](https://feo2x.github.io/docker-fundamentals-workshop/)**

Agenda-Seite und Folien für den vierstündigen Workshop „Docker Fundamentals“. Er baut auf dem Workshop [Linux Fundamentals](https://github.com/feO2x/linux-fundamentals-workshop) auf, dessen Repo als Vorlage dient.

Der komplette Zeitplan steht in `src/data/agenda.ts`. Uhrzeiten, Gesamtdauer und Praxisanteil werden aus den Blockdauern berechnet. Um einen Block zu verschieben oder umzutimen, ändert man also nur dieses Array.

Die Folien (`slides.html`, Quellen unter `src/slides/`) bauen auf reveal.js auf und übernehmen Titel, Fragen und Uhrzeiten der Blöcke ebenfalls aus der Agenda. Jeder Block hat eine eigene Datei unter `src/slides/blocks/`. Die Dockerfiles der Übungen lesen die Folien direkt aus `exercises/` ein.

## Lokal starten

```bash
npm ci
npm run dev
```

## Übungsdateien

Die Teilnehmer klonen das Repo zu Beginn (Folie „Bevor es losgeht“) und arbeiten in `exercises/`:

| Ordner | Block | Inhalt |
| --- | --- | --- |
| `website/` | Volumes & Bind Mounts | `index.html` für nginx per Bind Mount |
| `banner/` | Das erste Dockerfile | Beispiel-Image mit `figlet`, Vorlage für die Folien |
| `wetter/` | Das erste Dockerfile, Layer & Caching, Taggen & Pushen | `wetter.sh` (curl, jq, Open-Meteo); das Dockerfile schreiben die Teilnehmer |
| `hallo-dotnet/` | Multi-Stage-Builds | Konsolen-App mit einstufigem Dockerfile |
| `datenbank/` | Docker Compose | `compose.yaml` mit Adminer und PostgreSQL, das Beispiel der Folien |
| `zaehler/` | Abschlussübung | Besucherzähler (ASP.NET Core, PostgreSQL) mit absichtlich kaputtem `Dockerfile` und `compose.yaml` |
| `loesungen/` | | die Lösungs-Dockerfiles und die reparierte `compose.yaml`, die auch die Folien zeigen |

Der Workflow `.github/workflows/exercises.yml` spielt jede Übung so durch, wie die Folien sie vorgeben, und schlägt fehl, wenn ein Image nicht tut, was versprochen ist. Die Beispielausgaben auf den Folien (`docker ps`, Logs, Cache, Image-Größen) stammen aus seinen Logs. Lokal lässt sich z. B. die Abschlussübung so prüfen:

```bash
cd exercises/zaehler
cp ../loesungen/zaehler.Dockerfile Dockerfile
cp ../loesungen/zaehler.compose.yaml compose.yaml
docker compose up -d --build
curl localhost:8080   # Moin! Ihr seid Besucher Nr. 1.
docker compose down -v && git checkout Dockerfile compose.yaml
```

`.gitattributes` erzwingt LF für Skripte und Dockerfiles, sonst scheitern sie nach einem Checkout unter Windows im Container.

## Vorschau für Pull Requests

Jeder offene Pull Request aus diesem Repo bekommt auf GitHub Pages eine Vorschau unter `https://feo2x.github.io/docker-fundamentals-workshop/pr/<nummer>/`. Der Link steht als Kommentar im PR. Die Vorschau wird bei jedem Push neu gebaut und verschwindet, sobald der PR geschlossen ist. PRs aus Forks bekommen keine Vorschau.

`Docker.md` enthält das ursprüngliche Brainstorming zu den Inhalten.
