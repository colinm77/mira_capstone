// WHAT THIS DOES
// Sends Mira's answer back, whichever path produced it (an agent or Clarify).
// "Build Langfuse trace" already worked out the answer.
// It adds a note at the end when:
//   - the report was saved as a Google Doc (by "Save Doc") -> the Doc link
//   - a stakeholder draft was sent for approval (by "Send for approval", chat runs only)
// EVAL MODE: the evaluation workflow also needs the tool results ("context"),
// which agent answered ("path") and the Orchestrator's intent. They are returned as
// extra fields; the chat window only shows "output".

// Step 1: read the answer and details that "Build Langfuse trace" worked out
const trace = $('Build Langfuse trace').first().json;
const request = $('Normalize request').first().json;
let answer = trace.answer;

// Step 2: helper - did this node run in this request?
function nodeRan(nodeName) {
  try {
    return $(nodeName).isExecuted;
  } catch (error) {
    return false;
  }
}

// Step 3: if a Google Doc was saved, add its link
if (nodeRan('Save Doc')) {
  const docLink = $('Save Doc').first().json.webViewLink || '';
  if (docLink !== '') {
    answer = answer + '\n\n---\n**Saved to Google Doc:** ' + docLink;
  }
}

// Step 4: if a stakeholder draft was sent for approval (not in eval mode), say where
if (nodeRan('Send for approval') && request.source !== 'eval') {
  answer = answer + '\n\n---\n**Sent to Slack (#mira-reports) for your approval.** It will be emailed only after you click Approve.';
}

// Step 5: send it back (chat shows "output"; the evaluation also reads the other fields)
return [{
  json: {
    output: answer,
    context: trace.context,
    path: trace.path,
    intent: $('Orchestrator').first().json.output.intent,
    test_id: request.test_id
  }
}];