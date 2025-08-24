import React from "react";
import Hero from "../components/Hero";
import PetGrid from "../components/PetGrid";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen w-full relative bg-[#F5F7EB]">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-[#CADCAE] opacity-50 -z-10"></div>

      {/* Hero Section */}
      <Hero />

      {/* Pets Section */}
      <section className="p-6 w-full mt-12 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#EDA35A] mb-8 text-center">
          Our Adorable Pets
        </h1>

        {/* Subheading / optional description */}
        <p className="text-gray-700 text-center max-w-2xl mb-8">
          Explore our adorable pets! Watch them change and animate dynamically every few seconds for a lively gallery experience.
        </p>

        {/* Pet Grid */}
        <div className="w-full max-w-[1200px]">
          <PetGrid />
        </div>
      </section>

      {/* Call-to-action (optional) */}
      <section className="mt-12 w-full flex justify-center">
        <button className="px-6 py-3 bg-[#EDA35A] text-white font-semibold rounded-lg shadow-lg hover:bg-[#f0a75b] transition-all duration-300">
          Explore More Pets
        </button>
      </section>
    </div>
  );
};

export default Home;
