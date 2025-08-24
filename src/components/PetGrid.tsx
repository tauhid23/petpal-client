import React from 'react';


import pet1 from '../assets/pets/pet1.jpg';
import pet2 from '../assets/pets/pet2.jpg';
import pet3 from '../assets/pets/pet3.jpg';
import pet4 from '../assets/pets/pet4.jpg';
import pet5 from '../assets/pets/pet5.jpg';
import pet6 from '../assets/pets/pet6.jpg';
import pet7 from '../assets/pets/pet7.jpg';
import pet8 from '../assets/pets/pet8.jpg';

const PetGrid: React.FC = () => {
  const images = [pet1, pet2, pet3, pet4, pet5, pet6, pet7, pet8];

  const gridItems = [
    { id: 1, colSpan: 2, rowSpan: 2, content: <img src={images[0]} alt="Pet 1" className="w-full h-full object-cover rounded-xl" /> },
    { id: 2, colSpan: 2, rowSpan: 3, colStart: 3, content: <img src={images[1]} alt="Pet 2" className="w-full h-full object-cover rounded-xl" /> },
    { id: 3, colSpan: 2, rowSpan: 4, colStart: 5, content: <img src={images[2]} alt="Pet 3" className="w-full h-full object-cover rounded-xl" /> },
    { id: 4, colSpan: 2, rowSpan: 4, colStart: 3, rowStart: 4, content: <img src={images[3]} alt="Pet 4" className="w-full h-full object-cover rounded-xl" /> },
    { id: 5, colSpan: 2, rowSpan: 2, colStart: 5, rowStart: 6, content: <img src={images[4]} alt="Pet 5" className="w-full h-full object-cover rounded-xl" /> },
    { id: 6, colSpan: 2, rowSpan: 4, colStart: 1, rowStart: 4, content: <img src={images[5]} alt="Pet 6" className="w-full h-full object-cover rounded-xl" /> },
    { id: 7, colSpan: 2, rowSpan: 3, colStart: 7, rowStart: 1, content: <img src={images[6]} alt="Pet 7" className="w-full h-full object-cover rounded-xl" /> },
    { id: 8, colSpan: 2, rowSpan: 4, colStart: 7, rowStart: 4, content: <img src={images[7]} alt="Pet 8" className="w-full h-full object-cover rounded-xl" /> },
    { id: 9, colSpan: 2, colStart: 1, rowStart: 3, content: <div className="flex items-center justify-center bg-amber-700 text-white rounded-xl h-full text-center px-2">Find Your Perfect Companion</div> },
    { id: 10, colSpan: 2, colStart: 5, rowStart: 5, content: <div className="flex items-center justify-center bg-purple-500 text-white rounded-xl h-full text-center px-2">Adopt, Love, Care</div> },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-8 grid-rows-7 gap-4 h-[600px]">
        {gridItems.map(item => (
          <div
            key={item.id}
            className={`rounded-xl overflow-hidden relative col-span-${item.colSpan} ${item.rowSpan ? `row-span-${item.rowSpan}` : ''} ${item.colStart ? `col-start-${item.colStart}` : ''} ${item.rowStart ? `row-start-${item.rowStart}` : ''}`}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PetGrid;
