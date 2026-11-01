# 04 — Evaluation Metrics

**Purpose:** define how I judge whether the assistant is good enough to roll out. Following the capstone playbook (Step 6.4), there is one metric per core capability: plan, risk and status. Each test belongs to one capability, decided by what the request asks for. All metrics are measured on the 12 brief tests plus 5 tests I added (T13–T17, at least one per capability) in [`ground_truth.json`](../data/ground_truth.json).

---

## 1. The three metrics (one per core capability)

| Metric | Capability | Question it answers | Measured by | Tests | Target |
|---|---|---|---|---|---|
| Plan groundedness | Plan | Is everything in the plan traceable to the project data (phases, milestones, goals, risks)? | Groundedness judge | T1, T2, T9, T14 | Average ≥ 0.95 |
| Risk relevance | Risk | Are the risks specific to this project and taken from the risk file, not generic? | Correctness judge | T3, T4, T7, T13, T15 | Average ≥ 0.9 |
| Status accuracy | Status | Do counts, statuses and dates match the task board and timeline? | Correctness judge | T5, T6, T8, T10, T11, T16 | Average ≥ 0.9; T10 = 1.0 |

Each metric is the average judge score (0–1) across that capability's tests. The vague-input tests (T2, T4, T6, T9) count toward their capability's metric. Asking for details instead of guessing scores 1.0.

## 2. Pass or fail per test: two verdicts

Every test gets two verdicts:

| | LLM judge | Human judge |
|---|---|---|
| Who | gpt-4.1: the Groundedness and Correctness judges (§3) | Me, as the PM/TPM |
| Output | Two scores from 0 to 1. LLM verdict = Pass if both are ≥ 0.8 | Human verdict = Pass or Fail, plus a short note |
| Used for | The 3 metrics (averages), and fast re-runs after every change | The official pass or fail for each test |

- **The human verdict is final.** The LLM judges automate the scoring, and I confirm it.
- **Judge agreement:** the number of tests where the LLM verdict matches the human verdict, ÷ 17. It's reported with every run and shows whether the judges can be trusted. Every disagreement is explained in the note.
- **How I review:** I check every output against the test's expected answer in `ground_truth.json`.
- **Target:** all 17 tests pass by the human verdict. The 12 brief tests are the minimum, and T13–T17 are my additions. *The first target was 12/12 brief tests and ≥ 90% on the extra tests. When I added T13–T17 to cover every agent, I raised it to 17/17.*
- **Stakeholder tests:** T12 and T17 (the extended capability) have no metric of their own, but they count in the pass/fail total.

## 3. The two judges

- **Groundedness:** did the assistant make anything up? This judge compares the answer with the data the tools returned.
- **Correctness:** did the assistant give the right answer? This judge grades the answer against fixed, numbered criteria for each test (the `criteria` column: what must be in the answer), and uses the expected answer to check facts. How it scores, step by step, is in doc 05 A4.

Both are needed. An assistant that answers every request with "please give me more details" invents nothing, so it would score perfectly on groundedness. Only correctness catches that.

Prompts and setup are in [doc 05](05_metric_implementation_and_cost.md).

## 4. Results sheet

Each run writes one row per test to the results sheet. The main columns are the input, the output, both judge scores with their reasons, the LLM verdict, my human verdict and my note. The full column list is in [doc 05 A8](05_metric_implementation_and_cost.md).

The sheet also has the two columns from the capstone playbook (Step 5), "Expected keywords present?" and "Hallucination detected?". I used them in the baseline review. In the final runs I wrote the same checks into the human note instead: what was missing, and anything made up. The Groundedness judge's list of unsupported claims was my starting point for spotting anything invented.

## 5. Cost

Cost isn't a quality metric. It's in README §2.6 and [doc 05 B5](05_metric_implementation_and_cost.md): the cost per request, measured in n8n for one test of each type, and the actual bill from OpenAI usage. Langfuse's cost is only rough, so I didn't use it for cost.

## 6. Watched, not scored

- **In Langfuse:** which agent the Orchestrator picked, and the tool calls per request. I used these for debugging and the Q4 trace findings.
- **In n8n:** latency. The Langfuse trace times aren't real, because each step is placed in a fixed 1-second window.

## 7. Release gate

| Gate | Condition |
|---|---|
| Ready for pilot | All 17 tests pass by the human verdict, all three metrics are on target, and each request costs < $0.01 |
| Regression check | After any prompt or model change, re-run all 17 tests; no metric may drop |

Result for v1: the tests and metrics are met. Cost is met for plan, email and clarify, but not for status ($0.011) and risk ($0.015). I accepted that for correct answers (README §2.6). Pilot and rollout success measures are in the [Charter §7 and §11](01_project_charter_brd.md).
