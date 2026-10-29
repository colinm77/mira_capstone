// WHAT THIS DOES
// Runs when the Orchestrator decides there isn't enough information.
// Instead of guessing, Mira asks the user for what is missing.
//   - If the Orchestrator couldn't tell what kind of request it was ("unclear"),
//     Mira asks which kind of output the user wants.
//   - Otherwise Mira lists the missing details (e.g. scope, timeline, team).
// Mira has no conversation memory (known limitation), so the message asks the user
// to RESEND the full request with the missing details, not just reply with them.
// (Known issue T9: see implementation_plan.md. Left as-is until after the baseline run.)

// Step 1: read the Orchestrator's decision
const decision = $('Orchestrator').first().json.output;
const missingItems = decision.missing || [];

// Step 2: choose the message
let message = '';
if (decision.intent === 'unclear') {
  message = "I'm not sure what you need. Do you want a project plan, a risk assessment, a status report, or a stakeholder update? Please resend your request saying which one.";
} else {
  message = "I don't have enough information to do that yet. Please tell me: " + missingItems.join(', ') + '.'
    + ' Then resend your full request including those details (I don\'t remember earlier messages).';
}

// Step 3: send the message back to the chat
return [{ json: { output: message } }];
