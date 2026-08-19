/* ===================================================================
   MAIN.JS — Frôntis Editorial
   Site institucional one-page — editoração de livros desde 1993
   =================================================================== */

// Número de WhatsApp para onde os leads são direcionados.
// Número real confirmado pelo cliente (mesmo número usado no contato com a agência).
const WHATSAPP_NUMBER = '5511945116620';

// Mensagem padrão usada pelos botões genéricos de CTA (header, hero etc.).
const MENSAGEM_PADRAO_WHATSAPP = 'Olá! Vim pelo site da Frôntis Editorial e gostaria de saber mais sobre a edição do meu livro.';

/**
 * Monta a URL do wa.me com a mensagem já codificada.
 * @param {string} mensagem - Texto a ser pré-preenchido na conversa do WhatsApp.
 * @returns {string} URL completa para abrir uma conversa no WhatsApp.
 */
function linkWhatsApp(mensagem) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
}

/**
 * Preenche o href de todo elemento marcado com [data-whatsapp].
 * Usa o valor do atributo como mensagem (ex.: data-whatsapp="Olá...");
 * se o atributo estiver vazio, usa a mensagem padrão.
 */
function initLinksWhatsApp() {
  document.querySelectorAll('[data-whatsapp]').forEach((elemento) => {
    const mensagem = elemento.dataset.whatsapp || MENSAGEM_PADRAO_WHATSAPP;
    elemento.href = linkWhatsApp(mensagem);
    elemento.target = '_blank';
    elemento.rel = 'noopener noreferrer';
  });
}

/**
 * Adiciona sombra ao header (.scrolled) assim que a página rola.
 */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  const aoRolar = () => {
    header.classList.toggle('scrolled', window.scrollY > 8);
  };

  aoRolar();
  window.addEventListener('scroll', aoRolar, { passive: true });
}

/**
 * Controla o drawer de navegação mobile: abrir/fechar, overlay,
 * trava de scroll do body (preservando a posição), foco preso
 * dentro do drawer e fechamento pela tecla Esc.
 */
function initMenuMobile() {
  const botaoAbrir = document.getElementById('btn-hamburguer');
  const botaoFechar = document.getElementById('btn-drawer-fechar');
  const drawer = document.getElementById('drawer-mobile');
  const overlay = document.getElementById('drawer-overlay');

  if (!botaoAbrir || !botaoFechar || !drawer || !overlay) return;

  const seletorFocaveis = 'a[href], button:not([disabled])';
  let scrollYSalvo = 0;
  let elementoFocadoAntes = null;

  function obterFocaveis() {
    return Array.from(drawer.querySelectorAll(seletorFocaveis));
  }

  function prenderFoco(evento) {
    if (evento.key !== 'Tab') return;

    const focaveis = obterFocaveis();
    if (focaveis.length === 0) return;

    const primeiro = focaveis[0];
    const ultimo = focaveis[focaveis.length - 1];

    if (evento.shiftKey && document.activeElement === primeiro) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primeiro.focus();
    }
  }

  function aoTeclar(evento) {
    if (evento.key === 'Escape') {
      fecharDrawer();
    } else {
      prenderFoco(evento);
    }
  }

  function abrirDrawer() {
    elementoFocadoAntes = document.activeElement;
    scrollYSalvo = window.scrollY;

    // Trava o scroll do body preservando a posição atual
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollYSalvo}px`;
    document.body.style.width = '100%';

    overlay.hidden = false;
    drawer.hidden = false;

    // Aguarda um frame para o navegador aplicar hidden=false
    // antes de iniciar a transição de entrada
    requestAnimationFrame(() => {
      overlay.classList.add('aberto');
      drawer.classList.add('aberto');
    });

    botaoAbrir.setAttribute('aria-expanded', 'true');
    document.addEventListener('keydown', aoTeclar);

    const focaveis = obterFocaveis();
    if (focaveis.length > 0) focaveis[0].focus();
  }

  function fecharDrawer() {
    overlay.classList.remove('aberto');
    drawer.classList.remove('aberto');
    botaoAbrir.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', aoTeclar);

    const aoTerminarTransicao = () => {
      overlay.hidden = true;
      drawer.hidden = true;
      drawer.removeEventListener('transitionend', aoTerminarTransicao);
    };
    drawer.addEventListener('transitionend', aoTerminarTransicao);

    // Restaura o scroll do body na posição em que estava
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollYSalvo);

    if (elementoFocadoAntes) elementoFocadoAntes.focus();
  }

  botaoAbrir.addEventListener('click', abrirDrawer);
  botaoFechar.addEventListener('click', fecharDrawer);
  overlay.addEventListener('click', fecharDrawer);
  drawer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', fecharDrawer);
  });
}

/**
 * Destaca no menu o link correspondente à seção visível na tela.
 * Ignora âncoras cuja seção ainda não existe no DOM (etapas futuras).
 */
function initScrollSpy() {
  const links = Array.from(document.querySelectorAll('.header__link'));
  if (links.length === 0) return;

  const secoes = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (secoes.length === 0) return;

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;

        const linkCorrespondente = links.find(
          (link) => link.getAttribute('href') === `#${entrada.target.id}`
        );
        if (!linkCorrespondente) return;

        links.forEach((link) => link.classList.remove('ativo'));
        linkCorrespondente.classList.add('ativo');
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  secoes.forEach((secao) => observador.observe(secao));
}

