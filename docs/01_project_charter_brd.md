# 01 — Project Charter / Business Requirements (BRD)

**Project:** AI Project Assistant (the course brief calls it "Mira — AI-Powered Project Intelligence Assistant")
**Sponsor:** CTO, Nexora Pvt. Ltd.
**Owner:** AI PM/TPM (author)
**Status:** Final v1.0

---

## 1. Background

Nexora Pvt. Ltd. (London, ~120 staff) delivers software and IT services across Europe and Asia. It has won a contract to run the **AI Adoption Project for ABCDE Ltd.**, a mid-sized logistics company: a 6-month (24-week) programme to bring AI into demand forecasting, route optimization, inventory management and customer support.

Nexora is startup-lean. A few PMs/TPMs run several projects at once, and most project-management "paperwork" is done by hand.

## 2. Problem statement

Nexora's PMs/TPMs spend a large share of their week producing project artifacts by hand. The output quality varies by person, and problems surface too late.

| Pain point | Today | Business impact |
|---|---|---|
| Project plans built from high-level descriptions | 3–4 hrs per project, manual | Slow project kick-off; PM time not spent on delivery |
| Risk assessments | Inconsistent — some projects have detailed matrices, others none | Unmanaged risks; uneven client experience |
| Weekly status reports | 1–2 hrs/week compiled from task boards and notes | Recurring overhead per PM per project |
| Milestone tracking | No proactive alerts; slips found in retrospectives | Missed milestones, late escalation |
| Formats | No standard template for plans, risks or status | Hard to compare projects; rework for stakeholders |

**Problem in one sentence:** PMs/TPMs lack a fast, consistent and trustworthy way to turn raw project data into plans, risk matrices and status reports, so they lose hours each week and miss early warning signs.

## 3. Vision

> I will build an AI Project Assistant that helps Nexora's PMs and TPMs turn raw project data into ready-to-use, standardized plans, risk assessments and status reports in minutes. Every statement it makes traces back to the source data, and it warns PMs before milestones slip.

## 4. Business objectives

| ID | Objective | Measure |
|---|---|---|
| BO1 | Cut time to produce a first-draft project plan | 3–4 hrs → ≤ 30 min (incl. PM review) |
| BO2 | Cut time to produce a weekly status report | 1–2 hrs → ≤ 15 min |
| BO3 | Standardize artifacts across projects | 100% of the assistant's outputs follow the defined templates |
| BO4 | Surface at-risk milestones before they are missed | At-risk items flagged on request, including tasks due within 7 days |
| BO5 | Trustworthy output | 0 fabricated tasks, risks or milestones in evaluation |

## 5. Scope

**In scope (v1)**
- Data for one project, ABCDE Ltd's AI Adoption Project, read from the 4 files that came with the brief, stored unchanged in Google Drive:
  - `project_description.txt`: goals, business areas and approach
  - `project_timeline_mira.csv`: 8 phases over 24 weeks, with milestones and deliverables
  - `project_risks_mira.csv`: 10 risks (R01–R10), each with category, impact and mitigation
  - `sample_task_board_mira.csv`: 25 tasks, each with sprint, owner, status, priority and due date
- My additions in a separate config file (`mira_config.json`): the as-of date, project start, and which tasks mitigate which risk
- Core capabilities: plan, risk, status.
- One extended capability: stakeholder updates, with PM approval in Slack. The Planner also includes a short "Key risks" section.
- Chat/Slack interface, Langfuse tracing, n8n evaluation workflow against 17 tests (12 from the brief plus T13–T17).
- The three core outputs (project plan, risk assessment, weekly status report) are also saved to a Google Doc.
- The weekly status report is also sent automatically every Monday (Google Doc + Slack post).

**Out of scope (v1, candidates for phase 2)**
- Live Jira/Trello API sync. v1 reads the task board from a CSV file in Google Drive.
- Multi-project portfolio views.
- Fine-tuning, and RAG over large document sets.
- Scheduled (proactive) milestone alerts, Resource Allocation Advisor and Competitive Analysis.
- Writing back to task boards (the assistant is read-only).

## 6. Stakeholders

| Stakeholder | Role | Interest |
|---|---|---|
| CTO | Sponsor | ROI, adoption, risk |
| PMs/TPMs (10) | Primary users | Time saved, quality |
| Engineering / data science leads | Secondary users, reviewers | Accurate status, fewer status meetings |
| ABCDE Ltd client stakeholders | Recipients of updates | Clear, accurate reporting |
| Security / legal | Reviewers | Data privacy, LLM vendor terms |

