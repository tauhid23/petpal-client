export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species?: string;
  breed?: string;
  dob?: string;
  photos?: string[];
  microchipId?: string;
  emergencyContact?: string;
}

// Add Pet
export const addPet = async (petData: Omit<Partial<Pet>, "id">): Promise<Pet> => {
  const res = await fetch("http://localhost:5000/api/pets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(petData),
  });

  if (!res.ok) throw new Error("Failed to add pet");
  return res.json();
};

// Get All Pets
export const fetchPets = async (): Promise<Pet[]> => {
  const res = await fetch("http://localhost:5000/api/pets");
  if (!res.ok) throw new Error("Failed to fetch pets");
  return res.json();
};

// Get All Pets By ownerId
export const fetchPetsByOwner = async (ownerId:string): Promise<Pet[]> => {
  const res = await fetch(`http://localhost:5000/api/pets/owner/${ownerId}`);
  if (!res.ok) throw new Error("Failed to fetch pets");
  return res.json();
};



// Get Single Pet by ID
export const fetchPetById = async (id: string): Promise<Pet> => {
  const res = await fetch(`http://localhost:5000/api/pets/${id}`);
  if (!res.ok) throw new Error("Failed to fetch pet");
  return res.json();
};

// Delete Pet
export const deletePet = async (id: string) => {
  const res = await fetch(`http://localhost:5000/api/pets/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete pet");
};

// Edit Pet
export const editPet = async (id: string, petData: Partial<Omit<Pet, "id">>) => {
  const res = await fetch(`http://localhost:5000/api/pets/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(petData),
  });

  if (!res.ok) throw new Error("Failed to edit pet");
  return res.json();
};
