// src/pages/CalendarPage.tsx
import React, { useEffect, useState } from "react";
import MonthCalendar from "../components/MonthCalender";
import { fetchPets } from "../services/petService";
import type { Pet } from "../services/petService";

const CalendarPage: React.FC = () => {
const [pets, setPets] = useState<Pet[]>([]);

const loadPets = async () => {
    try {
      const data = await fetchPets();
      setPets(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch pets");
    } 
  };

  useEffect(() => {
    loadPets();
  }, []);
  return (
    <div className="min-h-screen w-full p-6"
         style={{
           background: `linear-gradient(180deg, rgba(226,233,201,0.5), rgba(254,232,217,0.5))`,
         }}
    >
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-center text-3xl font-extrabold tracking-tight"
            style={{ color: "#EDA35A" }}
        >
          Event Calendar
        </h1>
        <MonthCalendar pets={pets} />
      </div>
    </div>
  );
};

export default CalendarPage;