/**
 * Anima a entrada dos filhos de qualquer container marcado com
 * [data-anim-grupo], de forma escalonada, quando entram na viewport.
 * Reutilizável pelas próximas seções (produtos, portfólio etc.).
 */
function initAnimacaoEscalonada() {
  const grupos = document.querySelectorAll('[data-anim-grupo]');
  if (grupos.length === 0) return;

  const observador = new IntersectionObserver(
    (entradas, obs) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('anim-visivel');
        obs.unobserve(entrada.target);
      });
    },
    { threshold: 0.15 }
  );

  grupos.forEach((grupo) => {
    const itens = Array.from(grupo.children);
    itens.forEach((item, indice) => {
      item.style.setProperty('--atraso', `${indice * 80}ms`);
      observador.observe(item);
    });
  });
}

/**
 * Quando uma imagem de capa (placeholder ainda não enviado pelo cliente)
 * falha ao carregar, esconde o ícone de imagem quebrada e mantém apenas
 * o fundo neutro do placeholder, para o layout continuar estável.
 * Cobre as capas de Produtos e as dos livros à venda (Portfólio).
 */
function initFallbackImagensCapas() {
  document.querySelectorAll('.produtos__capa-botao img, .livro-card__capa img, .editor__foto img').forEach((img) => {
    img.addEventListener(
      'error',
      () => {
        img.classList.add('capa--erro');
      },
      { once: true }
    );
  });
}

/**
 * Lightbox em JS puro para as capas de produtos (e qualquer outra
 * galeria futura que use os mesmos atributos data-lightbox-*).
 * Navega entre as imagens do mesmo grupo (data-lightbox-grupo),
 * fecha por X, clique fora ou Esc, trava o scroll do body e devolve
 * o foco ao elemento que abriu o lightbox.
 */
