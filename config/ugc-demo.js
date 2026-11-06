/*
 * Seção "Quem já passou por aqui" (stories) — SOMENTE PARA DEMONSTRAÇÃO.
 * Personagem fictícia criada com IA, para a cliente visualizar o layout.
 * Só aparece com SITE_MODE = "demo" e sempre com o selo "Personagem fictícia".
 *
 * Imagens: public/ugc/story-N.webp, vertical 9:16 (ex.: 1080 × 1920 px).
 * Para usar com pacientes reais: conteúdo real, com autorização por escrito,
 * e ajuste o código da seção (hoje ela é bloqueada fora do modo demo).
 */
window.UGC_DEMO = {
  usuario: "@ana.exemplo",
  nome: "Ana",
  duracao: 5000, // tempo de cada story, em milissegundos
  stories: [
    {
      imagem: "public/ugc/story-1.webp",
      alt: "Personagem fictícia sorrindo em uma selfie perto da janela",
      tempo: "há 2 h",
      legenda: "Primeira consulta feita! Saí com um plano todo pensado para a minha pele."
    },
    {
      imagem: "public/ugc/story-2.webp",
      alt: "Personagem fictícia sorrindo enquanto se filma com o celular",
      tempo: "há 2 h",
      legenda: "Atendimento muito acolhedor. Tiraram todas as minhas dúvidas antes de começar."
    },
    {
      imagem: "public/ugc/story-3.webp",
      alt: "Personagem fictícia de suéter claro sorrindo em casa",
      tempo: "há 1 h",
      legenda: "A rotina de cuidados em casa que a Dra. passou é simples de seguir."
    },
    {
      imagem: "public/ugc/story-4.webp",
      alt: "Personagem fictícia sorrindo perto da janela",
      tempo: "há 30 min",
      legenda: "Já marquei o retorno. Recomendo a avaliação para quem está em dúvida."
    }
  ]
};
