// All dates are handled as local "YYYY-MM-DD" strings to avoid timezone drift.

export function parse(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function fmt(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayStr() {
  return fmt(new Date());
}

export function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export function addMonths(date, n) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + n);
  return d;
}

export function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// True if the "YYYY-MM-DD" day falls within [start, end] inclusive.
export function contains(dayStr, start, end) {
  return dayStr >= start && dayStr <= end;
}

// Build a 6-row (42 cell) grid for the month containing `date`, Sun-first.
export function monthGrid(date) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const start = addDays(first, -first.getDay());
  const cells = [];
  for (let i = 0; i < 42; i++) cells.push(addDays(start, i));
  return cells;
}

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Inclusive number of nights/days in a trip.
export function tripLength(start, end) {
  return Math.round((parse(end) - parse(start)) / 86400000) + 1;
}

// "Aug 3 – 9" or "Aug 30 – Sep 2, 2026"
export function formatRange(start, end) {
  const s = parse(start);
  const e = parse(end);
  const mo = (d) =>
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][
      d.getMonth()
    ];
  if (start === end) return `${mo(s)} ${s.getDate()}, ${s.getFullYear()}`;
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear())
    return `${mo(s)} ${s.getDate()} – ${e.getDate()}, ${e.getFullYear()}`;
  if (s.getFullYear() === e.getFullYear())
    return `${mo(s)} ${s.getDate()} – ${mo(e)} ${e.getDate()}, ${e.getFullYear()}`;
  return `${mo(s)} ${s.getDate()}, ${s.getFullYear()} – ${mo(e)} ${e.getDate()}, ${e.getFullYear()}`;
}

// Deterministic pleasant color per person name.
const PALETTE = [
  { bg: "bg-rose-500", soft: "bg-rose-100 text-rose-800", dot: "bg-rose-500", ring: "ring-rose-500" },
  { bg: "bg-orange-500", soft: "bg-orange-100 text-orange-800", dot: "bg-orange-500", ring: "ring-orange-500" },
  { bg: "bg-amber-500", soft: "bg-amber-100 text-amber-800", dot: "bg-amber-500", ring: "ring-amber-500" },
  { bg: "bg-emerald-500", soft: "bg-emerald-100 text-emerald-800", dot: "bg-emerald-500", ring: "ring-emerald-500" },
  { bg: "bg-teal-500", soft: "bg-teal-100 text-teal-800", dot: "bg-teal-500", ring: "ring-teal-500" },
  { bg: "bg-sky-500", soft: "bg-sky-100 text-sky-800", dot: "bg-sky-500", ring: "ring-sky-500" },
  { bg: "bg-indigo-500", soft: "bg-indigo-100 text-indigo-800", dot: "bg-indigo-500", ring: "ring-indigo-500" },
  { bg: "bg-violet-500", soft: "bg-violet-100 text-violet-800", dot: "bg-violet-500", ring: "ring-violet-500" },
  { bg: "bg-fuchsia-500", soft: "bg-fuchsia-100 text-fuchsia-800", dot: "bg-fuchsia-500", ring: "ring-fuchsia-500" },
  { bg: "bg-pink-500", soft: "bg-pink-100 text-pink-800", dot: "bg-pink-500", ring: "ring-pink-500" },
];

export function colorFor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}
