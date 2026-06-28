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

  /* ---- Botão flutuante WhatsApp + Topbar sticky + barra de progresso ---- */
  (function () {
    var btn = document.getElementById('wa-float');
    var bar = document.getElementById('topbar');
    var storyBar = document.getElementById('story-progress-bar');
    if (!btn && !bar && !storyBar) return;
    var ticking = false;
    function update() {
      var y = window.scrollY;
      var show = y > 140;
      if (btn) btn.classList.toggle('is-visible', show);
      if (bar) bar.classList.toggle('is-visible', show);
      if (storyBar) {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        storyBar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
      }
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  })();

  /* ---- Pulse 1x nos CTAs de plano quando entram em viewport ---- */
  (function () {
    var ctas = document.querySelectorAll('.plan-cta');
    if (!ctas.length || !('IntersectionObserver' in window)) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('pulse-once');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.55 });
    Array.prototype.forEach.call(ctas, function (el) { io.observe(el); });
  })();

  /* ---- Chapter rail — destaca o capítulo visível ---- */
  (function () {
    var rail = document.querySelector('.chapter-rail');
    if (!rail || !('IntersectionObserver' in window)) return;
    var links = rail.querySelectorAll('a[data-target]');
    var map = {};
    Array.prototype.forEach.call(links, function (a) {
      var sec = document.getElementById(a.getAttribute('data-target'));
      if (sec) map[a.getAttribute('data-target')] = a;
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          Array.prototype.forEach.call(links, function (a) { a.classList.remove('active'); });
          var active = map[entry.target.id];
          if (active) active.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    Array.prototype.forEach.call(links, function (a) {
      var sec = document.getElementById(a.getAttribute('data-target'));
      if (sec) io.observe(sec);
    });
  })();



  /* ──── MODAL SHAPED (relatório de avaliação) ──── */
  // SHAPED GALLERY MODAL — abertura, swipe, navegação, foco, ESC, teclado
    (function(){
      const modal = document.getElementById('shaped-modal');
      if (!modal) return;
  
      const slides = modal.querySelector('#shaped-slides');
      const slideEls = modal.querySelectorAll('.shaped-slide');
      const dots = modal.querySelectorAll('.shaped-dot');
      const prevBtn = modal.querySelector('.shaped-arrow-prev');
      const nextBtn = modal.querySelector('.shaped-arrow-next');
      const closeBtn = modal.querySelector('.shaped-modal-close');
      const hint = modal.querySelector('#shaped-hint');
      const triggers = document.querySelectorAll('[data-shaped-trigger]');
  
      const total = slideEls.length;
      let current = 0;
      let lastFocused = null;
      let hintHidden = false;
  
      const goTo = (idx, opts) => {
        opts = opts || {};
        current = Math.max(0, Math.min(total - 1, idx));
        slides.style.transform = 'translateX(' + (-current * 100) + '%)';
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
        if (prevBtn) prevBtn.disabled = current === 0;
        if (nextBtn) nextBtn.disabled = current === total - 1;
        if (opts.userAction && !hintHidden && hint) {
          hint.classList.add('is-hidden');
          hintHidden = true;
        }
      };
  
      const next = () => goTo(current + 1, { userAction: true });
      const prev = () => goTo(current - 1, { userAction: true });
  
      if (nextBtn) nextBtn.addEventListener('click', next);
      if (prevBtn) prevBtn.addEventListener('click', prev);
  
      dots.forEach(dot => {
        dot.addEventListener('click', () => {
          const idx = parseInt(dot.dataset.slide, 10);
          goTo(idx, { userAction: true });
        });
      });
  
      let touchStartX = 0;
      let touchEndX = 0;
      const SWIPE_THRESHOLD = 50;
  
      slides.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
  
      slides.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) < SWIPE_THRESHOLD) return;
        if (diff > 0 && current < total - 1) next();
        else if (diff < 0 && current > 0) prev();
      }, { passive: true });
  
      const onKeydown = (e) => {
        if (modal.hidden) return;
        if (e.key === 'ArrowRight') next();
        else if (e.key === 'ArrowLeft') prev();
        else if (e.key === 'Escape') close();
      };
  
      const open = (trigger) => {
        lastFocused = trigger || document.activeElement;
        modal.hidden = false;
        modal.offsetHeight;
        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        goTo(0);
        hintHidden = false;
        if (hint) hint.classList.remove('is-hidden');
        if (closeBtn) closeBtn.focus();
        document.addEventListener('keydown', onKeydown);
      };
  
      const close = () => {
        modal.classList.remove('is-open');
        document.removeEventListener('keydown', onKeydown);
        setTimeout(() => {
          modal.hidden = true;
          document.body.style.overflow = '';
          if (lastFocused && typeof lastFocused.focus === 'function') {
            lastFocused.focus();
          }
        }, 200);
      };
  
      if (closeBtn) closeBtn.addEventListener('click', close);
  
      triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          open(trigger);
        });
      });
    })();

})();
