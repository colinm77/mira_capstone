// WHAT THIS DOES
// Looks at every task on the board (sample_task_board.csv) and sorts the unfinished ones into 3 lists:
//   blocked  = the task's status is "Blocked"
//   overdue  = the due date has passed and the task isn't Done
//   due_soon = the task isn't Done and is due within due_soon_days (including today)
// The "today" date and the window come from mira_config.json.

// Step 1: settings from the config file
const settings = $('Load settings').first().json.settings;
const windowDays = Number(settings.due_soon_days);
const oneDay = 24 * 60 * 60 * 1000;

// Step 2: helpers for dates ("2026-04-28" or "4/28/2026" both work)
function toDate(text) {
  const value = String(text).trim();
  if (value.includes('/')) {
    const parts = value.split('/');
    return new Date(Date.UTC(Number(parts[2]), Number(parts[0]) - 1, Number(parts[1])));
  }
  return new Date(value + 'T00:00:00Z');
}
function toText(date) {
  return date.toISOString().slice(0, 10);
}
const asOfDate = toDate(settings.as_of_date);

// Step 3: empty lists to fill
const blocked = [];
const overdue = [];
const dueSoon = [];

// Step 4: check each task
for (const row of $('Parse tasks').all()) {
  const task = row.json;

  // Skip finished tasks
  if (task.status === 'Done') {
    continue;
  }

  // How many days until the due date (negative = already past)
  const daysUntilDue = Math.round((toDate(task.due_date) - asOfDate) / oneDay);

  // The basic facts we report for every flagged task
  const info = {
    task_id: task.task_id,
    task_name: task.task_name,
    assignee: task.assignee,
    status: task.status,
    sprint: task.sprint,
    due_date: task.due_date
  };

  if (task.status === 'Blocked') {
    // Use the reason written after "BLOCKED:" in the description, if there is one
    const description = String(task.description || '');
    if (description.includes('BLOCKED:')) {
      info.reason = 'Blocked: ' + description.split('BLOCKED:')[1].trim();
    } else {
      info.reason = 'Status is Blocked';
    }
    blocked.push(info);

  } else if (daysUntilDue < 0) {
    info.days_overdue = -daysUntilDue;
    info.reason = 'Overdue by ' + info.days_overdue + ' days, still ' + task.status;
    overdue.push(info);

  } else if (daysUntilDue <= windowDays) {
    info.days_until_due = daysUntilDue;
    if (daysUntilDue === 0) {
      info.reason = 'Due today, still ' + task.status;
    } else {
      info.reason = 'Due in ' + daysUntilDue + ' days, still ' + task.status;
    }
    dueSoon.push(info);
  }
}

// Step 5: send back the three lists
return [{
  json: {
    as_of: toText(asOfDate),
    window_days: windowDays,
    blocked: blocked,
    overdue: overdue,
    due_soon: dueSoon
  }
}];