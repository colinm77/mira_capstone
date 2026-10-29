# 03 — Ground Truth Data

**03 Ground Truth** is the answer key for all 17 tests: for each test, the correct answer Mira should give. This page is the human-readable version. The same answers are in [`data/ground_truth.json`](../data/ground_truth.json), which feeds the evaluation.

I used AI (Claude Opus 5.5) to help me build this answer key. It worked out the facts from the data files, drafted the expected answers and criteria, and helped me check them against the CSV files. I reviewed and approved every answer, and I made the final pass/fail call on each test myself.

T1–T12 come from the brief's *Baseline Test Dataset for Core Capabilities*: I copied the inputs word for word. I built each expected answer in two steps:

1. **Expected answer:** I expanded the brief's "Expected Output Must Contain" note into a full answer with the exact IDs, names, dates and counts from the CSV files.
2. **Criteria:** I turned that answer into a numbered checklist the judge grades against (`data/judge_criteria_v5.csv`; see change log CHG-01c and CHG-07).

T13–T17 are my own additions, built the same way.

All facts are computed from the CSV files, not from the problem statement. Each test in the JSON has the Langfuse dataset-item shape: `input`, `expected_output` and `metadata` (optional exact-match checks). Running `python scripts/json_to_csv.py` regenerates [`../data/mira_eval_dataset.csv`](../data/mira_eval_dataset.csv), the import file for an n8n Sheet/Data Table or a Langfuse dataset. Edit the JSON, never the CSV.

**Fixed reference dates**
- `AS_OF_DATE = 2026-04-28` (Tuesday, end of Sprint 3)
- `PROJECT_START = 2026-03-30` (Monday of Week 1)

---

Sections 1–3 list the facts I worked out from each data file (counts, dates, filters). Each test's correct answer in §4 is built from these, and §4 is what the evaluation checks.

## 1. Answer facts from the task board (`sample_task_board.csv`, 25 tasks)

### 1.1 Status counts (whole board)

**Used in:** T10 (expected answer: Done 5, In Progress 3, Blocked 1, To Do 16)

| Done | In Progress | Blocked | To Do | Total |
|---|---|---|---|---|
| **5** | **3** | **1** | **16** | **25** |

- Done: T001, T002, T003, T004, T005
- In Progress: T006, T007, T025
- Blocked: T024
- To Do: T008–T023 (16 tasks)

> ⚠ The problem statement says "3 Done". The CSV has 5 Done. **The CSV is the ground truth.**

### 1.2 Tasks by sprint