## 7. Success criteria (acceptance)

| ID | Criterion | Target |
|---|---|---|
| SC1 | Plan groundedness (Planner) | Average ≥ 0.95 |
| SC2 | Risk relevance (Risk) | Average ≥ 0.9 |
| SC3 | Status accuracy (Status) | Average ≥ 0.9; T10 = 1.0 |
| SC4 | Tests passed — human verdict (PM), with LLM judge scores alongside | **17 / 17 tests** (12 from the brief + T13–T17); judge agreement reported |
| SC5 | Cost per request (actual cost from OpenAI usage; Langfuse traces show an estimate) | < US$0.01 |
| SC6 | Pilot PM satisfaction ("would use weekly") | ≥ 4 / 5 |

Metric definitions are in [04 Evaluation metrics](04_evaluation_metrics.md).

*SC4 raised during the project:* the charter first set 12/12 brief tests and ≥ 90% on extra tests. When I added T13–T17 to cover every agent, I raised it to 17/17.

*SC5 source changed during evaluation:* the charter first named Langfuse traces as the cost source. Langfuse only estimates tokens (from text length) and labels every call with one model, so the actual cost is taken from OpenAI usage instead ([doc 05 B5](05_metric_implementation_and_cost.md), [change log](06_change_log.md)).

## 8. Timeline (build programme)

| Week | Dates | Phase | What I did |
|---|---|---|---|
| 1 | Oct 13–19 | Define | Charter, PRD, ground truth, metrics; design revised to 4 agents; Langfuse connection tested |
| 2 | Oct 20–26 | Build | Source files in Google Drive, `Mira Tools`, Orchestrator, Planner, Risk, Status, Stakeholder agent with Slack approval, Monday report; reworked after the instructor's Oct 25 changes |
| 3 | Oct 27–30 | Evaluate, fix, write up | Eval workflow and 17-test baseline (7/17); one change at a time to 17/17; 3 final runs; judge side test; README, docs and GitHub |

> *Pilot (hypothetical):* a 2-PM pilot is part of the proposed rollout ([§11](#11-rollout-plan), stage 1). It was not run in this capstone.

## 9. Risks and constraints

**Risks**

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| LLM fabricates tasks, risks or numbers | Med | High | Tools do the math; Orchestrator asks for details on vague input; groundedness evaluation before rollout |
| Client data sent to third-party LLM | Med | High | Use vendor API with no-training terms; send only the needed columns; legal review before rollout |
| PMs don't trust or adopt outputs | Med | High | Citations to task/risk IDs; human approval for external comms; pilot with champions |
| Source data quality issues | High | Med | Documented discrepancies; the assistant reports the data as-is and flags conflicts |

**Constraints:** low-code platform (n8n), capstone timebox of about 4 weeks, read-only data access. Technical assumptions (reference dates, source of truth) are in the [PRD §7](02_prd.md).

## 10. Decision-making and governance

- **Scope or architecture changes:** AI PM decides and informs the CTO. Changes that affect cost or vendor need CTO approval.
- **Go/no-go for rollout:** CTO approves, based on SC1–SC5 evaluation results and the security/legal sign-off.
- **Prompt and model changes:** every change is re-run against the 17-test evaluation set. No regression is allowed on SC1–SC3.
- **Cadence:** weekly 30-min review of evaluation results and trace findings.

## 11. Rollout plan

> **Note:** Stage 0 is carried out in this capstone. Stages 1–3 are the proposed plan for a real rollout to 10 PMs/TPMs (brief Q4), and their targets are planned, not measured.

| Stage | Who | Exit criteria |
|---|---|---|
| 0. Internal test | AI PM | SC1–SC4 met on the final runs; SC5 met for plan and email, just over for risk and status (≈ $0.011) |
| 1. Pilot | 2 PMs, 1 project each, 2 weeks | No critical errors; SC6 ≥ 4/5 |
| 2. Expand | All 10 PMs/TPMs | Onboarding guide, Slack channel, office hours |
| 3. Operate | All | Weekly eval re-runs, monthly cost review, feedback backlog |

Human-in-the-loop stays on for every client-facing message in all stages.
