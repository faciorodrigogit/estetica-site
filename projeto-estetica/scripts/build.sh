#!/usr/bin/env sh
# Build do site estático.
# 1) Valida SITE_MODE e grava config/site-mode.js
# 2) Copia só os arquivos públicos para dist/ (a pasta publicada na Render)
set -eu

MODE="${SITE_MODE:-producao}"
case "$MODE" in
  producao|demo|desenvolvimento) ;;
  *) echo "Erro: SITE_MODE inválido: \"$MODE\". Use producao, demo ou desenvolvimento." >&2; exit 1 ;;
esac

rm -rf dist
mkdir -p dist
cp index.html dist/
cp -R js config public dist/
rm -f dist/public/antes-depois/LEIA-ME.md

printf '/* Gerado no build a partir da variável SITE_MODE. */\nwindow.SITE_MODE = "%s";\n' "$MODE" > dist/config/site-mode.js

echo "Build concluído. SITE_MODE=$MODE"
