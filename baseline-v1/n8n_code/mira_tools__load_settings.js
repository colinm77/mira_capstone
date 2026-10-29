// WHAT THIS DOES
// Runs once at the start of every Mira Tools call, after all files are downloaded and parsed.
// It combines the request (which tool, sprint, status) with Mira's own settings
// from mira_config.json, and passes them on to the Switch.
// No project facts live in code: dates, windows and mitigation links all come from the config file.

// Step 1: the request sent by the agent
const request = $('When Executed by Another Workflow').first().json;

// Step 2: the parsed config file (Extract from File puts it under "data")
const parsed = $('Parse config').first().json;
let config = parsed;
if (parsed.data) {
  config = parsed.data;
}

// Step 3: pass the request and the settings on to the Switch
return [{
  json: {
    tool: request.tool,
    sprint: request.sprint,
    status: request.status,
    settings: config
  }
}];
