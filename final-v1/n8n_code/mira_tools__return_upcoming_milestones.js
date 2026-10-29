// WHAT THIS DOES
// Lists the timeline milestones (project_timeline.csv) that are due in the next
// milestone_window_days after as_of_date (both from mira_config.json).
// A milestone is due on its phase's end date. Week numbers become dates using project_start.
// The timeline has no "done" column, so this tool does not judge whether a milestone is complete.

// Step 1: settings from the config file
const settings = $('Load settings').first().json.settings;
const windowDays = Number(settings.milestone_window_days);
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
const projectStart = toDate(settings.project_start);
const windowEnd = new Date(asOfDate.getTime() + windowDays * oneDay);

// Step 3: check each phase's due date
const upcoming = [];
for (const row of $('Parse timeline').all()) {
  const phase = row.json;
  const endWeek = Number(phase.end_week);
  const dueDate = new Date(projectStart.getTime() + ((endWeek - 1) * 7 + 6) * oneDay);
  const daysUntilDue = Math.round((dueDate - asOfDate) / oneDay);

  if (daysUntilDue >= 0 && daysUntilDue <= windowDays) {
    upcoming.push({
      phase: Number(phase.phase),
      phase_name: phase.phase_name,
      milestones: phase.milestones_deliverables,
      due_date: toText(dueDate),
      days_until_due: daysUntilDue
    });
  }
}

// Step 4: send back the list (empty list = no milestones in the window)
let note = 'Found ' + upcoming.length + ' milestone(s) due in the window.';
if (upcoming.length === 0) {
  note = 'No milestones are due in this window. Do not invent milestones.';
}

return [{
  json: {
    as_of: toText(asOfDate),
    window: toText(asOfDate) + ' to ' + toText(windowEnd),
    note: note,
    upcoming: upcoming
  }
}];