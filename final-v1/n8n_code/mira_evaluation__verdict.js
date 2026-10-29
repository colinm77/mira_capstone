// Step 1: read both judges' answers
const grounded = $('Groundedness judge').item.json.output;
const correct = $('Correctness judge').item.json.output;
const groundednessScore = Number(grounded.score);
const correctnessScore = Number(correct.score);

// Step 2: LLM verdict = Pass only if both scores are 0.8 or higher
let verdict = 'Fail';
if (groundednessScore >= 0.8 && correctnessScore >= 0.8) {
  verdict = 'Pass';
}

// Step 3: turn the groundedness judge's list of unsupported claims into one line of text
let unsupported = 'none';
if (grounded.unsupported_claims && grounded.unsupported_claims.length > 0) {
  unsupported = grounded.unsupported_claims.join('; ');
}

// Step 4 (new): turn the correctness judge's list of missing items into one line of text
let missing = 'none';
if (correct.missing_items && correct.missing_items.length > 0) {
  missing = correct.missing_items.join('; ');
}

// Step 5: pass = 1 or 0, so n8n can average it into a pass rate
let passNumber = 0;
if (verdict === 'Pass') {
  passNumber = 1;
}

// Step 6: send everything on to "Save scores"
return {
  json: {
    groundedness: groundednessScore,
    correctness: correctnessScore,
    unsupported_claims: unsupported,
    missing_items: missing,
    groundedness_reason: grounded.reason,
    correctness_reason: correct.reason,
    llm_verdict: verdict,
    pass: passNumber
  }
};