# Standard v1 — Role Router / State Machine

## Зачем
Standard v1 не является жёсткой цепочкой из десяти обязательных ролей. Диспетчер выбирает минимальный безопасный маршрут по текущему состоянию проекта, масштабу изменения и риску.

## Lanes
- L0 — ответ/анализ/микроправка без значимого внешнего риска.
- L1 — локальное обратимое изменение существующего проекта: spec-lite → build → independent QA → state update.
- L2 — многоэтапный проект, редизайн, новый продукт, несколько агентов/интеграций: полный production pipeline с нужными ветвлениями.
- L3 — чувствительные данные, платежи, массовые действия, критичная infrastructure или высокий ущерб ошибки: L2 + ранний Security, усиленный QA, approvals и rollback checks.

## States
INTAKE → SPEC_READY → PLANNED → BUILDING → [INTEGRATING] → [CREATIVE_REVIEW] → QA_REVIEW → [SECURITY_REVIEW] → RELEASE_READY → RELEASED.

Любое состояние может перейти в BLOCKED.
Квадратные состояния необязательны: например, backend без UI может миновать Creative Review; статический сайт без новых внешних зависимостей не требует отдельного Security review на каждом цикле.

## Router rules
1. Сначала прочитать CURRENT STATE, а не полный чат.
2. Определить lane по риску, масштабу и обратимости, а не по «важности на словах».
3. Выбрать минимальный набор ролей, который закрывает задачу и обязательные gates.
4. Для каждой следующей роли зафиксировать WHY NOW / INPUT / EXPECTED OUTPUT / GATE.
5. Если меняется upstream-решение (цель, scope, подтверждённый факт, архитектура), зависимые артефакты получают STALE.
6. Старый PASS не переносится автоматически через критичное изменение.
7. Любой необратимый внешний шаг, новый OAuth/secret, mass send, payment, delete или production deploy требует отдельной проверки и human approval.
8. Если следующая роль вынуждена угадывать факты/версии/права — handoff NOT READY.

## Stop conditions
Перевести проект в BLOCKED и задать владельцу конкретный вопрос, если:
- не хватает критического факта;
- источники конфликтуют и от выбора зависит результат;
- есть BLOCKER QA/Security;
- требуются новые секреты, OAuth или доступ к внешним данным;
- действие необратимо или дорого;
- неясны права на данные/код/материалы;
- критичный upstream-артефакт STALE.

## Handoff contract
Каждая передача роли содержит:
INPUTS → DECISIONS → OUTPUT → UNKNOWN → RISKS → NEXT.

Если пакет недостаточен, Context Gate возвращает NOT READY и минимальный список недостающего.

## Текущий маршрут пилота сайта Надежды
Lane: L2.
State: PLANNED.
Активная роль: Builder.
Маршрут: Builder → Creative/Product Director → QA/Red Team → Release/Ops → Knowledge Steward.
Platform Integrator/Security подключаются только при появлении новых интеграций/скриптов/analytics/forms/OAuth.

Проект не должен переходить в RELEASE_READY до визуального preview, независимого PASS и явного подтверждения владельца на merge/production.
