// WHAT THIS DOES
// Returns task rows from sample_task_board.csv, optionally filtered by sprint and/or status,
// PLUS exact counts by status for those tasks (Done, In Progress, Blocked, To Do, total).
//   sprint: e.g. "Sprint 3" or just "3"; "current" = current_sprint from mira_config.json
//           (empty = all sprints)
//   status: Done, In Progress, Blocked or To Do  (empty = all statuses)
// The CODE does the counting so the numbers are always exact (the LLM never counts).
// If nothing matches, it returns an empty list and says so, so the agent doesn't guess.

// Step 1: read the request and settings (from "Load settings")
const request = $('Load settings').first().json;
const settings = request.settings;
let sprintFilter = String(request.sprint || '').trim();
const statusFilter = String(request.status || '').trim().toLowerCase();

// "current" or "current sprint" means the sprint set in the config file
if (sprintFilter.toLowerCase().startsWith('current')) {
  sprintFilter = String(settings.current_sprint || '');
}

// Accept "3" as well as "Sprint 3"
if (sprintFilter !== '' && !sprintFilter.toLowerCase().startsWith('sprint')) {
  sprintFilter = 'Sprint ' + sprintFilter;
}

// Step 2: start every count at zero
const counts = {
  'Done': 0,
  'In Progress': 0,
  'Blocked': 0,
  'To Do': 0,
  'total': 0
};

// Step 3: keep only the tasks that match the filters, and count them
const tasks = [];
for (const row of $('Parse tasks').all()) {
  const task = row.json;

  if (sprintFilter !== '' && String(task.sprint).toLowerCase() !== sprintFilter.toLowerCase()) {
    continue;
  }
  if (statusFilter !== '' && String(task.status).toLowerCase() !== statusFilter) {
    continue;
  }

  tasks.push({
    task_id: task.task_id,
    task_name: task.task_name,
    status: task.status,
    assignee: task.assignee,
    priority: task.priority,
    sprint: task.sprint,
    due_date: task.due_date,
    description: task.description
  });

  if (counts[task.status] !== undefined) {
    counts[task.status] = counts[task.status] + 1;
  }
  counts.total = counts.total + 1;
}

// Step 4: describe what was asked for, so the answer is clear
let sprintText = 'all sprints';
if (sprintFilter !== '') {
  sprintText = sprintFilter;
}
let statusText = 'all statuses';
if (statusFilter !== '') {
  statusText = request.status;
}

let note = 'Found ' + tasks.length + ' task(s).';
if (tasks.length === 0) {
  note = 'No tasks found for ' + sprintText + ', ' + statusText + '. Do not invent tasks.';
}

// Step 5: send back the counts and the matching tasks
return [{
  json: {
    as_of: settings.as_of_date,
    current_sprint: settings.current_sprint,
    filters: { sprint: sprintText, status: statusText },
    counts: counts,
    note: note,
    tasks: tasks
  }
}];
