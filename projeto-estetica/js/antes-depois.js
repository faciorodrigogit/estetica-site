/*
 * Seção "Antes e depois": comparador com divisória e lupa.
 * Lê os casos de window.CASOS_ANTES_DEPOIS (config/casos-antes-depois.js)
 * e o modo de window.SITE_MODE (config/site-mode.js).
 * As imagens nunca são alteradas por CSS ou JS: aparecem como foram enviadas.
 */
(function () {
  "use strict";

  /* ---------- Modo e diagnóstico ---------- */
  var MODE = String(window.SITE_MODE || "producao").toLowerCase();
  var host = location.hostname;
  var DEV = MODE !== "producao" || location.protocol === "file:" ||
            host === "localhost" || host === "127.0.0.1" || /\.local$/.test(host);
  function log(msg) { if (DEV) console.info("[antes-depois] " + msg); }
  function warn(msg) { if (DEV) console.warn("[antes-depois] " + msg); }

  /* ---------- Textos fixos por tipo ---------- */
  var TIPOS = {
    caso_real: {
      labels: ["Antes", "Depois"],
      nota: "Caso real, publicado com autorização. Os resultados variam de pessoa para pessoa.",
      botao: "Agendar avaliação"
    },
    exame_uv: {
      labels: ["Luz visível", "Luz UV"],
      tituloPadrao: "O que a sua pele esconde",
      nota: "Comparação entre fotos da mesma pessoa em luzes diferentes. Não representa o resultado de um tratamento.",
      botao: "Agendar avaliação"
    },
    simulacao: {
      labels: ["Simulação A", "Simulação B"],
      selo: "Simulação ilustrativa criada com IA",
      nota: "Imagem de demonstração. Não representa um paciente nem o resultado de um tratamento.",
      botao: "Ver como funciona",
      href: "#como-funciona"
    }
  };

  /* ---------- Validação ---------- */
  function txt(v) { return typeof v === "string" && v.trim() !== ""; }
  function data(v) {
    if (!txt(v) || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return null;
    var p = v.split("-").map(Number), d = new Date(p[0], p[1] - 1, p[2]);
    return (d.getFullYear() === p[0] && d.getMonth() === p[1] - 1 && d.getDate() === p[2]) ? d : null;
  }
  function pastaOk(caminho, id) {
    return txt(caminho) && caminho.indexOf("public/antes-depois/" + id + "/") === 0 && !/^[a-z]+:\/\//i.test(caminho);
  }

  function motivosBloqueio(c, ids) {
    var m = [];
    if (!c || typeof c !== "object") return ["entrada inválida na lista"];
    if (!txt(c.id)) m.push("sem id");
    else if (ids[c.id]) m.push("id repetido");
    if (!TIPOS[c.tipo]) { m.push('tipo inválido ("' + c.tipo + '"); use caso_real, exame_uv ou simulacao'); return m; }

    ["imagemA", "imagemB"].forEach(function (k) {
      var im = c[k];
      if (!im || !txt(im.normal) || !txt(im.alta)) m.push(k + " precisa de { normal, alta }");
      else if (txt(c.id) && (!pastaOk(im.normal, c.id) || !pastaOk(im.alta, c.id)))
        m.push(k + " fora da pasta public/antes-depois/" + c.id + "/");
    });
    if (!txt(c.altA)) m.push("sem altA");
    if (!txt(c.altB)) m.push("sem altB");
    if (c.tipo !== "exame_uv" && !txt(c.titulo)) m.push("sem titulo");
    if (!txt(c.descricao)) m.push("sem descricao");
    if (c.proporcao !== undefined && !/^\d+(\.\d+)?\s*\/\s*\d+(\.\d+)?$/.test(String(c.proporcao)))
      m.push('proporcao inválida (use, por exemplo, "4/5")');

    if ((c.tipo === "caso_real" || c.tipo === "exame_uv") && c.autorizacaoAssinada !== true)
      m.push("autorizacaoAssinada não é true");

    if (c.tipo === "caso_real") {
      var a = data(c.dataAntes), d = data(c.dataDepois);
      if (!a) m.push("dataAntes ausente ou inválida (use AAAA-MM-DD)");
      if (!d) m.push("dataDepois ausente ou inválida (use AAAA-MM-DD)");
      if (a && d && d <= a) m.push("dataDepois precisa ser posterior a dataAntes");
      if (!(typeof c.numeroSessoes === "number" && Number.isInteger(c.numeroSessoes) && c.numeroSessoes > 0))
        m.push("numeroSessoes ausente ou inválido");
    }

    if (c.tipo === "simulacao" && MODE !== "demo")
      m.push('simulação só aparece com SITE_MODE = "demo" (modo atual: "' + MODE + '")');
    return m;
  }

  /* ---------- Elementos ---------- */
  var section = document.getElementById("resultados");
  if (!section) return;
  var $ = function (id) { return document.getElementById(id); };
  var tabsEl = $("baTabs"), stage = $("ba"), handle = $("baHandle"), imgA = $("baImgA"), imgB = $("baImgB"),
      labelA = $("baLabelA"), labelB = $("baLabelB"), badge = $("baBadge"), hint = $("baHint"),
      lens = $("baLens"), lensA = $("baLensA"), lensB = $("baLensB"), lensLine = $("baLensLine"),
      info = $("baInfo"), meta = $("baMeta"), cta = $("baCta");

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Casos válidos ---------- */
  var lista = Array.isArray(window.CASOS_ANTES_DEPOIS) ? window.CASOS_ANTES_DEPOIS : [];
  if (!Array.isArray(window.CASOS_ANTES_DEPOIS)) warn("window.CASOS_ANTES_DEPOIS não é uma lista; a seção ficará oculta.");
  var ids = {}, casos = [];
  lista.forEach(function (c, i) {
    var m = motivosBloqueio(c, ids);
    var nome = (c && txt(c.id)) ? '"' + c.id + '"' : "#" + (i + 1);
    if (c && txt(c.id)) ids[c.id] = true;
    if (m.length) warn("caso " + nome + " bloqueado: " + m.join("; ") + ".");
    else casos.push(c);
  });
  log(casos.length + " de " + lista.length + " caso(s) válido(s). Modo: " + MODE + ".");

  function setVisivel(on) {
    section.hidden = !on;
    document.querySelectorAll('[data-section-link="resultados"]').forEach(function (el) {
      var alvo = el.closest("li") || el;
      alvo.hidden = !on;
      if (!on) alvo.style.display = "none"; else alvo.style.display = "";
    });
  }
  if (!casos.length) { setVisivel(false); return; }
  setVisivel(true);

  /* ---------- Estado e atualização por frame ---------- */
  var atual = -1, pos = 50, raf = 0, pend = { pos: false, lens: null };
  function agendar() { if (!raf) raf = requestAnimationFrame(flush); }
  function flush() {
    raf = 0;
    if (pend.pos) {
      pend.pos = false;
      stage.style.setProperty("--pos", pos + "%");
      var v = Math.round(pos), c = casos[atual], t = TIPOS[c.tipo].labels;
      handle.setAttribute("aria-valuenow", v);
      handle.setAttribute("aria-valuetext", v + "%: " + t[0] + " à esquerda, " + t[1] + " à direita");
    }
    if (pend.lens) { desenharLupa(pend.lens); pend.lens = null; }
  }
  function setPos(v) { pos = Math.max(0, Math.min(100, v)); pend.pos = true; agendar(); }

  /* ---------- Abas ---------- */
  function montarAbas() {
    tabsEl.innerHTML = "";
    casos.forEach(function (c, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "ba-tab"; b.id = "ba-tab-" + i;
      b.setAttribute("role", "tab"); b.setAttribute("aria-controls", "baInfo");
      b.textContent = c.tipo === "exame_uv" && !txt(c.titulo) ? TIPOS.exame_uv.tituloPadrao : c.titulo;
      b.addEventListener("click", function () { mostrar(i, true); });
      tabsEl.appendChild(b);
    });
    tabsEl.hidden = casos.length < 2;
  }
  montarAbas();
  tabsEl.addEventListener("keydown", function (e) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    var n = (atual + (e.key === "ArrowRight" ? 1 : -1) + casos.length) % casos.length;
    tabsEl.children[n].focus(); mostrar(n, true);
  });

  function fmt(s) { var d = data(s); return ("0" + d.getDate()).slice(-2) + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear(); }

  /* ---------- Exibir um caso ---------- */
  var token = 0;
  function mostrar(i, animar) {
    var c = casos[i], t = TIPOS[c.tipo], meu = ++token;
    atual = i;
    Array.prototype.forEach.call(tabsEl.children, function (b, k) {
      b.setAttribute("aria-selected", k === i ? "true" : "false"); b.tabIndex = k === i ? 0 : -1;
    });
    info.setAttribute("aria-labelledby", tabsEl.hidden ? "baTitle" : "ba-tab-" + i);

    function aplicar() {
      if (meu !== token) return;
      stage.style.setProperty("--ratio", String(c.proporcao || "4/5").replace(/\s/g, ""));
      carregarImagens(c, i);
      labelA.textContent = t.labels[0]; labelB.textContent = t.labels[1];
      handle.setAttribute("aria-label", "Divisória entre " + t.labels[0] + " e " + t.labels[1]);
      if (t.selo) { badge.innerHTML = '<i data-lucide="sparkles"></i>' + t.selo; badge.hidden = false; }
      else { badge.hidden = true; badge.textContent = ""; }

      $("baTitle").textContent = txt(c.titulo) ? c.titulo : (t.tituloPadrao || "");
      $("baDesc").textContent = c.descricao;
      if (c.tipo === "caso_real") {
        $("baDataA").textContent = fmt(c.dataAntes);
        $("baDataB").textContent = fmt(c.dataDepois);
        $("baSessoes").textContent = String(c.numeroSessoes);
        meta.hidden = false;
      } else meta.hidden = true;

      $("baCtaText").textContent = t.botao;
      $("baNote").textContent = t.nota;
      cta.removeAttribute("target"); cta.removeAttribute("rel");
      if (t.href) cta.href = t.href;
      else {
        var msg = "Olá! Vi a seção de antes e depois do site (" + ($("baTitle").textContent) + ") e gostaria de agendar uma avaliação.";
        cta.href = window.waLink ? window.waLink(msg) : "#contato";
        if (window.waLink) { cta.target = "_blank"; cta.rel = "noopener"; }
      }
      if (window.lucide) window.lucide.createIcons();
      setPos(50);
      esconderLupa();
      info.classList.remove("out");
    }
    if (animar && !reduce) { info.classList.add("out"); setTimeout(aplicar, 180); } else aplicar();
  }

  /* ---------- Imagens (sem filtros) ---------- */
  function carregarImagens(c, i) {
    c._alta = c._alta || { A: false, B: false, pedido: false };
    var prontas = 0, falhou = false;
    function ok() {
      if (++prontas < 2) return;
      if (imgA.naturalWidth !== imgB.naturalWidth || imgA.naturalHeight !== imgB.naturalHeight)
        warn('caso "' + c.id + '": as imagens têm dimensões diferentes (A ' + imgA.naturalWidth + "×" + imgA.naturalHeight +
             ", B " + imgB.naturalWidth + "×" + imgB.naturalHeight + "). Use o mesmo tamanho e enquadramento.");
    }
    function erro(qual) {
      if (falhou) return; falhou = true;
      warn('caso "' + c.id + '" removido: não foi possível carregar a imagem ' + qual + ".");
      remover(i);
    }
    [[imgA, c.imagemA, c.altA, "A"], [imgB, c.imagemB, c.altB, "B"]].forEach(function (x) {
      var el = x[0];
      el.onload = ok; el.onerror = function () { erro(x[3] + " (" + x[1].normal + ")"); };
      el.alt = x[2];
      el.src = x[1].normal;
    });
    lensA.style.backgroundImage = 'url("' + (c._alta.A ? c.imagemA.alta : c.imagemA.normal) + '")';
    lensB.style.backgroundImage = 'url("' + (c._alta.B ? c.imagemB.alta : c.imagemB.normal) + '")';
  }

  function remover(i) {
    casos.splice(i, 1);
    if (!casos.length) { warn("nenhum caso restante; seção oculta."); setVisivel(false); return; }
    montarAbas();
    mostrar(Math.min(i, casos.length - 1), false);
  }

  function carregarAlta() {
    var c = casos[atual];
    if (!c || c._alta.pedido) return;
    c._alta.pedido = true;
    [["A", lensA], ["B", lensB]].forEach(function (x) {
      var src = c["imagem" + x[0]].alta, im = new Image();
      im.onload = function () {
        c._alta[x[0]] = true;
        if (casos[atual] === c) x[1].style.backgroundImage = 'url("' + src + '")';
      };
      im.onerror = function () { warn('caso "' + c.id + '": versão de alta resolução não encontrada (' + src + "). A lupa usará a versão normal."); };
      im.src = src;
    });
  }

  /* ---------- Lupa ---------- */
  var ZOOM = 3, lupaAtiva = false;
  function mostrarLupa(clientX, clientY, toque) {
    var r = stage.getBoundingClientRect();
    var cx = clientX - r.left, cy = clientY - r.top;
    if (cx < 0 || cy < 0 || cx > r.width || cy > r.height) { esconderLupa(); return; }
    carregarAlta();
    pend.lens = { cx: cx, cy: cy, w: r.width, h: r.height, toque: toque };
    agendar();
    if (!lupaAtiva) { lupaAtiva = true; lens.classList.add("on"); usouLupa(); }
  }
  function esconderLupa() { lupaAtiva = false; pend.lens = null; lens.classList.remove("on"); }

  function camada(el, img, s) {
    var nw = img.naturalWidth || s.w, nh = img.naturalHeight || s.h;
    var k = Math.max(s.w / nw, s.h / nh), dw = nw * k, dh = nh * k;
    var ox = (s.w - dw) / 2, oy = (s.h - dh) / 2, L = lens.offsetWidth;
    el.style.backgroundSize = (dw * ZOOM) + "px " + (dh * ZOOM) + "px";
    el.style.backgroundPosition = (L / 2 - (s.cx - ox) * ZOOM) + "px " + (L / 2 - (s.cy - oy) * ZOOM) + "px";
  }
  function desenharLupa(s) {
    if (!lupaAtiva) return;
    var L = lens.offsetWidth, x = s.cx - L / 2, y = s.cy - L / 2;
    if (s.toque) {
      y = s.cy - L - 32;                       // acima do dedo
      if (y < -L * 0.5) y = s.cy + 40;         // sem espaço acima: abaixo
    }
    x = Math.max(-L * 0.25, Math.min(s.w - L * 0.75, x));
    lens.style.left = x + "px"; lens.style.top = y + "px";
    camada(lensA, imgA, s); camada(lensB, imgB, s);
    // divisória dentro da lupa: o lado esquerdo mostra A e o direito mostra B
    var lx = L / 2 + ((pos / 100) * s.w - s.cx) * ZOOM;
    var cl = Math.max(0, Math.min(L, lx));
    lensB.style.clipPath = "inset(0 0 0 " + cl + "px)";
    lensLine.style.left = cl + "px";
    lensLine.style.display = (lx <= 0 || lx >= L) ? "none" : "";
  }

  /* ---------- Dica ---------- */
  var CHAVE = "lumina-lupa-usada", jaUsou = false;
  try { jaUsou = localStorage.getItem(CHAVE) === "1"; } catch (e) {}
  if (!jaUsou) {
    hint.innerHTML = '<i data-lucide="zoom-in"></i>' + (finePointer ? "Passe o cursor para ver de perto" : "Toque e segure para ver de perto");
    hint.hidden = false;
  }
  function usouLupa() {
    if (jaUsou) return;
    jaUsou = true; hint.hidden = true;
    try { localStorage.setItem(CHAVE, "1"); } catch (e) {}
  }

  /* ---------- Animação de apresentação ---------- */
  var intro = { feita: false, raf: 0 };
  function pararIntro() { intro.feita = true; if (intro.raf) cancelAnimationFrame(intro.raf); intro.raf = 0; }
  function rodarIntro() {
    if (intro.feita || reduce) return;
    intro.feita = true;
    var etapas = [[50, 35, 700], [35, 65, 1000], [65, 50, 700]], e = 0, t0 = null;
    function ease(t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
    function passo(ts) {
      if (t0 === null) t0 = ts;
      var et = etapas[e], p = Math.min(1, (ts - t0) / et[2]);
      setPos(et[0] + (et[1] - et[0]) * ease(p));
      if (p >= 1) { e++; t0 = ts; if (e >= etapas.length) { intro.raf = 0; return; } }
      intro.raf = requestAnimationFrame(passo);
    }
    intro.raf = requestAnimationFrame(passo);
  }
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { io.disconnect(); setTimeout(rodarIntro, 250); }
    }, { threshold: 0.55 });
    io.observe(stage);
  }

  /* ---------- Ponteiro: mouse, toque e caneta ---------- */
  var g = null; // gesto em andamento
  function xParaPos(clientX) { var r = stage.getBoundingClientRect(); return (clientX - r.left) / r.width * 100; }

  stage.addEventListener("pointerdown", function (e) {
    pararIntro();
    if (e.pointerType === "mouse" && e.button !== 0) return;
    g = { id: e.pointerId, tipo: e.pointerType, x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY, modo: "espera", t: 0 };
    if (e.pointerType !== "touch") {
      g.modo = "arraste";
      esconderLupa();
      stage.setPointerCapture(e.pointerId);
      stage.classList.add("dragging");
      setPos(xParaPos(e.clientX));
      e.preventDefault();
    } else {
      var este = g;
      g.t = setTimeout(function () {
        if (g === este && este.modo === "espera") { este.modo = "lupa"; mostrarLupa(este.x, este.y, true); }
      }, 300);
    }
  });

  stage.addEventListener("pointermove", function (e) {
    if (!g || e.pointerId !== g.id) {
      if (e.pointerType !== "touch") mostrarLupa(e.clientX, e.clientY, false); // hover
      return;
    }
    g.x = e.clientX; g.y = e.clientY;
    if (g.modo === "arraste") setPos(xParaPos(e.clientX));
    else if (g.modo === "lupa") mostrarLupa(e.clientX, e.clientY, true);
    else {
      var dx = e.clientX - g.x0, dy = e.clientY - g.y0;
      if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
        clearTimeout(g.t); g.modo = "arraste";
        try { stage.setPointerCapture(e.pointerId); } catch (err) {}
        stage.classList.add("dragging");
        setPos(xParaPos(e.clientX));
      } else if (Math.abs(dy) > 8) { clearTimeout(g.t); g = null; } // rolagem vertical: o navegador assume
    }
  });

  function fim(e) {
    if (!g || e.pointerId !== g.id) return;
    clearTimeout(g.t);
    var era = g.modo, tipo = g.tipo;
    g = null;
    stage.classList.remove("dragging");
    if (era === "lupa") esconderLupa();
    else if (era === "espera" && e.type === "pointerup") setPos(xParaPos(e.clientX)); // toque rápido
    else if (era === "arraste" && tipo !== "touch" && e.type === "pointerup") mostrarLupa(e.clientX, e.clientY, false);
  }
  stage.addEventListener("pointerup", fim);
  stage.addEventListener("pointercancel", fim);
  stage.addEventListener("pointerleave", function (e) { if (e.pointerType !== "touch" && !g) esconderLupa(); });
  stage.addEventListener("contextmenu", function (e) { e.preventDefault(); });
  // Enquanto a lupa ou o arraste estão ativos no toque, a página não rola.
  stage.addEventListener("touchmove", function (e) {
    if (g && (g.modo === "lupa" || g.modo === "arraste")) e.preventDefault();
  }, { passive: false });

  /* ---------- Teclado ---------- */
  handle.addEventListener("keydown", function (e) {
    var passo = e.shiftKey ? 10 : 5, n = null;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") n = pos - passo;
    else if (e.key === "ArrowRight" || e.key === "ArrowUp") n = pos + passo;
    else if (e.key === "PageDown") n = pos - 10;
    else if (e.key === "PageUp") n = pos + 10;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = 100;
    if (n === null) return;
    e.preventDefault(); pararIntro(); setPos(n);
  });
  handle.addEventListener("focus", pararIntro);

  window.addEventListener("resize", esconderLupa, { passive: true });

  mostrar(0, false);
})();
