# Models, Sampling Temperature and tools (from the n8n exports)

## Mira - Evaluation

| Node | Model | Sampling Temperature | Tools |
|---|---|---|---|
| Groundedness judge | gpt-4.1 | 0 | — |
| Correctness judge | gpt-4.1 | 0 | — |

## Mira Main

| Node | Model | Sampling Temperature | Tools |
|---|---|---|---|
| Planner | gpt-4o-mini | 0 | get_description, get_risks, get_timeline |
| Orchestrator | gpt-4o-mini | 0 | — |
| Risk | gpt-4o-2024-11-20 | 0 | get_description1, get_overdue_or_blocked, get_risks1 |
| Status | gpt-4o-2024-11-20 | 0 | get_overdue_or_blocked1, get_tasks, get_upcoming_milestones |
| Stakeholder | gpt-4o-mini | 0 | get_overdue_or_blocked2, get_tasks1 |

## Mira Save Doc

| Node | Model | Sampling Temperature | Tools |
|---|---|---|---|

## Mira Stakeholder Approval

| Node | Model | Sampling Temperature | Tools |
|---|---|---|---|
| Basic LLM Chain | gpt-4o-mini | default | — |

## Mira Tools

| Node | Model | Sampling Temperature | Tools |
|---|---|---|---|
