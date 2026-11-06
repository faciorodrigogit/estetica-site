/*
 * Stories de demonstração (seção "Quem já passou por aqui").
 * Só aparece com SITE_MODE = "demo".
 * Controles: tocar à direita avança, à esquerda volta, segurar pausa,
 * arrastar para os lados troca, botão de pausa, setas do teclado.
 */
(function () {
  "use strict";
  var sec = document.getElementById("ugc"), cfg = window.UGC_DEMO;
  var mode = String(window.SITE_MODE || "producao").toLowerCase();
  if (!sec) return;
  var lista = cfg && Array.isArray(cfg.stories) ? cfg.stories.filter(function (s) { return s && s.imagem; }) : [];
  if (mode !== "demo" || !lista.length) { sec.hidden = true; return; }

  var $ = function (id) { return document.getElementById(id); };
  var card = $("story"), media = $("storyMedia"), bars = $("storyBars"), quote = $("ugcQuote"),
      time = $("storyTime"), toggle = $("storyToggle"), btnPrev = $("storyPrev"), btnNext = $("storyNext"),
      pausedTag = $("storyPaused");
  var DUR = Math.max(2000, Number(cfg.duracao) || 5000);
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  $("ugcUser").textContent = cfg.usuario || "";
  $("ugcName").textContent = (cfg.nome ? cfg.nome + " · " : "") + "personagem de exemplo";
  $("storyAvatar").src = lista[0].imagem;

  /* Monta imagens e barras */
  var imgs = [], fills = [];
  lista.forEach(function (s, i) {
    var im = document.createElement("img");
    im.className = "story-img"; im.alt = s.alt || ""; im.decoding = "async"; im.draggable = false;
    if (i === 0) im.src = s.imagem; else im.dataset.src = s.imagem;
    im.onerror = function () { console.warn("[stories] imagem não encontrada: " + s.imagem); };
    media.appendChild(im); imgs.push(im);
    var b = document.createElement("span"), f = document.createElement("i");
    b.appendChild(f); bars.appendChild(b); fills.push(f);
  });
  imgs[0].onload = function () { sec.hidden = false; };
  imgs[0].addEventListener("error", function () { sec.hidden = true; });

  function carregar(i) { var im = imgs[i]; if (im && !im.src && im.dataset.src) im.src = im.dataset.src; }

  /* Estado */
  var idx = 0, elapsed = 0, last = null, raf = 0;
  var playing = !reduce, visivel = false, segurando = false;

  function rodando() { return playing && visivel && !segurando && !document.hidden; }

  function mostrar(i) {
    idx = (i + lista.length) % lista.length;
    elapsed = 0; last = null;
    carregar(idx); carregar(idx + 1);
    imgs.forEach(function (im, k) { im.classList.toggle("on", k === idx); im.setAttribute("aria-hidden", k === idx ? "false" : "true"); });
    fills.forEach(function (f, k) { f.style.transform = "scaleX(" + (k < idx ? 1 : (k === idx && !playing ? 1 : 0)) + ")"; });
    quote.textContent = lista[idx].legenda || "";
    time.textContent = lista[idx].tempo || "";
    card.setAttribute("aria-label", "Story " + (idx + 1) + " de " + lista.length + " de " + (cfg.usuario || "exemplo"));
  }
  function proximo() { mostrar(idx + 1); }
  function anterior() { mostrar(idx - 1); }

  function setPlaying(v) {
    playing = v; last = null;
    toggle.setAttribute("aria-label", v ? "Pausar stories" : "Reproduzir stories");
    toggle.setAttribute("aria-pressed", v ? "false" : "true");
    toggle.innerHTML = '<i data-lucide="' + (v ? "pause" : "play") + '"></i>';
    if (window.lucide) window.lucide.createIcons();
    if (!v) fills[idx].style.transform = "scaleX(1)";
    else { elapsed = 0; fills[idx].style.transform = "scaleX(0)"; }
  }

  function tick(t) {
    raf = requestAnimationFrame(tick);
    if (!rodando()) { last = null; return; }
    if (last === null) last = t;
    elapsed += t - last; last = t;
    var p = Math.min(1, elapsed / DUR);
    fills[idx].style.transform = "scaleX(" + p + ")";
    if (p >= 1) proximo();
  }

  /* Toque, clique, segurar e arrastar */
  var g = null, ignorarClique = false;
  card.addEventListener("pointerdown", function (e) {
    if (e.target.closest(".story-toggle")) return;
    g = { x: e.clientX, y: e.clientY, t: setTimeout(function () {
      segurando = true; pausedTag.hidden = false; ignorarClique = true;
    }, 220) };
  });
  function soltar(e) {
    if (!g) return;
    clearTimeout(g.t);
    var dx = e.clientX - g.x, dy = e.clientY - g.y;
    if (e.type === "pointerup" && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      ignorarClique = true; dx < 0 ? proximo() : anterior();
    }
    if (segurando) { segurando = false; pausedTag.hidden = true; last = null; }
    g = null;
  }
  card.addEventListener("pointerup", soltar);
  card.addEventListener("pointercancel", soltar);
  card.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse") soltar(e); });
  card.addEventListener("contextmenu", function (e) { e.preventDefault(); });

  btnNext.addEventListener("click", function (e) { if (ignorarClique) { ignorarClique = false; return; } proximo(); });
  btnPrev.addEventListener("click", function (e) { if (ignorarClique) { ignorarClique = false; return; } anterior(); });
  toggle.addEventListener("click", function () { setPlaying(!playing); });
  // limpa o bloqueio de clique caso o gesto não termine num botão
  document.addEventListener("click", function () { setTimeout(function () { ignorarClique = false; }, 0); }, true);

  card.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { e.preventDefault(); proximo(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); anterior(); }
  });

  /* Só roda quando visível na tela */
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { visivel = en[0].isIntersecting; last = null; }, { threshold: 0.5 }).observe(card);
  } else visivel = true;
  document.addEventListener("visibilitychange", function () { last = null; });

  setPlaying(playing);
  mostrar(0);
  raf = requestAnimationFrame(tick);
})();
