// src/pages/CalendarPage.tsx
import React from "react";
import MonthCalendar from "../components/MonthCalender";

const CalendarPage: React.FC = () => {
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
        <MonthCalendar />
      </div>
    </div>
  );
};

export default CalendarPage;
