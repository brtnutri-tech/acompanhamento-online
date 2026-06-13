/* ============================================================
   Acompanhamento Online · Diogo Brito
   Interações em JS puro: reveal, mapa da jornada, quiz, FAQ,
   botão flutuante. Só transform/opacity, respeita reduced-motion.
   ============================================================ */
(function () {
  'use strict';

  /* ---- Reveal on scroll ---- */
  (function () {
    var els = document.querySelectorAll('.reveal, .reveal-fast');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  })();

  /* ---- Mapa da jornada — só sanfona (1 aberta por vez) ---- */
  (function () {
    var wrap = document.getElementById('journey-wrap');
    if (!wrap) return;
    var steps = Array.prototype.slice.call(wrap.querySelectorAll('[data-jstep]'));
    if (!steps.length) return;

    function panelOf(step) { return step.querySelector('.jstep-panel'); }
    function triggerOf(step) { return step.querySelector('.jstep-trigger'); }

    function close(step) {
      step.classList.remove('open');
      var p = panelOf(step), t = triggerOf(step);
      if (p) p.style.maxHeight = null;
      if (t) t.setAttribute('aria-expanded', 'false');
    }
    function open(step) {
      step.classList.add('open');
      var p = panelOf(step), t = triggerOf(step);
      if (p) p.style.maxHeight = p.scrollHeight + 'px';
      if (t) t.setAttribute('aria-expanded', 'true');
    }

    steps.forEach(function (step) {
      var t = triggerOf(step);
      if (t) {
        t.addEventListener('click', function () {
          var isOpen = step.classList.contains('open');
          steps.forEach(close);
          if (!isOpen) open(step);
        });
      }
    });

    open(steps[0]);

    window.addEventListener('resize', function () {
      var openStep = document.querySelector('.jstep.open');
      if (openStep) { var p = panelOf(openStep); if (p) p.style.maxHeight = p.scrollHeight + 'px'; }
    });
  })();

  /* ---- Quiz (lógica original da página online) ---- */
  (function () {
    var answers = { 1: null, 2: null, 3: null };

    var PLANS = {
      essencial:    { labelClass: 'essencial' },
      consistencia: { labelClass: 'consistencia' }
    };

    var RESULTS = {
      variante_a: {
        plan: 'essencial',
        profileLabel: 'Você está no começo, com clareza sobre o que quer.',
        title: 'Plano Essencial, <em>90&nbsp;dias</em>',
        why: 'Pelo que você respondeu, sua rotina tem uma estrutura que permite começar sem complicação. Você sabe onde quer chegar e está pronto para um processo claro e enxuto. 90 dias é tempo suficiente para você sentir a diferença, criar ritmo e decidir se quer continuar depois. O Essencial é construído pra isso.',
        ctaText: 'Ver os detalhes do Plano Essencial',
        ctaTarget: '#plan-essencial'
      },
      variante_b: {
        plan: 'consistencia',
        profileLabel: 'Você está num ponto em que consistência importa mais do que começar.',
        title: 'Plano Consistência, <em>180&nbsp;dias</em>',
        why: 'Pelo que você respondeu, o seu caso pede mais do que começar bem, pede que o padrão se sustente depois. Seja pela rotina que muda de uma semana pra outra, seja por ciclos anteriores que não duraram, 90 dias podem ser curtos para o resultado virar hábito. 180 dias é o tempo médio para o processo se instalar, e você fica com suporte semanal esse tempo inteiro.',
        ctaText: 'Ver os detalhes do Consistência',
        ctaTarget: '#plan-consistencia'
      },
      variante_c: {
        plan: 'consistencia',
        profileLabel: 'Você já tentou antes, e o que você precisa agora é tempo e suporte, nessa ordem.',
        title: 'Plano Consistência, <em>180&nbsp;dias</em>',
        why: 'Pelo que você respondeu, seu padrão já é claro. Você sabe o que quer, já tentou de várias formas, mas o que falhou foi o tempo de acompanhamento, não apenas o seu esforço. O Consistência foi desenhado exatamente para quem está nesse ponto. 180 dias de suporte semanal e acompanhamento ativo, com as duas sessões estratégicas. Aqui a gente trabalha todas as fases do processo pra te ajudar a estabelecer hábitos que duram depois que o plano termina.',
        ctaText: 'Ver os detalhes do Consistência',
        ctaTarget: '#plan-consistencia'
      }
    };

    function selectOption(el) {
      var q = el.dataset.q;
      var val = parseInt(el.dataset.val, 10);
      document.querySelectorAll('.quiz-option[data-q="' + q + '"]').forEach(function (o) { o.classList.remove('selected'); });
      el.classList.add('selected');
      answers[q] = val;
      var nextBtn = document.getElementById('quiz-next-q' + q);
      if (nextBtn) nextBtn.disabled = false;
      updateProgress();
    }

    function updateProgress() {
      var answered = Object.keys(answers).filter(function (k) { return answers[k] !== null; }).length;
      var pct = (answered / 3) * 100;
      var bar = document.getElementById('quiz-progress-bar');
      if (bar) bar.style.width = pct + '%';
    }

    function showScreen(id) {
      document.querySelectorAll('.quiz-screen').forEach(function (s) { s.classList.remove('active'); });
      var el = document.getElementById(id);
      if (el) el.classList.add('active');
    }

    function goToIntro() { showScreen('quiz-screen-intro'); }

    function goToQuestion(n) {
      if (answers[n] !== null) {
        var b = document.getElementById('quiz-next-q' + n);
        if (b) b.disabled = false;
      }
      showScreen('quiz-screen-q' + n);
    }

    function calcResult() {
      var score = (answers[1] || 0) + (answers[2] || 0) + (answers[3] || 0);
      if (score <= 2) return 'variante_a';
      if (score <= 4) return 'variante_b';
      return 'variante_c';
    }

    function showResult() {
      var res = RESULTS[calcResult()];
      var planData = PLANS[res.plan];

      var labelEl = document.getElementById('quiz-result-label');
      labelEl.textContent = res.profileLabel;
      labelEl.className = 'quiz-result-label ' + planData.labelClass;

      document.getElementById('quiz-result-title').innerHTML = res.title;
      document.getElementById('quiz-result-why').textContent = res.why;

      document.getElementById('quiz-result-cta-primary').setAttribute('href', res.ctaTarget);
      var ctaTextEl = document.getElementById('quiz-result-cta-primary-text');
      if (ctaTextEl) ctaTextEl.textContent = res.ctaText;

      var bar = document.getElementById('quiz-progress-bar');
      if (bar) bar.style.width = '100%';
      showScreen('quiz-screen-result');
    }

    function restart() {
      answers[1] = null; answers[2] = null; answers[3] = null;
      document.querySelectorAll('.quiz-option').forEach(function (o) { o.classList.remove('selected'); });
      ['quiz-next-q1', 'quiz-next-q2', 'quiz-next-q3'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.disabled = true;
      });
      var bar = document.getElementById('quiz-progress-bar');
      if (bar) bar.style.width = '0%';
      showScreen('quiz-screen-intro');
    }

    // Teclado nas opções (Enter / Espaço), já que são role="button"
    document.querySelectorAll('.quiz-option').forEach(function (o) {
      o.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectOption(o); }
      });
    });

    window.quizSelectOption = selectOption;
    window.quizGoToIntro = goToIntro;
    window.quizGoToQuestion = goToQuestion;
    window.quizShowResult = showResult;
    window.quizRestart = restart;
  })();

  /* ---- FAQ accordion ---- */
  (function () {
    document.querySelectorAll('.faq-item').forEach(function (item) {
      var q = item.querySelector('.faq-q');
      var a = item.querySelector('.faq-a');
      if (!q || !a) return;
      q.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(function (other) {
          other.classList.remove('open');
          var oa = other.querySelector('.faq-a');
          if (oa) oa.style.maxHeight = null;
          var oq = other.querySelector('.faq-q');
          if (oq) oq.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('open');
          a.style.maxHeight = a.scrollHeight + 'px';
          q.setAttribute('aria-expanded', 'true');
        }
      });
    });
  })();

  /* ---- Botão flutuante WhatsApp + Topbar sticky — aparecem após scroll ---- */
  (function () {
    var btn = document.getElementById('wa-float');
    var bar = document.getElementById('topbar');
    if (!btn && !bar) return;
    function update() {
      var show = window.scrollY > 140;
      if (btn) btn.classList.toggle('is-visible', show);
      if (bar) bar.classList.toggle('is-visible', show);
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  })();

})();
