# Standard v1 — Artifact Validity / Change Invalidation

## Проблема
В длинном AI-проекте опаснее не отсутствие документа, а наличие убедительного, но уже устаревшего документа. Поэтому каждый gate должен учитывать не только наличие артефакта, но и его актуальность относительно текущего baseline.

## Dependency chain
Project Intake / confirmed facts
→ Blueprint / PROJECT_SPEC
→ PLAN / architecture / permissions
→ TASKS / implementation
→ ACCEPTANCE / QA verdict
→ RELEASE candidate / release log
→ CURRENT STATE.

## Правило STALE
Если меняется upstream-решение, все зависимые артефакты проверяются на влияние. Затронутый артефакт помечается STALE до сверки/обновления.

Примеры:
- меняется только отступ в карточке → Intake/Blueprint остаются VALID; QA для изменённого UI повторяется локально;
- меняется главный CTA/позиционирование → Blueprint + creative review + acceptance могут стать STALE;
- добавляется форма с персональными данными → architecture/permissions/security/acceptance становятся STALE;
- меняется подтверждённый адрес → контентные проверки и все места публикации адреса требуют повторной сверки;
- меняется внешний API/MCP → Integration + Security + relevant QA становятся STALE.

## Decision diff
Перед обновлением утверждённого upstream-артефакта фиксировать:
- WHAT CHANGED;
- WHY;
- SOURCE / OWNER;
- IMPACTED ARTIFACTS;
- REQUIRED RECHECK;
- HUMAN APPROVAL, если меняется цель/scope/риск.

## Gate rule
Нельзя переходить в BUILDING или RELEASE_READY, если критический upstream-артефакт имеет статус STALE или CONFLICT.

## Для пилота Надежды
Текущие Intake, Blueprint и Acceptance считаются VALID на baseline main@13b5fc613103bc04a64dc64d6820111c2c0c4a9a.

Визуальная переработка hero/ритма без изменения подтверждённых фактов не делает Intake STALE. Но итоговый Creative Review и QA обязательно пересоздаются для нового preview.

Если в процессе будут подтверждены цена, длительность, онлайн-формат или правила переноса, это изменение фактов: контентные участки, первая встреча и acceptance должны быть повторно сверены перед release.
