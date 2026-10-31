# 06 — Change log (after baseline)

Every change made after the baseline run is logged here: what changed, why (the test evidence), and what it did to the results.

**Rules**
- The baseline is frozen in [`baseline-v1/`](../baseline-v1/). Never edit that folder.
- Make one change at a time, then re-run and record the result before the next change.
- After every change in n8n: **save and publish** the workflow (the eval runs the published version). This applies to **every** changed workflow (Mira main, Mira Tools, Mira Stakeholder Approval, Mira Save Doc), not only Mira main.
- Each changed prompt is saved as a new file in `prompts/` (e.g. `correctness_judge_v2.txt`). The old version stays.

## Versions

| Version | Date | What | Brief tests (human) | Extra tests (human) | Judge agreement | Plan groundedness (≥ 0.95) | Risk relevance (≥ 0.9) | Status accuracy (≥ 0.9, T10 = 1) |
|---|---|---|---|---|---|---|---|---|
| **baseline-v1** | 2026-10-26 | Mira v1 + correctness judge v1, 17 tests | 4/12 | 3/5 (60%) | 10/17 (59%) | 1.00 ✅ | 0.80 ❌ | 0.83 ❌ (T10 = 0) |
| rejudged-v2 | 2026-10-26 | Same outputs, judge v2 (checklist) | 4/12 | 3/5 (60%) | 14/17 (82%) | 1.00 ✅ | 0.30 ❌ | 0.58 ❌ |
| rejudged-v3 | 2026-10-26 | Same outputs, judge v3 | 4/12 | 3/5 (60%) | 12/17 (71%) | 1.00 ✅ | 0.30 ❌ | 0.67 ❌ |
| rejudged-v4 | 2026-10-26 | Same outputs, judge v4 (rubric) | 4/12 | 3/5 (60%) | 13/17 (76%) | 1.00 ✅ | 0.70 ❌ | 0.58 ❌ |
| **rejudged-v5 (judge frozen)** | 2026-10-26 | Same outputs, judge v5. **This is the baseline all Mira fixes are compared with** | **4/12** | **3/5 (60%)** | **14/17 (82%)** | **1.00 ✅** | **0.60 ❌** | **0.67 ❌ (T10 = 0)** |
| run-2 | 2026-10-26 | Mira + Risk prompt v2 (CHG-02), judge v5 | *human review pending* | *pending* | *pending* | 1.00 ✅ | 0.60 ❌ | 0.50 ❌ (T10 = 0) |
| run-3 | 2026-10-26 | + Sampling Temperature 0 (CHG-03), judge v5 | *human review pending* | *pending* | *pending* | 1.00 ✅ | 0.80 ❌ | 0.67 ❌ (T10 = 0) |
| run-4 | 2026-10-26 | + Risk prompt v3 (CHG-04), judge v5 | *human review pending* | *pending* | *pending* | 1.00 ✅ | 0.70 ❌ | 0.75 ❌ (T10 = 0) |
| run-5 | 2026-10-26 | + Status prompt v2 (CHG-05), judge v5 | *human review pending* | *pending* | *pending* | 1.00 ✅ | 0.90 ✅ | 0.58 ❌ (T10 = 0.5) |
| run-6 | 2026-10-26 | + Status prompt v3 (CHG-06), judge v5 | *human review pending* | *pending* | *pending* | 1.00 ✅ | 0.70 ❌ | 0.75 ❌ (T10 = 0.5, judge wording bug) |
| run-6-rejudged-v6 | 2026-10-26 | Same outputs as run-6, criteria v2 (CHG-07) + judge v6 (CHG-07b, frozen) | *not reviewed* | — | — | 1.00 ✅ | 0.70 ❌ | 0.83 ❌ |
| chg10-final-1 / -2 | 2026-10-27 | + Orchestrator v3, Status v5 (CHG-10); discarded as final runs | *not reviewed* | — | — | 1.00 / 1.00 ✅ | 0.80 / 0.90 | 0.75 / 0.75 ❌ |
| run-7 | 2026-10-27 | + Orchestrator v4 (CHG-11, rejected) | *not reviewed* | — | — | 1.00 ✅ | 0.80 ❌ | 0.83 ❌ |
| run-8 | 2026-10-27 | Orchestrator back to v1 + Clarify code v2 (CHG-12) | *not reviewed* | — | — | 1.00 ✅ | 0.60 ❌ | 0.92 ✅ (T10 = 1) |
| run-9 | 2026-10-27 | + Stakeholder v2 + get_overdue_or_blocked (CHG-13) | *not reviewed* | — | — | 1.00 ✅ | 0.60 ❌ | 1.00 ✅ (T10 = 1) |
| run-10 | 2026-10-27 | + Risk agent gpt-4o, Risk v4 (CHG-14) | *not reviewed* | — | — | 1.00 ✅ | 0.80 ❌ | 0.92 ✅ (T10 = 1) |
| run-11 | 2026-10-27 | + Active-project guard (CHG-15) | *not reviewed* | — | — | 1.00 ✅ | 1.00 ✅ | 0.92 ✅ (T10 = 1) |
| **final-1** | 2026-10-27 | + Status agent gpt-4o (CHG-16) — **final Mira** | **12/12** | **5/5 (100%)** | **16/17 (94%)** | **1.00 ✅** | **0.90 ✅** | **1.00 ✅ (T10 = 1)** |
| **final-2** | 2026-10-27 | Final Mira, run 2 | **12/12** | **5/5 (100%)** | **16/17 (94%)** | **1.00 ✅** | **0.90 ✅** | **1.00 ✅ (T10 = 1)** |
| **final-3** | 2026-10-27 | Final Mira, run 3 | **12/12** | **5/5 (100%)** | **17/17 (100%)** | **1.00 ✅** | **1.00 ✅** | **1.00 ✅ (T10 = 1)** |
| **FINAL (average of 3)** | | | **12/12** | **5/5 (100%)** | **16.3/17 (96%)** | **1.00 ✅** | **0.93 ✅** (range 0.90–1.00) | **1.00 ✅** (range 1.00–1.00) |

