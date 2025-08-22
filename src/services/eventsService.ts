// src/services/scheduleService.ts
export interface ScheduleItem {
  id: string;
  petId: string;
  type: "vet" | "walk" | "meds" | string;
  date: string;
}

// Add Schedule
export const addSchedule = async (scheduleData: Omit<Partial<ScheduleItem>, "id">): Promise<ScheduleItem> => {
  const res = await fetch("http://localhost:5000/api/schedules", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(scheduleData),
  });

  if (!res.ok) throw new Error("Failed to add schedule");
  return res.json();
};

// Get All Schedules
export const fetchSchedules = async (): Promise<ScheduleItem[]> => {
  const res = await fetch("http://localhost:5000/api/schedules");
  if (!res.ok) throw new Error("Failed to fetch schedules");
  return res.json();
};

// Get Schedule by ID
export const fetchScheduleById = async (id: string): Promise<ScheduleItem> => {
  const res = await fetch(`http://localhost:5000/api/schedules/${id}`);
  if (!res.ok) throw new Error("Failed to fetch schedule");
  return res.json();
};

// Get Schedules by Pet ID
export const fetchSchedulesByPetId = async (petId: string): Promise<ScheduleItem[]> => {
  const res = await fetch(`http://localhost:5000/api/schedules/pets/${petId}`);
  if (!res.ok) throw new Error("Failed to fetch schedules for this pet");
  return res.json();
};

// Update Schedule
export const updateSchedule = async (id: string, scheduleData: Partial<Omit<ScheduleItem, "id">>): Promise<ScheduleItem> => {
  const res = await fetch(`http://localhost:5000/api/schedules/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(scheduleData),
  });

  if (!res.ok) throw new Error("Failed to update schedule");
  return res.json();
};

// Delete Schedule
export const deleteSchedule = async (id: string): Promise<void> => {
  const res = await fetch(`http://localhost:5000/api/schedules/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete schedule");
};
