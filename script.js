'use strict';
const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
function closeMenu(returnFocus = false) {
  const wasOpen = !mobileNav.hidden;
  mobileNav.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Открыть меню');
  if (returnFocus && wasOpen) menuButton.focus();
}
menuButton.addEventListener('click', () => {
  const open = mobileNav.hidden;
  mobileNav.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(true); });
document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
const desktopQuery = window.matchMedia('(min-width: 981px)');
desktopQuery.addEventListener('change', event => { if (event.matches) closeMenu(); });

const topics = [...document.querySelectorAll('details[data-topic]')];
topics.forEach(item => item.addEventListener('toggle', () => {
  if (!item.open) return;
  requestAnimationFrame(() => {
    const headerBottom = document.querySelector('.header').getBoundingClientRect().bottom;
    if (item.open && item.getBoundingClientRect().top < headerBottom + 12) {
      item.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  });
}));
function selectTopic(topic) {
  const selected = topics.find(item => item.dataset.topic === topic);
  if (!selected) throw new Error('Неизвестная тема');
  topics.forEach(item => { item.open = item === selected; });
  return { topic, title: selected.querySelector('.route-name').textContent };
}
// The native details controls also work without JavaScript.
function openHashTopic() {
  const selected = topics.find(item => '#' + item.id === window.location.hash);
  if (selected) selectTopic(selected.dataset.topic);
}
window.addEventListener('hashchange', openHashTopic);
openHashTopic();

if (document.modelContext?.registerTool) {
  const lifecycle = new AbortController();
  try {
    Promise.resolve(document.modelContext.registerTool({
      name: 'select_conversation_topic',
      title: 'Открыть тему для разговора',
      description: 'Раскрывает описание темы на странице. Не записывает на консультацию и не отправляет сообщения.',
      inputSchema: { type: 'object', properties: { topic: { type: 'string', enum: ['adult', 'quiet', 'relations', 'self'] } }, required: ['topic'], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        if (!input || typeof input !== 'object' || Object.keys(input).length !== 1 || typeof input.topic !== 'string') throw new Error('Неизвестная тема');
        return selectTopic(input.topic);
      }
    }, { signal: lifecycle.signal })).catch(() => {});
  } catch {}
  window.addEventListener('pagehide', () => lifecycle.abort(), { once: true });
}
