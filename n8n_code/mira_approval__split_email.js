// WHAT THIS DOES ("Mira Stakeholder Approval" workflow)
// Runs after the PM clicks Approve. Splits the approved draft into the
// email subject (the "Subject:" line) and the email body (everything after it),
// ready for the Gmail node.

// Step 1: the approved draft
const draft = $('Current draft').first().json.draft || '';

// Step 2: find the "Subject:" line
let subject = 'Project update';
const bodyLines = [];
let subjectFound = false;
for (const line of draft.split('\n')) {
  if (!subjectFound && line.trim().toLowerCase().startsWith('subject:')) {
    subject = line.trim().slice('subject:'.length).trim();
    subjectFound = true;
  } else {
    bodyLines.push(line);
  }
}

// Step 3: send on the subject and body
return [{ json: { subject: subject, body: bodyLines.join('\n').trim() } }];
