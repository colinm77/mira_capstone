# baseline-v1 (frozen 2026-10-26, do not edit)

A snapshot of Mira exactly as it was for the baseline run. Changes made after this point are logged in [docs/06_change_log.md](../docs/06_change_log.md).

| Item | File |
|---|---|
| Results + human review (17 tests) | `results_with_human_review.csv` |
| Readable review page | `review_page.html` |
| All prompts, as in n8n (Orchestrator, 4 agents, 2 judges) | `prompts/` |
| Code nodes | `n8n_code/` |
| Final n8n workflow exports (taken right before the first change) | `n8n_export/` |
| Config and ground truth used | `mira_config.json`, `ground_truth.json` |

**Models:** Mira gpt-4o-mini · judges gpt-4.1 (temperature 0) · as-of date 2026-04-28.
