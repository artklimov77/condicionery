/* =============================================
   NORDIC AIR — Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* === SCROLL PROGRESS BAR === */
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.prepend(progressBar);

  /* === BACK TO TOP === */
  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', 'Наверх');
  backToTop.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>`;
  document.body.appendChild(backToTop);
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* === HEADER + SCROLL EFFECTS === */
  const header = document.getElementById('header');

  const onScroll = () => {
    const scrolled = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? (scrolled / docH) * 100 : 0;

    progressBar.style.width = pct + '%';

    if (header) {
      header.classList.toggle('scrolled', scrolled > 80);
    }

    backToTop.classList.toggle('visible', scrolled > 400);
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  /* === MOBILE MENU === */
  const burger = document.querySelector('.burger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        burger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // close on outside click
    document.addEventListener('click', (e) => {
      if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target) && !burger.contains(e.target)) {
        mobileMenu.classList.remove('open');
        burger.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* === ACTIVE NAV LINK === */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });

  /* === SCROLL REVEAL ANIMATIONS === */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* === COUNTER ANIMATION === */
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));

  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 1800;
    const isDecimal = el.dataset.decimal === 'true';
    const start = performance.now();

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString('ru')) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* === FAQ ACCORDION === */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');

      // close all
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-answer').style.maxHeight = '0';
      });

      // open clicked
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* === PORTFOLIO FILTER === */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        projectCards.forEach(card => {
          const show = filter === 'all' || card.dataset.category === filter;
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';

          setTimeout(() => {
            card.style.display = show ? '' : 'none';
            if (show) {
              requestAnimationFrame(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
              });
            }
          }, 150);
        });
      });
    });

    projectCards.forEach(card => {
      card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
  }

  /* === SMOOTH ANCHOR SCROLL === */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = header ? header.offsetHeight + 20 : 90;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* === FORM VALIDATION === */
  document.querySelectorAll('form[data-validate]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      form.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = 'var(--red)';
          field.style.boxShadow = '0 0 0 3px rgba(220,38,38,.12)';
        } else {
          field.style.borderColor = '';
          field.style.boxShadow = '';
        }
      });

      if (valid) {
        const btn = form.querySelector('[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg> Отправлено! Перезвоним в течение 15 минут`;
        btn.style.background = 'var(--green)';
        btn.disabled = true;

        const data = { _subject: 'Заявка NordicAir — ' + (form.querySelector('[name="name"]')?.value || form.querySelector('[name="phone"]')?.value || 'Клиент') };
        form.querySelectorAll('input, textarea, select').forEach(f => {
          if (f.name && !f.name.startsWith('_')) data[f.name] = f.value.trim();
        });
        fetch('https://formsubmit.co/ajax/artklimov77@yandex.com', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) }).catch(() => {});

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.disabled = false;
          form.reset();
        }, 5000);
      }
    });
  });

  /* === NOTICE BAR DISMISS === */
  const dismissBtn = document.querySelector('.notice-dismiss');
  const noticeBar = document.querySelector('.notice-bar');
  if (dismissBtn && noticeBar) {
    dismissBtn.addEventListener('click', () => {
      noticeBar.style.height = noticeBar.offsetHeight + 'px';
      requestAnimationFrame(() => {
        noticeBar.style.transition = 'height 0.3s ease, opacity 0.3s ease, padding 0.3s ease';
        noticeBar.style.height = '0';
        noticeBar.style.opacity = '0';
        noticeBar.style.padding = '0';
        noticeBar.style.overflow = 'hidden';
      });
    });
  }

  /* === TESTIMONIALS YANDEX STARS === */
  document.querySelectorAll('.testimonial-stars').forEach(el => {
    const rating = parseFloat(el.dataset.rating || 5);
    el.innerHTML = Array.from({ length: 5 }, (_, i) => {
      const filled = i < Math.floor(rating);
      return `<svg width="16" height="16" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    }).join('');
  });

  /* === NUMBER FORMATTING === */
  document.querySelectorAll('[data-count]').forEach(el => {
    const n = parseFloat(el.dataset.count);
    const s = el.dataset.suffix || '';
    el.textContent = s ? n + s : n.toLocaleString('ru');
  });

  /* === QUIZ CALCULATOR === */
  (function initQuiz() {
    const quizEl = document.querySelector('.quiz-card');
    if (!quizEl) return;

    const state = { step: 0, answers: {} };
    const steps = quizEl.querySelectorAll('.quiz-step');
    const totalSteps = steps.length - 1; // last step is result
    const progressFill = quizEl.querySelector('.quiz-progress-fill');
    const progressText = quizEl.querySelector('.quiz-progress-text');
    const resultCard = quizEl.querySelector('.quiz-result-card');

    function showStep(idx) {
      steps.forEach((s, i) => {
        s.classList.toggle('active', i === idx);
      });
      state.step = idx;
      const isResult = idx >= totalSteps;
      if (progressFill) {
        progressFill.style.width = isResult ? '100%' : ((idx / totalSteps) * 100) + '%';
      }
      if (progressText) {
        progressText.textContent = isResult ? 'Готово!' : `Шаг ${idx + 1} из ${totalSteps}`;
      }
    }

    function getResult() {
      const obj = state.answers['object'] || '';
      const area = parseInt(state.answers['area'] || 0);
      const task = state.answers['task'] || '';

      if (obj === 'industrial') {
        return {
          title: 'Промышленная система',
          subtitle: 'Индивидуальный расчёт',
          price: 'от 150 000 ₽',
          perks: ['Проектирование включено', 'Монтаж под ключ', 'Гарантия 3 года', 'Сервисное обслуживание'],
          link: 'contacts.html',
          linkText: 'Получить расчёт'
        };
      }
      if (task === 'heat') {
        return {
          title: 'Тепловой насос',
          subtitle: 'Оптимально для отопления',
          price: 'от 50 000 ₽',
          perks: ['Отопление + ГВС', 'Экономия до 70%', 'Работает до −25°C', 'Гарантия 3 года'],
          link: 'heat-pumps.html',
          linkText: 'Подробнее о насосах'
        };
      }
      if (task === 'vent') {
        return {
          title: 'Система вентиляции',
          subtitle: 'Свежий воздух круглый год',
          price: 'от 50 000 ₽',
          perks: ['Приток + вытяжка', 'Рекуперация тепла', 'Тихая работа', 'Гарантия 3 года'],
          link: 'ventilation.html',
          linkText: 'Подробнее о вентиляции'
        };
      }
      if (task === 'all') {
        return {
          title: 'Комплексная система',
          subtitle: 'Климат + вентиляция под ключ',
          price: 'от 120 000 ₽',
          perks: ['Единый проект', 'Скидка 10% на комплекс', 'Монтаж в одни сроки', 'Гарантия 3 года'],
          link: 'contacts.html',
          linkText: 'Обсудить проект'
        };
      }
      // Default: AC by area
      let price = 'от 18 000 ₽';
      let model = 'настенный кондиционер';
      if (area > 50) { price = 'от 45 000 ₽'; model = 'мульти-сплит система'; }
      else if (area > 25) { price = 'от 28 000 ₽'; model = 'кондиционер 18-24 BTU'; }
      return {
        title: 'Кондиционер',
        subtitle: `Рекомендуем: ${model}`,
        price: price,
        perks: ['Установка за 1 день', 'Бесплатный замер', 'Гарантия 3 года', 'Сервис раз в год'],
        link: 'conditioners.html',
        linkText: 'Смотреть кондиционеры'
      };
    }

    function renderResult() {
      if (!resultCard) return;
      const r = getResult();
      resultCard.querySelector('.quiz-rc-title').textContent = r.title;
      resultCard.querySelector('.quiz-rc-subtitle').textContent = r.subtitle;
      resultCard.querySelector('.quiz-rc-price').textContent = r.price;
      const perksEl = resultCard.querySelector('.quiz-rc-perks');
      if (perksEl) {
        perksEl.innerHTML = r.perks.map(p =>
          `<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>${p}</li>`
        ).join('');
      }
      const linkEl = resultCard.querySelector('.quiz-rc-link');
      if (linkEl) { linkEl.href = r.link; linkEl.textContent = r.linkText; }
    }

    // Option click → save answer, advance step
    quizEl.querySelectorAll('.quiz-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        const stepEl = btn.closest('.quiz-step');
        stepEl.querySelectorAll('.quiz-opt').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        const key = btn.dataset.key;
        const val = btn.dataset.val;
        if (key) state.answers[key] = val;
        setTimeout(() => {
          const nextStep = state.step + 1;
          if (nextStep >= totalSteps) {
            renderResult();
          }
          showStep(nextStep);
        }, 220);
      });
    });

    // Back buttons
    quizEl.querySelectorAll('.quiz-back-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (state.step > 0) showStep(state.step - 1);
      });
    });

    // Restart
    const restartBtn = quizEl.querySelector('.quiz-restart-btn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        state.answers = {};
        quizEl.querySelectorAll('.quiz-opt').forEach(b => b.classList.remove('selected'));
        showStep(0);
      });
    }

    // Quiz form submission
    const quizForm = quizEl.querySelector('.quiz-form-wrap');
    if (quizForm) {
      quizForm.addEventListener('submit', e => {
        e.preventDefault();
        const nameVal = quizForm.querySelector('input[name="quiz-name"]');
        const phoneVal = quizForm.querySelector('input[name="quiz-phone"]');
        if (!nameVal || !phoneVal) return;
        if (!nameVal.value.trim() || !phoneVal.value.trim()) {
          [nameVal, phoneVal].forEach(f => {
            if (!f.value.trim()) f.classList.add('error');
          });
          return;
        }
        const submitBtn = quizForm.querySelector('.quiz-form-btn');
        if (submitBtn) {
          submitBtn.textContent = 'Отправлено! Скоро перезвоним';
          submitBtn.disabled = true;
          submitBtn.style.background = 'var(--green, #22c55e)';
        }
        fetch('https://formsubmit.co/ajax/artklimov77@yandex.com', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ _subject: 'Квиз NordicAir — ' + nameVal.value.trim(), name: nameVal.value.trim(), phone: phoneVal.value.trim() }) }).catch(() => {});
      });
      quizForm.querySelectorAll('input').forEach(inp => {
        inp.addEventListener('input', () => inp.classList.remove('error'));
      });
    }

    showStep(0);
  })();

  /* === COUNTDOWN TIMERS (promotions page) === */
  (function initCountdowns() {
    const timers = document.querySelectorAll('[data-countdown]');
    if (!timers.length) return;

    function pad(n) { return String(n).padStart(2, '0'); }

    function tick(el, target) {
      const diff = target - Date.now();
      if (diff <= 0) {
        el.querySelectorAll('.cd-num').forEach(n => n.textContent = '00');
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      const nums = el.querySelectorAll('.cd-num');
      if (nums[0]) nums[0].textContent = pad(d);
      if (nums[1]) nums[1].textContent = pad(h);
      if (nums[2]) nums[2].textContent = pad(m);
      if (nums[3]) nums[3].textContent = pad(s);
    }

    timers.forEach(el => {
      const target = new Date(el.dataset.countdown).getTime();
      if (isNaN(target)) return;
      tick(el, target);
      setInterval(() => tick(el, target), 1000);
    });
  })();

});
