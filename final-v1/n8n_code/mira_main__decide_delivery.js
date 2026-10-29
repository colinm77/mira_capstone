// WHAT THIS DOES
// Decides how Mira's answer is delivered. It picks exactly ONE lane:
//   schedule  = the Monday trigger started this run -> save a Doc and post to Slack
//   doc       = a full plan, risk assessment or weekly report (Orchestrator save_to_doc = true)
//               -> save a Doc and reply in chat with the link
//   chat_only = everything else (short answers, Clarify, stakeholder drafts) -> reply in chat
// EVAL MODE: when the evaluation workflow runs a test (source = "eval"), the answer
// is always "chat_only", so 13 test runs don't create Docs or Slack posts.
// The "Delivery" Switch after this node routes on the field "lane".

// Step 1: where the request came from, what the Orchestrator decided, and which path answered
const source = $('Normalize request').first().json.source;
const decision = $('Orchestrator').first().json.output;
const path = $('Build Langfuse trace').first().json.path;

// Step 2: pick the lane
let lane = 'chat_only';
if (source === 'eval') {
  lane = 'chat_only';
} else if (source === 'schedule') {
  lane = 'schedule';
} else if (decision.save_to_doc === true && path !== 'Clarify') {
  lane = 'doc';
}

// Step 3: pass the lane on to the Switch
return [{ json: { lane: lane } }];