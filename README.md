# Clínica Dra. Nome Sobrenome — Landing page

Site estático (HTML + CSS + JS, sem dependências de build).

## Estrutura

```
index.html                      página
js/antes-depois.js              comparador antes/depois com lupa
js/ugc-demo.js                  stories de exemplo (só no modo demo)
config/casos-antes-depois.js    lista de casos do antes/depois
config/ugc-demo.js              @, legendas e fotos dos stories (modo demo)
config/site-mode.js             modo local (no deploy é gerado pelo build)
public/                         imagens
scripts/build.sh                build: gera dist/ e config/site-mode.js
render.yaml                     Blueprint da Render
```

## Modos (variável SITE_MODE)

- `demo`: mostra a simulação do antes/depois e os stories da personagem fictícia.
- `producao`: esconde todo conteúdo de demonstração.

Na Render, mude em **Dashboard → serviço → Environment → SITE_MODE** e faça um novo deploy
(ou altere o valor em `render.yaml` e faça commit).

## Rodar localmente

Abra `index.html` no navegador, ou:

```
python3 -m http.server 8000
```

## Testar o build

```
SITE_MODE=demo sh scripts/build.sh
cd dist && python3 -m http.server 8000
```

## Deploy na Render

1. Suba este repositório para o GitHub.
2. Na Render: **New → Blueprint**, selecione o repositório e confirme.
3. A cada `git push` na branch principal, a Render publica de novo.
