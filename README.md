# Mira: AI-Powered Project Intelligence Assistant

**Author:** Colin McGregor

## 0. Mira at a glance

For the capstone of *Applied Agentic AI for PMs/TPMs*, I chose **Mira** from the four options (CalendarMate, Mira, PRD Genie, SalesGenie). Mira is an assistant that helps Nexora's PMs/TPMs plan projects, assess risks and report status, using the data of the **ABCDE Ltd AI Adoption Project**.

I built Mira in **n8n** as a **router**. One Orchestrator call decides what kind of request it is and whether there is enough information. One specialist agent then answers, or Clarify asks for the missing details instead of guessing. The agents never read the data themselves: they call tools in which **code calculates and the LLM explains**, so every number is exact and every claim traces to a task or risk ID.

| Agent | Type | What it does |
|---|---|---|
| Planner | Core | Project plan: phases, milestones, deliverables and key risks, from the description and timeline |
| Risk agent | Core | Risk matrix and top risks from the register (R01–R10), linked to live task signals (blocked, overdue) |
| Status agent | Core | Weekly status report, task counts, blocked and at-risk tasks, upcoming milestones |
| **Stakeholder** | **Extended** | Sprint update email for an audience. **The PM must click Approve in Slack before Gmail sends anything**; Decline → feedback → redraft |

Core plans, risk assessments and status reports are saved as Google Docs. A weekly status report posts to Slack every Monday, and Langfuse traces every request for observability.

