// WHAT THIS DOES
// Mira main has three ways in:
//   - the chat (a person asks)                       -> source "chat"
//   - the Monday schedule                            -> source "schedule"
//   - the evaluation workflow (runs the 13 tests)    -> source "eval"
// This node gives all three the same shape, so every node after it works the same way:
//   message    = the request text
//   session_id = groups messages in Langfuse
//   source     = "chat", "schedule" or "eval" (decides how the answer is delivered)
//   test_id    = the test number (eval runs only, e.g. "T5"), shown in Langfuse
// All later nodes read the request from HERE, never from a trigger.

// Step 1: the request the schedule sends every Monday.
// "the task board" tells the Orchestrator the request is about the stored project data;
// the Status agent then uses current_sprint from mira_config.json.
const scheduledMessage = 'Generate the weekly status report for the current sprint using the task board.';

// Step 2: helper - did this trigger start this run?
function triggerRan(nodeName) {
  try {
    return $(nodeName).isExecuted;
  } catch (error) {
    return false;
  }
}

// Step 3: build the request
let message = '';
let sessionId = '';
let source = '';
let testId = '';

if (triggerRan('When chat message received')) {
  const chat = $('When chat message received').first().json;
  message = chat.chatInput || '';
  sessionId = chat.sessionId || 'no-session';
  source = 'chat';
} else if (triggerRan('When Executed by Another Workflow')) {
  const evalRequest = $('When Executed by Another Workflow').first().json;
  message = evalRequest.message || '';
  testId = evalRequest.test_id || '';
  sessionId = 'eval-' + new Date().toISOString().slice(0, 10);
  source = 'eval';
} else {
  message = scheduledMessage;
  sessionId = 'schedule-' + new Date().toISOString().slice(0, 10);
  source = 'schedule';
}

// Step 4: pass it on to the Orchestrator
return [{ json: { message: message, session_id: sessionId, source: source, test_id: testId } }];
