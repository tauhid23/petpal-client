// src/components/MonthCalendar.tsx
import React from "react";
import {
  createEvent,
  deleteEvent,
  listEventsByMonth,
  updateEvent,
} from "../services/eventsService";
import type { CalendarEvent } from "../services/eventsService";
import EventModal from "./EventModal";

const PALETTE = {
  bg: "#E1E9C9",
  border: "#CADCAE",
  accent: "#EDA35A",
  soft: "#FEE8D9",
};

const EVENT_COLORS = [
  "#EDA35A", // orange
  "#4CAF50", // green
  "#2196F3", // blue
  "#9C27B0", // purple
  "#F44336", // red
  "#FF9800", // amber
  "#3F51B5", // indigo
];

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}
function toISO(y: number, m: number, d: number) {
  return `${y}-${pad(m + 1)}-${pad(d)}`;
}

function useMonthMatrix(year: number, month: number) {
  const first = new Date(year, month, 1);
  const firstWeekday = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const cells: { y: number; m: number; d: number; inMonth: boolean }[] = [];
  for (let i = 0; i < firstWeekday; i++) {
    const dayNum = prevMonthDays - firstWeekday + 1 + i;
    const prevDate = new Date(year, month, 0);
    cells.push({ y: prevDate.getFullYear(), m: prevDate.getMonth(), d: dayNum, inMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ y: year, m: month, d, inMonth: true });
  }
  const remain = 42 - cells.length;
  for (let i = 1; i <= remain; i++) {
    const nextDate = new Date(year, month + 1, 1);
    cells.push({ y: nextDate.getFullYear(), m: nextDate.getMonth(), d: i, inMonth: false });
  }
  return cells;
}

const daysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const MonthCalendar: React.FC = () => {
  const today = new Date();
  const [year, setYear] = React.useState(today.getFullYear());
  const [month, setMonth] = React.useState(today.getMonth());
  const [events, setEvents] = React.useState<CalendarEvent[]>([]);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<"create" | "edit">("create");
  const [activeDate, setActiveDate] = React.useState<string>(toISO(year, month, today.getDate()));
  const [editing, setEditing] = React.useState<CalendarEvent | null>(null);

  const matrix = useMonthMatrix(year, month);

  React.useEffect(() => {
    (async () => {
      const data = await listEventsByMonth(year, month);
      setEvents(data);
    })();
  }, [year, month]);

  const handleToday = () => {
    const t = new Date();
    setYear(t.getFullYear());
    setMonth(t.getMonth());
    setActiveDate(toISO(t.getFullYear(), t.getMonth(), t.getDate()));
  };

  const handlePrev = () => {
    const d = new Date(year, month - 1, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  };
  const handleNext = () => {
    const d = new Date(year, month + 1, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  };

  const openCreateFor = (isoDate: string) => {
    setModalMode("create");
    setActiveDate(isoDate);
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (evt: CalendarEvent) => {
    setModalMode("edit");
    setActiveDate(evt.date);
    setEditing(evt);
    setModalOpen(true);
  };

  const submitModal = async (data: { title: string; date: string; time?: string; color?: string }) => {
    if (modalMode === "create") {
      const created = await createEvent({
        title: data.title,
        date: data.date,
        time: data.time,
        color: data.color || EVENT_COLORS[Math.floor(Math.random() * EVENT_COLORS.length)],
      });
      if (new Date(created.date).getMonth() === month && new Date(created.date).getFullYear() === year) {
        setEvents((prev) => [...prev, created]);
      }
    } else if (modalMode === "edit" && editing) {
      const updated = await updateEvent(editing.id, data);
      const inThisMonth =
        new Date(updated.date).getMonth() === month &&
        new Date(updated.date).getFullYear() === year;

      setEvents((prev) => {
        const filtered = prev.filter((e) => e.id !== editing.id);
        return inThisMonth ? [...filtered, updated] : filtered;
      });
    }
    setModalOpen(false);
  };

  const deleteEditing = async () => {
    if (!editing) return;
    await deleteEvent(editing.id);
    setEvents((prev) => prev.filter((e) => e.id !== editing.id));
    setModalOpen(false);
  };

  const eventsByDate = React.useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const e of events) {
      (map[e.date] ??= []).push(e);
    }
    return map;
  }, [events]);

  const isToday = (y: number, m: number, d: number) => {
    const t = new Date();
    return y === t.getFullYear() && m === t.getMonth() && d === t.getDate();
  };

  return (
    <div className="w-full rounded-3xl border shadow-lg" style={{ borderColor: PALETTE.border }}>
      {/* Header */}
      <div className="flex items-center justify-between rounded-t-3xl border-b p-4"
           style={{ background: PALETTE.bg, borderColor: PALETTE.border }}>
        <div className="flex items-center gap-2">
          <button onClick={handlePrev} className="rounded-xl border px-3 py-2 hover:bg-white" style={{ borderColor: PALETTE.border }}>
            ‹
          </button>
          <button onClick={handleNext} className="rounded-xl border px-3 py-2 hover:bg-white" style={{ borderColor: PALETTE.border }}>
            ›
          </button>
        </div>
        <div className="text-lg font-semibold text-slate-700">
          {months[month]} {year}
        </div>
        <button
          onClick={handleToday}
          className="rounded-xl bg-[#EDA35A] px-4 py-2 font-medium text-white hover:bg-[#d8883c]"
        >
          Today
        </button>
      </div>

      {/* Week row */}
      <div className="grid grid-cols-7 border-b" style={{ borderColor: PALETTE.border }}>
        {daysShort.map((d) => (
          <div key={d} className="p-2 text-center text-sm font-semibold text-slate-600">{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7">
        {matrix.map((cell, idx) => {
          const iso = toISO(cell.y, cell.m, cell.d);
          const dayEvents = eventsByDate[iso] || [];
          const faded = !cell.inMonth;
          return (
            <div key={`${iso}-${idx}`} className="min-h-[100px] border p-2" style={{
              borderColor: PALETTE.border,
              background: faded ? "#fafaf7" : "white",
            }}>
              <div className="mb-2 flex items-center justify-between">
                <button
                  onClick={() => openCreateFor(iso)}
                  className="rounded-full px-2 py-1 text-xs"
                  style={{ color: faded ? "#9aa193" : "#374151", background: faded ? "transparent" : PALETTE.soft }}
                >
                  + Add
                </button>
                <div className={`flex size-7 items-center justify-center rounded-full text-sm font-medium ${isToday(cell.y, cell.m, cell.d) ? "text-white" : ""}`}
                     style={{ background: isToday(cell.y, cell.m, cell.d) ? PALETTE.accent : "transparent" }}>
                  {cell.d}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                {dayEvents.map((e, i) => (
                  <button
                    key={e.id}
                    onClick={() => openEdit(e)}
                    className="truncate rounded-lg px-2 py-1 text-left text-sm text-white"
                    style={{ background: e.color || EVENT_COLORS[i % EVENT_COLORS.length] }}
                  >
                    {e.title}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <EventModal
        open={modalOpen}
        mode={modalMode}
        initial={{
          title: editing?.title ?? "",
          date: activeDate,
          time: editing?.time ?? "",
          color: editing?.color,
        }}
        onClose={() => setModalOpen(false)}
        onSubmit={submitModal}
        onDelete={modalMode === "edit" ? deleteEditing : undefined}
        colorOptions={EVENT_COLORS}
      />
    </div>
  );
};

export default MonthCalendar;
