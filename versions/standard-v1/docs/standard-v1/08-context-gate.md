# Context Gate — cold-start test

STATUS: **READY для структурной visual iteration / NOT READY для финального hero A/B/C**
DATE: 2026-09-14
LANE: L2
STATE: PLANNED
NEXT ROLE: Builder

## Проверенный handoff
### INPUTS
- `01-project-intake.md`
- `02-blueprint.md`
- `03-acceptance-and-creative-review.md`
- `04-iteration-plan.md`
- `05-current-state.md`
- production baseline `main@13b5fc613103bc04a64dc64d6820111c2c0c4a9a`
- рабочая ветка `pilot/standard-v1`

### DECISIONS
- не переписывать сайт с нуля;
- production не менять до preview + independent PASS + решения владельца;
- сохранить «Карту внутренних территорий», живой тон, реальные фото и Morpho;
- motion hierarchy: journey line → локальные Morpho accents → преимущественно статичный знак;
- неподтверждённые цена/длительность/онлайн/перенос не публиковать.

### OUTPUT, который ожидается от Builder
Обратимая версия на `pilot/standard-v1`:
1. облегчённый контентный ритм;
2. более компактная подача документов;
3. выстроенная motion hierarchy;
4. сохранённый текущий hero как вариант A;
5. mobile/reduced-motion не ухудшены.

### UNKNOWN
- альтернативные 2–3 живые фотографии Надежды для честного hero B/C ещё не отобраны/не находятся в репозитории;
- условия приёма остаются неподтверждёнными.

### RISKS
- не подменить отсутствие новых фотографий AI-генерацией;
- не вырезать подтверждённый смысл только ради сокращения страницы;
- не считать старый QA PASS действительным после visual changes — review нужно повторить.

### NEXT
Builder может начинать структурную visual iteration без чтения полной истории чатов.
Финальный выбор hero остаётся BLOCKED до появления реальных альтернативных кадров и human review.

## Verdict Context Gate
**READY**: для content rhythm + credentials layout + motion hierarchy + технического preview.

**NOT READY**: для утверждения финального hero B/C и для production release.

Таким образом cold-start тест пройден частично именно так, как должен работать Standard v1: следующий агент понимает задачу, границы и риски из короткого пакета; неизвестные не маскируются под факты.