I evaluated Mira in n8n. An evaluation workflow runs each test through Mira, scores it with two gpt-4.1 judges and writes the results to a [Google Sheet](https://docs.google.com/spreadsheets/d/1s5ycENt8-rFJuF1IEpWRB79vfeizXutrNx4_s-dDzVc/edit?usp=sharing), where I added my own verdict. The brief gives 12 tests (T1–T12). **I added 5 (T13–T17)** so every agent faced its hardest case, usually data that doesn't exist: a sprint, a field or an owner. **All results below cover all 17 tests.**

**The 3 metrics.** I judged Mira on one metric per core capability (plan, risk, status), each averaged over a fixed set of tests for that capability (full definitions in [§2.5](#25-baseline-testing-and-results)):
- **Plan groundedness:** is everything in the plan traceable to the project data? Target ≥ 0.95.
- **Risk relevance:** are the risks specific to this project and taken from the risk file? Target ≥ 0.9.
- **Status accuracy:** do counts, statuses and dates match the task board and timeline? Target ≥ 0.9, with the task-count test (T10) at exactly 1.0.

**Results** (baseline vs. the average of 3 identical final runs; I ran the final set three times to check the results were stable, not lucky)

| | Baseline | Final | Target |
|---|---|---|---|
| **All tests passed (human verdict)** | **7 / 17** | **17 / 17** | 17 / 17 |
| of which brief tests (T1–T12) | 4 / 12 | 12 / 12 | 12 / 12 |
| of which my extra tests (T13–T17) | 3 / 5 | 5 / 5 | 5 / 5 |
| Plan groundedness | 1.00 | **1.00** | ≥ 0.95 |
| Risk relevance | 0.60 | **0.93** | ≥ 0.9 |
| Status accuracy | 0.67 | **1.00** (T10 = 1.0) | ≥ 0.9, T10 = 1.0 |
| Cost per request (using Mira) | not measured | $0.001 plan · $0.0005 email · $0.011 status · $0.015 risk (measured in n8n) | < $0.01 |
| Cost per evaluation run (17 tests) | not measured | **≈ $0.21**: gpt-4.1 judges ≈ $0.10 + Mira ≈ $0.11 | — |

*Plan groundedness covers the plan tests (T1, T2, T9, T14). The Groundedness judge also scores the other tests. There a few score just under 1.0 (0.80–0.95, still a pass): T5 and T8 for the health rating and suggested actions they are asked to give, and T11 for answering "Owner: UNKNOWN" when the data has no owner. These are requested judgements or honest gaps, not invented facts.*

**Evaluation was the main cost.** gpt-4.1 judging was 83% of the day's spend ($2.87 of $3.47), because I re-ran all 17 tests after every change, about 28 runs' worth on that day alone. PMs using Mira never pay this cost. Details: [§2.6](#26-cost-analysis-and-evaluation-strategy).

**AI assistance.** I used AI (Claude Opus 5.5) as a coding and writing assistant. It wrote the JavaScript in all the n8n Code nodes and the agent and judge prompts, following my guidelines, helped build the answer key ([03 Ground truth](docs/03_ground_truth.md)) and helped draft these docs. I made the design decisions, built and connected the workflows in n8n, tested everything and gave the final verdict on every test.

**Where to find each graded item**

| Assignment item | Where |
|---|---|
| Q1 Ideation | [§1](#1-q1-ideation) · [PRD §1](docs/02_prd.md) |
| Q2 Design, core, extended, observability, baseline, cost | [§2](#2-q2-build-mira) · [PRD](docs/02_prd.md) · [Metrics](docs/04_evaluation_metrics.md) · [Metric implementation + cost](docs/05_metric_implementation_and_cost.md) |
| Q3 Program charter | [§3](#3-q3-program-charter) · [Charter / BRD](docs/01_project_charter_brd.md) |
| Q4 Reflection | [§4](#4-q4-reflection-and-next-steps) · [Change log](docs/06_change_log.md) |
| Workflow JSON | [final-v1/n8n_export/](final-v1/n8n_export/) (final) · [baseline-v1/n8n_export/](baseline-v1/n8n_export/) (before fixes) |
| Evaluation results sheet (all runs, scores, human verdicts) | [Google Sheet](https://docs.google.com/spreadsheets/d/1s5ycENt8-rFJuF1IEpWRB79vfeizXutrNx4_s-dDzVc/edit?usp=sharing) (view only) · [final-v1/mira_eval_results.xlsx](final-v1/mira_eval_results.xlsx) |
| Baseline test results (all inputs) | [baseline-v1/](baseline-v1/) · [final-v1/](final-v1/) |
| Screenshots | [§2](#2-q2-build-mira) · [screenshots/](screenshots/) |

---

## 1. Q1 Ideation

Three use cases where agents save Nexora's PMs/TPMs time. Full detail (inputs, outputs, knowledge base) in [PRD §1](docs/02_prd.md).

| Use case | Pain point | Agent(s) | Success metrics |
|---|---|---|---|
| **UC1 Project plan generation** | A first plan takes 3–4 hrs, and every PM uses a different format | Planner | 0 invented goals or milestones · plan groundedness ≥ 0.95 *(pilot only: draft in ≤ 30 min)* |
| **UC2 Weekly status and at-risk tracking** | Status takes 1–2 hrs a week; slips are found too late | Status agent | Counts 100% correct · 100% of blocked and overdue tasks caught *(pilot only: report in ≤ 15 min)* |
| **UC3 Risk assessment and stakeholder comms** | Risk matrices are inconsistent; emails are rewritten for each audience | Risk agent + Stakeholder | 100% real risk IDs · 0 out-of-sprint tasks *(pilot only: ≥ 70% of emails approved without edits)* |

---

## 2. Q2 Build Mira

### 2.1 Design: architecture, orchestration, tools, outputs

#### Architecture

```mermaid
flowchart TD
    U[Chat request, Monday 09:00 schedule<br/>or eval run] --> O[Orchestrator<br/>1 LLM call: intent + enough data?]
    O --> G{Enough data?<br/>+ active-project guard}
    G -- no --> C[Clarify<br/>fixed questions per request type]
    G -- yes --> W{Which agent?}
    W --> P[Planner]
    W --> R[Risk agent]
    W --> S[Status agent]
    W --> K[Stakeholder]
    P & R & S & K --> T[Mira Tools<br/>Drive files → parse CSV fields → Code nodes → JSON to agent<br/>tasks · overdue/blocked · milestones · risks · description · timeline]
    F[(Project files from the brief<br/>description · timeline · risks · task board)] --> T
    CFG[(mira_config.json — mine<br/>as-of date · current sprint · windows · risk-to-task links)] --> T
    P & R & S --> D[Google Doc + chat reply]
    K --> A{PM approval in Slack}
    A -- Approve --> E[Gmail]
    A -- Decline --> K

    classDef core fill:#EEEDFE,stroke:#534AB7,color:#3C3489
    classDef ext fill:#E1F5EE,stroke:#0F6E56,color:#085041
    class P,R,S core
    class K,A ext
```

*Purple = core agents. Green = extended capability. Full diagram and node-level detail: [PRD §4](docs/02_prd.md).*

#### Orchestration

Each request Mira gets is one type: a plan, a risk question, a status report or an email. So I chose a **router**. One Orchestrator call decides the type and whether there is enough information, and one specialist agent answers. That is cheaper, easier to test and easier to trace than agents calling each other.

At first the Orchestrator made every routing decision itself. During evaluation, fixing one routing case in its prompt kept breaking another, so I moved two decisions into code. A request that names the active project always goes through, since Mira has its data. A vague request gets a fixed list of clarifying questions. Details: [PRD §4.5](docs/02_prd.md#45-orchestration-pattern-and-rationale).

#### Source data

Mira works from the 4 data files that came with the assignment (course `Resources/` folder), used unchanged:

| File | What it holds |
|---|---|
| `project_description.txt` | The ABCDE Ltd AI adoption project: goals, business areas, approach |
| `project_timeline.csv` | 8 phases over 24 weeks, with key activities, milestones and deliverables |
| `project_risks.csv` | Risk register R01–R10 (category, risk, impact, mitigation) |
| `sample_task_board.csv` | 25 tasks T001–T025 (sprint, owner, status, priority, due date) |

I stored copies in a Google Drive folder, [**Mira Project Files**](https://drive.google.com/drive/folders/1ReOQqjBqKNWq7hK-QW2ZZjTTwHMBMQ2P?usp=sharing) (view only). Its **Mira Reports** subfolder holds the Google Docs Mira saved (plans, risk assessments, status reports). I added `_mira` to some file names only to tell my copies apart; the contents are unchanged. My own addition is [`mira_config.json`](data/mira_config.json) (see below). The 12 brief test inputs come from the assignment's `eval_mira_inputs.txt` (see §2.5).

#### Tools: code calculates, the LLM explains

I decided early that the LLMs would never count, compare dates or read the files themselves. Each agent calls tools in **Mira Tools**. There, code reads the project files and my `mira_config.json`, parses the CSV fields, does the calculations and returns a small JSON result. The agent only explains it. That keeps numbers exact and every claim traceable to a task or risk ID. The trade-off is that the data files must keep a fixed format (column names, date format). Details: [PRD §4.3](docs/02_prd.md). I used AI (Claude Opus 5.5) to write the JavaScript in all the Code nodes. I set the rules for each tool (what to count, filter and return), then tested every tool against the data files. All the code is in [final-v1/n8n_code/](final-v1/n8n_code/).

#### My config file: mira_config.json

`mira_config.json` is my own file, not part of the brief. It holds Mira's settings and assumptions:
- the as-of date: a fixed date (2026-04-28) that Mira treats as the current date in place of the real one (see below)
- the current sprint
- the "due soon" and "upcoming milestone" windows
- the risk-to-task mitigation links (§2.2)

Keeping them separate leaves the brief's files unchanged and the code generic.

**Design decision: a fixed as-of date for testing.** In real use, Mira would take today's date and judge every task against it: what is overdue, what is due this week, which milestones are coming up. This project's data is a historical snapshot, though. Against the real calendar, every open task would be overdue and the answers would change from day to day, so no test could have a fixed correct answer. So I set "today" in the config to **2026-04-28**, at the end of Sprint 3. All tools compare dates against it, which makes Mira behave as if it ran on that day. Every test then has one right answer that stays valid run after run. That is what made the ground truth and the 3 final runs comparable. For real use, the tools would read the system date instead, a small code change.

#### Managing outputs

A request can reach Mira in three ways, each through its own trigger in Mira main:
1. **Chat:** a PM types a request (When chat message received).
2. **Schedule:** the Monday 09:00 trigger asks for the weekly status report (Every Monday 9am).
3. **Evaluation:** the Mira – Evaluation workflow sends one of the 17 test inputs (When Executed by Another Workflow).

Each needs its answer delivered differently. A short question shouldn't create a document, and a test run should never post to Slack or email anyone. So the first node, **Normalize request**, tags every request with its source: `chat`, `schedule` or `eval`. After the agent answers, a **Decide delivery** Code node uses that tag and the Orchestrator's decision to pick exactly one lane. The **Delivery** Switch then routes the answer there:

| Source tag | Lane | When | What happens |
|---|---|---|---|
| `chat` | **doc** | Core outputs: a full plan, risk assessment or weekly report (the Orchestrator sets `save_to_doc`) | Saved as a formatted Google Doc in `Mira Reports`, with the link in the chat reply |
| `chat` | **chat_only** | Short answers (e.g. top 3 risks), clarifying questions and stakeholder drafts | Chat reply only |
| `schedule` | **schedule** | The Monday 09:00 trigger | Weekly report saved as a Google Doc and posted to Slack #mira-reports |
| `eval` | **chat_only** | Every evaluation run, whatever the request | Answer returned to the eval workflow; no Doc, no Slack, no email |

Stakeholder emails take one more step. The draft goes to Slack for approval, and Gmail sends it only after the PM clicks Approve (§2.3). The approval workflow also skips any draft whose source is `eval`, so a test can never email anyone.

This meets the PRD's delivery requirements: the three core outputs are saved to Google Docs with a link in chat (FR13), short answers stay in chat, the weekly report goes to Slack every Monday (FR16), and nothing is emailed without approval.

#### Models

I started with gpt-4o-mini for every agent: it is cheap and fast, and the tools do the calculating. gpt-4o-mini still runs the Orchestrator, Planner and Stakeholder agent. Evaluation showed two agents falling short, so I upgraded both to **gpt-4o**:
- **Risk agent:** on gpt-4o-mini, the Risk agent kept getting date logic wrong (e.g. it missed a mitigation task due today in T7) ([CHG-14](docs/06_change_log.md)).
- **Status agent:** on gpt-4o-mini, the Status agent sometimes dropped items from long sprint reports (e.g. it left out the blocked task in T5) ([CHG-16](docs/06_change_log.md)).

That adds about one cent per Risk or Status request, which I judged worth it. All models run at Sampling Temperature 0, so runs are comparable.

Claude Opus 5.5 wrote the prompts to my guidelines; I tested and revised them through the change log ([prompts](final-v1/prompts/)).

#### Workflows

| Workflow | Role |
|---|---|
| Mira main | Triggers, Orchestrator, Clarify, the 4 agents, delivery |
| Mira Tools | Reads the project files; the 6 tools |
| Mira Save Doc | Saves reports as formatted Google Docs |
| Mira Stakeholder Approval | Slack Approve / Decline, redraft, Gmail send |
| Mira – Evaluation | Runs the 17 tests through Mira and both judges |

![Mira main canvas](screenshots/canvas_mira_main.png)

▲ *Mira main: triggers, Orchestrator, Clarify, the 4 agents and delivery.*

<details>
<summary>Screenshots: the other 4 workflow canvases</summary>

![Mira Tools canvas](screenshots/canvas_mira_tools.png)

▲ *Mira Tools: loads the project files and serves the 6 tools.*

![Mira Stakeholder Approval canvas](screenshots/canvas_mira_stakeholder_approval.png)

▲ *Mira Stakeholder Approval: the Real draft guard, Slack Approve / Decline, redraft and Gmail.*

![Mira Save Doc canvas](screenshots/canvas_mira_save_doc.png)

▲ *Mira Save Doc: saves reports as formatted Google Docs.*

![Mira – Evaluation canvas](screenshots/canvas_mira_evaluation.png)

▲ *Mira – Evaluation: test inputs → Mira → 2 judges → verdict → results sheet.*

</details>

### 2.2 Core capabilities (end to end)

Mira covers the three core jobs from the brief: a project plan, a risk assessment and a weekly status report. It also asks for details when a request is too vague. The table shows one test of each, with what Mira produced in the final runs. Screenshots follow below.

| Capability | Example request | Result in final runs |
|---|---|---|
| Plan | "Generate a project plan for the AI Adoption Project at ABCDE Ltd." (T1) | Phases, dates and milestones from the timeline; saved as a Google Doc |
| Risk | "What are the top 3 risks…?" (T7) | R09, R01, R05 with live signals (T024 Blocked, T006 overdue, T025 due today), impact and mitigation |
| Status | "Generate a weekly status report… for Sprint 3." (T5) | Exact counts, T024 Blocked, T006 overdue, upcoming milestones, health rating |
| Vague input | "Generate a project plan for: 'We want to build a chatbot.'" (T2) | Asks for scope, goals, timeline, deliverables and team size instead of guessing |

#### Risk-to-task mapping (my design decision)

The risk register has no likelihood or severity scores. Ranking risks from it alone would mean the LLM guessing what matters. So I linked each risk to the tasks that mitigate it, and rated each link strong or weak. These links live in `mira_config.json`, and the brief's risk file stays unchanged.

The `get_risks` tool then checks those tasks against the task board. A risk whose strong-linked task is blocked or overdue rises to the top. For example, R09 Security is Tier 1 because its mitigation task T024 is Blocked. The Risk agent only explains the ranking, so every risk it names traces back to a real task and date. The mapping also answers a question leaders actually ask: which risks have mitigation, and which don't? Full table and rules: [PRD §6.4](docs/02_prd.md). Tested by T7 and T13.

#### Plan (T1)

*"Generate a project plan for the AI Adoption Project at ABCDE Ltd. Use the provided project description."*

📄 **Google Doc Mira saved:** [Mira — Project plan (DRAFT)](https://docs.google.com/document/d/1DG6ZGiGMz3RP1P8AoNCM3TxTRghX4OEy26fvT9w_6vM/edit?usp=sharing) (view only)

<details>
<summary>Screenshots: Plan (T1) · 4 images</summary>

![Plan request: path through Mira main](screenshots/T1_project_plan_showing_n8n_path.png)

▲ *Path through Mira main: Orchestrator → Planner → tools → Save Doc.*

![Plan in chat](screenshots/T1_project_plan_response_1.png)

![Plan in chat, continued](screenshots/T1_project_plan_response_2.png)

▲ *The plan in chat (two screenshots).*

![Plan saved as a Google Doc](screenshots/T1_project_plan_in_google_docs.png)

▲ *The plan saved as a Google Doc.*

</details>

#### Risk (T7)

*"What are the top 3 risks for the ABCDE Ltd project based on the risk data?"*

<details>
<summary>Screenshots: Risk (T7) · 2 images</summary>

![Risk request: path through Mira main](screenshots/T7_top3_risks_n8n_path.png)

▲ *Path through Mira main: Orchestrator → Risk → tools.*

![Top 3 risks in chat](screenshots/T7_top3_risk_response.png)

▲ *The answer: R09, R01 and R05, each with its live task signal, impact and mitigation.*

</details>

#### Status (T5)

*Weekly status report for Sprint 3.*

📄 **Google Doc Mira saved:** [Mira — Weekly status report, Sprint 3](https://docs.google.com/document/d/1xSdJl41awhVePU_B5YmSARR1ViQYPqli3N6V6Mf_1bY/edit?usp=sharing) (view only)

<details>
<summary>Screenshots: Status (T5) · 2 images</summary>

![Status request: path through Mira main](screenshots/T5_weekly_status_S3_n8n_path.png)

▲ *Path through Mira main: Orchestrator → Status → tools → Save Doc.*

![Sprint 3 weekly status report](screenshots/T5_weekly_status_S3_response.png)

▲ *The report in chat. It is also saved as a Google Doc.*

</details>

#### Vague input (T2)

*"Generate a project plan for: 'We want to build a chatbot.'"* The Orchestrator finds the request too vague, so Clarify asks for details instead of guessing.

<details>
<summary>Screenshot: Vague input (T2)</summary>

![Vague request: Clarify asks for details](screenshots/T2_vague_request_response_clarify_path.png)

▲ *Path: Orchestrator → Enough data? (no) → Clarify. Mira asks for the missing details.*

</details>

#### Monday status report (scheduled)

Every Monday at 09:00, the **Every Monday 9am** trigger sends a fixed request ("weekly status report for the current sprint") through the Orchestrator, which routes it to the Status agent. It saves the report as a Google Doc and posts it to Slack **#mira-reports**.

📄 **Google Doc Mira saved:** [Mira — Monday status report](https://docs.google.com/document/d/1J0ZNSw_ueloXw4M1Nc4LKYINIMjschdlujugxsrk8uQ/edit?usp=sharing) (view only)

<details>
<summary>Screenshots: Monday status report (scheduled) · 2 images</summary>

![Monday report posted to Slack](screenshots/monday_slack_report.png)

▲ *The Monday report posted to Slack #mira-reports.*

![Monday report saved as a Google Doc](screenshots/monday_slack_report_google_docs.png)

▲ *The same report saved as a Google Doc.*

</details>

### 2.3 Extended capability: Stakeholder update with PM approval

For the extended capability I chose stakeholder update emails, with a PM approval step built in. Emails go to people outside the team, so a PM must review each one before it is sent. The Stakeholder agent drafts a sprint update covering only that sprint's tasks. It flags anything overdue or blocked, with a plan to close it.

Mira never sends on its own. The draft goes to the PM in Slack with **Approve** and **Decline** buttons. Approve sends it through Gmail. Decline asks what to change, and Mira redrafts without adding new facts, then asks again. Evaluation runs skip Slack entirely. In my runs, Gmail sent each approved email to my own inbox (screenshots below). For privacy, the recipient in the published export is replaced with `pm@example.com`. Tested by T12 (Sprint 2 email) and T17 (no sprint named, so Mira asks which one). The brief also asks for updates tailored to leadership, engineering and client audiences. The prompt sets the tone for leadership (short, outcome-focused) and engineering (task detail), but has no rule for a client audience. No test checks the three versions. Details: [PRD §6.6](docs/02_prd.md#66-human-in-the-loop).

#### Approve flow (T12)

*"Generate a stakeholder update email summarizing Sprint 2 progress."*

<details>
<summary>Screenshots: Approve flow (T12) · 4 images</summary>

![Draft in chat](screenshots/T12_stakeholder_email_n8n_response_1.png)

![Draft in chat, continued](screenshots/T12_stakeholder_email_n8n_response_2.png)

▲ *Step 1: Mira drafts the email in chat and sends it to Slack for approval.*

![Slack approval request with Approve / Decline](screenshots/T12_stakeholder_email_approval_slack2.png)

▲ *Step 2: The PM reviews the draft in Slack and clicks Approve.*

![After Approve: email sent by Gmail](screenshots/T12_stakeholder_email_sent.png)

▲ *Step 3: Gmail sends the email.*

</details>

#### Decline flow (T12)

<details>
<summary>Screenshots: Decline flow (T12) · 4 images</summary>

![Decline: Mira asks what to change](screenshots/T12_decline4.png)

▲ *Step 1: The PM clicks Decline, and Mira asks what to change.*

![PM feedback form](screenshots/T12_decline5.png)

▲ *Step 2: The PM answers: "Too long for leadership. Cut it to 5 bullets."*

![Revised, shorter draft posted for approval](screenshots/T12_decline6.png)

▲ *Step 3: Mira redrafts (no new facts) and posts the shorter draft for approval again.*

![After Approve: revised email sent by Gmail](screenshots/T12_decline7_revised_email.png)

▲ *Step 4: After Approve, Gmail sends the revised email.*

</details>

### 2.4 Observability

I wired Mira to **Langfuse** so I could see how each request was handled: chat, the Monday schedule and eval runs. A trace shows the Orchestrator's routing decision, which agent ran, each tool call and an estimated cost. Eval traces carry the test ID, so I could follow a failing test step by step.

Langfuse is for observability only, not evaluation. Scoring happens in n8n, and the results go to the Google Sheet (§2.5). In practice the sheet also showed each test's path next to its scores, so I did most debugging there. One limit: Langfuse's cost figure is rough. The trace estimates tokens from text length, which is close, but it labels every call as gpt-4o-mini, so risk and status requests (gpt-4o) look far too cheap. The actual cost comes from OpenAI usage ([doc 05 B2](docs/05_metric_implementation_and_cost.md)).

#### Trace tree (T7)

![Langfuse trace for T7](screenshots/langfuse_trace_tree.png)

▲ *One request, step by step: mira → Orchestrator (routing decision) → Risk → get_risks.*

#### Trace list (one evaluation run)

<details>
<summary>Screenshot: Trace list (one evaluation run)</summary>

![Langfuse trace list for one evaluation run](screenshots/langfuse_trace_list_eval.png)

▲ *One trace per test, with the test ID, path and intent in the metadata.*

</details>

*In the trace, Risk is labelled gpt-4o-mini and the tokens are estimated; the actual model is gpt-4o (see above). The "correctness: 0.00" score comes from an old Langfuse evaluator that is no longer used; Mira's real scores come from the two gpt-4.1 judges in the n8n evaluation workflow (§2.5).*

### 2.5 Baseline testing and results

#### The 3 metrics

Each metric is a score from 0 to 1 for one **core capability**: planning, risk assessment or status reporting. It is worked out from a **fixed set of tests** for that capability, listed in the table below:
1. A judge scores each test in the set from 0 to 1.
2. The metric is the **average** of those scores.

**Example:** Risk relevance uses 5 tests (T3, T4, T7, T13, T15). If four score 1.0 and one scores 0.5, Risk relevance = (1 + 1 + 1 + 1 + 0.5) ÷ 5 = **0.90**.

A test belongs to a capability by what the user asked for, not by which part of Mira answered. So the vague requests (T2, T4, T6, T9) count too, even though Clarify answers them instead of an agent. There, the right answer is to ask for the missing details instead of guessing, and doing so scores 1.0.

| Metric | Question it answers | How it is scored | Tests | Target |
|---|---|---|---|---|
| **Plan groundedness** | Is everything in the plan traceable to the project data? | Average **Groundedness** judge score: the share of factual claims supported by the data Mira retrieved | T1, T2, T9, T14 | ≥ 0.95 |
| **Risk relevance** | Are the risks specific to this project and taken from the risk file? | Average **Correctness** judge score against numbered criteria per test: 1.0 = all met, 0.5 = one or two missed, 0 = three or more missed, or the wrong action | T3, T4, T7, T13, T15 | ≥ 0.9 |
| **Status accuracy** | Do counts, statuses and dates match the task board and timeline? | Average **Correctness** judge score, graded the same way; T10 (task counts) must be exactly 1.0 | T5, T6, T8, T10, T11, T16 | ≥ 0.9, T10 = 1.0 |

The extended capability, stakeholder email, has no metric of its own. Its two tests (T12, T17) are judged like the rest and passed in all 3 final runs (1.0 on both judges). Two tests are too few for a meaningful average; a metric would need at least four. In production I would measure it by the share of emails the PM approves without edits (target ≥ 70%, from UC3).

Full definitions: [doc 04](docs/04_evaluation_metrics.md). How the judges score: [doc 05 A3–A4](docs/05_metric_implementation_and_cost.md).

#### How I tested

I ran all evaluation in n8n and kept the results in a Google Sheet. The **Mira – Evaluation** workflow reads the test inputs from the sheet and runs each one through Mira. Two gpt-4.1 judges (Groundedness and Correctness) score it, and the workflow writes every output, score and judge reason to the sheet's **tests** tab. After each run I copied that tab and named it (e.g. `final-1`). I then reviewed each test and added my own verdict, which is final. A summary tab computes the 3 metrics for every run. Langfuse played no part in scoring.

📊 **Evaluation results sheet:** [Mira Eval Dataset](https://docs.google.com/spreadsheets/d/1s5ycENt8-rFJuF1IEpWRB79vfeizXutrNx4_s-dDzVc/edit?usp=sharing) (view only, live) · frozen copy: [final-v1/mira_eval_results.xlsx](final-v1/mira_eval_results.xlsx)

The 12 brief tests come from the assignment's *Baseline Test Dataset for Core Capabilities*, and I used their inputs word for word. The brief gives each test only a short "Expected Output Must Contain" note. I expanded each note into a full expected answer with the exact facts from the data, then turned that answer into a numbered checklist (the criteria) for the judge ([03 Ground truth](docs/03_ground_truth.md)). I used Claude Opus 5.5 to help build this answer key, and I reviewed every answer myself.

**Why criteria as well as the expected answer:** when the judge (gpt-4.1) compared answers to the expected answer alone, its grading swung between too lenient and too strict from one version to the next ([change log](docs/06_change_log.md) CHG-01c). The checklist says exactly what must be in the answer, so a score means the same thing on every run. The expected answer is still used to check facts. A stronger, reasoning judge might grade reliably against the expected answer alone. The side test with gpt-5.6-luna (§4) points that way, but I didn't test it without criteria.

I added 5 more tests (T13–T17) so every agent was tested on its hardest case, usually data that doesn't exist:

| Test | Agent | What it adds |
|---|---|---|
| T13 | Risk | Which risks have mitigation tasks, and which don't (coverage of all 10 risks) |
| T14 | Planner | A plan asking for owners and budgets, which the data doesn't have (must not invent them) |
| T15 | Risk | A likelihood score, a field the register doesn't have (must say so, not invent one) |
| T16 | Status | A report for Sprint 42, which doesn't exist (must not fill it from other sprints) |
| T17 | Stakeholder | An email with no sprint named (must ask which sprint, not draft) |

A test passes the judges if both scores are ≥ 0.8. The baseline passed only 7 of 17 by my review. I fixed the failures one change at a time, re-ran all 17 tests after each, and logged every change with its evidence in the [change log](docs/06_change_log.md).

#### Results

Then I froze Mira and ran the full 17-test set **three times**. Even at Sampling Temperature 0, both Mira's answers and the judges' scores can vary a little from run to run, so a single run could pass by luck. Three identical runs show whether the results are stable. I report the average of the three, and every run had to pass on its own. They did: 17/17 each time. The repeats also exposed judge noise. The same T13 answer failed in one run and passed in another (see "Judge error" below).

| | Baseline | Final run 1 | Final run 2 | Final run 3 |
|---|---|---|---|---|
| **All tests passed (human)** | **7 / 17** | **17 / 17** | **17 / 17** | **17 / 17** |
| Brief tests passed (human) | 4 / 12 | 12 / 12 | 12 / 12 | 12 / 12 |
| Extra tests passed (human) | 3 / 5 | 5 / 5 | 5 / 5 | 5 / 5 |
| **Plan groundedness** (≥ 0.95) | 1.00 | 1.00 | 1.00 | 1.00 |
| **Risk relevance** (≥ 0.9) | 0.60 | 0.90 | 0.90 | 1.00 |
| **Status accuracy** (≥ 0.9, T10 = 1.0) | 0.67 | 1.00 | 1.00 | 1.00 |
| Judge agreement with human | 59% | 94% | 94% | 100% |

*Baseline metrics are from re-judging the baseline answers with the final judge (tab `baseline-v1-rejudged-v5`), so they compare like for like with the final runs. The original judge scored them higher (Risk 0.80, Status 0.83), because it passed answers that were missing required items. The 59% agreement is the original judge's.*

📄 **Quick read:** [final-1](final-v1/final-1.html) · [final-2](final-v1/final-2.html) · [final-3](final-v1/final-3.html): one page per run with each test's input, expected answer, Mira's output, judge scores and reasons, and my final verdict. Download and open in a browser; GitHub shows HTML as code.

#### Results sheet: summary tab

![Results sheet, summary tab](screenshots/results_summary_tab.png)

▲ *The 3 metrics in words, every run, and the FINAL average.*

#### Results sheet: one run (final-3)

<details>
<summary>Screenshot: Results sheet: one run (final-3)</summary>

![Results sheet, final-3](screenshots/results_final-3_run.png)

▲ *Each test's scores, judge reasons, LLM verdict and human verdict.*

</details>

#### Judge error (T13)

**Why the human verdict is final:** in final-1 and final-2, the Correctness judge failed T13 (0.5). It claimed R01's mitigation tasks were wrong and that item 5 was not met. Both were correct in the answer, so I overruled it (Pass, note "Judge error"). In final-3 the judge **passed T13 (1.0) on an identical answer**: Mira's T13 output in final-3 matches final-1 character for character, and final-2 differs only in table spacing and one word. Same input, opposite verdicts, so the judge is noisy on long tables and the human verdict decides.

<details>
<summary>Screenshot: Judge error (T13)</summary>

![final-2, T13: LLM verdict Fail, human verdict Pass with the reason](screenshots/results_judge_error_T13.png)

▲ *final-2, T13: LLM verdict Fail (red), human verdict Pass, with my note.*

</details>

Per-test outputs, scores and human notes: [baseline-v1/](baseline-v1/) and [final-v1/](final-v1/) (CSV plus a readable HTML review page per run). Every change between them, with its evidence and result: [change log](docs/06_change_log.md).

### 2.6 Cost analysis and evaluation strategy

**Evaluation strategy:** I re-ran all 17 tests after every change, one change at a time, so I could tell what each change did. Two LLM judges score each answer: Groundedness against the tool results, Correctness against fixed, numbered criteria with evidence quotes ([doc 05 A4](docs/05_metric_implementation_and_cost.md)). The 3 metrics are defined in [§2.5](#25-baseline-testing-and-results). I review every test, and my verdict is final. The release was frozen after 3 final runs that all passed 17/17. That re-running is also why judging was most of my spend (below).

**Where the cost numbers come from:** OpenAI usage is the source of truth, since it's what I was actually billed. I used two sources and checked one against the other:
- **n8n token counts:** the cost of each request type, measured in one test per type (table below).
- **OpenAI usage for 2026-10-27:** the actual bill, the cost per model call and the evaluation cost. The files are the token export [openai_usage/completions_usage_2026-10-27_2026-10-27.csv](openai_usage/completions_usage_2026-10-27_2026-10-27.csv) and a screenshot of the usage page's cost by line item, [screenshots/cost_openai_usage.png](screenshots/cost_openai_usage.png) (below).

Langfuse's cost is only rough ([§2.4](#24-observability)), so I didn't use it.

**Cost per request, measured in n8n:** each n8n execution shows the input and output tokens of every model node. I read them for one test of each request type, and priced them at OpenAI's rates: gpt-4o-mini at $0.15 per million input tokens and $0.60 per million output, gpt-4o at $2.50 and $10. Each agent's count covers all of its model calls in the request. n8n marks its counts with ~ as approximate, and they line up with the OpenAI averages below.

| Request (test) | Model calls | Input tokens | Output tokens | Cost |
|---|---|---|---|---|
| Vague input, clarify (T2) | Orchestrator (gpt-4o-mini) | 833 | 35 | $0.0002 |
| Stakeholder email (T12) | Orchestrator + Stakeholder (gpt-4o-mini) | 2,750 | 152 | $0.0005 |
| Plan (T1) | Orchestrator + Planner (gpt-4o-mini) | 3,766 | 676 | $0.0010 |
| Status report (T5) | Orchestrator (gpt-4o-mini) + Status agent (gpt-4o) | 3,414 | 459 | $0.011 |
| Risk assessment (T3) | Orchestrator (gpt-4o-mini) + Risk agent (gpt-4o) | 4,126 | 690 | $0.015 |

Cost per plan is $0.001. Clarify, email and plan requests meet the < $0.01 target. A status report is just over, and a full risk assessment is 50% over. The extra cost comes almost entirely from gpt-4o. I moved the Risk and Status agents from gpt-4o-mini to gpt-4o because gpt-4o-mini got dates and summaries wrong (CHG-14, CHG-16). I accepted the extra 1 to 1.5 cents per request for correct answers.

<details>
<summary>Screenshot: T1 token counts in n8n</summary>

![n8n execution log for T1: prompt ~3,766 and completion ~676 tokens, 29.957 s](screenshots/tokens_T1.png)

▲ *The T1 execution in n8n. Hovering over the run total (~4,442 tokens) shows the split: prompt ~3,766, completion ~676.*

</details>

**Checked against the bill:** the OpenAI export gives each model's calls and tokens for the day. Pricing them at the same rates reproduces the bill: $0.17 for gpt-4o-mini, $0.42 for gpt-4o and $2.88 for gpt-4.1, against $0.18, $0.42 and $2.87 on the usage page. The export also has rows from other keys and some calls unrelated to this project, which I left out. Dividing each model's day totals by its number of calls gives the average per call:

| Model | Used by | Calls | Input tokens per call | Output tokens per call | Cost per call |
|---|---|---|---|---|---|
| gpt-4o-mini | Orchestrator, Planner, Stakeholder | 771 | ≈ 1,090 | ≈ 100 | ≈ $0.0002 |
| gpt-4o | Risk, Status | 80 | ≈ 1,440 | ≈ 180 | ≈ $0.0053 |
| gpt-4.1 | Groundedness and Correctness judges | 942 | ≈ 1,330 | ≈ 95 | ≈ $0.0030 |

**Evaluation cost**, built from those per-call averages:

| | Model calls | Input tokens | Output tokens | Cost |
|---|---|---|---|---|
| Judging one test | 2 gpt-4.1 | ≈ 2,660 | ≈ 190 | ≈ $0.006 |
| One full evaluation run (17 tests) | ≈ 43 Mira calls + 34 judge calls | ≈ 99,000 | ≈ 9,000 | ≈ $0.21: judges ≈ $0.10 + Mira ≈ $0.11 |

Judging was the bulk of my spend, because I ran the evaluation so many times. One run costs only about $0.21, but every change meant re-judging all 17 tests. On the day of the final runs I judged about 28 runs' worth (942 calls). That made the gpt-4.1 judges $2.87 of the day's $3.47 (83%); gpt-4o cost $0.42 and gpt-4o-mini $0.18. I accepted this cost because I chose gpt-4.1 as the judge believing it was stronger than the agents it grades. I later learned that, like gpt-4o, it is not a reasoning model, so it wasn't clearly a step up (see the side test in [§4](#what-i-learned-from-the-traces)). The fixed criteria are what made its scores trustworthy. PMs using Mira never pay this cost.

<details>
<summary>Screenshot: OpenAI usage for 2026-10-27</summary>

![OpenAI usage, cost by line item, 2026-10-27](screenshots/cost_openai_usage.png)

▲ *OpenAI usage for 2026-10-27, all API keys ($3.92). It includes about $0.44 from an old Langfuse evaluator on a separate key: part of the gpt-4.1 lines, and all of the gpt-4.1-mini lines. Mira's own spend was $3.47 ([doc 05 B2](docs/05_metric_implementation_and_cost.md)).*

</details>

---

## 3. Q3 Program charter

Full charter: [docs/01_project_charter_brd.md](docs/01_project_charter_brd.md).

- **Vision:** I will build an AI Project Assistant in n8n that helps Nexora's PMs and TPMs turn raw project data into standardized plans, risk assessments and status reports in minutes. PMs ask for them in the n8n chat, and the assistant saves each one as a Google Doc. Every Monday it posts the weekly status report to Slack automatically. It drafts stakeholder emails that the PM approves in Slack before they are sent. Every statement traces back to the source data, and it flags overdue and blocked work.
- **Scope (v1):** one active project; plan, risk and status (core); stakeholder updates with Slack approval (extended); tracing and evaluation. Out of scope: live Jira/Trello sync, portfolio views, fine-tuning.
- **Success criteria:** SC1–SC3 (the 3 metrics), SC4 (17/17 tests, human verdict), SC5 (cost per request < $0.01), SC6 (pilot satisfaction ≥ 4/5, *measured in pilot*).
- **Stakeholders:** CTO (sponsor), 10 PMs/TPMs (users), engineering leads, ABCDE Ltd stakeholders, security/legal.
- **Decision-making:** the AI TPM decides scope and design; cost or vendor changes need CTO approval; the CTO makes the go/no-go call on evaluation results and legal sign-off.
- **Rollout:** build and test → 2-PM pilot → 10 PMs/TPMs → operate (see §4).

---

## 4. Q4 Reflection and next steps

### What I learned from the traces

**I had to fix the judge before I could fix Mira.** On the baseline, the Correctness judge (gpt-4.1) agreed with my review on only 10 of 17 tests (59%), because it passed answers that were missing required items. I rebuilt it five times, adding a rubric, numbered criteria and then evidence quotes, and froze it at 96% agreement. Until then, its scores told me nothing about Mira.

**A stronger judge gave better reasons, not a different score.** I chose gpt-4.1 as the judge because I believed it was stronger than the agents' models. It isn't a reasoning model, so as a side test I re-judged the final-1 answers with one (gpt-5.6-luna), without re-running Mira. Both judges agreed with my verdict on 15 of 17 tests. gpt-4.1 failed T13 because it said the task IDs were missing, which was wrong. gpt-5.6-luna also failed T13, for a stricter reason: the answer doesn't say which task is blocked and which is overdue. Two judges failing the same test tells me the T13 criteria need to be clearer. On T12 it caught something gpt-4.1 and I both missed: Mira's email gave a reason for T006 being late ("ongoing analysis challenges") that isn't in the data. Results: [judge-test/](judge-test/).

**Most failures were reasoning, not data.** The tools returned the right facts, but gpt-4o-mini still called a task due today "due soon", dropped a Blocked task, and contradicted its own risk table in the summary. gpt-4o fixed all three.

**Routing prompts were fragile.** Three edits to the Orchestrator each fixed one test and broke another. I went back to the original prompt and handled the remaining cases in code.

**Some "bad answers" weren't the model's fault.** The Stakeholder agent never flagged T006 as overdue because it wasn't connected to the `get_overdue_or_blocked` tool. Connecting it fixed T12. Likewise, an unpublished workflow quietly ran old code, so I learned to publish after every change before blaming the LLM.

### Improvement plan

I took Mira from 7/17 to 17/17 by making one change at a time, re-running all 17 tests and logging each result ([change log](docs/06_change_log.md)). I:
- Moved two routing decisions from the Orchestrator prompt into code: a request that names the active project always goes through, and a vague request gets a fixed list of clarifying questions ([PRD §4.5](docs/02_prd.md#45-orchestration-pattern-and-rationale))
- Upgraded the Risk and Status agents to gpt-4o
- Connected the `get_overdue_or_blocked` tool to the Stakeholder agent
- Set Sampling Temperature 0 on every model
- Rebuilt the Correctness judge so its scores could be trusted

Next, I would:

**Answer quality**
1. Stop the Stakeholder agent from inventing why a task is late. In T12 the agent wrote that T006 was overdue "due to ongoing analysis challenges", which isn't in the data. Only the gpt-5.6-luna judge caught the made-up reason. I would add a prompt rule to state only the task's status and days overdue and ask the owner for the cause, and add a T12 criterion that fails any reason not in the data.

**Evaluation and judging**
1. Add a hold-out test set, since the judge and the fixes were tuned on the same 17 tests
2. Add a code check that flags any task or risk ID in an answer that isn't in the data, to back up the LLM judge
3. Swap in gpt-5.6-luna as the judge for both Groundedness and Correctness. In the side test it gave better reasons and caught an error gpt-4.1 missed
4. Add a client tone rule to the Stakeholder prompt, then add tests for a leadership, an engineering and a client email on the same sprint, so the three versions can be compared. Give the email capability its own metric
5. Make the T13 criteria clearer, so the answer must say which mitigation task is blocked and which is overdue

**Reliability**
1. Add graceful error handling: if a tool, Google Drive or Slack call fails, reply with a clear message instead of stopping silently

**Cost and speed**
1. Test gpt-5.6-luna on the Risk and Status agents. gpt-5.6-luna is a reasoning model that costs less than gpt-4o: $0.20 vs $2.50 per million input tokens and $1.20 vs $10 per million output tokens. With my measured tokens, a risk request would drop from $0.015 to about $0.002 to $0.003, and a status request from $0.011 to about $0.001 to $0.002. The range allows for up to 3× more output tokens from gpt-5.6-luna's hidden reasoning. Risk and status requests would be about 5 to 9 times cheaper, and about $0.20 to $0.35 per PM per month instead of $1.05. These costs are estimated, not run. Keep gpt-5.6-luna only if all 17 tests still pass, and check latency. The judge would move up to gpt-6-luna, so the judge stays stronger than the agents being graded. Then set the cost target as a monthly budget per PM instead of per request.
2. Download the project files once per request in Mira main, before the agent runs, and pass the parsed data to each tool call. That's 5 downloads per request instead of about 15 today, where each of an agent's 3 tool calls downloads all 5 files. On T1 this would save about 8 s of 30 s
3. Label each call in the Langfuse trace with its real model, so its cost matches the OpenAI bill

**New features**
1. Build a Slack chat app so PMs can ask the assistant from Slack instead of the n8n chat. Optionally, add conversation memory for each Slack thread, so follow-up questions like "and what about Sprint 4?" keep the context.

### Evaluation and fine-tuning
The evaluation set, with human verdicts across 3 final runs, is a labelled dataset. I chose **not** to fine-tune: every failure was fixed faster with a prompt, code or a model change, and 17 examples would overfit. Fine-tuning becomes worthwhile after the pilot. PM-corrected outputs, such as emails declined and redrafted in Slack, could train the Stakeholder agent or the Planner, and the same eval workflow would show whether it helps before release.

### Privacy
- Each agent can reach only its own data tools.
- No customer PII in prompts.
- OpenAI API under no-training terms.
- No email leaves without PM approval.
- **Open before rollout:** chat text goes to OpenAI; Langfuse traces contain project data, so retention limits and access controls are needed; legal and security sign-off ([charter §9–10](docs/01_project_charter_brd.md)).

### Rollout to 10 PMs/TPMs
| Stage | Who | Exit criteria |
|---|---|---|
| 0. Build and test (this capstone) | AI TPM (me), 1 project, 17 tests | SC1–SC4 met ✅; SC5 met for plan, email and clarify, over for status ($0.011) and risk ($0.015) |
| 1. Pilot | 2 PMs, 1 project each, 2 weeks | No critical errors; satisfaction ≥ 4/5 |
| 2. Expand | All 10 PMs/TPMs | Onboarding guide, Slack channel, office hours |
| 3. Operate | All | Evaluation re-run on every change (regression gate), monthly cost review, feedback backlog. Measure what the capstone couldn't: time to first draft, emails approved without edits (target ≥ 70%) |

Human approval stays on for every client-facing message in all stages.

### Limitations
- Results come from one project and 17 tests (12 from the brief, 5 of my own).
- Some run-to-run noise remains at Sampling Temperature 0.
- The Correctness judge is still unstable on long tables (T13), so the human verdict is final.
- The cost is measured on one day of usage.
- The data files must keep a fixed format (column names, date format). There is no schema check yet.
- The Stakeholder redraft step (after Decline) is not evaluated. It follows the PM's feedback, so feedback that names something outside the sprint can bring it into the redraft. The PM's approval is the safeguard.
- Tailoring by audience is untested. The Stakeholder prompt has tone rules for leadership and engineering but none for a client. T12 names no audience, and T17 names no sprint, so no test produces an email for a specific audience.

---

## 5. Repository map

| Folder / file | What it holds |
|---|---|
| [docs/](docs/) | 01 Charter / BRD · 02 PRD · 03 Ground truth · 04 Metrics · 05 Metric implementation + cost · 06 Change log |
| [baseline-v1/](baseline-v1/) | Mira before any fix: workflow exports, prompts, code, baseline results with human review |
| [final-v1/](final-v1/) | Mira as frozen for the final runs: exports, prompts, code, models, 3 final runs with human review, and the full results sheet (`mira_eval_results.xlsx`) |
| [judge-test/](judge-test/) | Side test: final-1 answers re-judged by gpt-5.6-luna (CSV + review page; also tab `judge-test-5.6-luna` in the results xlsx) |
| [prompts/](prompts/) | Every prompt version (judges, Orchestrator, agents), old versions kept |
| [data/](data/) | Answer key (`ground_truth.json`), my config, eval dataset, final judge criteria. Every run's results are in the [results xlsx](final-v1/mira_eval_results.xlsx) |
| [scripts/](scripts/) | `json_to_csv.py` (ground truth → dataset) · `build_review.py` (results → HTML review page) · `extract_workflows.py` (exports → prompts, code, models) |
| [openai_usage/](openai_usage/) | OpenAI token export for 2026-10-27, the source for the bill check and per-call costs (§2.6) |
| [screenshots/](screenshots/) | Canvases, Mira in action, Slack approval, Langfuse traces, OpenAI usage |

## 6. How to run

1. **Import** the 5 workflows from [final-v1/n8n_export/](final-v1/n8n_export/) into n8n.
2. **Connect** credentials: OpenAI, Google Drive/Docs, Gmail, Slack, Langfuse. In Mira Stakeholder Approval, **set** the Gmail node's recipient (`pm@example.com` in the export) to your own address.
3. **Upload** the source files (`project_description.txt`, `project_timeline.csv`, `project_risks.csv`, `sample_task_board.csv`) and [`mira_config.json`](data/mira_config.json) to a Google Drive folder, and point Mira Tools at it.
4. **Publish** every workflow (sub-workflows run their published version).
5. **Chat** with Mira main, or **run** Mira – Evaluation against the dataset ([final-v1/eval_dataset.csv](final-v1/eval_dataset.csv): 17 tests with `input`, `expected_output`, `criteria`, `metadata`; load it into the Google Sheet the Evaluation Trigger reads).

Key assumptions: as-of date `2026-04-28` (end of Sprint 3) and project start `2026-03-30`. Source data comes from the course `Resources/` folder and is used unchanged.
