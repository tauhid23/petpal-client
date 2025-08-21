import React from "react";
import { NavLink } from "react-router-dom";

const Navbar: React.FC = () => {
  const linkClasses = (isActive: boolean) =>
    `font-medium text-[#333] hover:text-[#EDA35A] transition-colors ${
      isActive ? "underline underline-offset-4 decoration-2" : ""
    }`;

  return (
    <nav className="bg-[#E1E9C9] shadow-md px-6 py-6 flex items-center justify-between">
      {/* Left: Logo */}
      <div className="text-2xl font-bold text-[#EDA35A]">
        PetCare 🐾
      </div>

      {/* Center: Menu */}
      <div className="hidden md:flex gap-6">
        <NavLink to="/" className={({ isActive }) => linkClasses(isActive)}>
          Home
        </NavLink>
        <NavLink to="/pets" className={({ isActive }) => linkClasses(isActive)}>
          My Pets
        </NavLink>
        <NavLink to="/add-pet" className={({ isActive }) => linkClasses(isActive)}>
          Add Pet
        </NavLink>
        <NavLink to="/calender" className={({ isActive }) => linkClasses(isActive)}>
          Calender
        </NavLink>
      </div>

      {/* Right: Auth */}
      <div className="flex gap-4">
        <button className="px-4 py-2 rounded-lg bg-[#EDA35A] text-white font-medium hover:bg-[#d8883c] transition-colors">
          Login
        </button>
        <button className="px-4 py-2 rounded-lg border border-[#EDA35A] text-[#EDA35A] font-medium hover:bg-[#FEE8D9] transition-colors">
          Signup
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
