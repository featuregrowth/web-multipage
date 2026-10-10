#!/usr/bin/env bash
# ==========================================================================
#  Feature Growth · Previsualización local del sitio
#  Levanta un servidor local y abre el navegador en la portada.
#  Uso:  ./ver-sitio.sh           (puerto por defecto 8000)
#        ./ver-sitio.sh 8080      (elegís el puerto)
#  Detener: Ctrl + C
# ==========================================================================
set -e

PORT="${1:-8000}"
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

URL="http://localhost:${PORT}/"

echo "Sirviendo el sitio en ${URL}"
echo "Presioná Ctrl + C para detenerlo."

# Abre el navegador un segundo después de levantar el servidor.
(
  sleep 1
  if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$URL" >/dev/null 2>&1 || true
  elif command -v open >/dev/null 2>&1; then
    open "$URL" >/dev/null 2>&1 || true
  fi
) &

exec python3 -m http.server "$PORT"
