// src/services/eventService.ts

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO YYYY-MM-DD
  time?: string; // "HH:mm"
}

const STORAGE_KEY = "calendar_events_v1";

function read(): CalendarEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CalendarEvent[]) : [];
  } catch {
    return [];
  }
}

function write(events: CalendarEvent[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

// ---------- Public API (mock) ----------
export async function listEventsByMonth(year: number, month: number) {
  // month: 0-11
  const all = read();
  return all.filter((e) => {
    const d = new Date(e.date + "T00:00:00");
    return d.getFullYear() === year && d.getMonth() === month;
  });
}

export async function listEventsForDate(isoDate: string) {
  return read().filter((e) => e.date === isoDate);
}

export async function createEvent(input: Omit<CalendarEvent, "id">) {
  const evt: CalendarEvent = { id: crypto.randomUUID(), ...input };
  const all = read();
  all.push(evt);
  write(all);
  return evt;
}

export async function updateEvent(
  id: string,
  patch: Partial<Omit<CalendarEvent, "id">>
) {
  const all = read();
  const idx = all.findIndex((e) => e.id === id);
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...patch };
    write(all);
    return all[idx];
  }
  throw new Error("Event not found");
}

export async function deleteEvent(id: string) {
  const all = read().filter((e) => e.id !== id);
  write(all);
  return true;
}
