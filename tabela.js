/* ============================================================
   Tabela de preços · uso interno · Diogo Brito
   - Renderiza os 3 cartões a partir de data/precos.js
   - Escala o frame 1080x1350 pra caber na tela
   - Botão "Baixar como JPEG" exporta a peça em 1080x1350
   ============================================================ */
(function () {
  'use strict';

  var DATA = window.PRECOS_TABELA;
  if (!DATA) { console.error('precos.js não carregou'); return; }

  /* ---------- Render dos cartões ---------- */
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

  function buildCard(opts) {
    var data = opts.data;
    var variant = opts.variant; // 'neutra' | 'essencial' | 'consistencia'

    var itensHtml = data.itens.map(function (it) {
      return '<li class="tb-item"><span class="tb-item-icon">' + checkIcon() + '</span><span class="tb-item-text">' + it + '</span></li>';
    }).join('');

    var riscadosHtml = '';
    if (data.itensRiscados && data.itensRiscados.length) {
      riscadosHtml = data.itensRiscados.map(function (it) {
        return '<li class="tb-item tb-item-off"><span class="tb-item-icon">' + noIcon() + '</span><span class="tb-item-text"><s>' + it + '</s></span></li>';
      }).join('');
    }

    var seloHtml = '';
    if (data.selo) {
      seloHtml = '<span class="tb-selo">' + data.selo + '</span>';
    }

    var subPrecoHtml = '';
    if (data.subPreco) {
      subPrecoHtml = '<p class="tb-subpreco">' + data.subPreco + '</p>';
    }

    return '' +
      '<article class="tb-card tb-card--' + variant + '">' +
        seloHtml +
        '<p class="tb-tag">' + data.tag + '</p>' +
        '<h2 class="tb-title">' + data.titulo + '</h2>' +
        '<p class="tb-subtitulo">' + data.subtitulo + '</p>' +
        '<div class="tb-precobox">' +
          '<p class="tb-preco">' + data.preco + '</p>' +
          subPrecoHtml +
        '</div>' +
        '<ul class="tb-itens">' + itensHtml + riscadosHtml + '</ul>' +
      '</article>';
  }

  var cardsEl = document.getElementById('tb-cards');
  cardsEl.innerHTML =
    buildCard({ data: DATA.consultoria,   variant: 'neutra' }) +
    buildCard({ data: DATA.essencial,     variant: 'essencial' }) +
    buildCard({ data: DATA.consistencia,  variant: 'consistencia' });

  var footerEl = document.getElementById('tb-footer');
  footerEl.textContent = DATA.rodape || '';

  /* ---------- Escala o frame 1080x1350 pra caber na tela ---------- */
  var FRAME_W = 1080;
  var FRAME_H = 1350;
  var scaler = document.getElementById('tb-stage-scaler');

  var frameForFit = document.getElementById('tb-frame');
  function fit() {
    var stage = scaler.parentElement;
    var availW = stage.clientWidth - 24;
    var availH = window.innerHeight - 24 - 56; // 56 = toolbar
    var sx = availW / FRAME_W;
    var sy = availH / FRAME_H;
    var s = Math.min(sx, sy, 1);
    // scaler ocupa o espaço VISUAL (escalado)
    scaler.style.width = (FRAME_W * s) + 'px';
    scaler.style.height = (FRAME_H * s) + 'px';
    // frame de verdade segue 1080x1350, só transformado visualmente
    frameForFit.style.transform = 'scale(' + s + ')';
  }
  fit();
  window.addEventListener('resize', fit);

  /* ---------- Botão de download ---------- */
  var btn = document.getElementById('tb-download');
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

  function downloadJpeg(dataUrl) {
    var a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'tabela-precos-diogo-brito.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  btn.addEventListener('click', function () {
    if (!window.htmlToImage) {
      alert('Não consegui carregar a biblioteca de exportação. Tente recarregar a página.');
      return;
    }
    setBusy(true);

    var opts = {
      width: FRAME_W,
      height: FRAME_H,
      pixelRatio: 1,
      quality: 0.95,
      backgroundColor: '#FAFAF8',
      style: { transform: 'none', margin: '0', boxShadow: 'none' },
      cacheBust: true
    };

    window.htmlToImage.toJpeg(frame, opts)
      .then(function (dataUrl) {
        downloadJpeg(dataUrl);
        setBusy(false);
      })
      .catch(function (err) {
        console.error('Falha ao exportar:', err);
        alert('Algo deu errado ao gerar a imagem. Detalhe no console.');
        setBusy(false);
      });
  });

})();