Metrics are averages of the LLM judge scores (doc 04). Human counts and agreement use the **final** human verdicts (after the T15 and T9 corrections), so every row is compared with the same human standard; the per-change notes below show the numbers at the time. The same numbers are calculated live in the results sheet, tab `summary`. Mira's answers are identical in all five rows; only the judge changed. Row 1 metrics are overstated because judge v1 was too lenient.

## Baseline findings (human review)

| Finding | Tests | Planned change |
|---|---|---|
| Correctness judge too lenient: gave 1.0 when required items were missing. All 5 disagreements are LLM Pass / human Fail | T2, T3, T5, T7, T8 | CHG-01 |
| Clarify asks for too few missing items | T2, T4, T9 | step 8 |
| Risk output missing the live-signal task IDs | T3, T7 | step 8 |
| Risk agent misreads mitigation coverage | T13 | step 8 |
| Status report missing task names, extra sections, no "due in X days" reason | T5, T8 | step 8 |
| Status counts the current sprint instead of the whole project | T10 | step 8 |

**Drift found while freezing:** the Risk agent prompt in n8n is older than the one in the PRD prompt appendix. It has no mitigation-coverage output format, which may explain T13. The n8n version is the one recorded in `baseline-v1/prompts/`.

## Changes

### CHG-01 — Correctness judge v1 → v2 (checklist prompt)

| | |
|---|---|
| **Component** | Mira – Evaluation → Correctness judge (prompt + Structured Output Parser), Verdict node, results sheet |
| **Why** | Judge agreement 71%. The v1 prompt scored the overall impression ("right action, right format"), so it gave 1.0 while required items were missing |
| **Before** | [`baseline-v1/prompts/correctness_judge.txt`](../baseline-v1/prompts/correctness_judge.txt) |
| **After** | `prompts/correctness_judge_v2.txt`: lists the required items from the expected answer, checks each one, returns `missing_items`; strict score rules (1.0 all present · 0.5 1–2 missing or extra sections · 0 wrong action, 3+ missing or wrong scope) |
| **Other edits** | Parser example gets `missing_items`; Verdict node passes `missing_items`; new sheet column `missing_items` |
| **Test** | Re-judge the saved baseline outputs (Mira not re-run) → `baseline-v1-rejudged` |
| **Target** | Judge agreement ≥ 90% |
| **Result** | Agreement still 12/17 (71%), but the errors flipped: v1 was too lenient (5 × LLM Pass / human Fail), v2 is too strict (5 × LLM Fail / human Pass: T1, T9, T11, T14, T15). v2 counts optional items ("may", "ideally") and demands "explicit statements" of things already implied. Metrics with v2: Plan 1.00 · Risk 0.30 · Status 0.58. → CHG-01b |
| **Human correction** | T15 human verdict changed Pass → Fail on re-check: Mira answered a vague "no project data available" instead of saying the register has no likelihood scores. With this, v2 agreement = 13/17 (76%) |

### CHG-01b — Correctness judge v2 → v3 (optional items, implied items)

| | |
|---|---|
| **Component** | Mira – Evaluation → Correctness judge prompt only |
| **Why** | v2 too strict: counted "may / ideally / e.g." items as required and demanded explicit statements of things the output already shows (T1, T9, T11, T14) |
| **Before** | `prompts/correctness_judge_v2.txt` |
| **After** | `prompts/correctness_judge_v3.txt`: optional items are not required; "does not invent" lines are checks, not items; an item counts if the output clearly shows it |
| **Test** | Re-judge the saved baseline outputs → `baseline-v1-rejudged-v3` |
| **Target** | Judge agreement ≥ 90% |
| **Result** | Worse: 11/17 (65%). Metrics Plan 1.00 · Risk 0.30 · Status 0.67. The judge is unstable: it builds its own checklist from the long expected answer each run, so small prompt changes shuffle results (T5, T8 flipped to Pass with no related change). Stop tuning wording → CHG-01c |

### CHG-01c — Correctness judge v3 → v4 (rubric-based grading)

