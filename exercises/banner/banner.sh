#!/bin/sh
# Schreibt den übergebenen Text als großes Banner. Die Schriftart kommt aus SCHRIFT.
exec figlet -f "$SCHRIFT" "$@"
