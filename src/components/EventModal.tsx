import React, { useState, useEffect } from "react";

export interface EventFormData {
  type: string;
  date: string;
  petId: string;
}

export interface Pet {
  id: string;
  name: string;
}

export interface EventModalProps {
  open: boolean;
  mode: "create" | "edit";
  pets: Pet[];
  initial?: EventFormData;
  onClose: () => void;
  onSubmit: (data: EventFormData) => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
}

const EventModal: React.FC<EventModalProps> = ({
  open,
  mode,
  pets,
  initial,
  onClose,
  onSubmit,
  onDelete,
}) => {
  const [form, setForm] = useState<EventFormData>({
    type: "",
    date: "",
    petId: "",
  });

  // reset form whenever modal opens or initial/pets change
  useEffect(() => {
    if (open) {
      setForm(
        initial ?? {
          type: "",
          date: new Date().toISOString().slice(0, 10),
          petId: pets[0]?.id ?? "",
        }
      );
    }
  }, [open, initial, pets]);

  if (!open) return null; // Don't render if modal closed

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
    onClose();
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    await onDelete();
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="w-96 rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">
          {mode === "create" ? "Add Event" : "Edit Event"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Type</label>
            <input
              type="text"
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full rounded border p-2"
              placeholder="Walk, Vet, Feed, Meds..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full rounded border p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Pet</label>
            <select
              name="petId"
              value={form.petId}
              onChange={handleChange}
              className="w-full rounded border p-2"
              required
            >
              <option value="" disabled>
                Select a pet
              </option>
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            {mode === "edit" && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded border px-3 py-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
            >
              {mode === "create" ? "Add" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
