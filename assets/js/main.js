// ===== 公共脚本 =====
document.addEventListener('DOMContentLoaded', () => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // ===== 全站登录状态检测 =====
  // 约定：导航栏中 <a id="navAuth" href="login.html">登录</a> 会被自动替换
  const API_BASE = 'https://api.newsistar.com';
  const navAuth = $('#navAuth');
  if (navAuth) {
    fetch(`${API_BASE}/api/auth/me`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(r => {
        if (!r || !r.data) return; // 未登录，保持"登录"按钮
        const u = r.data;
        navAuth.href = 'account.html';
        navAuth.innerHTML = u.is_admin
          ? '👑 ' + (u.display_name || u.username)
          : '🛡 ' + (u.display_name || u.username);
        navAuth.classList.add('nav-cta');
      })
      .catch(() => {}); // 网络失败静默处理
  }

  // 导航栏滚动效果
  const navbar = $('.navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // 移动端菜单
  const toggle = $('.nav-toggle');
  const menu = $('.nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => menu.classList.toggle('active'));
    menu.addEventListener('click', e => { if (e.target.tagName === 'A') menu.classList.remove('active'); });
  }

  // 高亮当前页面
  const path = location.pathname.split('/').pop() || 'index.html';
  $$('.nav-menu a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

  // 滚动淡入动画
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  $$('.feature-card, .map-card, .mod-item, .contact-card, .step, .stat-item, .about-preview, .content-section h2, .cta-card').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });

  // 复制按钮
  $$('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
        const orig = btn.textContent;
        btn.textContent = '✓ 已复制';
        btn.style.background = 'var(--success)';
        setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 1500);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); ta.remove();
        btn.textContent = '✓ 已复制';
        btn.style.background = 'var(--success)';
        setTimeout(() => { btn.textContent = btn.dataset.orig || '复制'; btn.style.background = ''; }, 1500);
      }
    });
  });

  // 数字滚动动画
  const animateNumbers = () => {
    $$('.stat-number').forEach(el => {
      if (el.dataset.animated) return;
      const text = el.textContent;
      const match = text.match(/([\d.]+)\s*(.*)/);
      if (!match) { el.dataset.animated = '1'; return; }
      const target = parseFloat(match[1]);
      const suffix = match[2] || '';
      const duration = 1500;
      const start = performance.now();
      const isFloat = target % 1 !== 0;
      const ease = t => 1 - Math.pow(1 - t, 3);

      const tick = now => {
        const p = Math.min((now - start) / duration, 1);
        const val = target * ease(p);
        el.textContent = (isFloat ? val.toFixed(1) : Math.floor(val)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else { el.textContent = text; el.dataset.animated = '1'; }
      };
      observer.observe(el, { threshold: 0.5 });
    });
  };
  animateNumbers();
});
