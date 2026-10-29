// WHAT THIS DOES
// Builds one Langfuse trace for a Mira request, for WHICHEVER path ran:
// an agent (Planner, Risk, Status, Stakeholder) or Clarify (vague request).
// The trace reads top to bottom, in the order things happened:
//   mira (the whole request)
//     1. Orchestrator   - the routing decision (runs on every request)
//     2. Agent          - the agent's model call (skipped for Clarify)
//          - tool calls  - one entry per tool, shown UNDER the agent that called it
// Token counts are ESTIMATED from text length (PRD §5.2); Langfuse turns them into cost.
// Calibrated on T1: agent estimate 3,108 tokens vs n8n's own count 3,098.
// Timing: n8n doesn't give us real step times here, so each step gets its own
// time slot inside a 1-second window. This keeps the steps in the right order in Langfuse.

// Step 1: settings
const modelName = 'gpt-4o-mini';
const agentNames = ['Planner', 'Risk', 'Status', 'Stakeholder'];
const orchestratorPromptTokens = 600; // Orchestrator system prompt, sent on every request
const systemPromptTokens = 300;       // agent system prompt + tool definitions, sent on every model call
const tokensPerToolCall = 20;         // tokens the model writes to ask for one tool
const charsPerTokenIn = 4;            // input text: about 4 characters per token
const charsPerTokenOut = 4.5;         // Markdown answers: about 4.5 characters per token

// Step 2: helpers
function asText(value) {
  if (typeof value === 'string') {
    return value;
  }
  return JSON.stringify(value || '');
}
function inputTokens(text) {
  return Math.ceil(String(text || '').length / charsPerTokenIn);
}
function outputTokens(text) {
  return Math.ceil(String(text || '').length / charsPerTokenOut);
}
function nodeRan(nodeName) {
  // True if this node ran in this request. A node that doesn't exist yet counts as "didn't run".
  try {
    return $(nodeName).isExecuted;
  } catch (error) {
    return false;
  }
}

// Step 3: get the request (from "Normalize request": chat or schedule) and the Orchestrator's decision
const request = $('Normalize request').first().json;
const userMessage = request.message || '';
const sessionId = request.session_id || 'no-session';
const source = request.source || 'chat';
const testId = request.test_id || '';
const decision = $('Orchestrator').first().json.output;

// Step 4: find which path ran and get its answer
let pathName = 'Clarify';
let answer = '';
let toolCalls = [];
for (const name of agentNames) {
  if (nodeRan(name)) {
    pathName = name;
    break;
  }
}
if (pathName === 'Clarify') {
  answer = $('Clarify').first().json.output || '';
} else {
  const agentResult = $(pathName).first().json;
  answer = agentResult.output || '';
  toolCalls = agentResult.intermediateSteps || [];
}

// Step 5: estimate the tokens
// 5a. Orchestrator: one model call (its prompt + the message in, a small JSON decision out)
const orchestratorIn = orchestratorPromptTokens + inputTokens(userMessage);
const orchestratorOut = outputTokens(JSON.stringify(decision));

// 5b. Agent: 2 model calls when it uses tools (ask for tools, then write the answer), else 1
let agentModelCalls = 0;
let agentIn = 0;
let agentOut = 0;
if (pathName !== 'Clarify') {
  agentModelCalls = 1;
  if (toolCalls.length > 0) {
    agentModelCalls = 2;
  }
  let toolResultTokens = 0;
  for (const call of toolCalls) {
    toolResultTokens = toolResultTokens + inputTokens(asText(call.observation));
  }
  agentIn = agentModelCalls * (systemPromptTokens + inputTokens(userMessage)) + toolResultTokens;
  agentOut = outputTokens(answer) + toolCalls.length * tokensPerToolCall;
}

// Step 6: helpers for the OpenTelemetry format
function randomHex(length) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result = result + Math.floor(Math.random() * 16).toString(16);
  }
  return result;
}
function textField(key, value) {
  return { key: key, value: { stringValue: String(value) } };
}
function numberField(key, value) {
  return { key: key, value: { intValue: Number(value) } };
}

// Time slots: the trace covers the last 1 second (1000 ms).
//   Orchestrator: 0–200 ms
//   Agent:        200–1000 ms, with its tool calls one after another inside 250–750 ms
const windowStart = (BigInt(Date.now()) - 1000n) * 1000000n;   // 1 second ago, in nanoseconds
function timeAt(milliseconds) {
  return (windowStart + BigInt(Math.round(milliseconds)) * 1000000n).toString();
}

const traceId = randomHex(32);
const rootSpanId = randomHex(16);
const agentSpanId = randomHex(16);

// Step 7: build the trace pieces ("spans")
const spans = [];

