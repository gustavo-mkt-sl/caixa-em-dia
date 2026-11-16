/* Roda antes do script da Kiwify: quem aceita o diagnóstico trimestral vai para a página
   de diagnóstico confirmado. Para voltar ao padrão da Kiwify (área de membros), apague a
   linha que carrega este arquivo em obrigado/index.html. */
(function () {
  var caixa = document.querySelector('[id^="kiwify-upsell-"][data-upsell-url]');
  if (!caixa || caixa.getAttribute('data-upsell-url')) return;
  try {
    caixa.setAttribute('data-upsell-url', new URL('../diagnostico/?plano=trimestral', window.location.href).toString());
  } catch (e) { /* mantém o padrão da Kiwify */ }
})();
