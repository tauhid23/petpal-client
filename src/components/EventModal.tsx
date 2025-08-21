// src/components/EventModal.tsx
import React from "react";

interface EventModalProps {
  open: boolean;
  mode: "create" | "edit";
  initial: { title: string; date: string; time?: string };
  onClose: () => void;
  onSubmit: (data: { title: string; date: string; time?: string }) => void;
  onDelete?: () => void; // only in edit
}

const EventModal: React.FC<EventModalProps> = ({
  open,
  mode,
  initial,
  onClose,
  onSubmit,
  onDelete,
}) => {
  const [form, setForm] = React.useState(initial);

  React.useEffect(() => setForm(initial), [initial, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[92vw] max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold text-[#EDA35A]">
          {mode === "create" ? "Add Event" : "Edit Event"}
        </h2>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Title
            </label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-xl border border-[#CADCAE] px-3 py-2 outline-none focus:ring-2 focus:ring-[#EDA35A]"
              placeholder="e.g., Vet Visit"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full rounded-xl border border-[#CADCAE] px-3 py-2 outline-none focus:ring-2 focus:ring-[#EDA35A]"
              />
            </div>
            <div className="w-1/2">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Time
              </label>
              <input
                type="time"
                value={form.time ?? ""}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full rounded-xl border border-[#CADCAE] px-3 py-2 outline-none focus:ring-2 focus:ring-[#EDA35A]"
              />
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          {mode === "edit" && onDelete && (
            <button
              onClick={onDelete}
              className="rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-red-600 hover:bg-red-100"
            >
              Delete
            </button>
          )}
          <div className="ml-auto flex gap-2">
            <button
              onClick={onClose}
              className="rounded-xl border border-[#CADCAE] bg-white px-4 py-2 text-slate-700 hover:bg-[#FEE8D9]"
            >
              Cancel
            </button>
            <button
              onClick={() => onSubmit(form)}
              className="rounded-xl bg-[#EDA35A] px-4 py-2 font-medium text-white hover:bg-[#d8883c]"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
