import React, { useEffect, useState } from "react";
import type { Pet } from "../services/petService";
import { useNavigate } from "react-router-dom";
import { fetchSchedulesByPetId } from "../services/eventsService";
import type { ScheduleItem } from "../services/eventsService";
import { deletePet } from "../services/petService";
import { FaEdit, FaTrashAlt, FaPaw, FaStethoscope, FaWalking } from "react-icons/fa";
import { motion } from "framer-motion";

interface Props {
  pet: Pet;
  onPetUpdate: () => void; // callback to reload pets
}

const PetCard: React.FC<Props> = ({ pet, onPetUpdate }) => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const navigate = useNavigate();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/edit-pet/${pet.id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this pet?")) return;
    try {
      await deletePet(pet.id);
      onPetUpdate();
    } catch (err) {
      console.error(err);
      alert("Failed to delete pet");
    }
  };

  const handleCardClick = () => {
    navigate(`/pets/${pet.id}`);
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchSchedulesByPetId(pet.id);
        setSchedule(data);
      } catch (error) {
        console.error("Failed to fetch schedules:", error);
      }
    })();
  }, [pet.id]);

  const photo = pet.photos?.[0] || "https://via.placeholder.com/400?text=Pet+Image";
  const nextVet = schedule?.find((s) => s.type === "vet")?.date || "N/A";
  const nextWalk = schedule?.find((s) => s.type === "walk")?.date || "N/A";

  return (
    <motion.div
      onClick={handleCardClick}
      className="group relative w-80 h-80 outline-1 -outline-offset-2 overflow-hidden rounded-xl shadow-lg transition-all duration-300 transform cursor-pointer"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Background Image */}
      <img
        src={photo}
        alt={pet.name}
        className="w-full h-full object-cover absolute inset-0 z-0 transition-transform duration-300 group-hover:scale-105"
      />

      {/* Hover Overlay Content */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-end p-5">
        <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{pet.name}</h3>

        <div className="flex flex-col gap-2 text-sm text-white">
          <p className="font-semibold flex items-center gap-2">
            <FaPaw className="text-lg text-white" />
            <span className="text-base">Breed: {pet.breed || "Unknown"}</span>
          </p>
          <p className="flex items-center gap-2">
            <FaWalking className="text-white" />
            Next Walk: {nextWalk}
          </p>
          <p className="flex items-center gap-2">
            <FaStethoscope className="text-white" />
            Next Vet: {nextVet}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-start gap-3 mt-4">
          <button
            onClick={handleEdit}
            className="p-3 bg-white/30 backdrop-blur-sm rounded-full shadow-md text-white hover:bg-white/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Edit pet"
            title="Edit"
          >
            <FaEdit />
          </button>
          <button
            onClick={handleDelete}
            className="p-3 bg-red-500/50 backdrop-blur-sm rounded-full shadow-md text-white hover:bg-red-600/70 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label="Delete pet"
            title="Delete"
          >
            <FaTrashAlt />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PetCard;