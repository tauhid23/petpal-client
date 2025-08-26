import React, { useEffect, useState } from "react";
import type { Pet } from "../services/petService";
import { useNavigate } from "react-router-dom";
import { fetchSchedulesByPetId } from "../services/eventsService";
import type { ScheduleItem } from "../services/eventsService";

import { deletePet } from "../services/petService";

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
    <div
      onClick={handleCardClick}
      className="group relative w-80 h-80 outline-1 -outline-offset-2 overflow-hidden rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
    >
      {/* Background Image */}
      <img
        src={photo}
        alt={pet.name}
        className="w-full h-full object-cover absolute inset-0 z-0 transition-transform duration-300 group-hover:scale-105"
      />

      {/* Hover Overlay Content */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-end p-5">
        <h3 className="text-xl font-bold text-white mb-2">{pet.name}</h3>

        <div className="flex flex-col gap-1 text-sm text-white">
          <p className="font-semibold">
            <span className="text-lg">📋</span> Breed: {pet.breed || "Unknown"}
          </p>
          <p>Next Walk: {nextWalk}</p>
          <p>Next Vet: {nextVet}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-start gap-3 mt-4">
          <button
            onClick={handleEdit}
            className="p-2 bg-white/30 backdrop-blur-sm rounded-full shadow-md text-white hover:bg-white/50 transition-colors duration-200"
            aria-label="Edit pet"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            className="p-2 bg-white/30 backdrop-blur-sm rounded-full shadow-md text-white hover:bg-white/50 transition-colors duration-200"
            aria-label="Delete pet"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default PetCard;