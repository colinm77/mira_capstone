// WHAT THIS DOES
// Gets the report ready to save as a Google Doc: a title and the text.
// The title says what kind of report it is and when it was made.

// Step 1: which agent answered, and its answer (worked out by "Build Langfuse trace")
const trace = $('Build Langfuse trace').first().json;
const agentName = trace.path;
const reportText = trace.answer;

// Step 2: pick the report type from the agent
let reportType = 'Report';
if (agentName === 'Planner') {
  reportType = 'Project plan (DRAFT)';
} else if (agentName === 'Risk') {
  reportType = 'Risk assessment';
} else if (agentName === 'Status') {
  reportType = 'Weekly status report';
}

// Step 3: the date and time it was made, e.g. "2026-10-25 14:03"
const madeAt = new Date().toISOString().slice(0, 16).replace('T', ' ');

// Step 4: send on the title and text
return [{
  json: {
    title: 'Mira — ' + reportType + ' — ' + madeAt,
    text: reportText
  }
}];