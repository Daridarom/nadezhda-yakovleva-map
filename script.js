'use strict';
(() => {
  const core = document.createElement('script');
  core.src = 'script-core.js';
  core.async = false;
  core.onload = () => {
    const experience = document.querySelector('.experience-note strong');
    if (experience) experience.textContent = '11 лет';

    const lead = document.querySelector('.about-copy .lead');
    if (lead) lead.textContent = 'Мне важно, чтобы рядом со мной не нужно было производить правильное впечатление. В терапию можно приходить без роли и без необходимости выглядеть собранно: с силой, растерянностью, усталостью и живыми чувствами.';

    const hero = document.querySelector('.hero-photo img');
    if (hero) hero.alt = 'Надежда Яковлева — портрет в парке';

    const about = document.querySelector('.about-photo img');
    if (about) about.alt = 'Надежда в творческом пространстве';

    const consultation = document.querySelector('.story-photo--routes img');
    if (consultation) consultation.alt = 'Надежда во время консультации';
    const consultationCaption = document.querySelector('.story-photo--routes figcaption');
    if (consultationCaption) consultationCaption.textContent = 'В работе для меня важны контакт, внимание и живой диалог.';
  };
  core.onerror = () => console.error('Не удалось загрузить основной сценарий сайта');
  document.head.append(core);
})();
