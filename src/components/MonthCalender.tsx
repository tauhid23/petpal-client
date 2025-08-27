// src/components/MonthCalendar.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  addSchedule,
  fetchSchedulesByPetId,
  deleteSchedule,
  updateSchedule,
} from "../services/eventsService";
import type { ScheduleItem } from "../services/eventsService";
import EventModal from "./EventModal";
import type { EventFormData } from "./EventModal";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export interface Pet {
  id: string;
  name: string;
}

interface MonthCalendarProps {
  pets: Pet[];
}
// Custom Confirmation Modal component
interface ConfirmModalProps {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}
const PALETTE = {
  bg: "#E1E9C9",
  border: "#CADCAE",
  accent: "#EDA35A",
  soft: "#FEE8D9",
};

const EVENT_TYPE_COLORS: Record<string, string> = {
  walk: "#347433", 
  vet: "#5D688A", 
  feed: "#77BEF0", 
  meds: "#FF0066", 
};

// Custom Hook to check for mobile screen size
const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);
  return isMobile;
};

// Normalize any date string to YYYY-MM-DD
function normalizeISO(dateStr: string) {
  const d = new Date(dateStr);
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Generate 6x7 month matrix
function useMonthMatrix(year: number, month: number) {
  const first = new Date(year, month, 1);
  const firstWeekday = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const cells: { y: number; m: number; d: number; inMonth: boolean; iso: string }[] = [];
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  // Previous month tail
  for (let i = 0; i < firstWeekday; i++) {
    const dayNum = prevMonthDays - firstWeekday + 1 + i;
    const prevDate = new Date(year, month, 0);
    const iso = `${prevDate.getFullYear()}-${pad(prevDate.getMonth() + 1)}-${pad(dayNum)}`;
    cells.push({ y: prevDate.getFullYear(), m: prevDate.getMonth(), d: dayNum, inMonth: false, iso });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${year}-${pad(month + 1)}-${pad(d)}`;
    cells.push({ y: year, m: month, d, inMonth: true, iso });
  }

  // Next month head
  const remain = 42 - cells.length;
  for (let i = 1; i <= remain; i++) {
    const nextDate = new Date(year, month + 1, 1);
    const iso = `${nextDate.getFullYear()}-${pad(nextDate.getMonth() + 1)}-${pad(i)}`;
    cells.push({ y: nextDate.getFullYear(), m: nextDate.getMonth(), d: i, inMonth: false, iso });
  }

  return cells;
}

const daysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];


const ConfirmModal: React.FC<ConfirmModalProps> = ({ open, message, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <p className="text-center text-lg font-semibold mb-4">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const MonthCalendar: React.FC<MonthCalendarProps> = ({ pets }) => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [events, setEvents] = useState<ScheduleItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [activeDate, setActiveDate] = useState<string>(
    normalizeISO(today.toISOString())
  );
  const [editing, setEditing] = useState<ScheduleItem | null>(null);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => () => {});

  const isMobile = useIsMobile();
  const matrix = useMonthMatrix(year, month);
  // Fetch schedules and normalize dates
  useEffect(() => {
    (async () => {
      try {
        // Use the first pet's id as default, or handle empty pets array
        const petId = pets[0]?.id;
        if (!petId) {
          // setEvents([]);
          return;
        }
        const data = await fetchSchedulesByPetId(petId);
        const normalized = data.map(e => ({ ...e, date: normalizeISO(e.date) }));
        setEvents(normalized);
      } catch (error) {
        console.error("Failed to fetch schedules:", error);
      }
    })();
  }, [year, month,pets]);

  // Navigation
  const handleToday = () => {
    const t = new Date();
    setYear(t.getFullYear());
    setMonth(t.getMonth());
    setActiveDate(normalizeISO(t.toISOString()));
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
    try {
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
    } catch (error) {
      console.error("Failed to save schedule:", error);
      
      setConfirmModalOpen(true);
      setConfirmAction(() => () => { setConfirmModalOpen(false); });
    }
  };

  
  const deleteEditing = async () => {
    if (!editing) return;
    setConfirmAction(() => async () => {
      try {
        await deleteSchedule(editing.id);
        setEvents((prev) => prev.filter((e) => e.id !== editing.id));
        setModalOpen(false);
      } catch (error) {
        console.error("Failed to delete event:", error);
        
      } finally {
        setConfirmModalOpen(false);
      }
    });
    setConfirmModalOpen(true);
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

  const renderHeader = () => (
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
          <FaChevronLeft />
        </button>
        <button
          onClick={handleNext}
          className="rounded-xl border px-3 py-2 hover:bg-white"
          style={{ borderColor: PALETTE.border }}
        >
          <FaChevronRight />
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
  );

  const renderEvents = (iso: string) => {
    const dayEvents = eventsByDate[iso] || [];
    return dayEvents.map((e) => {
      const color = EVENT_TYPE_COLORS[e.type.toLowerCase()] || "#888";
      const petName = pets.find((p) => p.id === e.petId)?.name ?? e.petId;
      return (
        <button
          key={e.id}
          onClick={() => openEdit(e)}
          className="truncate rounded-lg px-2 py-1 text-left text-sm text-white md:text-xs md:py-0.5"
          style={{ background: color }}
        >
          {e.type} ({petName})
        </button>
      );
    });
  };

  const renderDesktopCalendar = () => (
    <div className="hidden md:block w-full rounded-3xl border shadow-lg" style={{ borderColor: PALETTE.border }}>
      {renderHeader()}
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
          const iso = cell.iso;
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
                {renderEvents(iso)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderMobileCalendar = () => (
    <div className="md:hidden w-full rounded-3xl border shadow-lg" style={{ borderColor: PALETTE.border }}>
      {renderHeader()}
      <div className="p-4 flex flex-col gap-4">
        {matrix.filter(cell => cell.inMonth).map((cell) => {
          const iso = cell.iso;
          const dayEvents = eventsByDate[iso] || [];

          return (
            <div key={iso} className="border-b pb-4" style={{ borderColor: PALETTE.border }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <span
                    className={`flex size-8 items-center justify-center rounded-full text-sm font-medium ${
                      isToday(cell.y, cell.m, cell.d) ? "text-white" : ""
                    }`}
                    style={{
                      background: isToday(cell.y, cell.m, cell.d)
                        ? PALETTE.accent
                        : "transparent",
                      color: isToday(cell.y, cell.m, cell.d) ? "white" : "black"
                    }}
                  >
                    {cell.d}
                  </span>
                  <span>{daysShort[new Date(iso).getDay()]}</span>
                </div>
                <button
                  onClick={() => openCreateFor(iso)}
                  className="rounded-full px-3 py-1 text-sm bg-[#FEE8D9] text-gray-800 hover:bg-white"
                >
                  + Add Event
                </button>
              </div>
              <div className="flex flex-col gap-1 ml-10">
                {dayEvents.length > 0 ? (
                  renderEvents(iso)
                ) : (
                  <span className="text-gray-500 text-sm italic">No events</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {isMobile ? renderMobileCalendar() : renderDesktopCalendar()}
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
      <ConfirmModal
        open={confirmModalOpen}
        message="Are you sure you want to delete this event?"
        onConfirm={confirmAction}
        onCancel={() => setConfirmModalOpen(false)}
      />
    </>
  );
};

export default MonthCalendar;
