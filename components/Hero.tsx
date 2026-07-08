import React from "react";
import { Spotlight } from "./ui/spotlight-new";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import ButtonsCard from "./ui/tailwindcss-buttons";
import { Send } from "lucide-react";

const Hero = () => {
  return (
    <div className="pb-30 pt-20 sm:pt-26 md:pt-46  ">
      <div className="overflow-hidden mx-auto text-center">
        <Spotlight />
        <div className="p-4 max-w-6xl mx-auto relative z-10 w-full pt-20 md:pt-0">
          <p className="uppercase tracking-[0.2em] text md:tracking-[0.25em] text-xs sm:text-xl md:text-lg text-center mx-auto text-gray-400 max-w-fit mb-4">
            Dynamic Web Magic with Next.js
          </p>
          <TextGenerateEffect
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center bg-clip-text text-transparent `bg-gradient-to-b` from-neutral-50 to-neutral-400 bg-opacity-50"
            words="Transforming Concepts into Seamless User Experiences"
          />
          <p className="mt-4 font-normal text-xs sm:text-xl md:text-lg lg:text-2xl text-blue-100 max-w-fit text-center mx-auto">
            Hi! I&apos;m Maher, a Next.js Developer based in Egypt.
          </p>

          <a href="#about">
            <ButtonsCard
              title="see my work"
              icon={<Send size={18} />}
              position="right"
            />
          </a>
        </div>
      </div>

      {/* Grid background */}
      <div className="h-screen w-full absolute top-0 left-0 flex items-center justify-center pointer-events-none">
        {/* Grid lines - horizontal and vertical */}
        <div
          className="absolute inset-0"
          style={{
            backgroundSize: "100px 100px",
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
          }}
        />
        {/* Radial fade - center stays visible, edges fade */}
        <div
          className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black-100"
          style={{
            background:
              "radial-gradient(circle at center, rgba(2, 0, 15, 0) 0%, rgba(2, 0, 15, 0.3) 40%, rgba(2, 0, 15, 1) 100%)",
          }}
        />
      </div>
    </div>
  );
};

export default Hero;
