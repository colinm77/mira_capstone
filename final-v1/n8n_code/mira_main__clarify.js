// WHAT THIS DOES (v2, CHG-12)
// Runs when the Orchestrator decides there isn't enough information.
// Instead of guessing, Mira asks the user for what is missing.
//   - If the Orchestrator couldn't tell what kind of request it was ("unclear"),
//     Mira asks which kind of output the user wants.
//   - Otherwise Mira asks for a FIXED list of details for that kind of request.
// v1 used the Orchestrator's own "missing" list, which changed from run to run.
// The list is now set here in code, so it is the same every time.

// Step 1: read the Orchestrator's decision and the user's message
const decision = $('Orchestrator').first().json.output;
const request = $('Normalize request').first().json.message.toLowerCase();

// Step 2: the fixed list of details to ask for, per kind of request
const fixedLists = {
  plan: ['scope', 'goals', 'timeline', 'deliverables', 'team size'],
  risk: ['domain', 'scope', 'goals', 'timeline', 'team/technology'],
  status: ['task data'],
  stakeholder: ['the audience', 'the topic or period to cover']
};

let missingItems = fixedLists[decision.intent] || [];

// Step 3: if the user already gave a duration (e.g. "a 2-week project"),
// don't ask for the timeline again
const givesDuration = request.includes('week') || request.includes('month') || request.includes('day');
if (givesDuration) {
  const withoutTimeline = [];
  for (const item of missingItems) {
    if (item !== 'timeline') {
      withoutTimeline.push(item);
    }
  }
  missingItems = withoutTimeline;
}

// Step 4: choose the message
let message = '';
if (decision.intent === 'unclear' || missingItems.length === 0) {
  message = "I'm not sure what you need. Do you want a project plan, a risk assessment, a status report, or a stakeholder update?";
} else {
  message = "I don't have enough information to do that yet. Please tell me: " + missingItems.join(', ') + '.';
}

// Step 5: send the message back to the chat
return [{ json: { output: message } }];
