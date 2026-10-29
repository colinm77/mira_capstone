// WHAT THIS DOES ("Mira Stakeholder Approval" workflow)
// Holds the draft email that is about to go to the PM for approval.
// It is reached two ways:
//   - first time: from the trigger (field "draft" = the Stakeholder agent's draft)
//   - after a Decline: from "Redraft" (field "text" = the new draft)
// Either way, it passes on one field: draft.

// Step 1: read whatever arrived
const incoming = $input.first().json;

// Step 2: pick the draft text
let draft = '';
if (incoming.draft) {
  draft = incoming.draft;          // first time, from the trigger
} else if (incoming.text) {
  draft = incoming.text;           // after a redraft
} else if (incoming.output) {
  draft = incoming.output;
}

// Step 3: pass it on to "Ask for approval"
return [{ json: { draft: draft } }];
