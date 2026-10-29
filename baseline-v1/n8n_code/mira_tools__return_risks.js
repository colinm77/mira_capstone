// WHAT THIS DOES
// Returns risks R01–R10 from project_risks.csv, with each risk's mitigation tasks,
// a mitigation coverage status, a tier and a rank (PRD §6.4).
// The CODE decides all of this, not the LLM.
//
// WHERE THE LINKS COME FROM: mira_config.json -> risk_mitigation
//   (tasks that reduce each risk + link strength "strong" / "weak"; a PM decision)
//
// HOW:
// 1. Each mitigation task is checked against as_of_date from the config:
//      blocked              = status is Blocked
//      overdue              = past due date and not Done
//      in_progress_due_soon = In Progress and due within due_soon_days
//      todo_due_soon        = To Do and due within due_soon_days (context only)
// 2. Coverage status (answers "which risks have mitigation tasks, and which don't?"):
//      No mitigation      = no tasks linked
//      Weak coverage      = only weak links
//      Mitigation at risk = a strong-linked task is blocked or overdue
//      Covered, on track  = strong link(s), none blocked or overdue
// 3. Tier (for "top N risks"). ONLY STRONG LINKS raise a tier:
//      Tier 1 = a strong-linked task is blocked or overdue
//      Tier 2 = a strong-linked task is In Progress and due now or soon
//      Tier 3 = no urgent signal
// 4. Order: Tier 1, then 2, then 3. Inside Tier 1, blocked ranks above overdue.
//    All other ties keep the risk file order (R01, R02, ...).

// Step 1: settings from the config file
const settings = $('Load settings').first().json.settings;
const mitigationLinks = settings.risk_mitigation || {};
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

// Step 3: put all tasks in a lookup table by task ID, e.g. tasksById['T024']
const tasksById = {};
for (const row of $('Parse tasks').all()) {
  tasksById[row.json.task_id] = row.json;
}

// Step 4: a helper that describes one mitigation task and its live signal
function checkTask(taskId) {
  const task = tasksById[taskId];
  if (!task) {
    return { task_id: taskId, task_name: 'NOT FOUND ON BOARD', status: 'UNKNOWN', signal: 'none' };
  }
  const result = {
    task_id: taskId,
    task_name: task.task_name,
    status: task.status,
    due_date: task.due_date,
    signal: 'none'
  };
  if (task.status === 'Done') {
    return result;
  }
  const daysUntilDue = Math.round((toDate(task.due_date) - asOfDate) / oneDay);
  if (task.status === 'Blocked') {
    result.signal = 'blocked';
  } else if (daysUntilDue < 0) {
    result.signal = 'overdue';
    result.days_overdue = -daysUntilDue;
  } else if (daysUntilDue <= windowDays) {
    if (task.status === 'In Progress') {
      result.signal = 'in_progress_due_soon';
    } else {
      result.signal = 'todo_due_soon';
    }
    result.days_until_due = daysUntilDue;
  }
  return result;
}

// Step 5: build one entry per risk
const risks = [];
let fileOrder = 0;
for (const row of $('Parse risks').all()) {
  const risk = row.json;

  // 5a. Mitigation tasks and link strength from the config
  let linkedTaskIds = [];
  let strength = 'none';
  const link = mitigationLinks[risk.risk_id];
  if (link) {
    linkedTaskIds = link.tasks || [];
    strength = link.strength || 'none';
  }
  if (linkedTaskIds.length === 0) {
    strength = 'none';
  }

  const mitigationTasks = [];
  for (const taskId of linkedTaskIds) {
    mitigationTasks.push(checkTask(taskId));
  }

  // 5b. What signals do the mitigation tasks show?
  let hasBlocked = false;
  let hasOverdue = false;
  let hasInProgressSoon = false;
  for (const t of mitigationTasks) {
    if (t.signal === 'blocked') hasBlocked = true;
    if (t.signal === 'overdue') hasOverdue = true;
    if (t.signal === 'in_progress_due_soon') hasInProgressSoon = true;
  }

  // 5c. Coverage status
  let coverage = 'Covered, on track';
  if (strength === 'none') {
    coverage = 'No mitigation';
  } else if (strength === 'weak') {
    coverage = 'Weak coverage';
  } else if (hasBlocked || hasOverdue) {
    coverage = 'Mitigation at risk';
  }

  // 5d. Tier: only strong links can raise it
  let tier = 3;
  if (strength === 'strong') {
    if (hasBlocked || hasOverdue) {
      tier = 1;
    } else if (hasInProgressSoon) {
      tier = 2;
    }
  }

  // 5e. Sort number: tier first, then (inside Tier 1) blocked before overdue, then file order
  let sortNumber = tier * 100 + fileOrder;
  if (tier === 1 && !hasBlocked) {
    sortNumber = sortNumber + 50;
  }

  risks.push({
    risk_id: risk.risk_id,
    category: risk.category,
    risk: risk.risk_challenge,
    impact: risk.impact,
    mitigation: risk.mitigation_strategy,
    mitigation_tasks: mitigationTasks,
    link_strength: strength,
    coverage_status: coverage,
    tier: tier,
    sortNumber: sortNumber
  });
  fileOrder = fileOrder + 1;
}

// Step 6: sort, then number the ranks 1, 2, 3, ...
risks.sort(function (a, b) {
  return a.sortNumber - b.sortNumber;
});
for (let i = 0; i < risks.length; i++) {
  risks[i].rank = i + 1;
  delete risks[i].sortNumber;
}

// Step 7: send back the ranked list
return [{
  json: {
    as_of: toText(asOfDate),
    ranking_rule: 'Tier 1 = strong-linked task blocked/overdue (blocked first), Tier 2 = strong-linked task in progress and due soon, Tier 3 = no signal. Weak links never raise a tier.',
    risks: risks
  }
}];
