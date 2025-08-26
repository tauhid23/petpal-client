import React, { useEffect, useState } from "react";
import { fetchPets } from "../services/petService";
import { useAuth } from "../context/AuthContext";
import type { Pet } from "../types/pet";
import HPetCard from "../components/HPetCard";
import { motion } from "framer-motion"; // Import motion
import Hero from "../components/Hero";

const PHome: React.FC = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    if (user) {
      loadPets();
    }
  }, [user]);

  const loadPets = async () => {
    try {
      const data = await fetchPets();
      setPets(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F7EB]">
        <p className="text-xl font-medium text-gray-700 p-6 rounded-lg shadow-md bg-white">
          Please log in to view your pets.
        </p>
      </div>
    );
  }

  // Define the container variants for the stagger effect
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2, // This controls the delay between each child animation
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#F5F7EB] ">
       <div className="mb-7 shadow-2xs">
         <Hero/>
       </div>
      <h1 className="text-4xl font-extrabold text-[#EDA35A] text-center mb-12 drop-shadow-lg">
        Adorable Pets Through The WORLD
      </h1>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {pets.length > 0 ? (
          pets.map((pet) => (
            <HPetCard key={pet.id} pet={pet} userId={String(user.id)} />
          ))
        ) : (
          <p className="col-span-full text-center text-lg text-gray-500">
            No pets found. Check back later!
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default PHome;