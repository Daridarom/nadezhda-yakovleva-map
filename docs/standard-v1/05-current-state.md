# CURRENT STATE — сайт Надежды Яковлевой

PROJECT: Надежда Яковлева — «Карта внутренних территорий»
LANE: L2
STATE: CREATIVE_REVIEW
ACTIVE ROLE: Creative / Product Director + Owner review
BASELINE/VERSION: production baseline = main@13b5fc613103bc04a64dc64d6820111c2c0c4a9a; pilot candidate = 783e52c64efe3866b57c15d6bd38c7c1559153da; staging = https://nadezhda-yakovleva-map.vercel.app
LAST UPDATED: 2026-09-14

## DONE / DECIDED
1. Зафиксированы Project Intake и Blueprint.
2. Независимая приёмка текущей production-версии дала verdict CONDITIONAL PASS.
3. Согласован принцип: не переписывать сайт с нуля, а улучшать существующую структуру.
4. Следующая визуальная итерация идёт отдельно от production.
5. Приоритеты итерации: hero comparison → content rhythm → motion hierarchy → технический polish → независимая приёмка.
6. Ролевая модель AI Штаба и handoff contract включены в пилот.
7. Builder собрал обратимую visual iteration: ритм страницы, компактная подача документов и иерархия motion.
8. Static/syntax/live staging checks пройдены; QA v1 = CONDITIONAL PASS.
9. Отдельный Vercel-стенд доступен для просмотра; исходный GitHub Pages production/main не изменён.

## UNKNOWN
- Какие 2–3 фотографии из последней большой подборки Надежды должны участвовать в сравнении hero B/C.
- Подтверждены ли стоимость, длительность, онлайн-формат и правила переноса — пока не публиковать.
- Нужна ли отдельная запись/календарь в ближайшей версии — пока Telegram остаётся единственным подтверждённым первым шагом.

## BLOCKERS
- Для полноценного hero A/B/C в репозитории пока нет отобранных альтернативных живых фотографий из последней подборки. Это не блокирует структурный/ритмический прототип, но блокирует честное финальное сравнение hero.

## STALE ARTIFACTS
- `03-acceptance-and-creative-review.md` остаётся валидным как baseline assessment исходной production-версии, но НЕ является текущим release verdict после visual changes.
- Текущие review-артефакты: `09-creative-review-v1.md` и `10-qa-review-v1.md`.
- Любое изменение позиционирования, ключевого CTA, подтверждённых фактов или структуры должно сначала обновить upstream-артефакт и пометить зависимые review-артефакты STALE.

## NEXT ACTION
1. Владелец смотрит staging и оценивает текущую структурную итерацию.
2. Найти/добавить 2–3 реальные альтернативные фотографии Надежды и собрать одинаковые hero A/B/C.
3. Creative/Product Director выбирает shortlist по единым критериям; финальный выбор — human approval.
4. После hero-изменения повторить QA, keyboard/reduced-motion regression и только затем переходить в RELEASE_READY.

## NEXT ROLE
Creative/Product Director + Owner → Builder (hero B/C) → QA/Red Team → Release/Ops.
Security подключается только если появятся новые внешние зависимости, analytics, формы, OAuth или скрипты.

## HUMAN APPROVAL NEEDED
- Для выбора финального hero после визуального сравнения.
- Для изменения позиционирования/ключевого смысла.
- Перед merge в main / production release.