| | |
|---|---|
| **Component** | Correctness judge prompt; new sheet column `criteria`; `judge_criteria` for T2, T3, T8 in `ground_truth.json` |
| **Why** | Open "compare to the expected answer" grading was unstable (v1 lenient, v2/v3 strict and shuffling). Standard practice: grade against a fixed rubric per test |
| **Before** | `prompts/correctness_judge_v3.txt` |
| **After** | `prompts/correctness_judge_v4.txt`: grades only the test's `criteria` (the `judge_criteria` written in Phase 1); the expected answer is used only to check facts |
| **Criteria updated to match the human standard** | T2 asks for scope/goals, timeline, team size · T3 shows live-signal task IDs (T024, T006, T025) · T8 gives a reason per at-risk task and no unrequested sections. All in `judge_criteria_v4.csv` (working file, not submitted) |
| **Test** | Re-judge the saved baseline outputs → `baseline-v1-rejudged-v4` |
| **Target** | Judge agreement ≥ 90% |
| **Result** | 12/17 (71%), but stable: every miss maps to a criteria item. Metrics Plan 1.00 · Risk 0.70 · Status 0.58. Disagreements checked against the outputs: T1 judge wrong (called description goals "invented"; it can't see the data), T3/T7 judge wrong (accepted task names without IDs), T6 judge nitpick, T9 human changed (below) → CHG-01d |
| **Human correction** | T9 human verdict Pass → Fail: Mira did not ask for goals, which the criteria require (same rule as T2) |

### CHG-01d — Correctness judge v4 → v5 (final judge tweak)

| | |
|---|---|
| **Component** | Correctness judge prompt only |
| **Why** | v4 errors on T1, T3, T7 |
| **Before** | `prompts/correctness_judge_v4.txt` |
| **After** | `prompts/correctness_judge_v5.txt`: task/risk IDs must appear exactly (a name alone doesn't count); skip "no invented …" items (the groundedness judge covers them) |
| **Test** | Re-judge the saved baseline outputs → `baseline-v1-rejudged-v5` |
| **Target** | Judge agreement ≥ 90%. This is the last judge change; after it the judge is frozen |
| **Limitation** | The judge was tuned on the same 17 tests it scores, so agreement may be optimistic (risk of overfitting the judge) |
| **Result** | 14/17 (82%), below the 90% target. Metrics Plan 1.00 · Risk 0.60 · Status 0.67. The 3 remaining errors are all exact-ID misreads: T3 and T7 "IDs shown" when they are not; T12 "IDs missing" when they are present. LLMs are unreliable at exact text checks, and prompt wording cannot fix it |
| **Decision** | **Judge frozen at v5.** The human verdict stays final, so these errors don't change the release decision. Future improvement: a deterministic ID check in code (the "code calculates" principle) instead of more prompt tuning |

### CHG-02 — Risk agent prompt v1 → v2

| | |
|---|---|
| **Component** | Mira main → Risk agent system prompt |
| **Why** | T3, T7: live signals shown by task name without the ID. T13: the n8n prompt was an old version with no mitigation-coverage format (drift from PRD prompt appendix). T15: answered a vague "no project data" instead of saying the register has no likelihood scores |
| **Before** | `prompts/risk_agent_v1.txt` (= `baseline-v1/prompts/risk_agent.txt`) |
| **After** | `prompts/risk_agent_v2.txt` = the PRD prompt appendix version (adds the coverage output and coverage fields) + 2 rules: cite tasks by ID and name with the signal; for a field the register doesn't have, say so and give what it has |
| **Test** | Full run (Mira + frozen judge v5), all 17 tests → `run-2` |
| **Target** | T3, T7, T13, T15 pass; no other test gets worse |
| **Result** | Partial. T3, T7: task IDs now shown ✅. T13: coverage table now produced, but still says R02, R04, R07, R08, R10 have no tasks, although get_risks returns them as "Covered, on track" (groundedness 0.6). T15: now says the register has no likelihood score ✅, but called **no tools**, so R05 details are "[not specified]" (groundedness 0). Regression not caused by this change: T16 (Status, prompt unchanged) invented a Sprint 42 report; Mira's answers vary between runs (agent temperature not set) |
| **Next** | CHG-03: set **Sampling Temperature** to 0 first, so runs are repeatable and later fixes can be measured. CHG-04 Risk v3: always call get_risks first; copy coverage_status exactly as the tool returns it (code calculates, LLM explains) |

### CHG-03 — Sampling Temperature → 0 (all Mira models)

| | |
|---|---|
| **Component** | Mira main → the 5 OpenAI Chat Model nodes (Orchestrator, Planner, Risk, Status, Stakeholder) → option **Sampling Temperature** |
| **Why** | Answers vary between runs: T16 (Status, prompt unchanged) passed in the baseline and invented a Sprint 42 report in run-2. Without repeatable answers, a score change can't be credited to a fix |
| **Before** | Sampling Temperature not set (n8n default 0.7) |
| **After** | Sampling Temperature = 0 on all 5 nodes |
| **Test** | Full run, judge v5 → `run-3` |
| **Target** | T16 passes again; no new failures |
| **Result** | First run-3 was invalid: Mira main was saved but not **published**, so the eval ran the old version (the eval calls Mira main as a sub-workflow, which runs the published version). Re-run after publishing: ✅ T16 passes again, T4 and T7 now pass, T9 back to fail (doesn't ask for goals), no other changes. LLM pass 7/12 brief, 3/5 extra. Metrics Plan 1.00 · Risk 0.80 · Status 0.67 |

### CHG-04 — Risk agent prompt v2 → v3

| | |
|---|---|
| **Component** | Mira main → Risk agent system prompt |
| **Why** | T15: called no tools, so R05 details were "[not specified]". T13: decided coverage itself and said covered risks had no tasks. T7: no ranking reason |
| **Before** | `prompts/risk_agent_v2.txt` |
| **After** | `prompts/risk_agent_v3.txt`: always call get_risks first; tier, rank, link strength and coverage status are copied from get_risks, never decided by the LLM (code calculates, LLM explains); coverage table has one row per risk R01–R10; top-N list states each risk's tier and live signal |
| **Test** | Full run, judge v5, temperature 0 → `run-4` |
| **Target** | T7, T13, T15 pass; no other test gets worse |
| **Result** | Mostly worked. T15: now calls get_risks and gives R05's real details ✅ (the judge still scores 0.5 for "R05 details match the register", a judge error: they do match). T13: the coverage table is now correct for all 10 risks ✅, but the summary sentence is wrong ("all risks except R09, R01 and R05 have mitigation tasks"). Also a data bug: T13's criteria include the note "Extra test added for a likely leadership question", which the judge treats as a required item; fix the criteria cell. Run-to-run noise remains even at temperature 0 (T4 flipped to fail, T8 and T9 to pass, with no related change), about ±1–2 tests per run. LLM pass 8/12 brief, 3/5 extra. Metrics Plan 1.00 · Risk 0.70 · Status 0.75 |

### CHG-05 — Status agent prompt v1 → v2

| | |
|---|---|
| **Component** | Mira main → Status agent system prompt |
| **Why** | T10: "current project status" was read as "current sprint", so get_tasks was called with sprint = Sprint 3 and returned 4 tasks instead of 25 (the tool's counts were correct for what it was asked). T5: the report gave counts but no task list by status, no To do section, and mixed in the other output formats |
| **Before** | `prompts/status_agent_v1.txt` (= baseline) |
| **After** | `prompts/status_agent_v2.txt`: explicit rule for the sprint filter (named sprint → that sprint; weekly report with no sprint → current; anything else → empty = whole board); use only one output format; weekly report lists tasks by ID, name, owner and due date under Completed / In progress / To do; Blocked and Overdue come from get_overdue_or_blocked (any sprint) |
| **Test** | Full run, judge v5, temperature 0 → `run-5` |
| **Target** | T10 = 1.0; T5 passes; no other test gets worse |
| **Result** | Partial. T10: now calls get_tasks for the whole board and gets the right counts (Done 5, In Progress 3, To Do 16) ✅, but leaves out Blocked and total (0.5). T5: tasks now listed by status ✅, but T024/T006 blockers missing (0.5). **Regression caused by this change:** T16 (Sprint 42) — get_tasks correctly found no tasks, but the new "Blocked/Overdue from any sprint" rule filled the report with other sprints' tasks (groundedness 0). Risk reached 0.90 (T13 passes, noise). LLM pass 8/12 brief, 3/5 extra. Metrics Plan 1.00 · Risk 0.90 · Status 0.58 |

### CHG-06 — Status agent prompt v2 → v3

| | |
|---|---|
| **Component** | Mira main → Status agent system prompt |
| **Why** | T16 regression from CHG-05; T10 missing Blocked and total |
| **Before** | `prompts/status_agent_v2.txt` |
| **After** | `prompts/status_agent_v3.txt`: if get_tasks finds no tasks for the requested sprint, stop and ask which sprint (never fill with other sprints' tasks); status summary always shows all five counts and no task list unless asked |
| **Test** | Full run → `run-6` |
| **Target** | T16 passes again; T10 = 1.0; no other test gets worse |
| **Result** | T16 passes again ✅. T10: Mira's answer is now exactly right (Done 5, In Progress 3, Blocked 1, To Do 16, Total 25), but the judge gave 0.5 because the criteria said "Counts exactly match the CSV" and it expected Mira to *say* that → criteria wording bug (CHG-07). Noise: T4, T9, T13 flipped with no related change. LLM pass 6/12 brief, 3/5 extra. Metrics Plan 1.00 · Risk 0.70 · Status 0.75 |

### CHG-07 — Criteria v2 (all 17 rewritten) + 3-run measurement

| | |
|---|---|
| **Component** | `criteria` column (judge prompt v5 unchanged); `judge_criteria` in `ground_truth.json`; file `data/judge_criteria_v5.csv` |
| **Why** | Short, loosely worded criteria were misread by the judge: T10 "match the CSV" read as a phrase Mira must say; T13 a note read as a required item; T15 "any R05 details match the register" can't be checked. Also, single runs move by about ±3 tests at temperature 0 (T4, T9, T13 flipped in run-6 with no related change), as large as the effect of a fix |
| **Before** | `judge_criteria_v4.csv` (+ T13 note removed; working file, not submitted) |
| **After** | Every criterion is a numbered list of single, observable checks with the exact IDs, names, dates and counts to look for. Each reflects the human reviewer's standard (e.g. T2 asks for scope/goals, timeline and team size; T8 needs a reason and an action per task and no extra report sections). Negative checks are worded "does not contain …" |
| **Measurement** | Run current Mira **3 times** (`final-1`, `final-2`, `final-3`) and report the average and range. The baseline was **not** re-judged with the new criteria (decision: skipped to save effort), so baseline vs final scores use different criteria wording; the human verdicts, which use the same standard throughout, are the fair before/after comparison |
| **Result** | *pending* |

### CHG-07b — Correctness judge v5 → v6 (evidence quotes) — judge unfrozen once

| | |
|---|---|
| **Component** | Correctness judge prompt; Structured Output Parser example gets `evidence` |
| **Why** | Re-judging run-6 with the clearer criteria showed the judge contradicting itself: T2 "asks for scope, timeline, team… missing scope, timeline, team size"; T10 "no task IDs" (not a criterion); T15 "does not name T025 Legal review of data usage" when the output does. The "strict evaluator / do not give credit" wording pushed it to invent misses |
| **Before** | `prompts/correctness_judge_v5.txt` |
| **After** | `prompts/correctness_judge_v6.txt`: grade numbered items one at a time; copy the exact words from the output as evidence for each item; an item is missing only if no evidence can be copied (search again first); "does not contain" items met if absent; "strict" removed; wrong action still scores 0 |
| **Test** | Re-judge the run-6 outputs again → `run-6-rejudged-v6` |
| **Target** | T2, T10, T15 score 1.0; no contradictory reasons |
| **Stop rule** | If v6 still contradicts itself, stop tuning the judge; the human verdict decides |
| **Result** | ✅ Works. Same run-6 answers: T2, T8, T12, T15 now correctly pass; the remaining misses were checked against the outputs and are real (T4 doesn't ask for goals or team/technology; T5 has no T024; T9 doesn't ask for goals; T13's summary says R03 and R06 have no tasks). One wording bug left: T10 item 2 "counts are for all sprints" was read as a phrase Mira must write → T10 criteria reduced to one item (`judge_criteria_v6.csv`, working file, not submitted). LLM pass 7/12 brief, 4/5 extra. Metrics Plan 1.00 · Risk 0.70 · Status 0.83 |
| **Decision** | **Judge frozen at v6** with criteria v2 |

### CHG-08 + CHG-09 — Orchestrator v2 and Status v4 (made together)

Made together before the final runs, because they touch different agents and single runs are too noisy to measure them separately. A small break from "one change at a time".

| | CHG-08 Orchestrator v1 → v2 | CHG-09 Status v3 → v4 |
|---|---|---|
| **Why** | T2, T4, T9: the "missing" list was whatever the model thought of, so it varied and often left out goals or team | T5: weekly report sometimes skipped get_overdue_or_blocked, so T024 Blocked was missing. T8: reasons/actions sometimes dropped |
| **Before** | `prompts/orchestrator_v1.txt` (= baseline) | `prompts/status_agent_v3.txt` |
| **After** | `prompts/orchestrator_v2.txt`: fixed missing-item list per intent (plan: scope, goals, timeline, deliverables, team size · risk: domain, scope, goals, timeline, team/technology · status: task data); include every item not given, no others; worked example | `prompts/status_agent_v4.txt`: which tools to call per request type (weekly report → all three); every Blocked/overdue task from get_overdue_or_blocked is listed whatever its sprint; every flagged task gets a reason and a suggested action |
| **Target** | T2, T4, T9 pass | T5, T8 pass |

**Criteria data fix (same time):** T9 item 2 "says a 2-week duration alone is not enough" → "says there is not enough information to build a plan" (same as T2; the reviewer did not require the 2-week wording).

**Test:** 3 full runs → `final-1`, `final-2`, `final-3`.
**Result (final-1, final-2; final-3 not run):** CHG-08 fixed Clarify (T2, T4, T9 pass in both runs) but **caused a regression**: T3 and T14, both about the active project, were sent to Clarify ("missing: domain, scope…") in both runs. The new fixed list was applied to every request, not only new projects. CHG-09 partly worked: T5 still drops T024 (in final-1 get_overdue_or_blocked was called with a sprint filter, so T024 never came back; in final-2 it came back but was left out); T10 again left out the Blocked count. Plan 1.00 · Risk 0.60 · Status 0.67–0.75. Both runs discarded as final runs → CHG-10

### CHG-10 — Orchestrator v3 and Status v5

| | Orchestrator v2 → v3 | Status v4 → v5 |
|---|---|---|
| **Why** | T3, T14 regression from CHG-08 | T5 drops T024; T10 drops the Blocked count |
| **After** | `prompts/orchestrator_v3.txt`: the fixed missing-lists apply ONLY to a new project; a request about the active project or the stored data is always sufficient = true, missing = [] (with the T3/T14-style examples) | `prompts/status_agent_v5.txt`: status summary is an exact five-line template (Done, In Progress, Blocked, To Do, Total); call get_overdue_or_blocked without a sprint filter; every Blocked/overdue task MUST appear in the weekly report, with a final check that none is missing |
| **Test** | 3 fresh runs → `final-1`, `final-2`, `final-3` (overwrite the earlier ones) | |
| **Result (final-1, final-2; final-3 not run)** | Fixed T3 and T14 (pass in both runs). **Caused a regression on T6**: "weekly status report for: \"Things are going fine.\"" got a full Sprint 3 report (score 0 in both runs). The "always sufficient for the active project" line overruled the VAGUE RULE; Mira has one active project, so every request was read as being about it | Fixed T10 (pass in both runs). T5 still drops T024: get_overdue_or_blocked **did** return T024 (Blocked, Sprint 5), but the agent left it out. This is the model ignoring tool data, not a missing tool |
| **Metrics** | Plan 1.00 / 1.00 · Risk 0.80 / 0.90 · Status 0.75 / 0.75 | Other fails: T7 (impact missing), T12 (Stakeholder agent has only get_tasks, so it cannot see that T006 is overdue), T13 in final-1 (summary says R03/R06 have no tasks) |

Both runs discarded as final runs → CHG-11. (CSVs kept in my working files, not submitted; the CHG-08 final-1/final-2 CSVs were overwritten by these.)

### CHG-11 — Orchestrator v3 → v4

| | |
|---|---|
| **Why** | T6 regression from CHG-10 |
| **Before** | `prompts/orchestrator_v3.txt`: "A request about the active project, or one that refers to the stored data, is always sufficient = true" |
| **After** | `prompts/orchestrator_v4.txt`: the Orchestrator first decides which project the request is about. **NEW project** = the user gives their own content (quoted text after "for:", pasted notes, or another project such as "a 2-week project"), and only that content is judged. **ACTIVE project** = the request names ABCDE, uses a stored-data phrase, or asks about the project without giving content of its own; it is always sufficient. Adds T6 as an example of NEW with no task data → sufficient = false, missing = ["task data"] |
| **Expected** | T6 back to Clarify; T2, T4, T9 stay Clarify; T3, T10, T13, T14, T17 stay sufficient |
| **Limitation** | The examples in the prompt are close to test inputs (T3, T14, T6), so these tests are partly tuned to. Report this in the write-up; a fresh hold-out test set is a future improvement |
| **Test** | 1 check run → `run-7` |
| **Result** | T6 back to Clarify (pass), but **T5 now regressed**: "weekly status report using the sample task board data for Sprint 3" was sent to Clarify ("task data") and scored 0. Plan 1.00 · Risk 0.80 · Status 0.83. **Rejected** → CHG-12 |

### CHG-12 — Orchestrator back to v1; fixed missing-list moved into the Clarify Code node

**Step back.** Routing (which agent, Clarify or not) under Orchestrator v1 was correct for **all 17 tests in all 6 runs** (baseline, run-2 … run-6). The only v1 problem was the *wording* of the Clarify message: the "missing" list was whatever the model thought of (T4, T9 scored 0.5). Orchestrator v2, v3 and v4 tried to fix that wording inside the routing prompt, and each one broke routing for a different test (v2: T3, T14 · v3: T6 · v4: T5). Lesson: don't fix an output-wording problem in the routing prompt. Following "code calculates, LLM explains", the list now lives in code.

| | |
|---|---|
| **Before** | `prompts/orchestrator_v4.txt` + `baseline-v1/n8n_code/mira_main__clarify.js` (uses the Orchestrator's own "missing" list) |
| **After** | Orchestrator prompt **reverted to `prompts/orchestrator_v1.txt`** (= baseline). Clarify Code node → `mira_main__clarify_v2.js` (working file, not submitted; final version in `final-v1/n8n_code/mira_main__clarify.js`): a fixed list per intent (plan: scope, goals, timeline, deliverables, team size · risk: domain, scope, goals, timeline, team/technology · status: task data); "timeline" is dropped if the request already gives a duration (week / month / day). Orchestrator v2–v4 are kept in `prompts/` as rejected versions |
| **Expected** | Routing as in baseline (all 17 correct); T2, T4, T9 ask for the full fixed list |
| **Test** | 1 check run → `run-8` |
| **Result** | Clarify fixed: T2, T4, T6, T9 pass and ask for exactly the fixed lists (T9 skips "timeline"). T3, T5, T10, T14 route correctly. **T15 went to Clarify** (score 0), although the prompt in n8n was checked and is exactly v1 and T15 routed to Risk in all 6 earlier v1 runs, so this is run noise. Decision: do not edit the Orchestrator again; if T15 flips again in the final runs, add a code guard (request names ABCDE → sufficient = true). Plan 1.00 · Risk 0.60 · **Status 0.92 ✅ (first time on target)** · T10 = 1 |

### CHG-13 — Stakeholder agent v1 → v2 (+ get_overdue_or_blocked tool)

| | |
|---|---|
| **Why** | T12 fails in every run: T006 (Sprint 2, due 4/21) is listed as In progress but never called overdue, and there is no plan to close it. The Stakeholder agent only had `get_tasks`, which returns no overdue flag, so it could not see that T006 is overdue |
| **Before** | `prompts/stakeholder_agent_v1.txt` (= baseline); tool: `get_tasks` only |
| **After** | `prompts/stakeholder_agent_v2.txt`; tools: `get_tasks` + **`get_overdue_or_blocked`** (connected in Mira main). The prompt says: call get_overdue_or_blocked with no sprint filter; use it only to check this sprint's tasks (never mention other sprints, e.g. T024 in Sprint 5); an overdue task of this sprint must be called overdue in In progress, Risks / asks and Next steps, with a plan to close it (assignee, action, new due date) |
| **Expected** | T12 passes; T17 still asks for the sprint |
| **Test** | 1 check run → `run-9` |
| **Result** | **T12 passes**: the email says T006 is "OVERDUE by 7 days", lists it under Risks / asks, gives a plan (Priya Nair, new due date) and mentions no other sprint. T17 still asks for the sprint. T5 also passed. Plan 1.00 · Risk 0.60 · **Status 1.00 ✅** · T10 = 1. Remaining fails are all Risk: T7, T13, and T15 (Clarify again, 2 runs in a row, so no longer treated as noise) |

### CHG-14 — Risk agent model gpt-4o-mini → gpt-4o + Risk prompt v3 → v4 (impact line)

| | |
|---|---|
| **Why** | **T7:** T025 is due on the as-of date (`days_until_due: 0`), but the Risk agent (gpt-4o-mini) wrote "In Progress, Due Soon" or just "In Progress", never "due today". T7 passed in run-3 … run-6 and started failing when the clearer criteria v2 (CHG-07) asked for "in progress at its due date"; re-judging the unchanged run-6 output gave 0.5, so this is a real gap the old criteria did not catch, not a Mira regression. T7 item 5 (impact for each risk) also failed. **T13:** the coverage summary is wrong in most runs (e.g. "R03 and R06 have no tasks"), although every risk has at least one task |
| **Diagnosis** | gpt-4o-mini is **unreliable at date reasoning** (turning a day count into the right words: "0 days" → "due today") and at summarising a 10-row table without contradicting it. T7 item 5 is a **prompt gap**: the top-N format asked for "R-ID, risk, why it ranks here, mitigation" and never for impact, so no model would show it |
| **Quick test (editor chat, not logged as a run)** | Risk agent's model set to gpt-4o, original prompt v3 and original get_risks code. **T7:** "In Progress and Due Soon (due today)" ✅, but no impact (item 5 ❌, as expected from the prompt gap) → would score 0.5. **T13:** all 5 items met, summary correct → would score 1.0 |
| **Options considered** | **A (chosen): upgrade the Risk agent's model** to gpt-4o and add the impact line to the prompt. No new code; the LLM still does the reasoning. **B (fallback, not used): keep gpt-4o-mini and do the date wording in code** — get_risks writes a `signal_text` per task ("Due today, still In Progress (due 4/28/2026)"), and the prompt copies it (files kept: `n8n_code/mira_tools__return_risks_v2.js`, `prompts/risk_agent_v4_signal_text_fallback.txt`). B is fully deterministic but moves reasoning out of the LLM, so the eval measures less of the agent |
| **Decision** | **The extra cost is worth the better reasoning.** gpt-4o costs about 15–17× more per token than gpt-4o-mini (list price per 1M tokens: gpt-4o $2.50 in / $10.00 out; gpt-4o-mini $0.15 in / $0.60 out). Only the Risk agent is upgraded; Orchestrator, Planner, Status and Stakeholder stay on gpt-4o-mini. The judges (gpt-4.1) do not need to change, since they are already stronger than Mira's models. **Actual cost (OpenAI usage, doc 05 B5): a gpt-4o call ≈ $0.0053 vs ≈ $0.0002 for gpt-4o-mini; about +1 cent per Risk or Status request** |
| **Before** | Risk agent model `gpt-4o-mini`, Sampling Temperature 0; `prompts/risk_agent_v3.txt`; get_risks code unchanged (`baseline-v1/n8n_code/mira_tools__return_risks.js`) |
| **After** | Risk agent model **`gpt-4o-2024-11-20`** (latest gpt-4o snapshot), Sampling Temperature 0. `prompts/risk_agent_v4.txt` = v3 + top-N format asks for impact: "…why it ranks here, impact, mitigation. Every risk in the list MUST show its impact and its mitigation from get_risks." get_risks code unchanged (v1) |
| **Expected** | T7 and T13 pass; T3, T4, T15 unchanged (T15 is a routing problem in the Orchestrator, not the Risk agent) |
| **Test** | 1 check run → `run-10` |
| **Result** | **T7 and T13 pass.** T7 now says "In Progress, due today" for T025 and shows impact and mitigation for all three risks; T13's summary is correct. T3 and T4 still pass. Plan 1.00 · **Risk 0.80** (up from 0.60) · Status 0.92 · T10 = 1. Remaining fails: **T15** (sent to Clarify by the Orchestrator for the 3rd run in a row, so the Risk agent never ran; all 4 Risk tests that reached the Risk agent scored 1.0) and **T5** (Status, intermittent: wrote "Blocked: 0" and left out T024; passed in run-9) |

### CHG-15 — Active-project guard in the "Enough data?" If node (T15)

| | |
|---|---|
| **Why** | T15 ("What is the likelihood score of risk R05 for the ABCDE project?") was sent to Clarify in run-8, run-9 and run-10, asking for "domain, scope, goals, timeline, team/technology", although the request names the active project and the Orchestrator prompt (v1, checked in n8n) says "If the request names the active project, sufficient = true". The Orchestrator gives the right **intent** (risk) but the wrong **sufficient** (false). Editing the Orchestrator prompt is ruled out: v2, v3 and v4 each broke routing for another test (CHG-08 … CHG-11) |
| **Before** | "Enough data?" passes a request to the agents if `sufficient` is true AND `intent` is not "unclear" |
| **After** | "Enough data?" passes a request to the agents if (`sufficient` is true **OR the user's message contains "abcde"**, any case) AND `intent` is not "unclear". The code overrules the Orchestrator in one case only: the request names the active project, whose data Mira already has. Intent is still decided by the Orchestrator, so T15 goes to the Risk agent |
| **Effect on other tests** | T1, T3, T7, T14 also name ABCDE and were already sufficient, so no change. The Clarify tests (T2, T4, T6, T9) do not name ABCDE, so the Orchestrator still decides them |
| **Limits** | "ABCDE" is the active-project setting (same as in the Orchestrator prompt) and changes per deployment. Langfuse still shows the Orchestrator's own `sufficient: false` for T15, which documents that the guard overruled it. Follows "code calculates, LLM explains": a fact Mira already knows (the active project's data is stored) is checked in code, not left to the LLM |
| **Test** | 1 check run → `run-11` |
| **Result** | **T15 passes**: it now reaches the Risk agent, which says the register has no likelihood score and gives R05's details and T025. No other routing changed. Plan 1.00 ✅ · **Risk 1.00 ✅** · **Status 0.92 ✅** · T10 = 1 ✅. **All three metrics meet their targets for the first time.** 16/17 tests pass; the only fail is T5 (wrote "Blocked: 0" and left out T024, a Sprint 5 task that is Blocked; failed in 4 of the last 5 runs) |

### Fix (not a measured change) — Stakeholder approval posted to Slack during eval runs

From run-8 onwards, the Mira Stakeholder Approval workflow posted an approval request to Slack for T12 during eval runs, although its "Real draft" If node should stop eval runs (`source` not equal to "eval"). **Cause:** the `source` field had been added to the workflow's trigger but the workflow was **not published**, so Mira main called the older published version, whose trigger only accepted `draft`; `source` arrived empty, and empty is "not equal to eval". **Fix:** published Mira Stakeholder Approval. **Check (no LLM cost):** trigger pinned with `{"draft": "Subject: test", "source": "eval"}` → Real draft went out of false, no Slack message. The live call path is confirmed in the next eval run (trigger shows `source: "eval"`). No effect on scores (the eval reads Mira's chat answer). Approval requests from eval runs were not approved, so no email was sent. **Lesson (added to the rules):** publish every changed workflow (Mira main, Mira Tools, Mira Stakeholder Approval, Mira Save Doc), not only Mira main

### CHG-16 — Status agent model gpt-4o-mini → gpt-4o (T5)

| | |
|---|---|
| **Why** | T5 (weekly report for Sprint 3) left out T024 Security review of AI infrastructure (Blocked, Sprint 5) in 4 of the last 5 runs, writing "Blocked: 0". get_overdue_or_blocked **does** return T024, and Status v5 says every Blocked/overdue task MUST appear, with a final check. gpt-4o-mini keeps dropping it because it is from another sprint: an instruction-following limit of the model, not missing data or a missing rule |
| **Quick test (editor chat, not logged as a run)** | Status agent's model set to gpt-4o, prompt unchanged (Status v5). T5 answer met all 7 criteria items: Sprint 3 report; T007, T025 In Progress; T008, T009 To Do; none Done; **T024 listed under Blocked** with its reason; T006 overdue (Sprint 2); health Amber with a reason |
| **Decision** | Same as CHG-14: the extra cost is worth the better reasoning. Only the Risk and Status agents use gpt-4o; Orchestrator, Planner and Stakeholder stay on gpt-4o-mini. Actual cost: about +1 cent per Status request (doc 05 B5) |
| **Before** | Status agent model `gpt-4o-mini`, Sampling Temperature 0, `prompts/status_agent_v5.txt` |
| **After** | Status agent model **`gpt-4o-2024-11-20`**, Sampling Temperature 0, prompt unchanged (v5) |
| **Expected** | T5 passes; T6, T8, T10, T11, T16 unchanged |
| **Test** | The 3 final runs → `final-1`, `final-2`, `final-3` (overwrite the earlier ones). Mira is frozen from here: no more changes before the final runs |
| **Result** | **T5 passes in all 3 final runs.** See "Final results" below |

## Final results (Mira frozen after CHG-16, judge v6, 3 runs)

| Metric | Target | final-1 | final-2 | final-3 | **Average** | **Range** | |
|---|---|---|---|---|---|---|---|
| Plan groundedness (T1, T2, T9, T14) | ≥ 0.95 | 1.00 | 1.00 | 1.00 | **1.00** | 1.00–1.00 | ✅ |
| Risk relevance (T3, T4, T7, T13, T15) | ≥ 0.9 | 0.90 | 0.90 | 1.00 | **0.93** | 0.90–1.00 | ✅ |
| Status accuracy (T5, T6, T8, T10, T11, T16) | ≥ 0.9, T10 = 1 | 1.00 | 1.00 | 1.00 | **1.00** | 1.00–1.00 | ✅ (T10 = 1 in all 3) |
| LLM verdict Pass | — | 16/17 | 16/17 | 17/17 | 16.3/17 | 16–17 | |

**All three metrics meet their targets in every run.** The only LLM fail is **T13** in final-1 and final-2, and it is a **judge error**: Mira's T13 answer in final-1 is **word-for-word identical** to final-3, which the same judge scored 1.0, and final-2 differs by one word. The judge failed final-1 and final-2 for a different, wrong reason each time (final-1: "does not name the task IDs for each risk", although every table row lists them; final-2: "incorrectly lists T004, T006, T010, T011 for R01", although those are R01's tasks in get_risks, and item 5 "not met", although nothing says a risk has no tasks). The only fair gap is item 1: the answer names R09/T024 and R01/T006 as "Mitigation at risk" but does not say which task is Blocked and which is overdue. **Human verdicts (final):** 17/17 Pass in all 3 runs (12/12 brief tests, 5/5 extra tests). The human reviewer overruled the judge on T13 in final-1 ("Correctness Judge is wrong. The answer DOES explicitly name the mitigation task IDs for each risk in a clear, direct way in the table") and final-2 ("Judge error: R01 tasks and item 5 are correct. Minor: doesn't say which task is Blocked and which is overdue"). Judge agreement: 16/17, 16/17, 17/17 (average 96%). Review pages: [final-v1/final-1.html](../final-v1/final-1.html), [final-2.html](../final-v1/final-2.html), [final-3.html](../final-v1/final-3.html) (with my final verdict).

**Baseline → final (human verdicts, the like-for-like comparison):** brief tests 4/12 → **12/12**; extra tests 3/5 → **5/5**; judge agreement 82% (judge v5) → **96%** (judge v6).

**Baseline → final (LLM judge):** Plan 1.00 → 1.00 · Risk 0.60 → 0.93 · Status 0.67 → 1.00 (baseline = rejudged-v5, the frozen-judge baseline; the criteria were reworded in CHG-07, so the human verdicts are the like-for-like comparison).

**Limitations (for the write-up)**
- The judge and the criteria were tuned on the same 17 tests that measure Mira; some prompt examples are close to test inputs (CHG-10, CHG-11). A fresh hold-out test set is a future improvement.
- Run-to-run noise remains at Sampling Temperature 0 (±1–3 tests per run before the final changes), so single check runs were used to accept or reject a change, and the final result is 3 runs.
- The LLM judge is unstable on long table answers (T13); the human review is the final verdict.
- Deterministic guards in code (Clarify missing-list, active-project guard) fix the routing for these tests but are simple rules ("abcde" in the message, duration words).
- Risk and Status agents now use gpt-4o: about 23× the cost of a gpt-4o-mini call in practice, about +1 cent per Risk or Status request (doc 05 B5). Langfuse cost is an estimate (estimated tokens, every call labelled gpt-4o-mini); the OpenAI usage numbers are the actual cost.

### Documentation change (not a measured change) — SC5 cost source

Charter SC5 said cost per request is measured from **Langfuse traces**. During evaluation it turned out that the "Build Langfuse trace" Code node **estimates** tokens from text length and labels every call as gpt-4o-mini, so Langfuse under-states the cost once Risk and Status use gpt-4o. SC5 now reads: *"Cost per request (actual cost from OpenAI usage; Langfuse traces show an estimate)"*. Actual costs and tokens are in doc 05 B5. Result against SC5 (< $0.01): plan, stakeholder and Clarify requests meet it (≈ $0.001 or less); Risk and Status requests are just over (≈ $0.011) since CHG-14 / CHG-16.
