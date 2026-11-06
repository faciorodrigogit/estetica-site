/* Exibe a seção de UGC fictícia apenas no modo demo. */
(function () {
  "use strict";
  var sec = document.getElementById("ugc"), cfg = window.UGC_DEMO;
  var mode = String(window.SITE_MODE || "producao").toLowerCase();
  if (!sec) return;
  if (mode !== "demo" || !cfg || !cfg.imagem) { sec.hidden = true; return; }
  var img = document.getElementById("ugcImg");
  img.onload = function () { sec.hidden = false; };
  img.onerror = function () { sec.hidden = true; console.warn("[ugc] imagem não encontrada: " + cfg.imagem); };
  img.alt = cfg.alt || "";
  document.getElementById("ugcUser").textContent = cfg.usuario || "";
  document.getElementById("ugcQuote").textContent = cfg.citacao || "";
  document.getElementById("ugcName").textContent = (cfg.nome ? cfg.nome + " · " : "") + "personagem de exemplo";
  img.src = cfg.imagem;
})();
