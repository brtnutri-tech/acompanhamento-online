/* ============================================================
   Tabela de preços · uso interno · Diogo Brito
   ============================================================ */
(function () {
  'use strict';

  var DATA = window.PRECOS_TABELA;
  if (!DATA) { console.error('precos.js não carregou'); return; }

  /* ---------- Ícones ---------- */
  function checkIcon() {
    return '<svg class="tb-check" viewBox="0 0 20 20" aria-hidden="true">' +
      '<path d="M4 10.5l3.8 3.8L16.5 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>';
  }
  function noIcon() {
    return '<svg class="tb-no" viewBox="0 0 20 20" aria-hidden="true">' +
      '<line x1="5" y1="10" x2="15" y2="10" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>' +
      '</svg>';
  }

  /* ---------- Preço formatado: "6× R$199" → prefix menor + número grande ---------- */
  function formatPreco(preco) {
    var m = preco.match(/^(.*?)(R\$)(\d[\d.,]*)$/);
    if (!m) return '<span class="tb-preco-num">' + preco + '</span>';
    var prefix = m[1].trim();
    var out = '';
    if (prefix) out += '<span class="tb-preco-prefix">' + prefix + '</span>';
    out += '<span class="tb-preco-cur">R$</span>';
    out += '<span class="tb-preco-num">' + m[3] + '</span>';
    return out;
  }

  /* ---------- Build de cada item da lista ---------- */
  function buildCheckItem(it) {
    var texto = typeof it === 'object' ? it.texto : it;
    var negrito = typeof it === 'object' && it.negrito;
    var inner = negrito ? '<strong>' + texto + '</strong>' : texto;
    return '<li class="tb-item' + (negrito ? ' tb-item-negrito' : '') + '">' +
      '<span class="tb-item-icon">' + checkIcon() + '</span>' +
      '<span class="tb-item-text">' + inner + '</span>' +
      '</li>';
  }
  function buildRiscadoItem(it) {
    var texto = typeof it === 'object' ? it.texto : it;
    return '<li class="tb-item tb-item-off">' +
      '<span class="tb-item-icon">' + noIcon() + '</span>' +
      '<span class="tb-item-text"><s>' + texto + '</s></span>' +
      '</li>';
  }

  /* ---------- Build do cartão completo ---------- */
  function buildCard(opts) {
    var data = opts.data;
    var variant = opts.variant;

    var seloHtml = data.selo ? '<span class="tb-selo">' + data.selo + '</span>' : '';
    var recorrenciaHtml = data.recorrencia ? '<p class="tb-recorrencia">' + data.recorrencia + '</p>' : '';
    var subPrecoHtml = data.subPreco ? '<p class="tb-subpreco">' + data.subPreco + '</p>' : '';
    var itensHtml = data.itens.map(buildCheckItem).join('');
    var riscadosHtml = (data.itensRiscados || []).map(buildRiscadoItem).join('');

    return '' +
      '<article class="tb-card tb-card--' + variant + '">' +
        seloHtml +
        '<p class="tb-tag">' + data.tag + '</p>' +
        '<h2 class="tb-title">' + data.titulo + '</h2>' +
        '<p class="tb-subtitulo">' + data.subtitulo + '</p>' +
        '<ul class="tb-itens">' + itensHtml + riscadosHtml + '</ul>' +
        '<div class="tb-precobox">' +
          '<p class="tb-preco">' + formatPreco(data.preco) + '</p>' +
          recorrenciaHtml +
          subPrecoHtml +
        '</div>' +
      '</article>';
  }

  /* ---------- Renderiza cartões ---------- */
  var cardsEl = document.getElementById('tb-cards');
  cardsEl.innerHTML =
    buildCard({ data: DATA.consultoria,   variant: 'neutra' }) +
    buildCard({ data: DATA.essencial,     variant: 'essencial' }) +
    buildCard({ data: DATA.consistencia,  variant: 'consistencia' });

  /* ---------- Rodapé ---------- */
  var footerEl = document.getElementById('tb-footer');
  if (DATA.rodape && typeof DATA.rodape === 'object') {
    footerEl.innerHTML =
      '<span class="tb-footer-linha1">' + DATA.rodape.linha1 + '</span>' +
      (DATA.rodape.linha2 ? '<span class="tb-footer-linha2">' + DATA.rodape.linha2 + '</span>' : '');
  } else {
    footerEl.textContent = DATA.rodape || '';
  }

  /* ---------- Escala o frame 1080x1350 pra caber na tela ---------- */
  var FRAME_W = 1080;
  var FRAME_H = 1350;
  var scaler = document.getElementById('tb-stage-scaler');
  var frameForFit = document.getElementById('tb-frame');

  function fit() {
    var stage = scaler.parentElement;
    var availW = stage.clientWidth - 24;
    var availH = window.innerHeight - 24 - 56;
    var sx = availW / FRAME_W;
    var sy = availH / FRAME_H;
    var s = Math.min(sx, sy, 1);
    scaler.style.width  = (FRAME_W * s) + 'px';
    scaler.style.height = (FRAME_H * s) + 'px';
    frameForFit.style.transform = 'scale(' + s + ')';
  }
  fit();
  window.addEventListener('resize', fit);

  /* ---------- Botão de download ---------- */
  var btn   = document.getElementById('tb-download');
  var frame = document.getElementById('tb-frame');

  function setBusy(busy) {
    if (busy) {
      btn.setAttribute('disabled', 'true');
      btn.classList.add('is-busy');
      btn.querySelector('span').textContent = 'Gerando…';
    } else {
      btn.removeAttribute('disabled');
      btn.classList.remove('is-busy');
      btn.querySelector('span').textContent = 'Baixar como JPEG';
    }
  }

  btn.addEventListener('click', function () {
    if (!window.htmlToImage) {
      alert('Biblioteca de exportação não carregou. Recarregue a página.');
      return;
    }
    setBusy(true);
    window.htmlToImage.toJpeg(frame, {
      width: FRAME_W,
      height: FRAME_H,
      pixelRatio: 1,
      quality: 0.95,
      backgroundColor: '#FAFAF8',
      style: { transform: 'none', margin: '0', boxShadow: 'none' },
      cacheBust: true
    }).then(function (dataUrl) {
      var a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'tabela-precos-diogo-brito.jpg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setBusy(false);
    }).catch(function (err) {
      console.error('Falha ao exportar:', err);
      alert('Algo deu errado ao gerar a imagem. Detalhe no console.');
      setBusy(false);
    });
  });

})();
