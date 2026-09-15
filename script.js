'use strict';

const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.getElementById('mobile-nav');

function closeMenu(returnFocus = false) {
  if (!menuButton || !mobileNav) return;
  const wasOpen = !mobileNav.hidden;
  mobileNav.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Открыть меню');
  if (returnFocus && wasOpen) menuButton.focus();
}

if (menuButton && mobileNav) {
  menuButton.addEventListener('click', () => {
    const open = mobileNav.hidden;
    mobileNav.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  });
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(true); });
  document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
  window.matchMedia('(min-width: 1161px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
}

const topics = [...document.querySelectorAll('details[data-topic]')];
topics.forEach(item => item.addEventListener('toggle', () => {
  if (!item.open) return;
  requestAnimationFrame(() => {
    const headerBottom = document.querySelector('.header')?.getBoundingClientRect().bottom || 0;
    if (item.open && item.getBoundingClientRect().top < headerBottom + 12) {
      item.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  });
}));

function selectTopic(topic) {
  const selected = topics.find(item => item.dataset.topic === topic);
  if (!selected) throw new Error('Неизвестная тема');
  topics.forEach(item => { item.open = item === selected; });
  return { topic, title: selected.querySelector('.route-name')?.textContent || '' };
}

function openHashTopic() {
  const selected = topics.find(item => '#' + item.id === window.location.hash);
  if (selected) selectTopic(selected.dataset.topic);
}
window.addEventListener('hashchange', openHashTopic);
openHashTopic();

const morphoPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionToggle = document.getElementById('motion-toggle');
let morphoPaused = false;
try { morphoPaused = sessionStorage.getItem('nadezhda-morpho-paused') === 'yes'; } catch {}

function updateMorphoPreference() {
  const enabled = !morphoPaused && !morphoPreference.matches && !document.hidden;
  document.body.dataset.morphoMotion = enabled ? 'on' : 'off';
  if (motionToggle) {
    motionToggle.hidden = morphoPreference.matches;
    motionToggle.textContent = morphoPaused ? 'Включить полёт' : 'Остановить полёт';
  }
  document.dispatchEvent(new Event('morphomotionchange'));
}

motionToggle?.addEventListener('click', () => {
  morphoPaused = !morphoPaused;
  try { sessionStorage.setItem('nadezhda-morpho-paused', morphoPaused ? 'yes' : 'no'); } catch {}
  updateMorphoPreference();
});
morphoPreference.addEventListener('change', updateMorphoPreference);
document.addEventListener('visibilitychange', updateMorphoPreference);

if ('IntersectionObserver' in window) {
  const sceneObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('is-in-view', entry.isIntersecting));
  }, { threshold: 0 });
  document.querySelectorAll('.morpho-scene').forEach(scene => sceneObserver.observe(scene));
} else {
  document.querySelectorAll('.morpho-scene').forEach(scene => scene.classList.add('is-in-view'));
}
updateMorphoPreference();

