Anforderungen:

* `docker run` und `docker exec`

---

Konzepte

* Docker Image / Container
* Registry
* Image bauen via Dockerfile

---

Recap `docker run`, `docker pull`, `docker exec`

* `docker image` (`ls` usw.)

Hier als Beispiel irgendein bestehendes Image mal benutzen.

* `docker ps`

* `docker stop`
* `docker logs` (-n -f)

---

Dockerfile schreiben.

* Basics, `RUN`, `FROM`, `ENTRYPOINT`, `ENV`
  * wie man Befehle über mehrere Zeilen gestalten kann (z.B. `apt-get install ...`)
* Layering und Caching
* `docker build` mit Tag(s)
* `docker push`

---

Beispiel für ein Dockerfile auf Basis von NukeExtensions

* Zeigt Basics im konkreten Beispiel
* Labels
* ...

---

Multi-Stage-Build

* Warum?
* Letzte Stage ist entscheidend

---



Docker Volumes müssen noch irgendwo mit rein

...

---

Themen, die wir kurz anschneiden könnten:

* Docker Compose
* Docker Networks
* `FROM scratch`
* Health Checks
* Multi-Arch (mit lokaler Emulation)
* Base-Image-Auswahl, Alpine vs. Debian/Ubuntu