**Used in:** T5 (Sprint 3 status report), T12 (Sprint 2 email), T16 (Sprint 42 doesn't exist; the board has Sprints 1–10)

| Sprint | Tasks (status, due date) |
|---|---|
| Sprint 1 | T001 Done 4/7 · T002 Done 4/7 · T003 Done 4/10 |
| **Sprint 2** | **T004 Done 4/18 · T005 Done 4/18 · T006 In Progress 4/21** |
| **Sprint 3** | **T007 In Progress 4/28 · T008 To Do 5/2 · T009 To Do 5/5 · T025 In Progress 4/28** |
| Sprint 4 | T010 To Do 5/12 · T011 To Do 5/19 · T012 To Do 5/19 |
| Sprint 5 | T013 To Do 5/26 · T014 To Do 6/2 · T024 **Blocked** 5/26 |
| Sprint 6 | T015 To Do 6/9 · T016 To Do 6/16 |
| Sprint 7 | T017 To Do 6/23 · T018 To Do 6/30 |
| Sprint 8 | T019 To Do 7/7 · T020 To Do 7/14 |
| Sprint 9 | T021 To Do 7/21 · T022 To Do 7/28 |
| Sprint 10 | T023 To Do 8/4 |

### 1.3 Blocked / overdue / at risk (as of 2026-04-28)

**Used in:** T8 (expected answer). Also T3, T5, T7 and T13, which cite T024 (blocked) and T006 (overdue) as evidence

| Task | Name | Owner | Status | Due | Flag | Reason |
|---|---|---|---|---|---|---|
| **T024** | Security review of AI infrastructure | James Wong | Blocked | 5/26 | **Blocked** | Waiting for security team availability |
| **T006** | Identify data gaps and quality issues | Priya Nair | In Progress | 4/21 | **Overdue (7 days)** | Past due, not Done; Sprint 2 carry-over |
| T007 | Shortlist AI use cases | Arjun Mehta | In Progress | 4/28 | Due today | Not Done on due date |
| T025 | Legal review of data usage | Sarah Lin | In Progress | 4/28 | Due today | Not Done on due date |
| T008 | Define success criteria for each use case | Sarah Lin | To Do | 5/2 | Due in 4 days | Not started; depends on T007 |
| T009 | Vendor evaluation for ML platform | James Wong | To Do | 5/5 | Due in 7 days | Not started |

## 2. Answer facts from the timeline (`project_timeline.csv`)

**Used in:** T1 and T14 (8 phases, dates, milestones), T11 (milestone due 5/10), T7 (overdue gap analysis report)

| Phase | Name | Weeks | Start | End | Milestones / deliverables |
|---|---|---|---|---|---|
| 1 | Project Initiation | 1–2 | 2026-03-30 | 2026-04-12 | Project charter signed off; Team structure finalized |
| 2 | Current State Analysis | 3–4 | 2026-04-13 | 2026-04-26 | Current systems audit report; Gap analysis report |
| 3 | Use Case Selection | 5–6 | 2026-04-27 | 2026-05-10 | Final list of prioritized use cases with success criteria |
| 4 | Pilot Design | 7–10 | 2026-05-11 | 2026-06-07 | Working prototype models; Data pipelines established |
| 5 | Pilot Implementation | 11–14 | 2026-06-08 | 2026-07-05 | Pilot results report; User feedback and performance metrics |
| 6 | Evaluation & Iteration | 15–16 | 2026-07-06 | 2026-07-19 | Updated models and process refinements |
| 7 | Full Deployment | 17–22 | 2026-07-20 | 2026-08-30 | Full production rollout; Training sessions completed |
| 8 | Monitoring & Review | 23–24 | 2026-08-31 | 2026-09-13 | Project closure report; Recommendations for future scaling |

**Current phase at AS_OF_DATE:** Phase 3, Use Case Selection (Week 5).

**Milestones in the next 2 weeks (2026-04-28 → 2026-05-12)**
- Phase 3 — *Final list of prioritized use cases with success criteria*, due 2026-05-10. Depends on T007 (In Progress) and T008 (To Do).

**Recently due, incomplete**
- Phase 2 — *Gap analysis report*, due 2026-04-26. Not complete, because T006 is In Progress → **overdue milestone**.
- Phase 2 — *Current systems audit report* is complete (T004 Done).

**Also note:** Phase 4 starts 2026-05-11. Its milestones are due 2026-06-07, outside the 2-week window.

## 3. Answer facts from the description and risks

**Used in:** T1 (goals and business areas), T14 (goals), T3, T7, T13 and T15 (risk register and top 3)

**Stated goals (only these three):** reduce delivery delays by 15%; lower operational costs by 10%; improve service responsiveness.

**Business areas the project covers:** demand forecasting, route optimization, inventory management, customer support.

**Risk register:** R01–R10 (10 risks, 10 categories). Valid IDs are R01–R10 only.

**Top 3 risks** (ranking rule in PRD §6.4):
1. **R09 Security Vulnerabilities** — T024 security review is Blocked
2. **R01 Data Quality & Availability** — T006 data-gap analysis is overdue
3. **R05 Ethical & Legal Concerns** — T025 legal review of data usage is due today, still In Progress

## 4. Expected results per test *(used by the evaluation)*

| ID | Expected type | Must contain | Must NOT contain |
|---|---|---|---|
| T1 | plan | Phases from the timeline; milestones; timeline (24 weeks / 6 months); the 3 stated goals; the 4 business areas | Goals or KPIs not in the description |
| T2 | clarification | Flags insufficient detail; asks for scope, timeline, team size | A phased plan or timeline table |
| T3 | risk_matrix | Categorized risks from R01–R10, tied to logistics/AI context; impact + mitigation | Risks unrelated to the project; IDs outside R01–R10 |
| T4 | clarification | Flags insufficient info; asks for project details (domain, scope, goals) | Any risk matrix or project-specific risks |
| T5 | status_report | Sprint 3 tasks T007, T008, T009, T025 with correct statuses; blockers (T024) and carry-over (T006) | Invented tasks; IDs > T025; Sprint 3 tasks shown as Done |
| T6 | clarification | States that no task data is available | Any task statuses, IDs or progress percentages |
| T7 | risk_answer | 3 risks from R01–R10 with rationale; expected R09, R01, R05 | Risks not in the register |
| T8 | alert_list | **T024 (Blocked)**; T006 (overdue); due-date check against AS_OF_DATE; T007/T025 due today | Done tasks flagged as at risk |
| T9 | clarification | Asks for scope, goals, deliverables | A detailed plan built from "2 weeks" alone |
| T10 | status_summary | Done 5, In Progress 3, Blocked 1, To Do 16 (total 25) | Any other counts (e.g. "3 Done") |
| T11 | milestone_list | Phase 3 milestone due 2026-05-10 | Milestones not in the timeline; Phase 4+ milestones listed as due in the window |
| T13 *(extra, Risk)* | risk_coverage | R09, R01 mitigation at risk (T024 blocked, T006 overdue); R03, R06 weak coverage; others covered, on track | Risk or task IDs not in the data |
| T12 | stakeholder_email | Sprint 2 tasks T004, T005 (Done), T006 (In Progress / overdue); professional tone | Any Sprint 3+ task (T007–T025) |
| T14 *(extra, Planner)* | plan | 8 phases + goals as T1; owner and budget = UNKNOWN, under Open questions | Invented owners, budgets or amounts |
| T15 *(extra, Risk)* | risk_answer | Register has no likelihood scores; R05 details from the register | Any invented score, percentage or rating |
| T16 *(extra, Status)* | status_no_data | No tasks for Sprint 42 | Invented tasks, counts or health |
| T17 *(extra, Stakeholder)* | clarification | Asks which sprint; asks to resend with the sprint | An email draft or task IDs |

## 5. Data discrepancies *(background, not tested)*

1. Done count in the problem statement (3) ≠ CSV (5).
2. Task board ends 2026-08-04 (T023), but timeline Phase 8 ends 2026-09-13. The board schedule is compressed relative to the plan.
3. Risk register has no likelihood or severity, so "top risks" needs a declared ranking rule.
4. T024 is in Sprint 5 but already Blocked at Sprint 3. This is an early warning for the Pilot Design phase.
