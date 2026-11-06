/*
 * Modo do site.
 *
 *   "producao"        → site publicado. Casos do tipo "simulacao" NUNCA aparecem.
 *   "demo"            → amostra de portfólio. Casos "simulacao" podem aparecer.
 *   "desenvolvimento" → como produção, mas com mensagens de diagnóstico no console.
 *
 * Como o site é estático (HTML + CSS + JS, sem build), esta é a "variável de
 * ambiente" SITE_MODE. Se a hospedagem tiver etapa de build (Netlify, Vercel,
 * Cloudflare Pages), gere este arquivo a partir da variável real, por exemplo:
 *
 *   echo "window.SITE_MODE = \"$SITE_MODE\";" > config/site-mode.js
 *
 * Se este arquivo não carregar, o site assume "producao" (o modo mais seguro).
 */
window.SITE_MODE = "demo";
