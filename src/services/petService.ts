export interface ScheduleItem {
  type: "vet" | "walk" | "meds" | string; 
  date: string; 
}

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species?: string;
  breed?: string;
  dob?: string;
  photos?: string[];
  microchipId?: string;
  schedule?: ScheduleItem[];
  emergencyContact?: string;
}


// Add Pet
export const addPet = async (petData: Partial<Pet>): Promise<Pet> => {
  const res = await fetch("http://localhost:5000/api/pets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(petData),
  });

  if (!res.ok) throw new Error("Failed to add pet");
  return res.json();
};

// All Pet from Backend
export const fetchPets = async (): Promise<Pet[]> => {
  const res = await fetch("http://localhost:5000/api/pets");
  if (!res.ok) {
    throw new Error("Failed to fetch pets");
  }
  return res.json();
};

// Delete Pet
export const deletePet = async (id: string) => {
  const res = await fetch(`http://localhost:5000/api/pets/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete pet");
};

// Edit Pet (update)
export const editPet = async (id: string, petData: Partial<Pet>) => {
  const res = await fetch(`http://localhost:5000/api/pets/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(petData),
  });
  if (!res.ok) throw new Error("Failed to edit pet");
  return res.json();
};
