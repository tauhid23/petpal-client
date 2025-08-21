import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";
import type { Pet } from "../services/petService";
import { fetchPets } from "../services/petService";
import PetCard from "../components/petCard";

const Home: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPets = async () => {
      try {
        const data = await fetchPets();
        setPets(data);
      } catch (err) {
        setError("Could not load Pets");
      } finally {
        setLoading(false);
      }
    };
    loadPets();
  }, []);

  if (loading) return <p className="p-6">Loading pets...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen w-full relative">
      {/* Simple semi-transparent background overlay */}
      <div className="absolute inset-0 bg-[#CADCAE] opacity-50 -z-10"></div>

      <Hero />

      {/* Pets Section */}
      <div className="p-6 w-full mt-12 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-[#EDA35A] mb-6">My Pets 🐾</h1>

        {pets.length === 0 ? (
          <p className="text-gray-700">No pets found. Please add a pet.</p>
        ) : (
          <div className="overflow-x-auto scrollbar-hide py-4 w-full max-w-7xl">
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
