/*
 * CASOS DA SEÇÃO "ANTES E DEPOIS"
 * ------------------------------------------------------------------
 * A lista começa vazia de propósito. Enquanto não houver caso válido,
 * a seção fica oculta no site (sem espaço vazio e sem imagem quebrada).
 *
 * Regras (verificadas automaticamente em js/antes-depois.js):
 *  - "caso_real" e "exame_uv" só aparecem com autorizacaoAssinada: true.
 *  - "caso_real" exige dataAntes, dataDepois (AAAA-MM-DD, depois > antes)
 *    e numeroSessoes (número inteiro maior que zero).
 *  - "simulacao" só aparece quando SITE_MODE = "demo" (config/site-mode.js).
 *  - As imagens precisam estar em public/antes-depois/<id-do-caso>/.
 *  - Nunca invente pacientes, datas, números ou resultados.
 *
 * Imagens de cada caso (WebP, mesmo enquadramento e mesmas dimensões):
 *   public/antes-depois/<id>/a-1200.webp   ← imagem A, versão normal (~1200 px)
 *   public/antes-depois/<id>/a-2400.webp   ← imagem A, alta resolução (~2400 px, usada na lupa)
 *   public/antes-depois/<id>/b-1200.webp   ← imagem B, versão normal
 *   public/antes-depois/<id>/b-2400.webp   ← imagem B, alta resolução
 *
 * Campo opcional:
 *   proporcao: "4/5"  → proporção do quadro (largura/altura). Padrão: "4/5".
 *                       Use a mesma proporção das fotos para não haver corte.
 *
 * Para publicar um caso: copie o exemplo do tipo certo, tire os comentários
 * (/* e *\/) e preencha com os dados reais.
 */
window.CASOS_ANTES_DEPOIS = [

  /* Caso de demonstração: par de imagens geradas por IA (Midjourney), personagem fictícia.
     Não é paciente nem resultado de tratamento. Só aparece com SITE_MODE = "demo".
     Remova quando tiver casos reais. */
  {
    id: "simulacao-01",
    tipo: "simulacao",
    imagemA: { normal: "public/antes-depois/simulacao-01/a-1200.webp", alta: "public/antes-depois/simulacao-01/a-2400.webp" },
    imagemB: { normal: "public/antes-depois/simulacao-01/b-1200.webp", alta: "public/antes-depois/simulacao-01/b-2400.webp" },
    altA: "Personagem fictícia gerada por IA, com manchas, poros aparentes e tom de pele irregular",
    altB: "A mesma personagem fictícia com a pele uniforme e com viço",
    titulo: "Manchas e textura",
    descricao: "Demonstração de como o comparador apresenta um tratamento de manchas e textura da pele. Arraste a divisória ou use a lupa para ver os detalhes.",
    proporcao: "4/5"
  },

  /* ===== Exemplo: caso_real =====
  {
    id: "caso-01",
    tipo: "caso_real",
    imagemA: { normal: "public/antes-depois/caso-01/a-1200.webp", alta: "public/antes-depois/caso-01/a-2400.webp" },
    imagemB: { normal: "public/antes-depois/caso-01/b-1200.webp", alta: "public/antes-depois/caso-01/b-2400.webp" },
    altA: "Descreva a foto de antes (ex.: rosto de frente, luz neutra, antes do tratamento)",
    altB: "Descreva a foto de depois",
    titulo: "Nome do tratamento",
    descricao: "O que foi feito, em uma ou duas frases.",
    proporcao: "4/5",
    dataAntes: "AAAA-MM-DD",
    dataDepois: "AAAA-MM-DD",
    numeroSessoes: 0,
    autorizacaoAssinada: false
  },
  */

  /* ===== Exemplo: exame_uv =====
  {
    id: "uv-01",
    tipo: "exame_uv",
    imagemA: { normal: "public/antes-depois/uv-01/a-1200.webp", alta: "public/antes-depois/uv-01/a-2400.webp" },
    imagemB: { normal: "public/antes-depois/uv-01/b-1200.webp", alta: "public/antes-depois/uv-01/b-2400.webp" },
    altA: "Rosto fotografado com luz visível",
    altB: "O mesmo rosto fotografado com luz UV",
    titulo: "",                       // vazio = "O que a sua pele esconde"
    descricao: "O que o exame com luz UV mostra, em uma ou duas frases.",
    proporcao: "4/5",
    autorizacaoAssinada: false
  },
  */

  /* ===== Exemplo: simulacao (só aparece com SITE_MODE = "demo") =====
  {
    id: "simulacao-01",
    tipo: "simulacao",
    imagemA: { normal: "public/antes-depois/simulacao-01/a-1200.webp", alta: "public/antes-depois/simulacao-01/a-2400.webp" },
    imagemB: { normal: "public/antes-depois/simulacao-01/b-1200.webp", alta: "public/antes-depois/simulacao-01/b-2400.webp" },
    altA: "Imagem de demonstração A, criada com IA",
    altB: "Imagem de demonstração B, criada com IA",
    titulo: "Demonstração do comparador",
    descricao: "Exemplo de como os casos aparecem nesta seção.",
    proporcao: "4/5"
  },
  */

];
