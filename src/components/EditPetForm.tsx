import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPetById, editPet} from "../services/petService";
import type { Pet } from "../services/petService";

const EditPetForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<Partial<Pet>>({
    name: "",
    species: "",
    breed: "",
    dob: "",
    microchipId: "",
    emergencyContact: "",
    photos: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPet = async () => {
      if (!id) return;
      try {
        const pet = await fetchPetById(id);
        setForm(pet);
      } catch (err) {
        console.error(err);
        alert("Failed to load pet");
      } finally {
        setLoading(false);
      }
    };
    loadPet();
  }, [id]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await editPet(id, form);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to update pet");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#CADCAE]">
      <form
        onSubmit={handleSubmit}
        className="relative bg-[#E1E9C9] shadow-xl rounded-3xl p-8 w-full max-w-4xl flex flex-col gap-6"
      >
        <h2 className="text-2xl font-bold text-[#EDA35A] text-center">
          Edit Pet 🐾
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            placeholder="Name *"
            value={form.name || ""}
            onChange={handleChange}
            className="border border-[#CADCAE] px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EDA35A] shadow-sm transition w-full"
            required
          />
          <input
            name="species"
            placeholder="Species"
            value={form.species || ""}
            onChange={handleChange}
            className="border border-[#CADCAE] px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EDA35A] shadow-sm transition w-full"
          />
          <input
            name="breed"
            placeholder="Breed"
            value={form.breed || ""}
            onChange={handleChange}
            className="border border-[#CADCAE] px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EDA35A] shadow-sm transition w-full"
          />
          <input
            name="dob"
            type="date"
            placeholder="Date of Birth"
            value={form.dob ? form.dob.split("T")[0] : ""}
            onChange={handleChange}
            className="border border-[#CADCAE] px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EDA35A] shadow-sm transition w-full"
          />
          <input
            name="microchipId"
            placeholder="Microchip ID"
            value={form.microchipId || ""}
            onChange={handleChange}
            className="border border-[#CADCAE] px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EDA35A] shadow-sm transition w-full"
          />
          <input
            name="emergencyContact"
            placeholder="Emergency Contact"
            value={form.emergencyContact || ""}
            onChange={handleChange}
            className="border border-[#CADCAE] px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EDA35A] shadow-sm transition w-full"
          />
        </div>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handlePhotoChange}
          className="border border-[#CADCAE] px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EDA35A] shadow-sm transition w-full"
        />

        <button
          type="submit"
          className="bg-[#EDA35A] text-white px-6 py-3 rounded-2xl font-medium hover:bg-[#d8883c] transition w-full"
        >
          Update Pet
        </button>
      </form>
    </div>
  );
};

export default EditPetForm;
