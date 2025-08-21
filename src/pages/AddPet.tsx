import React, { useState } from "react";
import { addPet } from "../services/petService";
import { useNavigate } from "react-router-dom";

interface ScheduleItem {
  type: "vet" | "walk" | string;
  date: string;
}

interface PetForm {
  name: string;
  species?: string;
  breed?: string;
  dob?: string;
  microchipId?: string;
  emergencyContact?: string;
  photos: string[];
  schedule: ScheduleItem[];
}

const AddPetForm: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<PetForm>({
    name: "",
    species: "",
    breed: "",
    dob: "",
    microchipId: "",
    emergencyContact: "",
    photos: [],
    schedule: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const urls = Array.from(files).map((file) => URL.createObjectURL(file));
      setForm({ ...form, photos: urls });
    }
  };

  const handleScheduleChange = (
    index: number,
    key: "type" | "date",
    value: string
  ) => {
    const schedule = [...form.schedule];
    schedule[index] = { ...(schedule[index] || {}), [key]: value };
    setForm({ ...form, schedule });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      ownerId: "8f14e45f-ea3d-4e29-b59b-1d5c71a48f2a",
      name: form.name,
    };

    if (form.species) payload.species = form.species;
    if (form.breed) payload.breed = form.breed;
    if (form.dob) payload.dob = form.dob || undefined;
    if (form.microchipId) payload.microchipId = form.microchipId;
    if (form.emergencyContact) payload.emergencyContact = form.emergencyContact;
    if (form.photos.length > 0) payload.photos = form.photos;
    if (form.schedule.length > 0) payload.schedule = form.schedule;

    try {
      console.log("Submitting pet data:", payload);
      await addPet(payload);
      navigate("/");
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

        {/* Grid Layout for Inputs */}
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

        {/* Photos */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handlePhotoChange}
          className="border border-[#CADCAE] px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EDA35A] shadow-sm transition w-full"
        />

        {/* Schedule */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-700 mb-1 font-medium">Schedule</label>
          {form.schedule.map((_, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Type (vet / walk)"
                value={form.schedule[idx]?.type || ""}
                onChange={(e) =>
                  handleScheduleChange(idx, "type", e.target.value)
                }
                className="border border-[#CADCAE] px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EDA35A] shadow-sm transition w-full"
              />
              <input
                type="date"
                value={form.schedule[idx]?.date || ""}
                onChange={(e) =>
                  handleScheduleChange(idx, "date", e.target.value)
                }
                className="border border-[#CADCAE] px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EDA35A] shadow-sm transition w-full"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setForm({
                ...form,
                schedule: [...form.schedule, { type: "", date: "" }],
              })
            }
            className="mt-2 text-sm text-teal-700 hover:underline"
          >
            + Add Schedule
          </button>
        </div>

        {/* Submit */}
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
