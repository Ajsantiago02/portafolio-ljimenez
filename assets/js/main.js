/* ==========================================================================
   Portafolio · Ing. Santiago Jiménez
   Interacciones: preloader, tema, menú, scroll, typewriter, contadores,
   cursores magnéticos, formularios y utilidades.
   Vanilla JS, sin dependencias. Compatible con prefers-reduced-motion.
   ========================================================================== */
(() => {
  'use strict';

  /* Helpers ---------------------------------------------------------- */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = () => window.matchMedia('(min-width: 1024px)').matches;

  /* -------------------------------------------------------------------
     1. Preloader
     Simula la carga y retira la pantalla con un fundido suave.
     ------------------------------------------------------------------- */
  function initPreloader() {
    const preloader = $('#preloader');
    const bar = $('#preloader-bar');
    if (!preloader || !bar) return;

    // Si el usuario prefiere menos movimiento, lo retiramos de inmediato.
    if (reduceMotion) {
      preloader.remove();
      return;
    }

    let progress = 0;
    const tick = setInterval(() => {
      progress = Math.min(progress + Math.random() * 18 + 6, 100);
      bar.style.width = progress + '%';
      if (progress >= 100) clearInterval(tick);
    }, 130);

    const finish = () => {
      clearInterval(tick);
      bar.style.width = '100%';
      setTimeout(() => {
        preloader.classList.add('is-done');
        document.body.style.removeProperty('overflow');
        setTimeout(() => preloader.remove(), 750);
      }, 320);
    };

    // No bloqueamos más de 1.4 s aunque algo falle.
    setTimeout(finish, 1400);
    window.addEventListener('load', () => setTimeout(finish, 420), { once: true });
  }

  /* -------------------------------------------------------------------
     2. Tema claro / oscuro
     Respeta la preferencia del sistema y la recuerda en localStorage.
     ------------------------------------------------------------------- */
  function initTheme() {
    const root = document.documentElement;
    const btn = $('#theme-toggle');
    const KEY = 'sj-portfolio-theme';

    const stored = (() => { try { return localStorage.getItem(KEY); } catch { return null; } })();
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    const initial = stored || (prefersLight ? 'light' : 'dark');

    const apply = (theme) => {
      root.classList.toggle('dark', theme === 'dark');
      if (btn) btn.setAttribute('aria-pressed', String(theme === 'dark'));
    };
    apply(initial);

    btn?.addEventListener('click', () => {
      const next = root.classList.contains('dark') ? 'light' : 'dark';
      apply(next);
      try { localStorage.setItem(KEY, next); } catch { /* modo privado */ }
    });
  }

  /* -------------------------------------------------------------------
     3. Menú móvil
     ------------------------------------------------------------------- */
  function initMobileMenu() {
    const toggle = $('#menu-toggle');
    const menu = $('#mobile-menu');
    if (!toggle || !menu) return;

    const burger = $('.hamburger', toggle);
    const openBtnLabel = toggle.getAttribute('aria-label');

    const setOpen = (open) => {
      menu.classList.toggle('hidden', !open);
      if (open) {
        // Fuerza reflow para que la transición de entrada se aplique.
        void menu.offsetWidth;
        menu.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      } else {
        menu.classList.remove('is-open');
        document.body.style.removeProperty('overflow');
      }
      burger?.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : openBtnLabel);
    };

    toggle.addEventListener('click', () => setOpen(menu.classList.contains('hidden')));
    $$('[data-menu-close], .mobile-link', menu).forEach((el) => el.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.classList.contains('hidden')) setOpen(false);
    });
    // Al pasar a escritorio, nos aseguramos de cerrar el menú móvil.
    window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => {
      if (e.matches) setOpen(false);
    });
  }

  /* -------------------------------------------------------------------
     4. Navbar: sombra al hacer scroll, progreso de lectura y enlace activo
     ------------------------------------------------------------------- */
  function initNavbar() {
    const shell = $('#nav-shell');
    const progress = $('#scroll-progress');
    const navLinks = $$('#nav-links .nav-link');
    const sections = navLinks
      .map((a) => document.getElementById(a.getAttribute('href').slice(1)))
      .filter(Boolean);

    let ticking = false;
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;

      shell?.classList.toggle('is-scrolled', y > 24);
      if (progress) progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';

      // Enlace activo: la última sección cuyo inicio ya pasó el centro de pantalla.
      const marker = y + window.innerHeight * 0.32;
      let activeId = '';
      sections.forEach((s) => { if (s.offsetTop <= marker) activeId = s.id; });

      navLinks.forEach((a) => {
        const isActive = a.getAttribute('href') === '#' + activeId;
        a.classList.toggle('is-active', isActive);
        if (isActive) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
    onScroll();
  }

  /* -------------------------------------------------------------------
     5. Animaciones de entrada al hacer scroll
     Barrido geométrico limitado con requestAnimationFrame: se revisan solo los
     elementos que faltan por mostrarse y, al terminar todos, se desconectan los
     listeners. Así el coste es mínimo y el contenido nunca queda invisible.
     ------------------------------------------------------------------- */
  function initReveal() {
    let pending = $$('.reveal');
    if (!pending.length) return;

    if (reduceMotion) {
      pending.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    let ticking = false;

    const sweep = () => {
      // Revelamos hasta un 8% por encima del borde inferior: el elemento ya
      // está animándose cuando entra en pantalla, no justo al aparecer.
      const limit = window.innerHeight * 0.92;

      pending = pending.filter((el) => {
        // "top" por debajo de la línea de revelación = ya lo vimos o está fuera.
        if (el.getBoundingClientRect().top < limit) {
          el.classList.add('is-visible');
          return false;
        }
        return true;
      });

      if (!pending.length) {           // todo revelado: liberamos los listeners
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => { ticking = false; sweep(); });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    sweep();                           // revela lo que ya esté en pantalla al cargar
  }

  /* -------------------------------------------------------------------
     6. Typewriter del hero
     Escribe y borra los títulos profesionales uno tras otro.
     ------------------------------------------------------------------- */
  function initTypewriter() {
    const el = $('#typewriter');
    if (!el) return;

    const roles = [
      'Frontend Developer',
      'Ingeniería CFDI & Automatización',
      'Arquitectura DDD',
      'Branding & Identidad Visual',
    ];

    if (reduceMotion) { el.textContent = roles[0]; return; }

    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const type = () => {
      const word = roles[roleIndex];
      charIndex += deleting ? -1 : 1;
      el.textContent = word.slice(0, charIndex);

      let delay = deleting ? 45 : 85;
      if (!deleting && charIndex === word.length) { deleting = true; delay = 1900; }
      else if (deleting && charIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; delay = 320; }

      setTimeout(type, delay);
    };
    setTimeout(type, 900);
  }

  /* -------------------------------------------------------------------
     7. Contadores animados de las métricas
     ------------------------------------------------------------------- */
  function initCounters() {
    const counters = $$('.stat-number');
    if (!counters.length) return;

    const run = (el) => {
      const target = parseFloat(el.dataset.target) || 0;
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const final = prefix + target + suffix;

      // Escribimos el valor real de inmediato: si requestAnimationFrame llegara a
      // pausarse (pestaña en segundo plano), el número nunca se queda en cero.
      el.textContent = final;
      if (reduceMotion) return;

      const duration = 1500;
      const start = performance.now();

      const step = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        el.textContent = prefix + Math.round(target * eased) + suffix;
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = final;
      };
      requestAnimationFrame(step);
    };

    if (reduceMotion || !('IntersectionObserver' in window)) {
      counters.forEach((el) => {
        el.textContent = (el.dataset.prefix || '') + el.dataset.target + (el.dataset.suffix || '');
      });
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { run(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });

    counters.forEach((el) => io.observe(el));
  }

  /* -------------------------------------------------------------------
     8. Botones magnéticos (solo escritorio y sin reduced-motion)
     ------------------------------------------------------------------- */
  function initMagneticButtons() {
    if (reduceMotion || !isDesktop()) return;

    $$('.btn-primary, .btn-icon').forEach((btn) => {
      btn.classList.add('is-magnetic');
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  /* -------------------------------------------------------------------
     9. Halo que sigue al cursor dentro de las tarjetas
     ------------------------------------------------------------------- */
  function initCardSpotlight() {
    if (reduceMotion || !isDesktop()) return;

    $$('.project-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
      });
    });
  }

  /* -------------------------------------------------------------------
     10. Halo global que sigue al mouse
     ------------------------------------------------------------------- */
  function initCursorGlow() {
    const glow = $('#cursor-glow');
    if (!glow || reduceMotion || !isDesktop()) return;

    // Invisible hasta el primer movimiento del mouse, para no "flotar" arriba a la izquierda.
    let active = false;
    let x = 0, y = 0, tx = 0, ty = 0;

    window.addEventListener('mousemove', (e) => {
      tx = e.clientX; ty = e.clientY;
      if (!active) { active = true; x = tx; y = ty; glow.style.opacity = '1'; }
    }, { passive: true });

    // Interpolación suave: el halo "persigue" al cursor con inercia.
    const loop = () => {
      if (active) {
        x += (tx - x) * 0.08;
        y += (ty - y) * 0.08;
        glow.style.left = x + 'px';
        glow.style.top = y + 'px';
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  /* -------------------------------------------------------------------
     11. Botón "volver arriba"
     ------------------------------------------------------------------- */
  function initBackToTop() {
    const btn = $('#back-to-top');
    if (!btn) return;

    const onScroll = () => {
      const visible = window.scrollY > 600;
      btn.classList.toggle('opacity-0', !visible);
      btn.classList.toggle('translate-y-4', !visible);
      btn.classList.toggle('pointer-events-none', !visible);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
    onScroll();
  }

  /* -------------------------------------------------------------------
     12. Notificación tipo toast
     ------------------------------------------------------------------- */
  let toastTimer;
  function showToast(message, extraClass = '') {
    const toast = $('#toast');
    const text = $('#toast-text');
    if (!toast || !text) return;

    toast.className = 'pointer-events-none fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 translate-y-6 rounded-2xl border border-white/10 bg-ink-900/95 px-5 py-3 text-sm text-white opacity-0 shadow-2xl transition-all duration-400 dark:border-white/10';
    if (extraClass) toast.classList.add(extraClass);
    text.textContent = message;
    toast.classList.remove('opacity-0', 'translate-y-6');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.add('opacity-0', 'translate-y-6'), 2600);
  }

  /* -------------------------------------------------------------------
     13. Copiar correo al portapapeles
     ------------------------------------------------------------------- */
  function initCopyEmail() {
    const email = 'santiagoluis28394@gmail.com';
    $$('a[href^="mailto:"]').forEach((link) => {
      link.addEventListener('click', async (e) => {
        // En escritorio, copiamos al portapapeles sin romper el flujo de mailto.
        if (!navigator.clipboard) return;
        e.preventDefault();
        try {
          await navigator.clipboard.writeText(email);
          showToast('Correo copiado al portapapeles ✦');
        } catch {
          window.location.href = 'mailto:' + email;
        }
      });
    });
  }

  /* -------------------------------------------------------------------
     14. Formulario de contacto
     Valida los campos y compone el mensaje para WhatsApp (sin backend).
     ------------------------------------------------------------------- */
  function initContactForm() {
    const form = $('#contact-form');
    if (!form) return;

    const WA_NUMBER = '524525269616';
    const fields = {
      name:    { el: $('#name'),    msg: 'Escribe tu nombre.' },
      email:   { el: $('#email'),   msg: 'Escribe un correo válido.' },
      subject: { el: $('#subject'), msg: 'Selecciona un motivo.' },
      message: { el: $('#message'), msg: 'Cuéntame brevemente sobre tu proyecto.' },
    };
    const successBox = $('#form-success');
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const showError = (key, msg) => {
      const { el } = fields[key];
      el.classList.add('has-error');
      const box = form.querySelector(`[data-error-for="${key}"]`);
      if (box) box.textContent = msg;
    };
    const clearError = (key) => {
      fields[key].el.classList.remove('has-error');
      const box = form.querySelector(`[data-error-for="${key}"]`);
      if (box) box.textContent = '';
    };

    // Validación en vivo: el error desaparece al corregir.
    Object.entries(fields).forEach(([key, { el }]) => {
      el.addEventListener('input',  () => clearError(key));
      el.addEventListener('change', () => clearError(key));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;

      Object.entries(fields).forEach(([key, { el, msg }]) => {
        const value = el.value.trim();
        if (!value) { showError(key, msg); ok = false; }
        else if (key === 'email' && !emailRe.test(value)) { showError(key, msg); ok = false; }
        else if (key === 'message' && value.length < 10) { showError(key, 'Agrega un poco más de detalle (mínimo 10 caracteres).'); ok = false; }
      });

      if (!ok) { form.querySelector('.has-error')?.focus(); return; }

      const name    = fields.name.el.value.trim();
      const email   = fields.email.el.value.trim();
      const subject = fields.subject.el.value.trim();
      const message = fields.message.el.value.trim();

      const text =
        `Hola Santiago, te escribo desde tu portafolio.%0A%0A` +
        `*Nombre:* ${encodeURIComponent(name)}%0A` +
        `*Correo:* ${encodeURIComponent(email)}%0A` +
        `*Motivo:* ${encodeURIComponent(subject)}%0A%0A` +
        `${encodeURIComponent(message)}`;

      // Estado de éxito + apertura de WhatsApp con el mensaje listo.
      if (successBox) {
        successBox.classList.remove('hidden');
        successBox.classList.add('flex');
        setTimeout(() => { successBox.classList.add('hidden'); successBox.classList.remove('flex'); }, 6000);
      }

      window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, '_blank', 'noopener');
      showToast('Abriendo WhatsApp… 🏴‍☠️', 'success');
      form.reset();
      Object.keys(fields).forEach(clearError);
    });

    // El enlace de WhatsApp también se actualiza con el motivo seleccionado.
    const waFallback = $('#wa-fallback');
    fields.subject.el.addEventListener('change', () => {
      if (!waFallback) return;
      const motivo = fields.subject.el.value.trim();
      waFallback.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
        motivo ? `Hola Santiago, te escribo desde tu portafolio. Me interesa: ${motivo}.` : 'Hola Santiago, te escribo desde tu portafolio.'
      )}`;
    });
  }

  /* -------------------------------------------------------------------
     15. Scroll suave para enlaces internos con offset del navbar
     ------------------------------------------------------------------- */
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        if (!id || id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;

        e.preventDefault();
        const offset = 88; // altura aproximada del navbar
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
        history.replaceState(null, '', id);
      });
    });
  }

  /* -------------------------------------------------------------------
     16. Año del footer
     ------------------------------------------------------------------- */
  function initYear() {
    const el = $('#year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* -------------------------------------------------------------------
     17. Konami Code → Soul Society mode
     ↑↑↓↓←→←→BA
     ------------------------------------------------------------------- */
  function initKonamiCode() {
    const sequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','KeyB','KeyA'];
    let idx = 0;
    window.addEventListener('keydown', (e) => {
      if (e.code === sequence[idx]) {
        idx++;
        if (idx === sequence.length) {
          document.documentElement.classList.add('soul-society');
          showToast('BANKAI... Soul Society mode activado 🏴‍☠️');
          idx = 0;
        }
      } else {
        idx = e.code === sequence[0] ? 1 : 0;
      }
    });
  }

  /* -------------------------------------------------------------------
     18. Kon (mod-soul) — triple click en footer
     ------------------------------------------------------------------- */
  function initKonEasterEgg() {
    const footer = $('footer');
    if (!footer) return;
    let clicks = 0, timer = null;
    footer.addEventListener('click', () => {
      clicks++;
      if (clicks === 1) timer = setTimeout(() => clicks = 0, 600);
      if (clicks === 3) {
        clearTimeout(timer);
        clicks = 0;
        spawnKon();
      }
    });
  }

  function spawnKon() {
    if (document.querySelector('.kon-hidden')) return;
    const kon = document.createElement('div');
    kon.className = 'kon-hidden';
    kon.setAttribute('aria-hidden', 'true');
    document.body.appendChild(kon);
    setTimeout(() => { kon.remove(); }, 8000);
  }

  /* -------------------------------------------------------------------
     19. Modal de certificaciones
     ------------------------------------------------------------------- */
  function initCertModal() {
    const modal = $('#cert-modal');
    const closeBtn = $('#cert-modal-close');
    const viewBtn = $('#cert-modal-view');
    const overlay = modal?.querySelector('[data-cert-close]');
    if (!modal) return;

    // Función robusta para ocultar
    const hideModal = () => {
      modal.classList.add('hidden');
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.removeProperty('overflow');
    };

    const showModal = () => {
      modal.classList.remove('hidden');
      modal.style.display = 'flex';
      modal.removeAttribute('aria-hidden');
      document.body.style.overflow = 'hidden';
    };

    const open = (card) => {
      const badge = card.querySelector('.cert-badge');
      const title = card.querySelector('.cert-title');
      const instructor = card.querySelector('.cert-instructor');
      const desc = card.querySelector('.cert-desc');
      const skills = card.querySelectorAll('.cert-skills li');
      const url = card.getAttribute('data-cert-url');

      $('#cert-modal-badge').textContent = badge?.textContent || '';
      $('#cert-modal-badge').className = 'cert-badge';
      $('#cert-modal-title').textContent = title?.textContent || '';
      $('#cert-modal-instructor').textContent = instructor?.textContent || '';
      $('#cert-modal-desc').textContent = desc?.textContent || '';

      const skillsContainer = $('#cert-modal-skills');
      skillsContainer.innerHTML = '';
      skills.forEach((s) => {
        const span = document.createElement('span');
        span.textContent = s.textContent;
        skillsContainer.appendChild(span);
      });

      if (url) {
        viewBtn.href = url;
        viewBtn.classList.remove('hidden');
      } else {
        viewBtn.classList.add('hidden');
      }

      showModal();
      // Focus trap
      closeBtn?.focus();
    };

    const close = () => {
      hideModal();
    };

    // Click en card
    $$('.cert-card').forEach((card) => {
      card.addEventListener('click', () => open(card));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(card); }
      });
    });

    // Cerrar
    [closeBtn, overlay].forEach((el) => el?.addEventListener('click', close));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) close();
    });
  }

  /* -------------------------------------------------------------------
     Arranque
     ------------------------------------------------------------------- */
  function init() {
    document.body.style.overflow = 'hidden'; // evita scroll durante el preloader
    initPreloader();
    initTheme();
    initMobileMenu();
    initNavbar();
    initReveal();
    initTypewriter();
    initCounters();
    initMagneticButtons();
    initCardSpotlight();
    initBackToTop();
    initCertModal();
    initCopyEmail();
    initContactForm();
    initSmoothScroll();
    initKonamiCode();
    initKonEasterEgg();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
