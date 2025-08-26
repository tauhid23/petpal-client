import React, { useState, useEffect } from "react";

import pet1 from '../assets/pets/pet1.jpg'
import pet2 from '../assets/pets/pet2.jpg'
import pet3 from '../assets/pets/pet3.jpg'
import pet4 from '../assets/pets/pet4.jpg'
import pet5 from '../assets/pets/pet5.jpg'
import pet6 from '../assets/pets/pet6.jpg'
import pet7 from '../assets/pets/pet7.jpg'
import pet8 from '../assets/pets/pet8.jpg'
import pet9 from '../assets/pets/pet9.jpg'
import pet10 from '../assets/pets/pet10.jpg'

const allImages = [
  pet1, pet2,pet3,pet4,pet5,pet6,pet7,pet8,pet9,pet10
];


interface PetImage {
  src: string;
  id: number;
}

const PetGrid: React.FC = () => {
  // Initialize images in their positions
  const [images, setImages] = useState<PetImage[]>(
    allImages.slice(0, 7).map((img, index) => ({ src: img, id: index }))
  );

  // Randomly change 2-3 images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setImages(prev => {
        const newImages = [...prev];
        const positions = Array.from({ length: newImages.length }, (_, i) => i).sort(() => Math.random() - 0.5);
        const toChange = positions.slice(0, Math.floor(Math.random() * 2) + 2); // 2 or 3 images

        toChange.forEach(pos => {
          const available = allImages.filter(img => !newImages.map(item => item.src).includes(img));
          if (available.length > 0) {
            const newImageSrc = available[Math.floor(Math.random() * available.length)];
            newImages[pos] = { src: newImageSrc, id: Date.now() + pos };
          }
        });

        return newImages;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Completely new grid layout definition
  // This layout uses a more asymmetrical design with varying aspect ratios.
  const gridItems = [
    // Large centerpiece image
    { colSpan: 4, rowSpan: 5, colStart: 3, rowStart: 1, content: <img src={images[0].src} key={images[0].id} alt="Pet 1" className="w-full h-full object-cover rounded-xl animate-fade-in" /> },

    // Left column
    { colSpan: 2, rowSpan: 3, colStart: 1, rowStart: 1, content: <img src={images[1].src} key={images[1].id} alt="Pet 2" className="w-full h-full object-cover rounded-xl animate-fade-in" /> },
    { colSpan: 2, rowSpan: 2, colStart: 1, rowStart: 4, content: <div className="flex items-center justify-center bg-amber-700 text-white rounded-xl h-full text-center px-2 font-semibold text-lg animate-pulse-subtle">Find Your Perfect Companion</div> },

    // Right column
    { colSpan: 2, rowSpan: 2, colStart: 7, rowStart: 1, content: <div className="flex items-center justify-center bg-purple-500 text-white rounded-xl h-full text-center px-2 font-semibold text-lg animate-pulse-subtle">Adopt, Love, Care</div> },
    { colSpan: 2, rowSpan: 3, colStart: 7, rowStart: 3, content: <img src={images[2].src} key={images[2].id} alt="Pet 3" className="w-full h-full object-cover rounded-xl animate-fade-in" /> },

    // Bottom row
    { colSpan: 2, rowSpan: 2, colStart: 1, rowStart: 6, content: <img src={images[3].src} key={images[3].id} alt="Pet 4" className="w-full h-full object-cover rounded-xl animate-fade-in" /> },
    { colSpan: 2, rowSpan: 2, colStart: 3, rowStart: 6, content: <img src={images[4].src} key={images[4].id} alt="Pet 5" className="w-full h-full object-cover rounded-xl animate-fade-in" /> },
    { colSpan: 2, rowSpan: 2, colStart: 5, rowStart: 6, content: <img src={images[5].src} key={images[5].id} alt="Pet 6" className="w-full h-full object-cover rounded-xl animate-fade-in" /> },
    { colSpan: 2, rowSpan: 2, colStart: 7, rowStart: 6, content: <img src={images[6].src} key={images[6].id} alt="Pet 7" className="w-full h-full object-cover rounded-xl animate-fade-in" /> },
  ];

  const colSpanClasses: Record<number, string> = {
    1: "col-span-1",
    2: "col-span-2",
    3: "col-span-3",
    4: "col-span-4",
    5: "col-span-5",
    6: "col-span-6",
    7: "col-span-7",
    8: "col-span-8",
  };
  
  const rowSpanClasses: Record<number, string> = {
    1: "row-span-1",
    2: "row-span-2",
    3: "row-span-3",
    4: "row-span-4",
    5: "row-span-5",
    6: "row-span-6",
    7: "row-span-7",
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulseSubtle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-pulse-subtle {
          animation: pulseSubtle 4s ease-in-out infinite;
        }
        `}
      </style>
      <div className="grid grid-cols-8 grid-rows-7 gap-4 h-[600px]">
        {gridItems.map((item) => {
          const colSpan = colSpanClasses[item.colSpan];
          const rowSpan = item.rowSpan ? rowSpanClasses[item.rowSpan] : "";
          const colStart = item.colStart ? `col-start-${item.colStart}` : "";
          const rowStart = item.rowStart ? `row-start-${item.rowStart}` : "";

          return (
            <div
              key={item.content.props.key}
              className={`rounded-xl overflow-hidden relative ${colSpan} ${rowSpan} ${colStart} ${rowStart}`}
            >
              {item.content}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PetGrid;
