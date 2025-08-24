// src/components/MonthCalendar.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  addSchedule,
  fetchSchedules,
  deleteSchedule,
  updateSchedule,
} from "../services/eventsService";
import type { ScheduleItem } from "../services/eventsService";
import EventModal from "./EventModal";
import type { EventFormData } from "./EventModal";

export interface Pet {
  id: string;
  name: string;
}

interface MonthCalendarProps {
  pets: Pet[];
}

const PALETTE = {
  bg: "#E1E9C9",
  border: "#CADCAE",
  accent: "#EDA35A",
  soft: "#FEE8D9",
};

const EVENT_TYPE_COLORS: Record<string, string> = {
  walk: "green",
  vet: "orange",
  feed: "teal",
  meds: "rose",
};

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function toISO(y: number, m: number, d: number) {
  return `${y}-${pad(m + 1)}-${pad(d)}`;
}

// Normalize any date string to YYYY-MM-DD
function normalizeISO(dateStr: string) {
  const d = new Date(dateStr);
  return toISO(d.getFullYear(), d.getMonth(), d.getDate());
}

// Generate 6x7 month matrix
function useMonthMatrix(year: number, month: number) {
  const first = new Date(year, month, 1);
  const firstWeekday = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const cells: { y: number; m: number; d: number; inMonth: boolean }[] = [];

  // Previous month tail
  for (let i = 0; i < firstWeekday; i++) {
    const dayNum = prevMonthDays - firstWeekday + 1 + i;
    const prevDate = new Date(year, month, 0);
    cells.push({
      y: prevDate.getFullYear(),
      m: prevDate.getMonth(),
      d: dayNum,
      inMonth: false,
    });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ y: year, m: month, d, inMonth: true });
  }

  // Next month head
  const remain = 42 - cells.length;
  for (let i = 1; i <= remain; i++) {
    const nextDate = new Date(year, month + 1, 1);
    cells.push({
      y: nextDate.getFullYear(),
      m: nextDate.getMonth(),
      d: i,
      inMonth: false,
    });
  }

  return cells;
}

const daysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const MonthCalendar: React.FC<MonthCalendarProps> = ({ pets }) => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [events, setEvents] = useState<ScheduleItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [activeDate, setActiveDate] = useState<string>(
    toISO(year, month, today.getDate())
  );
  const [editing, setEditing] = useState<ScheduleItem | null>(null);

  const matrix = useMonthMatrix(year, month);

  // Fetch schedules and normalize dates
  useEffect(() => {
    (async () => {
      const data = await fetchSchedules();
      const normalized = data.map(e => ({ ...e, date: normalizeISO(e.date) }));
      setEvents(normalized);
    })();
  }, [year, month]);

  // Navigation
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

  // Open modal
  const openCreateFor = (isoDate: string) => {
    setModalMode("create");
    setActiveDate(isoDate);
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (evt: ScheduleItem) => {
    setModalMode("edit");
    setActiveDate(evt.date);
    setEditing(evt);
    setModalOpen(true);
  };

  // Submit modal
  const submitModal = async (data: EventFormData) => {
    if (modalMode === "create") {
      const created = await addSchedule(data);
      setEvents((prev) => [
        ...prev,
        { ...created, date: normalizeISO(created.date) },
      ]);
    } else if (modalMode === "edit" && editing) {
      const updated = await updateSchedule(editing.id, data);
      setEvents((prev) =>
        prev.map((e) =>
          e.id === editing.id ? { ...updated, date: normalizeISO(updated.date) } : e
        )
      );
    }
    setModalOpen(false);
  };

  // Delete
  const deleteEditing = async () => {
    if (!editing) return;
    await deleteSchedule(editing.id);
    setEvents((prev) => prev.filter((e) => e.id !== editing.id));
    setModalOpen(false);
  };

  // Map events by normalized date
  const eventsByDate = useMemo(() => {
    const map: Record<string, ScheduleItem[]> = {};
    for (const e of events) {
      const iso = normalizeISO(e.date);
      (map[iso] ??= []).push(e);
    }
    return map;
  }, [events]);

  const isToday = (y: number, m: number, d: number) => {
    const t = new Date();
    return y === t.getFullYear() && m === t.getMonth() && d === t.getDate();
  };

  return (
    <div
      className="w-full rounded-3xl border shadow-lg"
      style={{ borderColor: PALETTE.border }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between rounded-t-3xl border-b p-4"
        style={{ background: PALETTE.bg, borderColor: PALETTE.border }}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="rounded-xl border px-3 py-2 hover:bg-white"
            style={{ borderColor: PALETTE.border }}
          >
            ‹
          </button>
          <button
            onClick={handleNext}
            className="rounded-xl border px-3 py-2 hover:bg-white"
            style={{ borderColor: PALETTE.border }}
          >
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
      <div
        className="grid grid-cols-7 border-b"
        style={{ borderColor: PALETTE.border }}
      >
        {daysShort.map((d) => (
          <div
            key={d}
            className="p-2 text-center text-sm font-semibold text-slate-600"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7">
        {matrix.map((cell, idx) => {
          const iso = toISO(cell.y, cell.m, cell.d);
          const dayEvents = eventsByDate[iso] || [];
          const faded = !cell.inMonth;

          return (
            <div
              key={`${iso}-${idx}`}
              className="min-h-[100px] border p-2"
              style={{
                borderColor: PALETTE.border,
                background: faded ? "#fafaf7" : "white",
              }}
            >
              <div className="mb-2 flex items-center justify-between">
                <button
                  onClick={() => openCreateFor(iso)}
                  className="rounded-full px-2 py-1 text-xs"
                  style={{
                    color: faded ? "#9aa193" : "#374151",
                    background: faded ? "transparent" : PALETTE.soft,
                  }}
                >
                  + Add
                </button>
                <div
                  className={`flex size-7 items-center justify-center rounded-full text-sm font-medium ${
                    isToday(cell.y, cell.m, cell.d) ? "text-white" : ""
                  }`}
                  style={{
                    background: isToday(cell.y, cell.m, cell.d)
                      ? PALETTE.accent
                      : "transparent",
                  }}
                >
                  {cell.d}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                {dayEvents.map((e) => {
                  const color =
                    EVENT_TYPE_COLORS[e.type.toLowerCase()] || "#888";
                  const petName =
                    pets.find((p) => p.id === e.petId)?.name ?? e.petId;

                  return (
                    <button
                      key={e.id}
                      onClick={() => openEdit(e)}
                      className="truncate rounded-lg px-2 py-1 text-left text-sm text-white"
                      style={{ background: color }}
                    >
                      {e.type} ({petName})
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Event Modal */}
      <EventModal
        open={modalOpen}
        mode={modalMode}
        pets={pets}
        initial={
          modalMode === "edit" && editing
            ? { type: editing.type, date: editing.date, petId: editing.petId }
            : { type: "", date: activeDate, petId: pets[0]?.id ?? "" }
        }
        onClose={() => setModalOpen(false)}
        onSubmit={submitModal}
        onDelete={modalMode === "edit" ? deleteEditing : undefined}
      />
    </div>
  );
};

export default MonthCalendar;
