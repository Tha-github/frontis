# DEPLOY.md — Guia de publicação por FTP (UOL Host)

Este arquivo existe porque o site novo (`index.html` + `/css` + `/js` +
`/assets`) será enviado por FTP para o MESMO domínio que já hospeda
páginas antigas do cliente. Leia antes de subir qualquer arquivo.

## 1. Páginas e pastas INTOCÁVEIS

O cliente foi explícito: nada da lista abaixo pode ser apagado,
sobrescrito ou movido. Elas continuam no ar e recebem tráfego/links
externos mesmo depois do site novo publicado.

- `/livros_de_autores_4.html`
- `/livros_de_autores2.html`
- `/livros_de_autores1.html`
- `/portfolio_edicoes_institucionais.html`
- `/portfolio_meus_livros.html`
- `/livros_a_venda.html`
- `/wa_files/` (pasta inteira, com todos os PDFs antigos)

Essas páginas também foram incluídas no `sitemap.xml` do site novo,
já que continuam ativas e precisam seguir indexadas.

## 2. O que sobe do projeto novo

Envie por FTP **apenas** estes arquivos e pastas, mantendo a mesma
estrutura relativa (upload na raiz do domínio, ao lado das páginas
antigas):

- `index.html`
- `/css` (reset.css, style.css)
- `/js` (main.js)
- `/assets` (imagens, PDFs em `/assets/pdf/`, favicon, logos)
- `robots.txt`
- `sitemap.xml`

Não faz parte do deploy: `PROJETO.md`, `DEPLOY.md`, `README.md`,
`.git/`, `.gitignore`, `.claude/` — são arquivos de trabalho/controle
de versão, não fazem parte do site publicado.

## 3. Regra de ouro no cliente de FTP

**NÃO usar sincronização com exclusão** — nenhuma opção do tipo
"espelhar pasta local", "mirror", "sincronizar" ou "apagar arquivos
que não existem na origem". Esse tipo de sincronização apagaria as
páginas antigas listadas na seção 1, porque elas não existem na pasta
local do projeto novo.

Faça sempre upload seletivo/manual dos arquivos da seção 2, sobre a
estrutura já existente no servidor — nunca "substituir pasta".

## 4. Antes de subir qualquer coisa

- Baixe um backup completo do FTP atual (todos os arquivos e pastas do
  domínio) para uma pasta local, antes do primeiro envio. Se algo sair
  errado, esse backup é a forma de reverter.

## 5. Certificado SSL (HTTPS)

O certificado já foi comprado pelo cliente, mas ainda não foi ativado
pela hospedagem — o site responde em `http` até lá.

- O projeto novo já usa caminhos relativos em todos os assets internos
  (CSS, JS, imagens, PDFs), então funciona em `http` e em `https` sem
  alteração de código.
- Os poucos links que apontam para as páginas antigas (seção 1) já
  usam `https://www.frontis.com.br/...` no `sitemap.xml`. Quando o
  certificado for ativado, confirme que o servidor redireciona `http`
  para `https` automaticamente.
- **Antes da publicação final:** confirmar com a hospedagem (UOL Host)
  que o certificado SSL foi ativado.
- **Depois da ativação do certificado:** testar novamente os 8 links
  de PDF em `/assets/pdf/` e os links para as páginas antigas, agora
  em `https`.

## 6. Pendências que bloqueiam a publicação final

- Os 8 arquivos PDF reais em `/assets/pdf/` (a pasta existe, mas só
  tem o arquivo `LEIA-ME-PENDENTE.txt` explicando os nomes exatos
  esperados — ver Item 2 da rodada de ajustes).
- O 9º artigo "Bibliografia — Normas ABNT" (card comentado no HTML).
- Links de cada capa em "Livros à venda" na Uiclap (atualmente
  `href="#"` com `data-livro` por título).
- Dados de acesso FTP da UOL Host para a publicação em si.

## 7. Domínio com/sem "www"

O `sitemap.xml` e as tags canônicas do `index.html` usam
`https://www.frontis.com.br/`, mas os links para páginas antigas
informados pelo cliente vieram sem "www"
(`https://frontis.com.br/...`). Confirmar com a hospedagem que existe
redirecionamento entre as duas formas (apex → www ou o inverso) antes
da publicação, para nenhum link antigo quebrar.
