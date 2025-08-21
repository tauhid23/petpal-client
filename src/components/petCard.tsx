import React from "react";
import type { Pet } from "../services/petService";
import { useNavigate } from "react-router-dom";

// Assuming you already have deletePet & editPet in petService
import { deletePet } from "../services/petService";

interface Props {
  pet: Pet;
  onPetUpdate: () => void; // callback to reload pets
}

const PetCard: React.FC<Props> = ({ pet, onPetUpdate }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/edit-pet/${pet.id}`); // we can create EditPetForm later
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this pet?")) return;
    try {
      await deletePet(pet.id);
      onPetUpdate(); // refresh list
    } catch (err) {
      console.error(err);
      alert("Failed to delete pet");
    }
  };

  const photo = pet.photos?.[0] || "https://via.placeholder.com/150";
  const nextVet = pet.schedule?.find((s) => s.type === "vet")?.date || "Not scheduled";
  const nextWalk = pet.schedule?.find((s) => s.type === "walk")?.date || "Not scheduled";

  return (
    <div className="group relative bg-gradient-to-br from-[#E1E9C9] to-[#d4e0b8] max-w-4xl mx-auto shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 m-4 border border-[#c8d4a8]">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      
      <div className="flex flex-row">
        {/* Image Section */}
        <div className="w-1/3 relative">
          <div className="h-[320px] overflow-hidden">
            <img 
              src={photo} 
              alt={pet.name} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
              loading="lazy" 
            />
          </div>
          {/* Decorative corner accent */}
          <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-[#EDA35A]/30 to-transparent"></div>
        </div>

        {/* Content Section */}
        <div className="w-2/3 flex flex-col justify-between p-6">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-[#EDA35A] tracking-tight">
                {pet.name}
              </h2>
              <div className="w-2 h-2 bg-[#EDA35A] rounded-full opacity-60"></div>
            </div>
            
            {/* Pet Details */}
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                <span className="text-gray-700 font-medium">Species:</span>
                <span className="text-gray-600">{pet.species || "Unknown"}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                <span className="text-gray-700 font-medium">Breed:</span>
                <span className="text-gray-600">{pet.breed || "Unknown"}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                <span className="text-gray-700 font-medium">DOB:</span>
                <span className="text-gray-600">{pet.dob ? pet.dob.split('T')[0] : "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Schedule & Actions */}
          <div className="space-y-4 mt-2">
            {/* Schedule Info */}
            <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white/40 rounded-xl backdrop-blur-sm">
              <div className="flex-1 flex items-center gap-2">
                <span className="text-lg">🐕</span>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Next Walk</p>
                  <p className="text-sm font-semibold text-gray-700">{nextWalk}</p>
                </div>
              </div>
              <div className="flex-1 flex items-center gap-2">
                <span className="text-lg">🩺</span>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Next Vet</p>
                  <p className="text-sm font-semibold text-gray-700">{nextVet}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button 
                onClick={handleEdit}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#EDA35A] to-[#e0954a] text-white font-medium hover:from-[#e0954a] hover:to-[#d48640] transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                ✏️ Edit
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#c8d4a8] to-[#b8c898] text-gray-700 font-medium hover:from-[#b8c898] hover:to-[#a8b888] transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetCard;