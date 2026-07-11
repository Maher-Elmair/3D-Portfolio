"use client";

import React, { useState } from "react";
import Image from "next/image";

import { workExperience } from "@/data";
import { Button } from "./ui/moving-border";

// Extracted each card into its own component so useState can be called
// per card (hooks can't be called inside a .map() loop)
const ExperienceCard = ({ card }: { card: (typeof workExperience)[number] }) => {
  // useState lazy initializer: Math.random runs once on mount only,
  // fixing the react-hooks/purity error
  const [duration] = useState(() => Math.floor(Math.random() * 10000) + 10000);

  return (
    <Button
      duration={duration}
      borderRadius="1.75rem"
      style={{
        //   add these two
        //   you can generate the color from here https://cssgradient.io/
        background: "rgb(4,7,29)",
        backgroundColor:
          "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
        // add this border radius to make it more rounded so that the moving border is more realistic
        borderRadius: `calc(1.75rem* 0.96)`,
      }}
      // remove bg-white dark:bg-slate-900
      className="flex-1 text-black dark:text-white border-neutral-200 dark:border-slate-800"
    >
      <div className="flex lg:flex-row flex-col lg:items-center p-3 py-6 md:p-5 lg:p-10 gap-2">
        {/* <img> -> <Image />, fixes no-img-element. Added width/height
        (required by Image) + h-auto so height scales with the width
        classes below. alt fixed to use the title instead of the thumbnail path */}
        <Image
          src={card.thumbnail}
          alt={card.title}
          width={128}
          height={128}
          className="lg:w-32 md:w-20 w-16 h-auto"
        />
        <div className="lg:ms-5">
          <h1 className="text-start text-xl md:text-2xl font-bold">
            {card.title}
          </h1>
          <p className="text-start text-white-100 mt-3 font-semibold">
            {card.desc}
          </p>
        </div>
      </div>
    </Button>
  );
};

const Experience = () => {
  return (
    <div className="py-20 w-full">
      <h1 className="heading">
        My <span className="text-purple">work experience</span>
      </h1>

      <div className="w-full mt-12 grid lg:grid-cols-4 grid-cols-1 gap-10">
        {workExperience.map((card) => (
          <ExperienceCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
};

export default Experience;