// Scroll-driven route. Its geometry is measured only from real page content,
// never from the absolutely positioned SVG itself. This prevents height feedback loops.
(() => {
  const svg = document.getElementById('journey-track');
  const main = document.querySelector('main');
  const footer = document.querySelector('.footer');
  if (!svg || !main) return;

  const base = document.getElementById('journey-base');
  const progress = document.getElementById('journey-progress');
  const marker = document.getElementById('journey-marker');
  const stops = document.getElementById('journey-stops');
  const gradient = document.getElementById('journey-ink');
  const sections = [...document.querySelectorAll('main > section')];
  if (!base || !progress || !marker || !stops || !gradient || !sections.length) return;

  const navLinks = [...document.querySelectorAll('.desktop-nav a, .mobile-nav a[href^="#"]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const contact = document.getElementById('contact');
  const butterfly = document.getElementById('journey-butterfly');
  const heroButterflies = [...document.querySelectorAll('.hero-flight .morpho-flight')];
  const heroScene = document.querySelector('.hero-flight');
  const heroSection = document.getElementById('home');

  let butterflyRestTimer = 0;
  let butterflySize = 30;
  let flightGutter = 0;
  let heroEnd = 0;
  let lastButterflyY = -1;
  let points = [];
  let stopElements = [];
  let length = 0;
  let paintFrame = 0;
  let geometryFrame = 0;
  let currentIndex = -1;

  function contentBottom() {
    const last = footer || main;
    return Math.max(window.innerHeight, Math.ceil(last.getBoundingClientRect().bottom + window.scrollY));
  }

  function paint() {
    paintFrame = 0;
    if (!length || points.length < 2) return;

    const availableScroll = Math.max(1, contentBottom() - window.innerHeight);
    const fraction = Math.max(0, Math.min(1, window.scrollY / availableScroll));
    const targetY = points[0].y + fraction * (points[points.length - 1].y - points[0].y);
    let low = 0;
    let high = length;

    for (let i = 0; i < 14; i += 1) {
      const middle = (low + high) / 2;
      if (base.getPointAtLength(middle).y < targetY) low = middle;
      else high = middle;
    }

    const distance = fraction <= 0 ? 0 : fraction >= 1 ? length : (low + high) / 2;
    const position = base.getPointAtLength(distance);
    progress.setAttribute('stroke-dashoffset', reducedMotion.matches ? '0' : String(length - distance));
    marker.setAttribute('transform', `translate(${position.x} ${position.y})`);

    const motionEnabled = document.body.dataset.morphoMotion === 'on';
    if (heroScene?.classList.contains('is-in-view') && motionEnabled) {
      heroButterflies.forEach(item => {
        const factor = Number.parseFloat(getComputedStyle(item).getPropertyValue('--lift-factor')) || .06;
        item.style.setProperty('--scroll-lift', `${-Math.min(60, window.scrollY * factor)}px`);
      });
    }

    if (butterfly) {
      butterfly.hidden = !motionEnabled || window.scrollY < heroEnd;
      if (!butterfly.hidden) {
        const desiredY = Math.min(points.at(-1).y, window.scrollY + window.innerHeight * .46);
        let lo = 0;
        let hi = length;
        for (let i = 0; i < 12; i += 1) {
          const mid = (lo + hi) / 2;
          if (base.getPointAtLength(mid).y < desiredY) lo = mid;
          else hi = mid;
        }
        const flightDistance = (lo + hi) / 2;
        const flightPoint = base.getPointAtLength(flightDistance);
        const next = base.getPointAtLength(Math.min(length, flightDistance + 8));
        const turn = Math.max(-28, Math.min(28, Math.atan2(next.x - flightPoint.x, next.y - flightPoint.y) * 180 / Math.PI));
        const flightX = Math.max(1, Math.min(flightGutter - butterflySize - 2, flightPoint.x - butterflySize / 2));
        butterfly.style.transform = `translate3d(${flightX}px,${flightPoint.y - butterflySize / 2}px,0) rotate(${-turn}deg)`;
        butterfly.classList.add('is-ready');
        if (Math.abs(flightPoint.y - lastButterflyY) > .5) {
          butterfly.classList.add('is-flying');
          clearTimeout(butterflyRestTimer);
          butterflyRestTimer = setTimeout(() => butterfly.classList.remove('is-flying'), 250);
        }
        lastButterflyY = flightPoint.y;
      } else {
        butterfly.classList.remove('is-flying');
      }
    }

    svg.dataset.progress = fraction.toFixed(3);
    let nextIndex = 0;
    points.forEach((point, index) => { if (point.y <= targetY + 2) nextIndex = index; });
    if (nextIndex !== currentIndex) {
      currentIndex = nextIndex;
      stopElements.forEach((stop, index) => {
        stop.classList.toggle('is-passed', index < currentIndex);
        stop.classList.toggle('is-current', index === currentIndex);
      });
      navLinks.forEach(link => {
        if (link.hash === '#' + points[currentIndex].id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
  }

  function schedulePaint() {
    if (!paintFrame) paintFrame = requestAnimationFrame(paint);
  }

  function measure() {
    geometryFrame = 0;
    const width = document.documentElement.clientWidth;
    const height = contentBottom();
    const hero = document.querySelector('.hero');
    const gutter = hero?.getBoundingClientRect().left || 0;
    flightGutter = gutter;
    butterflySize = Math.min(width <= 680 ? 18 : 30, Math.max(12, gutter - 6));

    if (butterfly) {
      butterfly.style.width = butterflySize + 'px';
      butterfly.style.height = butterflySize + 'px';
    }

    if (heroSection) heroEnd = heroSection.offsetTop + heroSection.offsetHeight - window.innerHeight * .25;
    const centerX = Math.min(54, Math.max(8, gutter * .47));
    const wave = Math.min(22, gutter * .24);

    points = sections.map((section, index) => {
      const heading = section.querySelector('.eyebrow, h1, h2');
      const box = (heading || section).getBoundingClientRect();
      return {
        id: section.id,
        x: centerX + (index % 2 ? wave * .35 : -wave * .35),
        y: box.top + window.scrollY + box.height / 2
      };
    });

    let path = `M ${points[0].x} ${points[0].y}`;
    let previous = points[0];
    points.slice(1).forEach((end, sectionIndex) => {
      const start = previous;
      const count = Math.max(1, Math.ceil((end.y - start.y) / 190));
      for (let step = 1; step <= count; step += 1) {
        const point = step === count ? end : {
          x: centerX + Math.sin((sectionIndex + step) * 1.8) * wave,
          y: start.y + (end.y - start.y) * step / count
        };
        const rise = (point.y - previous.y) / 3;
        path += ` C ${previous.x} ${previous.y + rise}, ${point.x} ${point.y - rise}, ${point.x} ${point.y}`;
        previous = point;
      }
    });

    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.style.height = height + 'px';
    gradient.setAttribute('y2', String(height));
    base.setAttribute('d', path);
    progress.setAttribute('d', path);
    length = base.getTotalLength();
    progress.setAttribute('stroke-dasharray', `${length} ${length}`);

    stops.replaceChildren();
    stopElements = points.map(point => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('class', 'journey-stop');
      circle.setAttribute('cx', String(point.x));
      circle.setAttribute('cy', String(point.y));
      circle.setAttribute('r', width <= 680 ? '2.8' : '4');
      stops.append(circle);
      return circle;
    });

    currentIndex = -1;
    svg.removeAttribute('hidden');
    document.body.classList.add('journey-active');
    paint();
  }

  function scheduleGeometry() {
    if (!geometryFrame) geometryFrame = requestAnimationFrame(measure);
  }

  window.addEventListener('scroll', schedulePaint, { passive: true });
  window.addEventListener('resize', scheduleGeometry);
  reducedMotion.addEventListener('change', schedulePaint);
  document.addEventListener('morphomotionchange', schedulePaint);
  if ('ResizeObserver' in window) new ResizeObserver(scheduleGeometry).observe(main);
  if ('IntersectionObserver' in window && contact) {
    new IntersectionObserver(entries => {
      contact.classList.toggle('is-reached', entries[0].isIntersecting);
    }, { threshold: .2 }).observe(contact);
  } else {
    contact?.classList.add('is-reached');
  }
  document.fonts?.ready.then(scheduleGeometry);
  scheduleGeometry();
})();

if (document.modelContext?.registerTool) {
  const lifecycle = new AbortController();
  try {
    Promise.resolve(document.modelContext.registerTool({
      name: 'select_conversation_topic',
      title: 'Открыть тему для разговора',
      description: 'Раскрывает описание темы на странице. Не записывает на консультацию и не отправляет сообщения.',
      inputSchema: {
        type: 'object',
        properties: { topic: { type: 'string', enum: ['adult', 'quiet', 'relations', 'self', 'anxiety', 'direction'] } },
        required: ['topic'],
        additionalProperties: false
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        if (!input || typeof input !== 'object' || Object.keys(input).length !== 1 || typeof input.topic !== 'string') {
          throw new Error('Неизвестная тема');
        }
        return selectTopic(input.topic);
      }
    }, { signal: lifecycle.signal })).catch(() => {});
  } catch {}
  window.addEventListener('pagehide', () => lifecycle.abort(), { once: true });
}

const themeToggle = document.getElementById('theme-toggle');
const themeMeta = document.querySelector('meta[name="theme-color"]');

function applyTheme(theme) {
  if (theme === 'blue') document.documentElement.dataset.theme = 'blue';
  else delete document.documentElement.dataset.theme;
  if (themeMeta) themeMeta.content = theme === 'blue' ? '#f3f5f8' : '#f6f3eb';
  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', String(theme === 'blue'));
    themeToggle.querySelector('.theme-label').textContent = theme === 'blue' ? 'Палитра: синяя' : 'Палитра: песок';
  }
  try { localStorage.setItem('nadezhda-theme', theme); } catch {}
}

applyTheme(document.documentElement.dataset.theme === 'blue' ? 'blue' : 'sand');
themeToggle?.addEventListener('click', () => {
  applyTheme(document.documentElement.dataset.theme === 'blue' ? 'sand' : 'blue');
});

// Content polish: document accordion, map caption, and distributed original photos.
(() => {
  const styleId = 'content-polish-2026-09-15';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .education-panel > summary{cursor:pointer}
      .education-panel .education-grid{display:grid;grid-template-columns:1fr;gap:0;margin-top:20px}
      .education-detail{border-top:1px solid var(--line);background:transparent}
      .education-detail:last-child{border-bottom:1px solid var(--line)}
      .education-detail>summary{display:grid;grid-template-columns:minmax(0,1fr) 34px;align-items:center;gap:20px;padding:20px 8px;cursor:pointer;list-style:none}
      .education-detail>summary::-webkit-details-marker{display:none}
      .education-detail>summary:hover{background:var(--hover)}
      .education-detail__year{display:block;font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);margin-bottom:5px}
      .education-detail__title{display:block;font-family:var(--serif);font-size:1.55rem;line-height:1.2;color:var(--ink)}
      .education-detail__description{display:block;font-size:.86rem;line-height:1.55;color:var(--muted);margin-top:5px;max-width:760px}
      .education-detail__icon{display:block;position:relative;width:29px;height:29px;border:1px solid var(--icon-ring);border-radius:50%}
      .education-detail__icon:before,.education-detail__icon:after{content:'';position:absolute;background:var(--ink);left:8px;right:8px;height:1px;top:13px}
      .education-detail__icon:after{transform:rotate(90deg)}
      .education-detail[open] .education-detail__icon:after{display:none}
      .education-detail__body{padding:0 8px 24px}
      .education-detail__body img{height:auto;max-height:620px;object-fit:contain;object-position:left center}
      .education-detail__body .document-link,.education-detail__body .document-original{display:inline-flex;margin-top:12px}
      .map-caption-note{border-left:2px solid var(--accent);padding-left:14px;max-width:620px}
      .story-photo{margin-top:48px;display:block}
      .story-photo img{display:block;width:100%;height:auto;max-height:680px;object-fit:contain;border-radius:3px}
      .story-photo figcaption{font-size:.8125rem;line-height:1.65;color:var(--muted);margin-top:12px}
      .story-photo--routes{width:min(72%,760px);margin-left:auto}
      .story-photo--approach{width:min(64%,680px);margin-right:auto}
      .story-photo--space{width:min(70%,720px);margin-left:auto;margin-bottom:10px}
      @media(max-width:680px){
        .education-detail>summary{grid-template-columns:minmax(0,1fr) 30px;gap:12px;padding:17px 4px}
        .education-detail__title{font-size:1.35rem}
        .education-detail__description{font-size:.82rem}
        .education-detail__body{padding-inline:4px}
        .story-photo,.story-photo--routes,.story-photo--approach,.story-photo--space{width:100%;margin:34px 0 0}
        .story-photo img{max-height:none}
      }
    `;
    document.head.append(style);
  }

  const educationPanel = document.querySelector('.education-panel');
  if (educationPanel) {
    educationPanel.open = false;
    const grid = educationPanel.querySelector('.education-grid');
    if (grid && !grid.querySelector('.education-detail')) {
      [...grid.querySelectorAll(':scope > .education-item')].forEach((item, index) => {
        const yearNode = item.querySelector('.education-year');
        const titleNode = item.querySelector('h3');
        const descriptionNode = [...item.children].find(node => node.tagName === 'P' && !node.classList.contains('education-year'));
        const year = yearNode?.textContent.trim() || '';
        const title = titleNode?.textContent.trim() || `Документ ${index + 1}`;
        const description = descriptionNode?.textContent.trim() || '';
        yearNode?.remove();
        titleNode?.remove();
        descriptionNode?.remove();

        const details = document.createElement('details');
        details.className = 'education-detail';
        details.setAttribute('name', 'education-documents');
        const summary = document.createElement('summary');
        const text = document.createElement('span');
        text.innerHTML = `${year ? `<span class="education-detail__year">${year}</span>` : ''}<span class="education-detail__title"></span>${description ? `<span class="education-detail__description"></span>` : ''}`;
        text.querySelector('.education-detail__title').textContent = title;
        const descriptionTarget = text.querySelector('.education-detail__description');
        if (descriptionTarget) descriptionTarget.textContent = description;
        const icon = document.createElement('span');
        icon.className = 'education-detail__icon';
        icon.setAttribute('aria-hidden', 'true');
        summary.append(text, icon);

        const body = document.createElement('div');
        body.className = 'education-detail__body';
        while (item.firstChild) body.append(item.firstChild);
        details.append(summary, body);
        item.replaceWith(details);
      });

      const detailsItems = [...grid.querySelectorAll('.education-detail')];
      detailsItems.forEach(item => item.addEventListener('toggle', () => {
        if (!item.open) return;
        detailsItems.forEach(other => { if (other !== item) other.open = false; });
      }));
    }
  }

  const mapCaption = document.querySelector('.place-links p');
  if (mapCaption) {
    mapCaption.textContent = 'На карте место отмечено как «Нараяна». Психологический центр находится здесь же. Время и детали визита согласуем при записи.';
    mapCaption.classList.add('map-caption-note');
  }

  const gallery = document.querySelector('.studio-gallery');
  if (gallery) {
    const figures = [...gallery.querySelectorAll(':scope > figure')];
    const placements = [
      { anchor: document.querySelector('.work-list'), className: 'story-photo--routes' },
      { anchor: document.querySelector('#approach .process-note'), className: 'story-photo--approach' },
      { anchor: document.querySelector('#space .space-grid'), className: 'story-photo--space' }
    ];
    figures.forEach((figure, index) => {
      const placement = placements[index];
      if (!placement?.anchor) return;
      figure.classList.add('story-photo', placement.className);
      placement.anchor.insertAdjacentElement('afterend', figure);
    });
    gallery.remove();
  }
})();