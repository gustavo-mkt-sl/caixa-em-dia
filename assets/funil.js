/* Caixa em Dia · comportamentos do funil (sem coleta de dados, sem cookies). */
(function () {
  'use strict';

  /* 1. Botões de compra: levam a origem da visita (utm, src, sck) para o checkout da Kiwify
        e mostram que o clique funcionou enquanto o checkout abre. */
  var PERMITIDOS = /^(utm_source|utm_medium|utm_campaign|utm_content|utm_term|src|sck)$/;
  var extras = [];
  try {
    new URLSearchParams(window.location.search).forEach(function (valor, chave) {
      if (PERMITIDOS.test(chave) && /^[\w.-]{1,60}$/.test(valor)) extras.push([chave, valor]);
    });
  } catch (e) { /* navegador antigo: segue sem repassar */ }

  Array.prototype.forEach.call(document.querySelectorAll('a[data-checkout]'), function (a) {
    if (extras.length) {
      try {
        var url = new URL(a.href);
        extras.forEach(function (p) { if (!url.searchParams.has(p[0])) url.searchParams.set(p[0], p[1]); });
        a.href = url.toString();
      } catch (e) { /* mantém o link original */ }
    }
    a.addEventListener('click', function () {
      a.classList.add('indo');
      setTimeout(function () { a.classList.remove('indo'); }, 6000);
    });
  });
  // Quem volta do checkout pelo botão "voltar" não fica com o botão girando.
  window.addEventListener('pageshow', function () {
    Array.prototype.forEach.call(document.querySelectorAll('.indo'), function (b) { b.classList.remove('indo'); });
  });

  /* 2. Barra fixa de compra no celular: aparece depois do primeiro botão e some perto do último. */
  var barra = document.getElementById('barra-compra');
  var primeiro = document.getElementById('cta-topo');
  var ultimo = document.getElementById('cta-final');
  if (barra && primeiro && 'IntersectionObserver' in window) {
    var passouTopo = false, vendoFinal = false;
    var atualizar = function () { barra.classList.toggle('visivel', passouTopo && !vendoFinal); };
    new IntersectionObserver(function (e) {
      passouTopo = !e[0].isIntersecting && e[0].boundingClientRect.top < 0; atualizar();
    }).observe(primeiro);
    if (ultimo) new IntersectionObserver(function (e) { vendoFinal = e[0].isIntersecting; atualizar(); }).observe(ultimo);
  }

  /* 3. Página de obrigado: o "não" final aciona o botão de recusa da Kiwify,
        que fica escondido para o downsell aparecer antes dele. */
  Array.prototype.forEach.call(document.querySelectorAll('[data-recusar]'), function (botao) {
    botao.addEventListener('click', function () {
      var kiwify = document.querySelector('[id^="kiwify-upsell-cancel-trigger"]');
      botao.setAttribute('aria-busy', 'true');
      botao.textContent = 'Só um instante…';
      if (kiwify) kiwify.click();
      setTimeout(function () {
        var aviso = document.getElementById('recusa-aviso');
        if (aviso) aviso.hidden = false;
        botao.textContent = 'Não, obrigado. Quero só a planilha.';
        botao.removeAttribute('aria-busy');
      }, 4000);
    });
  });

  /* 4. Página de diagnóstico: ajusta a frase conforme o plano (?plano=mensal ou trimestral). */
  var plano = document.querySelector('[data-plano]');
  if (plano) {
    var p = (new URLSearchParams(window.location.search).get('plano') || '').toLowerCase();
    var textos = {
      mensal: 'Diagnóstico mensal ativo. Todo fechamento de mês eu leio os seus números.',
      trimestral: 'Diagnóstico trimestral confirmado. São 3 leituras, uma em cada fechamento de mês.'
    };
    if (textos[p]) plano.textContent = textos[p];
  }
})();