function initLightbox() {
  const gatilhos = Array.from(document.querySelectorAll('[data-lightbox-grupo]'));
  if (gatilhos.length === 0) return;

  const lightbox = document.getElementById('lightbox');
  const overlay = document.getElementById('lightbox-overlay');
  const imagem = document.getElementById('lightbox-imagem');
  const legenda = document.getElementById('lightbox-legenda');
  const botaoFechar = document.getElementById('lightbox-fechar');
  const botaoAnterior = document.getElementById('lightbox-anterior');
  const botaoProximo = document.getElementById('lightbox-proximo');

  if (!lightbox || !overlay || !imagem || !legenda || !botaoFechar || !botaoAnterior || !botaoProximo) return;

  let grupoAtual = [];
  let indiceAtual = 0;
  let scrollYSalvo = 0;
  let elementoFocadoAntes = null;

  function obterGrupo(nomeGrupo) {
    return gatilhos.filter((gatilho) => gatilho.dataset.lightboxGrupo === nomeGrupo);
  }

  function obterFocaveisDoLightbox() {
    return [botaoFechar, botaoAnterior, botaoProximo].filter((el) => !el.hidden);
  }

  function prenderFoco(evento) {
    if (evento.key !== 'Tab') return;

    const focaveis = obterFocaveisDoLightbox();
    if (focaveis.length === 0) return;

    const primeiro = focaveis[0];
    const ultimo = focaveis[focaveis.length - 1];

    if (evento.shiftKey && document.activeElement === primeiro) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primeiro.focus();
    }
  }

  function mostrarImagemAtual() {
    const gatilho = grupoAtual[indiceAtual];
    imagem.src = gatilho.dataset.lightboxSrc;
    imagem.alt = gatilho.dataset.lightboxLegenda || '';
    legenda.textContent = gatilho.dataset.lightboxLegenda || '';

    const temNavegacao = grupoAtual.length > 1;
    botaoAnterior.hidden = !temNavegacao;
    botaoProximo.hidden = !temNavegacao;
  }

  function irParaAnterior() {
    indiceAtual = (indiceAtual - 1 + grupoAtual.length) % grupoAtual.length;
    mostrarImagemAtual();
  }

  function irParaProximo() {
    indiceAtual = (indiceAtual + 1) % grupoAtual.length;
    mostrarImagemAtual();
  }

  function aoTeclar(evento) {
    if (evento.key === 'Escape') {
      fechar();
    } else if (evento.key === 'ArrowLeft') {
      irParaAnterior();
    } else if (evento.key === 'ArrowRight') {
      irParaProximo();
    } else {
      prenderFoco(evento);
    }
  }

  function abrir(gatilho) {
    elementoFocadoAntes = gatilho;
    grupoAtual = obterGrupo(gatilho.dataset.lightboxGrupo);
    indiceAtual = grupoAtual.indexOf(gatilho);

    scrollYSalvo = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollYSalvo}px`;
    document.body.style.width = '100%';

    mostrarImagemAtual();
    lightbox.hidden = false;
    document.addEventListener('keydown', aoTeclar);
    botaoFechar.focus();
  }

  function fechar() {
    lightbox.hidden = true;
    document.removeEventListener('keydown', aoTeclar);

    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollYSalvo);

    if (elementoFocadoAntes) elementoFocadoAntes.focus();
  }

  gatilhos.forEach((gatilho) => {
    gatilho.addEventListener('click', () => abrir(gatilho));
  });

  botaoFechar.addEventListener('click', fechar);
  overlay.addEventListener('click', fechar);
  botaoAnterior.addEventListener('click', irParaAnterior);
  botaoProximo.addEventListener('click', irParaProximo);
}

/**
 * Controla o botão "Ver a história completa" da seção Sobre: expande
 * os marcos 2004–2020 (recolhidos por padrão), alterna o texto do
 * botão e mantém aria-expanded / aria-hidden sincronizados com o
 * estado visual.
 */
function initHistoriaExpandir() {
  const botao = document.getElementById('btn-historia-expandir');
  const linha = document.getElementById('historia-linha');
  if (!botao || !linha) return;

  const marcosExtras = Array.from(linha.querySelectorAll('.historia__marco--extra'));

  botao.addEventListener('click', () => {
    const expandido = linha.classList.toggle('expandido');

    botao.setAttribute('aria-expanded', String(expandido));
    botao.textContent = expandido ? 'Ver menos' : 'Ver a história completa';

    marcosExtras.forEach((marco) => {
      marco.setAttribute('aria-hidden', String(!expandido));
    });
  });
}

/**
 * Aplica a máscara de telefone brasileiro conforme o usuário digita.
 * Alterna automaticamente entre o formato de fixo (00) 0000-0000 e
 * de celular (00) 00000-0000, de acordo com a quantidade de dígitos.
 * @param {string} valor - Valor atual do campo.
 * @returns {string} Valor formatado.
 */
function mascararTelefone(valor) {
  const digitos = valor.replace(/\D/g, '').slice(0, 11);

  if (digitos.length === 0) return '';
  if (digitos.length <= 2) return `(${digitos}`;
  if (digitos.length <= 6) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
  if (digitos.length <= 10) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  }
  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
}

/**
 * Formulário de contato: máscara de telefone, validação no submit
 * (nome, telefone, tipo de publicação e situação do original) com
 * aria-invalid/aria-describedby e foco no primeiro erro, e montagem
 * da mensagem que abre o WhatsApp. Sem backend — nada é enviado além
 * de abrir a conversa já preenchida.
 */
function initFormularioContato() {
  const form = document.getElementById('form-contato');
  if (!form) return;

  const campoNome = document.getElementById('campo-nome');
  const campoTelefone = document.getElementById('campo-telefone');
  const campoTipo = document.getElementById('campo-tipo');
  const campoSituacao = document.getElementById('campo-situacao');
  const campoMensagem = document.getElementById('campo-mensagem');
  const mensagemSucesso = document.getElementById('contato-sucesso');

  campoTelefone.addEventListener('input', () => {
    campoTelefone.value = mascararTelefone(campoTelefone.value);
  });

  function definirErro(campo, elementoErro, mensagemErro) {
    if (mensagemErro) {
      campo.setAttribute('aria-invalid', 'true');
      elementoErro.textContent = mensagemErro;
      return false;
    }
    campo.removeAttribute('aria-invalid');
    elementoErro.textContent = '';
    return true;
  }

  function validar() {
    let primeiroInvalido = null;

    const nomeValido = definirErro(
      campoNome,
      document.getElementById('erro-nome'),
      campoNome.value.trim().length < 3 ? 'Informe seu nome completo (mínimo de 3 caracteres).' : ''
    );
    if (!nomeValido) primeiroInvalido = primeiroInvalido || campoNome;

    const digitosTelefone = campoTelefone.value.replace(/\D/g, '');
    const telefoneValido = definirErro(
      campoTelefone,
      document.getElementById('erro-telefone'),
      digitosTelefone.length !== 10 && digitosTelefone.length !== 11
        ? 'Informe um telefone válido com DDD (10 ou 11 dígitos).'
        : ''
    );
    if (!telefoneValido) primeiroInvalido = primeiroInvalido || campoTelefone;

    const tipoValido = definirErro(
      campoTipo,
      document.getElementById('erro-tipo'),
      campoTipo.value === '' ? 'Selecione o tipo de publicação.' : ''
    );
    if (!tipoValido) primeiroInvalido = primeiroInvalido || campoTipo;

    const situacaoValida = definirErro(
      campoSituacao,
      document.getElementById('erro-situacao'),
      campoSituacao.value === '' ? 'Selecione a situação do original.' : ''
    );
    if (!situacaoValida) primeiroInvalido = primeiroInvalido || campoSituacao;

    if (primeiroInvalido) {
      primeiroInvalido.focus();
      return false;
    }
    return true;
  }

  form.addEventListener('submit', (evento) => {
    evento.preventDefault();

    if (mensagemSucesso) mensagemSucesso.hidden = true;
    if (!validar()) return;

    const nome = campoNome.value.trim();
    const telefone = campoTelefone.value.trim();
    const tipo = campoTipo.value;
    const situacao = campoSituacao.value;
    const mensagemTexto = campoMensagem.value.trim();

    const partesMensagem = [
      'Olá, Ricardo!',
      `Meu nome é ${nome}.`,
      `Tenho interesse em publicar: ${tipo}.`,
      `Situação do original: ${situacao}.`,
      mensagemTexto,
      `Meu contato: ${telefone}`
    ].filter(Boolean);

    window.open(linkWhatsApp(partesMensagem.join(' ')), '_blank', 'noopener,noreferrer');

    if (mensagemSucesso) mensagemSucesso.hidden = false;
    form.reset();
  });
}

/**
 * Escreve o ano atual no rodapé (para o © dinâmico).
 */
function initAnoRodape() {
  const elementoAno = document.getElementById('ano-atual');
  if (!elementoAno) return;
  elementoAno.textContent = String(new Date().getFullYear());
}

/**
 * Botão flutuante de WhatsApp: aparece com fade após 300px de rolagem
 * e some automaticamente sempre que o botão "Enviar mensagem" do
 * formulário de contato estiver visível, para nunca cobri-lo no mobile.
 */
function initBotaoFlutuanteWhatsApp() {
  const botao = document.getElementById('whatsapp-flutuante');
  if (!botao) return;

  let passouDoLimiteDeScroll = false;
  let botaoEnviarVisivel = false;

  function atualizarVisibilidade() {
    botao.classList.toggle('visivel', passouDoLimiteDeScroll && !botaoEnviarVisivel);
  }

  function aoRolar() {
    passouDoLimiteDeScroll = window.scrollY > 300;
    atualizarVisibilidade();
  }

  aoRolar();
  window.addEventListener('scroll', aoRolar, { passive: true });

  const botaoEnviar = document.querySelector('.contato__enviar');
  if (botaoEnviar) {
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          botaoEnviarVisivel = entrada.isIntersecting;
          atualizarVisibilidade();
        });
      },
      // A margem negativa reserva o espaço equivalente ao próprio botão
      // flutuante, então ele já reaparece assim que deixa de haver risco
      // real de sobreposição.
      { rootMargin: '0px 0px -56px 0px' }
    );
    observador.observe(botaoEnviar);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initLinksWhatsApp();
  initHeaderScroll();
  initMenuMobile();
  initScrollSpy();
  initAnimacaoEscalonada();
  initFallbackImagensCapas();
  initLightbox();
  initHistoriaExpandir();
  initFormularioContato();
  initAnoRodape();
  initBotaoFlutuanteWhatsApp();
});
