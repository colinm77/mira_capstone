# final-v1 (frozen 2026-10-27, do not edit)

A snapshot of Mira exactly as it was for the 3 final runs (after CHG-16). Compare with [`baseline-v1/`](../baseline-v1/); every change in between is logged in [docs/06_change_log.md](../docs/06_change_log.md).

| Item | File |
|---|---|
| n8n workflow exports (taken after the final runs) — **the source of truth** | `n8n_export/` |
| All prompts, as in n8n (Orchestrator, 4 agents, redraft step, 2 judges) | `prompts/` |
| All Code nodes, as in n8n | `n8n_code/` |
| Model, Sampling Temperature and tools per agent | `models_and_tools.md` |
| Results + human review (3 runs × 17 tests) | `final-1.csv`, `final-2.csv`, `final-3.csv` |
| The whole results sheet: every run tab, the summary tab and the test set (Excel copy; formulas use Google Sheets functions, so the [live sheet](https://docs.google.com/spreadsheets/d/1s5ycENt8-rFJuF1IEpWRB79vfeizXutrNx4_s-dDzVc/edit?usp=sharing) is the reference) | `mira_eval_results.xlsx` |
| Readable review pages | `final-1.html`, `final-2.html`, `final-3.html` |
| Summary of the 3 metrics (import into the results sheet, tab `summary`) | `summary_tab.csv` |
| Eval dataset as used (17 tests, with the judge's `criteria`) | `eval_dataset.csv` |
| Config and ground truth used | `mira_config.json`, `ground_truth.json` |

`prompts/`, `n8n_code/` and `models_and_tools.md` were generated from the exports with `python scripts/extract_workflows.py final-v1`.

**Models:** Orchestrator, Planner, Stakeholder gpt-4o-mini · Risk and Status gpt-4o (`gpt-4o-2024-11-20`) · judges gpt-4.1 · Sampling Temperature 0 on all of them (except the Stakeholder redraft step, which is not evaluated) · as-of date 2026-04-28.

**What changed from baseline-v1** (details in the change log)

| Part | baseline-v1 | final-v1 | Change |
|---|---|---|---|
| Orchestrator prompt | v1 | v1 (unchanged; v2–v4 were tried and rejected) | CHG-08 … CHG-12 |
| Clarify Code node | uses the Orchestrator's "missing" list | fixed list per intent (`mira_main__clarify.js`) | CHG-12 |
| "Enough data?" If node | sufficient AND intent ≠ unclear | (sufficient OR message names "abcde") AND intent ≠ unclear | CHG-15 |
| Planner | v1, gpt-4o-mini | unchanged | — |
| Risk agent | v1, gpt-4o-mini | prompt v4, **gpt-4o** | CHG-02, CHG-04, CHG-14 |
| Status agent | v1, gpt-4o-mini | prompt v5, **gpt-4o** | CHG-05, CHG-06, CHG-09, CHG-10, CHG-16 |
| Stakeholder agent | v1, tool get_tasks | prompt v2, tools get_tasks + get_overdue_or_blocked | CHG-13 |
| Correctness judge | v1 | v6 (rubric, evidence quotes) | CHG-01 … CHG-07b |
| Groundedness judge | v1 | unchanged | — |
| All models | default temperature | Sampling Temperature 0 | CHG-03 |
| Mira Stakeholder Approval | `source` field not published | published with `source`, so eval runs skip Slack | Fix (change log) |

**Note on `baseline-v1/n8n_code/mira_tools__return_tasks.js`:** that copy is older than the baseline export (it matches "current" with `startsWith`, the export uses `includes`). The baseline **export** is the source of truth; `Return tasks` did not change between baseline and final.
