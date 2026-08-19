# Frôntis Editorial — Site Institucional

Site one-page estático (HTML + CSS + JavaScript puro, sem build e sem
frameworks) desenvolvido conforme o briefing em [`PROJETO.md`](PROJETO.md).
Este README explica o que trocar antes de publicar e como enviar os
arquivos por FTP para a hospedagem UOL, sem sobrescrever as páginas
antigas que o cliente vai manter.

## Estrutura de arquivos

```
/
├── index.html
├── PROJETO.md
├── README.md
├── robots.txt
├── sitemap.xml
├── /css
│   ├── reset.css
│   └── style.css
├── /js
│   └── main.js
└── /assets
    ├── favicon.svg
    ├── logo.svg            (logo para o header, fundo claro)
    ├── logo-clara.svg      (logo para o rodapé, fundo escuro)
    └── /img
        ├── hero-livros.svg
        ├── ricardo.jpg      (placeholder — ainda não existe)
        ├── /produtos        (15 placeholders — ainda não existem)
        └── /portfolio       (5 placeholders — ainda não existem)
```

Todos os caminhos usados no HTML/CSS são **relativos**, então a pasta
inteira pode ser publicada tanto na raiz do domínio quanto em uma
subpasta, sem precisar editar nada.

## O que trocar antes de publicar

Toda troca pendente está marcada no código com o comentário
`TROCAR AQUI`. Você pode abrir cada arquivo e usar Ctrl+F para localizá-los,
ou seguir a lista abaixo.

### 1. Número do WhatsApp

**Arquivo:** [`js/main.js`](js/main.js), linha 8. Já configurado com o
número real confirmado pelo cliente:

```js
const WHATSAPP_NUMBER = '5511945116620';
```

Formato sempre **só dígitos**: `55` + DDD + número (sem espaços,
parênteses, traços ou o símbolo `+`). Essa é a única linha do projeto
inteiro que define o número — todos os botões de WhatsApp do site
(header, hero, processo, produtos, contato, rodapé e o botão
flutuante) usam essa mesma constante automaticamente.

### 2. Logotipo

O logotipo ainda não foi enviado pelo cliente, então três arquivos estão
com uma versão provisória (um monograma "F" simples):

| Arquivo | Onde aparece |
|---|---|
| `assets/logo.svg` | Header (fundo claro) |
| `assets/logo-clara.svg` | Rodapé (fundo azul-marinho escuro) |
| `assets/favicon.svg` | Aba do navegador |

Basta **substituir o conteúdo desses três arquivos** pelos arquivos
oficiais (mantendo os mesmos nomes) — nenhuma linha de HTML ou CSS
precisa mudar. Depois de ter o logotipo definitivo, gere também:

