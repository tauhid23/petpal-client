import React, { useEffect, useState } from "react";
import { fetchPets } from "../services/petService";
import type { Pet } from "../services/petService";
import PetCard from "../components/petCard";

const MyPets: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPets = async () => {
    try {
      const data = await fetchPets();
      setPets(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch pets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPets();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#E1E9C9]">
        <p className="text-xl font-semibold text-[#EDA35A] animate-pulse">
          Loading pets...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#E1E9C9] p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-center text-[#EDA35A] mb-2">
          My Pets 🐾
        </h1>
        <p className="text-center text-gray-700">
          Manage your pets' profiles, schedules, and care information.
        </p>
      </div>

      {/* Pets Grid */}
      {pets.length === 0 ? (
        <p className="text-center text-gray-600 mt-10 text-lg">
          No pets found. Add a new pet to get started!
        </p>
      ) : (
        <div className="max-w-6xl mx-auto ">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPets;
