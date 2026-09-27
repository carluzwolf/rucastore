# RUCA Store

Loja virtual de demonstração (front-end estático) para papelaria, personalizados e cultura pop, com identidade visual de **tinta roxa líquida** — roxo dominante, laranja em conversão e azul bebê em detalhes.

> ⚠️ **Este projeto é uma demonstração de e-commerce.** Não há backend, não há processamento real de pagamentos e os produtos/avaliações são fictícios.

## Stack

- HTML5, CSS3 e JavaScript puro (vanilla) — sem frameworks, sem Bootstrap, sem React.
- SVG inline para ícones e formas líquidas.
- Google Fonts: Fredoka (display), Poppins (texto), Caveat (assinatura "Store").
- Persistência local via `localStorage` (carrinho, favoritos, cupom, frete e login demonstrativo).

## Estrutura

```
/ruca-store
  index.html
  /assets
    logo-ruca.png        <- substitua pela logo real (ver comentário no index.html)
    logo-ruca-round.png  <- versão circular da logo
    /products
    /banners
  /css
    style.css
  /js
    products.js   -> catálogo de produtos + renderização e filtros
    cart.js       -> carrinho, favoritos, cupom e cálculo de frete
    checkout.js   -> etapas do checkout, PIX/cartão/boleto (demo)
    app.js        -> header, busca, modais, toasts, contador, login demo
  README.md
```

## Como usar a logo real

O projeto já funciona com um logotipo em SVG gerado no código (`<!-- SUBSTITUA PELO ARQUIVO REAL DA LOGO -->` em `index.html`). Para usar a arte oficial:

1. Coloque os arquivos em `assets/logo-ruca.png` e `assets/logo-ruca-round.png`.
2. No `index.html`, troque o bloco `<svg class="logo-mark">...</svg>` por `<img class="logo-mark" src="assets/logo-ruca.png" alt="RUCA Store">`.

## Funcionalidades incluídas

- Busca instantânea com painel de resultados e estado "nada encontrado".
- Filtros por categoria, personalizáveis/mais vendidos/novidades e ordenação.
- Carrinho em drawer lateral, com quantidade, cupom (`RUCA10` = 10%, `RUCA20` = 20%) e cálculo de frete simulado por CEP.
- Interface de personalização (tamanho, cor, upload demonstrativo, texto e observações) com preço recalculado.
- Checkout em 4 etapas (identificação, entrega, pagamento, confirmação) com PIX (QR ilustrativo + copiar código), cartão com máscara e boleto — tudo simulado.
- Favoritos e login persistidos em `localStorage`.
- Toasts de feedback, contador regressivo da oferta da semana e botão "voltar ao topo".
- Responsivo de 360px a 1920px, com menu mobile em off-canvas.

## Publicar no GitHub Pages

1. Crie um repositório e envie os arquivos deste projeto (a raiz deve conter `index.html`).
2. Em **Settings → Pages**, selecione a branch principal e a pasta `/root`.
3. O site ficará disponível em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

## Publicar na Vercel

1. Importe o repositório do GitHub em [vercel.com/new](https://vercel.com/new).
2. Como é um site estático, não é necessário configurar build command — deixe **Framework Preset: Other** e **Output Directory** como raiz (`.`).
3. Clique em **Deploy**.

## Próximos passos sugeridos

- Substituir as imagens placeholder (geradas em SVG) por fotos reais dos produtos em `assets/products/`.
- Conectar o checkout a um gateway de pagamento real (PIX/cartão) e a um backend de pedidos.
- Adicionar autenticação real caso a loja passe a ter contas de cliente.
