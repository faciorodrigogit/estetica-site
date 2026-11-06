# Imagens do "Antes e depois"

Cada caso tem a própria pasta, com o mesmo nome do `id` usado em
`config/casos-antes-depois.js`:

```
public/antes-depois/
  caso-01/
    a-1200.webp   imagem A, versão normal (~1200 px de largura)
    a-2400.webp   imagem A, alta resolução (~2400 px, usada só na lupa)
    b-1200.webp   imagem B, versão normal
    b-2400.webp   imagem B, alta resolução
```

## Regras

- Use fotos reais e nunca as edite para aumentar ou diminuir a diferença.
- As imagens A e B precisam ter as mesmas dimensões e o mesmo enquadramento.
  O site avisa no console (em desenvolvimento) quando as dimensões são diferentes.
- Tenha a autorização assinada da paciente antes de marcar `autorizacaoAssinada: true`.
- Não use imagens de banco de fotos.

## Como gerar os arquivos WebP

Com o ImageMagick instalado:

```
magick antes.jpg  -resize 1200x -quality 82 a-1200.webp
magick antes.jpg  -resize 2400x -quality 82 a-2400.webp
magick depois.jpg -resize 1200x -quality 82 b-1200.webp
magick depois.jpg -resize 2400x -quality 82 b-2400.webp
```

Ou use o site squoosh.app (gratuito, roda no navegador): exporte em WebP
com as larguras 1200 e 2400.

## Dicas para fotos comparáveis

Mesma luz, mesmo ângulo, mesma distância, mesmo fundo neutro, sem maquiagem
e sem filtros do celular. Vale marcar no chão a posição da paciente e do tripé.
