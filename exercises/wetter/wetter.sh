#!/bin/sh
# Zeigt das aktuelle Wetter für eine Stadt: wetter.sh <Stadt>
# Die Einheit kommt aus der Umgebungsvariable EINHEIT: celsius (Standard) oder fahrenheit.
set -eu

if [ $# -eq 0 ]; then
  echo "Aufruf: wetter.sh <Stadt>" >&2
  exit 1
fi

stadt="$*"
einheit="${EINHEIT:-celsius}"

# Die Stadt in Koordinaten übersetzen (Open-Meteo, ohne API-Schlüssel).
name=$(jq -rn --arg stadt "$stadt" '$stadt | @uri')
ort=$(curl -fsS "https://geocoding-api.open-meteo.com/v1/search?count=1&language=de&name=$name")

if [ "$(echo "$ort" | jq '.results | length')" = "0" ]; then
  echo "Stadt nicht gefunden: $stadt" >&2
  exit 1
fi

breite=$(echo "$ort" | jq -r '.results[0].latitude')
laenge=$(echo "$ort" | jq -r '.results[0].longitude')
anzeigename=$(echo "$ort" | jq -r '.results[0].name')

# Das aktuelle Wetter an diesen Koordinaten abfragen.
wetter=$(curl -fsS "https://api.open-meteo.com/v1/forecast?latitude=$breite&longitude=$laenge&current=temperature_2m,wind_speed_10m&temperature_unit=$einheit")

echo "$wetter" | jq -r --arg ort "$anzeigename" \
  '"\($ort): \(.current.temperature_2m) \(.current_units.temperature_2m), Wind \(.current.wind_speed_10m) \(.current_units.wind_speed_10m)"'
