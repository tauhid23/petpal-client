import React, { useState } from "react";
import { addPet } from "../services/petService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface PetForm {
  name: string;
  species?: string;
  breed?: string;
  dob?: string;
  microchipId?: string;
  emergencyContact?: string;
  photos: string[]; // Only one URL will be stored in index 0
}

const AddPetForm: React.FC = () => {
  const navigate = useNavigate();
  const {user} = useAuth();

  const [form, setForm] = useState<PetForm>({
    name: "",
    species: "",
    breed: "",
    dob: "",
    microchipId: "",
    emergencyContact: "",
    photos: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Store single image URL in photos array at index 0
    setForm({ ...form, photos: [e.target.value] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {
      ownerId: user?.id,
      name: form.name,
    };

    if (form.species) payload.species = form.species;
    if (form.breed) payload.breed = form.breed;
    if (form.dob) payload.dob = form.dob;
    if (form.microchipId) payload.microchipId = form.microchipId;
    if (form.emergencyContact) payload.emergencyContact = form.emergencyContact;
    if (form.photos.length > 0) payload.photos = form.photos;

    try {
      console.log("Submitting pet data:", payload);
      await addPet(payload);
      navigate("/pets");
    } catch (err) {
      console.error(err);
      alert("Failed to add pet");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#CADCAE]">
      <form
        onSubmit={handleSubmit}
        className="relative bg-[#E1E9C9] shadow-xl rounded-3xl p-8 w-full max-w-4xl flex flex-col gap-6"
      >
        <h2 className="text-2xl font-bold text-[#EDA35A] text-center">
          Add New Pet 🐾
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            placeholder="Name *"
            value={form.name}
            onChange={handleChange}
            className="border border-[#CADCAE] px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EDA35A] shadow-sm transition w-full"
            required
          />
          <input
            name="species"
            placeholder="Species"
            value={form.species}
            onChange={handleChange}
            className="border border-[#CADCAE] px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EDA35A] shadow-sm transition w-full"
          />
          <input
            name="breed"
            placeholder="Breed"
            value={form.breed}
            onChange={handleChange}
            className="border border-[#CADCAE] px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EDA35A] shadow-sm transition w-full"
          />
          <input
            name="dob"
            type="date"
            placeholder="Date of Birth"
            value={form.dob}
            onChange={handleChange}
            className="border border-[#CADCAE] px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EDA35A] shadow-sm transition w-full"
          />
          <input
            name="microchipId"
            placeholder="Microchip ID"
            value={form.microchipId}
            onChange={handleChange}
            className="border border-[#CADCAE] px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EDA35A] shadow-sm transition w-full"
          />
          <input
            name="emergencyContact"
            placeholder="Emergency Contact"
            value={form.emergencyContact}
            onChange={handleChange}
            className="border border-[#CADCAE] px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EDA35A] shadow-sm transition w-full"
          />
        </div>

        {/* Single Photo URL */}
        <input
          type="text"
          name="photo"
          placeholder="Enter image URL"
          value={form.photos[0] || ""}
          onChange={handlePhotoChange}
          className="border border-[#CADCAE] px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EDA35A] shadow-sm transition w-full"
        />

        <button
          type="submit"
          className="bg-[#EDA35A] text-white px-6 py-3 rounded-2xl font-medium hover:bg-[#d8883c] transition w-full"
        >
          Add Pet
        </button>
      </form>
    </div>
  );
};

export default AddPetForm;
