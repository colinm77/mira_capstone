// WHAT THIS DOES
// Returns the project description text from project_description.txt.
// If the file is empty, returns "NOT AVAILABLE" so the agent knows not to guess.

// Step 1: read the parsed text file (Extract from File puts the text under "data")
const parsed = $('Parse description').first().json;

// Step 2: take the text, or NOT AVAILABLE if it's missing
let descriptionText = 'NOT AVAILABLE';
if (parsed && parsed.data && String(parsed.data).trim() !== '') {
  descriptionText = String(parsed.data).trim();
}

// Step 3: send it back
return [{ json: { description: descriptionText } }];