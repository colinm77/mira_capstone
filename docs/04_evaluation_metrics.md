# 04 — Evaluation Metrics

**Purpose:** define how we judge whether Mira is good enough to roll out. Following the capstone playbook (Step 6.4), Mira has **one metric per core agent**. All metrics are measured on the 12 brief tests plus 5 extra tests of our own (T13–T17, at least one per agent) in [`ground_truth.json`](../data/ground_truth.json).

---

## 1. The three metrics (one per core agent)

| Metric | Agent | Question it answers | Measured by | Tests | Target |
|---|---|---|---|---|---|
| **Plan groundedness** | Planner | Is everything in the plan traceable to the project data (phases, milestones, goals, risks)? | Groundedness judge | T1, T2, T9, T14 | Average ≥ 0.95 |
| **Risk relevance** | Risk | Are the risks specific to this project and taken from the risk file, not generic? | Correctness judge | T3, T4, T7, T13, T15 | Average ≥ 0.9 |
| **Status accuracy** | Status | Do counts, statuses and dates match the task board and timeline? | Correctness judge | T5, T6, T8, T10, T11, T16 | Average ≥ 0.9; T10 = 1.0 |

Each metric is the average judge score (0–1) across that agent's tests. The vague-input tests (T2, T4, T6, T9) count toward their agent's metric. Asking for details instead of guessing scores 1.0.

## 2. Pass / fail per test — two judges for every test

Every test gets **two verdicts**:

| | LLM judge | Human judge (PM) |
|---|---|---|
| Who | gpt-4.1: Groundedness and Correctness evaluators (§3) | The PM/TPM (author) |
| Output | Two scores 0–1; **LLM verdict** = Pass if both ≥ 0.8 | **Human verdict** = Pass / Fail + a short note |
| Used for | The 3 metrics (averages), fast re-runs after every change | **The official pass/fail** for each test |

- **The human verdict is final.** The LLM judge automates scoring; the human confirms it.
- **Judge agreement** = tests where the LLM verdict matches the human verdict ÷ 13. Reported with every run. It shows whether the automated judge can be trusted; any disagreement is explained in the note.
- The human reviews every output against the test's expected answer (`ground_truth.json`) — the same check the TAs do.
- The write-up reports **"X / 12 brief tests passed"** (target: 12 / 12) and, separately, **"X / N extra tests passed"** (target ≥ 90%). The brief's 12 tests are the minimum; extra tests (T13+) are our own additions.
- **T12 and T17** (Stakeholder, extended capability) have no metric of its own, but they count in the pass/fail totals.

## 3. The two judges

- **Groundedness:** did Mira make anything up? It compares Mira's answer with the data Mira's tools returned.
- **Correctness:** did Mira give the right answer? It grades Mira's answer against a fixed **marking scheme** per test (the `criteria` column: what must be in the answer), and uses the expected answer to check facts. How it scores, step by step: doc 05, A4.

We need both. A Mira that answers every request with "please give me more details" invents nothing, so it would score perfectly on groundedness. Only correctness catches that.

Prompts and setup are in [doc 05](05_metric_implementation_and_cost.md).

## 4. Test results table

Each test is reported with our own scores (agreed with the instructor in place of the playbook's "keywords present / hallucination detected" columns):

| Test | Input | Output | Groundedness | Correctness | LLM verdict | Expected keywords present? | Hallucination detected? | Human verdict | Note |
|---|---|---|---|---|---|---|---|---|---|

The two columns **Expected keywords present?** and **Hallucination detected?** follow the capstone playbook (Step 5) and are filled in by the human reviewer:
- **Expected keywords present?** — "Yes: <which>" or "Missing: <which>", checked against the test's expected answer (e.g. T8 must name T024; T10 must show 5 / 3 / 1 / 16).
- **Hallucination detected?** — "No" or "Yes: <what was invented>". The Groundedness judge's `unsupported_claims` list is shown next to it as a starting point.

Together they are the basis for the human verdict.

An optional automated keyword check (Code node) is described in [doc 05 §A6](05_metric_implementation_and_cost.md); in this design the keyword check is done by the human reviewer.

## 5. Cost

Cost isn't a quality metric. It's reported in the cost section of [doc 05](05_metric_implementation_and_cost.md), including cost per request, cost per plan and cost per user per day, all taken from Langfuse traces.

## 6. Watched in traces (not scored)

Latency, which agent the Orchestrator picked, and tool calls per request are visible in Langfuse. They're used for debugging and the Q4 trace findings.

## 7. Release gate

| Gate | Condition |
|---|---|
| **Ready for pilot** | **All 12 brief tests (T1–T12) pass by the human verdict (100%)** **and** extra tests (T13+) ≥ 90% **and** all three metrics on target **and** cost < $0.01 per request |
| Regression check | Any prompt or model change → re-run all 17 tests; no metric may drop |

Pilot and rollout success measures are in the [Charter §7 and §11](01_project_charter_brd.md).