// 7a. The whole request (0–1000 ms)
spans.push({
  traceId: traceId, spanId: rootSpanId, name: 'mira', kind: 1,
  startTimeUnixNano: timeAt(0), endTimeUnixNano: timeAt(1000),
  attributes: [
    textField('langfuse.trace.name', 'mira'),
    textField('langfuse.trace.input', userMessage),
    textField('langfuse.trace.output', answer),
    textField('langfuse.session.id', sessionId),
    textField('langfuse.trace.metadata.intent', decision.intent),
    textField('langfuse.trace.metadata.sufficient', decision.sufficient),
    textField('langfuse.trace.metadata.path', pathName),
    textField('langfuse.trace.metadata.source', source),
    textField('langfuse.trace.metadata.test_id', testId),
    { key: 'langfuse.trace.tags', value: { arrayValue: { values: [
      { stringValue: 'mira' },
      { stringValue: pathName.toLowerCase() },
      { stringValue: source },
      { stringValue: testId || 'no-test' }
    ] } } }
  ]
});

// 7b. Step 1 of the request: the Orchestrator's model call (0–200 ms)
spans.push({
  traceId: traceId, spanId: randomHex(16), parentSpanId: rootSpanId, name: 'Orchestrator', kind: 1,
  startTimeUnixNano: timeAt(0), endTimeUnixNano: timeAt(200),
  attributes: [
    textField('langfuse.observation.type', 'generation'),
    textField('gen_ai.request.model', modelName),
    textField('langfuse.observation.input', userMessage),
    textField('langfuse.observation.output', JSON.stringify(decision)),
    numberField('gen_ai.usage.input_tokens', orchestratorIn),
    numberField('gen_ai.usage.output_tokens', orchestratorOut),
    textField('langfuse.observation.metadata.token_counts', 'estimated from text length')
  ]
});

// 7c. Step 2 of the request: the agent's model call (200–1000 ms; skipped for Clarify)
if (pathName !== 'Clarify') {
  spans.push({
    traceId: traceId, spanId: agentSpanId, parentSpanId: rootSpanId, name: pathName, kind: 1,
    startTimeUnixNano: timeAt(200), endTimeUnixNano: timeAt(1000),
    attributes: [
      textField('langfuse.observation.type', 'generation'),
      textField('gen_ai.request.model', modelName),
      textField('langfuse.observation.input', userMessage),
      textField('langfuse.observation.output', answer),
      numberField('gen_ai.usage.input_tokens', agentIn),
      numberField('gen_ai.usage.output_tokens', agentOut),
      textField('langfuse.observation.metadata.token_counts', 'estimated from text length'),
      numberField('langfuse.observation.metadata.model_calls', agentModelCalls)
    ]
  });

  // 7d. The agent's tool calls, shown under the agent, one after another (250–750 ms)
  let slotLength = 500;
  if (toolCalls.length > 0) {
    slotLength = 500 / toolCalls.length;
  }
  let slotStart = 250;
  for (const call of toolCalls) {
    let toolName = 'tool';
    let toolInput = '';
    if (call.action) {
      toolName = call.action.tool || 'tool';
      toolInput = asText(call.action.toolInput);
    }
    spans.push({
      traceId: traceId, spanId: randomHex(16), parentSpanId: agentSpanId, name: toolName, kind: 1,
      startTimeUnixNano: timeAt(slotStart), endTimeUnixNano: timeAt(slotStart + slotLength - 10),
      attributes: [
        textField('langfuse.observation.type', 'span'),
        textField('langfuse.observation.input', toolInput),
        textField('langfuse.observation.output', asText(call.observation).slice(0, 5000))
      ]
    });
    slotStart = slotStart + slotLength;
  }
}

// Step 8: the tool results as one text block ("context"). The evaluation's Groundedness
// judge checks Mira's answer against exactly this: what the tools returned.
let context = '';
for (const call of toolCalls) {
  let toolName = 'tool';
  if (call.action) {
    toolName = call.action.tool || 'tool';
  }
  context = context + '[' + toolName + ']\n' + asText(call.observation) + '\n\n';
}
if (context === '') {
  context = 'No tools were called.';
}

// Step 9: wrap everything in the OpenTelemetry envelope and send it on
const payload = {
  resourceSpans: [{
    resource: { attributes: [textField('service.name', 'mira')] },
    scopeSpans: [{ scope: { name: 'n8n' }, spans: spans }]
  }]
};

return [{
  json: {
    path: pathName,
    answer: answer,
    context: context,
    estimate: {
      orchestratorTokens: orchestratorIn + orchestratorOut,
      agentTokens: agentIn + agentOut,
      total: orchestratorIn + orchestratorOut + agentIn + agentOut
    },
    payload: payload
  }
}];