// WHAT THIS DOES
// For the scheduled Monday report only: builds a short Slack message with
// the report's title line, its Health line, and the link to the Google Doc.

// Step 1: the report text and the Doc link
const report = $('Build Langfuse trace').first().json.answer || '';
let docLink = '';
try {
  if ($('Save Doc (schedule)').isExecuted) {
    docLink = $('Save Doc (schedule)').first().json.webViewLink || '';
  }
} catch (error) {
  docLink = '';
}

// Step 2: pick out the title line and the Health line from the report
let titleLine = 'Weekly status report';
let healthLine = '';
for (const rawLine of report.split('\n')) {
  const line = rawLine.replace(/#/g, '').trim();
  if (line === '') {
    continue;
  }
  if (titleLine === 'Weekly status report' && line.toLowerCase().startsWith('status report')) {
    titleLine = line;
  }
  if (healthLine === '' && line.toLowerCase().startsWith('health')) {
    healthLine = line;
  }
}

// Step 3: build the message
let text = ':bar_chart: *' + titleLine + '*\n';
if (healthLine !== '') {
  text = text + healthLine + '\n';
}
if (docLink !== '') {
  text = text + 'Full report: ' + docLink;
} else {
  text = text + '(The Google Doc could not be saved. See the n8n execution.)';
}

// Step 4: send it on to the Slack node
return [{ json: { text: text } }];