import React from "react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.25 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 14 } },
};

const floating = {
  animate: { y: [0, -10, 0], transition: { duration: 5, repeat: Infinity, ease: "easeInOut" } },
};

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-[#FEE8D9] flex items-center justify-center overflow-hidden shadow-amber-200">
      {/* Decorative blurred blobs */}
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-[#EDA35A]/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-[#CADCAE]/30 rounded-full blur-3xl"></div>

      {/* Pet-themed SVGs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute top-20 left-10 w-12 h-12 text-[#EDA35A] opacity-20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c1.657 0 3-1.79 3-4s-1.343-4-3-4-3 1.79-3 4 1.343 4 3 4zm-6-1c1.105 0 2-1.343 2-3s-.895-3-2-3-2 1.343-2 3 .895 3 2 3zm12 0c1.105 0 2-1.343 2-3s-.895-3-2-3-2 1.343-2 3 .895 3 2 3zm-6 2c-2.21 0-4 2.239-4 5h8c0-2.761-1.79-5-4-5z" />
        </svg>
        <svg className="absolute bottom-24 right-16 w-16 h-16 text-[#CADCAE] opacity-20 rotate-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 11.5a3.5 3.5 0 0 1-4.796 3.213A3.49 3.49 0 0 1 13 18.5a3.5 3.5 0 1 1-7 0c0-1.306.835-2.418 2.004-2.854A3.494 3.494 0 0 1 5 12.5a3.5 3.5 0 1 1 7 0c0 1.306-.835 2.418-2.004 2.854A3.494 3.494 0 0 1 11 15.5c1.657 0 3-1.343 3-3s-1.343-3-3-3c0-1.306.835-2.418 2.004-2.854A3.494 3.494 0 0 1 13 5.5a3.5 3.5 0 1 1 7 0c0 1.306-.835 2.418-2.004 2.854A3.494 3.494 0 0 1 21 11.5z" />
        </svg>
      </div>

      <section className="relative w-full max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 items-center gap-12 lg:gap-20 relative z-10">
          {/* Left Content */}
          <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-8 text-center lg:text-left">
            <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#333] leading-tight">
              Your Best Friend <br /> Deserves the Best Care
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg md:text-xl text-[#333] max-w-xl mx-auto lg:mx-0">
              Connect with{" "}
              <span className="font-semibold text-[#EDA35A]">
                trusted pet sitters
              </span>{" "}
              who treat your pets like family.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-xl bg-[#EDA35A] px-8 py-4 text-lg font-semibold text-white shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-[#EDA35A]/50"
              >
                Find a Pet Sitter
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-xl border border-[#EDA35A] px-8 py-4 text-lg font-semibold text-[#EDA35A] hover:bg-[#FEE8D9] transition duration-300"
              >
                Learn More
              </a>
            </motion.div>
          </motion.div>

          {/* Right Image Section */}
          <div className="relative w-full h-[500px] flex items-center justify-center">
            {/* Glassy backdrop */}
            <div className="absolute inset-0 bg-[#CADCAE]/50 backdrop-blur-xl rounded-3xl shadow-2xl"></div>

            {/* Center image */}
            <motion.img variants={floating} animate="animate" src="https://i.ibb.co.com/ynqFP6RM/alvan-nee-T-0-EW-SEbs-E-unsplash.jpg" alt="Cat" className="absolute w-60 h-60 md:w-80 md:h-80 object-cover rounded-2xl shadow-2xl z-20 hover:scale-105 hover:shadow-[#EDA35A]/40 transition duration-500" />

            {/* Left image */}
            <motion.img variants={floating} animate="animate" transition={{ delay: 1 }} src="https://i.ibb.co.com/gLvPvTNr/alan-king-KZv7w34tlu-A-unsplash.jpg" alt="Dog" className="absolute -left-6 md:-left-16 top-12 w-40 h-40 md:w-56 md:h-56 object-cover rounded-2xl shadow-xl hover:scale-105 hover:shadow-[#EDA35A]/40 transition duration-500" />

            {/* Right image */}
            <motion.img variants={floating} animate="animate" transition={{ delay: 2 }} src="https://i.ibb.co.com/dZ8Ms8V/alvan-nee-ZCHj-2l-JP00-unsplash.jpg" alt="Rabbit" className="absolute -right-6 md:-right-16 bottom-12 w-36 h-36 md:w-52 md:h-52 object-cover rounded-2xl shadow-xl hover:scale-105 hover:shadow-[#EDA35A]/40 transition duration-500" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
