import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const linkClasses = (isActive: boolean) =>
    `font-medium text-[#333] hover:text-[#EDA35A] transition-colors ${
      isActive ? "underline underline-offset-4 decoration-2" : ""
    }`;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-[#E1E9C9] shadow-md px-6 py-6 flex items-center justify-between relative">
      {/* Left: Logo */}
      <div className="text-2xl font-bold text-[#EDA35A]">PetCare 🐾</div>

      {/* Right: Hamburger Menu for small screens */}
      <div className="md:hidden">
        <button onClick={toggleMobileMenu} className="text-[#333] text-2xl focus:outline-none">
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Center: Main Menu for medium and large screens */}
      <div className="hidden md:flex md:items-center md:gap-6">
        {user ? (
          <NavLink
            to="/phome"
            className={({ isActive }) => linkClasses(isActive)}
          >
            Home
          </NavLink>
        ) : (
          <NavLink to="/" className={({ isActive }) => linkClasses(isActive)}>
            Home
          </NavLink>
        )}
        <NavLink to="/pets" className={({ isActive }) => linkClasses(isActive)}>
          My Pets
        </NavLink>
        <NavLink
          to="/add-pet"
          className={({ isActive }) => linkClasses(isActive)}
        >
          Add Pet
        </NavLink>
        <NavLink to="/cal" className={({ isActive }) => linkClasses(isActive)}>
          Calendar
        </NavLink>
      </div>

      {/* Right: Auth Buttons for medium and large screens */}
      <div className="hidden md:flex gap-4">
        {user ? (
          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg bg-[#EDA35A] text-white font-medium hover:bg-[#d8883c] transition-colors"
          >
            Logout
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-lg bg-[#EDA35A] text-white font-medium hover:bg-[#d8883c] transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-4 py-2 rounded-lg border border-[#EDA35A] text-[#EDA35A] font-medium hover:bg-[#FEE8D9] transition-colors"
            >
              Signup
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu (conditionally rendered) */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#E1E9C9] shadow-lg flex flex-col items-center py-4 md:hidden z-50">
          <div className="flex flex-col gap-4 w-full text-center">
            {user ? (
              <NavLink
                to="/phome"
                className={({ isActive }) => linkClasses(isActive) + " py-2"}
                onClick={toggleMobileMenu}
              >
                Home
              </NavLink>
            ) : (
              <NavLink
                to="/"
                className={({ isActive }) => linkClasses(isActive) + " py-2"}
                onClick={toggleMobileMenu}
              >
                Home
              </NavLink>
            )}
            <NavLink
              to="/pets"
              className={({ isActive }) => linkClasses(isActive) + " py-2"}
              onClick={toggleMobileMenu}
            >
              My Pets
            </NavLink>
            <NavLink
              to="/add-pet"
              className={({ isActive }) => linkClasses(isActive) + " py-2"}
              onClick={toggleMobileMenu}
            >
              Add Pet
            </NavLink>
            <NavLink
              to="/cal"
              className={({ isActive }) => linkClasses(isActive) + " py-2"}
              onClick={toggleMobileMenu}
            >
              Calendar
            </NavLink>
          </div>
          <div className="flex flex-col gap-4 mt-4 w-full items-center">
            {user ? (
              <button
                onClick={() => { logout(); toggleMobileMenu(); }}
                className="w-3/4 px-4 py-2 rounded-lg bg-[#EDA35A] text-white font-medium hover:bg-[#d8883c] transition-colors"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => { navigate("/login"); toggleMobileMenu(); }}
                  className="w-3/4 px-4 py-2 rounded-lg bg-[#EDA35A] text-white font-medium hover:bg-[#d8883c] transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => { navigate("/register"); toggleMobileMenu(); }}
                  className="w-3/4 px-4 py-2 rounded-lg border border-[#EDA35A] text-[#EDA35A] font-medium hover:bg-[#FEE8D9] transition-colors"
                >
                  Signup
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;