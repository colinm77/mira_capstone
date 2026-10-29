// WHAT THIS DOES ("Mira Save Doc" workflow)
// Packages the report so Google Drive can turn it into a formatted Google Doc.
// In:  the title (from the trigger) and the report as HTML (from the "Markdown to HTML" node)
// Out: an upload "body" in Drive's multipart format + its content type,
//      ready for the "Upload as Google Doc" HTTP Request node.
// Drive converts the HTML into a real Google Doc (headings, tables, bullets) because we
// ask for mimeType "application/vnd.google-apps.document".

// Step 1: SETTING — the ID of the "Mira Reports" folder in Google Drive
// (the code after /folders/ in the folder's URL). This is a deployment setting, not project data.
const reportsFolderId = 'PASTE_MIRA_REPORTS_FOLDER_ID_HERE';

// Step 2: the title (sent by the caller) and the HTML
const title = $('When Executed by Another Workflow').first().json.title;
let html = $('Markdown to HTML').first().json.html || '';

// Step 3: give tables visible borders (Drive keeps these when it converts)
html = html.split('<table>').join('<table border="1" cellpadding="4" style="border-collapse:collapse">');
const fullHtml = '<html><head><meta charset="UTF-8"></head><body>' + html + '</body></html>';

// Step 4: the file details Drive needs: name, "make it a Google Doc", and the folder
const fileDetails = {
  name: title,
  mimeType: 'application/vnd.google-apps.document',
  parents: [reportsFolderId]
};

// Step 5: build the multipart body (part 1 = file details, part 2 = the HTML)
const boundary = 'mira_boundary_' + Date.now();
const lineBreak = '\r\n';
let body = '';
body = body + '--' + boundary + lineBreak;
body = body + 'Content-Type: application/json; charset=UTF-8' + lineBreak + lineBreak;
body = body + JSON.stringify(fileDetails) + lineBreak;
body = body + '--' + boundary + lineBreak;
body = body + 'Content-Type: text/html; charset=UTF-8' + lineBreak + lineBreak;
body = body + fullHtml + lineBreak;
body = body + '--' + boundary + '--';

// Step 6: send it on to the HTTP Request node
return [{
  json: {
    contentType: 'multipart/related; boundary=' + boundary,
    body: body
  }
}];