- `assets/favicon-32x32.png`, `assets/favicon-16x16.png` e
  `assets/apple-touch-icon.png` (180×180px) — já estão referenciados no
  `<head>` do `index.html`, faltando só os arquivos. Um gerador como o
  [realfavicongenerator.net](https://realfavicongenerator.net) resolve
  isso em poucos minutos a partir do logotipo.
- `assets/img/og-image.jpg` (1200×630px) — imagem usada quando o link do
  site é compartilhado no WhatsApp, Facebook etc. Pode ser uma foto de
  capas de livros ou uma peça com o logotipo.

### 3. Verde da marca

**Arquivo:** [`css/style.css`](css/style.css), linha 11.

```css
--verde: #1F7A4D; /* PLACEHOLDER — confirmar com o logotipo */
```

Essa variável controla o verde em todo o site (ícones, links, detalhes,
linha do tempo). Quando o cliente confirmar o tom exato do logotipo,
troque o valor hexadecimal e remova o comentário. Vale conferir também se
`--verde-escuro` (`#155C39`, hover e textos) e `--verde-claro`
(`#EAF3EE`, fundos de seção) continuam harmônicos com o novo tom — eles
estão logo abaixo, no mesmo bloco `:root`.

### 4. Imagens

Nenhuma foto real foi enviada até o momento, então as galerias do site
usam placeholders visuais (retângulos com sombra, no formato de capa de
livro) que se ajustam sozinhos quando você substitui os arquivos pelos
nomes abaixo — não é preciso alterar nenhum HTML.

| Local | Arquivos a criar | Proporção recomendada |
|---|---|---|
| Hero | `assets/img/hero-livros.svg` (ou troque para `.jpg`, ajustando a extensão no `index.html`) | livre |
| Produtos → Livros e e-books | `assets/img/produtos/livros-01.jpg` a `livros-03.jpg` | 2:3 |
| Produtos → Manuais técnicos | `assets/img/produtos/manuais-01.jpg` a `manuais-03.jpg` | 2:3 |
| Produtos → Anais de Congresso | `assets/img/produtos/anais-01.jpg` a `anais-03.jpg` | 2:3 |
| Produtos → Revistas científicas | `assets/img/produtos/revistas-01.jpg` a `revistas-03.jpg` | 2:3 |
| Produtos → Vade Mecum | `assets/img/produtos/vademecum-01.jpg` a `vademecum-03.jpg` | 2:3 |
| Livros à venda | `assets/img/portfolio/venda-01.jpg` a `venda-05.jpg` | 2:3 |
| Sobre o editor | `assets/img/ricardo.jpg` | 3:4 |

**Recomendações de peso e formato** (a seção de Produtos sozinha tem 15
imagens, então o cuidado aqui faz diferença real na velocidade do site):

- Formato JPG (fotos) ou WebP, qualidade em torno de 75–80%.
- Exporte as capas em ~320×480px (o dobro do tamanho exibido, 160×240px,
  para telas de alta resolução) — não precisa de mais que isso.
- Comprima antes de subir com uma ferramenta gratuita como
  [squoosh.app](https://squoosh.app) ou [tinypng.com](https://tinypng.com).
  Cada capa comprimida deve ficar bem abaixo de 100KB.
- A foto do editor pode ser um pouco maior (~720×960px), mas vale o mesmo
  cuidado de compressão.

Se alguma imagem faltar ou o nome do arquivo não bater, o site **não
quebra**: o espaço reservado aparece como um retângulo neutro no lugar da
foto, sem ícone de erro e sem bagunçar o layout.

### 5. E-mail e telefone fixo

Aparecem como placeholders em dois lugares (seção de Contato e rodapé),
sempre marcados com `TROCAR AQUI` logo acima da linha:

- `contato@frontis.com.br` → trocar pelo e-mail real, nos atributos
  `href="mailto:..."` e no texto visível do link.
- `(11) 3000-0000` → trocar pelo telefone real, nos atributos
  `href="tel:+55..."` e no texto visível.

### 6. CNPJ (opcional)

No rodapé, logo acima da linha de copyright, há um comentário
`TROCAR AQUI` indicando onde incluir o CNPJ, caso o cliente confirme que
quer exibi-lo.

## Pendências que dependem do cliente

Lista consolidada (ver também a seção 14 do `PROJETO.md`):

- [ ] Número do WhatsApp com DDD
- [ ] Arquivo do logotipo oficial (para os três SVGs e os ícones de favicon)
- [ ] Confirmação do verde exato da marca
- [ ] Fotos e capas de livros para as categorias de Produtos (15 imagens)
- [ ] Capas para "Livros à venda" (5 imagens)
- [ ] Foto de Ricardo Sterchele
- [ ] Imagem para compartilhamento em redes sociais (`og-image.jpg`)
- [ ] URL da página de portfólio de autores independentes (já preparada
      no botão "Conheça o portfólio", no `index.html` e no rodapé — busque
      por `URL PENDENTE`)
- [ ] E-mail e telefone fixo definitivos
- [ ] CNPJ e endereço, se quiser exibi-los
- [ ] Confirmar se haverá depoimentos no site (não incluídos nesta versão)
- [ ] Dados de acesso FTP da UOL Host para a publicação

## Publicação por FTP na UOL Host

O site é 100% estático — não precisa de banco de dados, PHP ou qualquer
build. É só enviar os arquivos.

1. **Acesse o FTP** da hospedagem com um cliente FTP (FileZilla, por
   exemplo) e os dados fornecidos pela UOL Host.
2. **Localize a pasta raiz do domínio** (geralmente `public_html/`,
   `www/` ou `httpdocs/` — varia conforme o plano UOL). É nela que está
   hoje o `livros_a_venda.html` e a pasta `wa_files/`.
3. **Não apague nem sobrescreva** os itens que já existem nessa pasta:
   - `livros_a_venda.html`
   - a pasta `wa_files/` (contém os 9 PDFs da Biblioteca de Artigos e é
     referenciada diretamente pelo novo site — se for movida ou
     renomeada, os links de artigos quebram)
   - qualquer outra página antiga que o cliente decida manter
4. **Envie os arquivos e pastas deste projeto** para dentro dessa mesma
   pasta raiz, mantendo a estrutura tal como está aqui:
   - `index.html`
   - `robots.txt`
   - `sitemap.xml`
   - a pasta `css/` inteira
   - a pasta `js/` inteira
   - a pasta `assets/` inteira
   - (`PROJETO.md` e este `README.md` são apenas documentação interna —
     não é obrigatório publicá-los, mas também não há problema em deixá-los
     no servidor, já que não são referenciados por nenhuma página)
5. **Não envie** a pasta `.claude/`, se existir localmente — é apenas
   configuração do assistente usado no desenvolvimento, não faz parte do
   site.
6. **Teste no ar**: abra `https://www.frontis.com.br/` e confira que a
   home carrega, que `https://www.frontis.com.br/livros_a_venda.html`
   continua funcionando normalmente, e que os 9 links da Biblioteca de
   Artigos (seção "Artigos sobre edição de livros") abrem os PDFs em
   `wa_files/` sem erro 404.
7. Sempre que atualizar alguma imagem ou o logotipo depois da publicação,
   basta reenviar o arquivo com o mesmo nome por FTP — não é necessário
   reenviar o site inteiro.

Nenhum arquivo deste projeto tem o mesmo nome de `livros_a_venda.html` ou
da pasta `wa_files/`, então não há risco de colisão ao enviar tudo junto
para a mesma pasta.
