export const units = {
  year: "year",
  yearly: "yearly",
  quarter: "quarter",
  quartly: "quartly",
  month: "month",
  monthly: "monthly",
  week: "week",
  weekly: "weekly",
  day: "day",
  daily: "daily",
};

export const commands = {
  me: "me",
  my: "me",
  top: "top",
  total: "total",
  help: "help",
};

export const types = {
  list: "list",
  pie: "pie",
  bar: "bar",
  line: "line",
  radar: "radar",
  polararea: "polarArea",
};

function normalizeUnit(input: string) {
  const normalized = units[input ? input.toLowerCase() : input];

  if (!normalized) return null;

  return normalized;
}

function startOf(input: string) {
  const normalized = {
    yearly: "yearly",
    quartly: "quartly",
    monthly: "monthly",
    weekly: "weekly",
    daily: "daily",
  }[input ? input.toLowerCase() : input];

  if (!normalized) return null;

  return normalized;
}

function toLuxonUnit(input: string) {
  const normalized = {
    year: "year",
    yearly: "year",
    quarter: "quarter",
    quartly: "quarter",
    month: "month",
    monthly: "month",
    week: "week",
    weekly: "week",
    day: "day",
    daily: "day",
  }[input ? input.toLowerCase() : input];

  if (!normalized) return null;

  return normalized;
}

function normalizeCommand(input: string) {
  const normalized = commands[input ? input.toLowerCase() : input];

  if (!normalized) return null;

  return normalized;
}

function normalizeType(input: string) {
  const normalized = types[input ? input.toLowerCase() : input];

  if (!normalized) return null;

  return normalized;
}

export const normalize = {
  unit: normalizeUnit,
  command: normalizeCommand,
  type: normalizeType,
  startOf,
  toLuxonUnit,
};
