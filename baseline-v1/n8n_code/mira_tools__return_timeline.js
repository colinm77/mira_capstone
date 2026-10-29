// WHAT THIS DOES
// Returns the 8 project phases from project_timeline.csv, with real calendar dates.
// The file only has week numbers, so we convert them using project_start from the config:
//   Phase start date = project start + (start week - 1) weeks
//   Phase end date   = project start + (end week - 1) weeks + 6 days (the Sunday of that week)

// Step 1: settings from the config file
const settings = $('Load settings').first().json.settings;
const oneDay = 24 * 60 * 60 * 1000;

// Step 2: helpers for dates ("2026-03-30" or "3/30/2026" both work)
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

const projectStart = toDate(settings.project_start);

// Step 3: build one entry per phase
const phases = [];
for (const row of $('Parse timeline').all()) {
  const fileRow = row.json;
  const startWeek = Number(fileRow.start_week);
  const endWeek = Number(fileRow.end_week);

  const startDate = new Date(projectStart.getTime() + (startWeek - 1) * 7 * oneDay);
  const endDate = new Date(projectStart.getTime() + ((endWeek - 1) * 7 + 6) * oneDay);

  phases.push({
    phase: Number(fileRow.phase),
    name: fileRow.phase_name,
    weeks: startWeek + '-' + endWeek,
    start_date: toText(startDate),
    end_date: toText(endDate),
    key_activities: fileRow.key_activities,
    milestones: fileRow.milestones_deliverables
  });
}

// Step 4: send back the list of phases
return [{ json: { project_start: toText(projectStart), phases: phases } }];
