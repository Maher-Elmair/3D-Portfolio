"use client";

import React from "react";
import Image from "next/image";

import { companies, testimonials } from "@/data";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

const Clients = () => {
  return (
    <section id="testimonials" className="py-20">
      <h1 className="heading">
        Kind words from
        <span className="text-purple"> satisfied clients</span>
      </h1>

      <div className="flex flex-col items-center max-lg:mt-10">
        <div
          // Changed md:h-[30rem] to md:h-120. Reason: Tailwind intellisense
          // flagged the old arbitrary-value syntax as non-canonical, since
          // 30rem maps to Tailwind's h-120 scale value
          // Changed h-[50vh] to h-auto. Reason: Tailwind intellisense flagged
          className="h-auto md:h-120 rounded-md flex flex-col antialiased  items-center justify-center relative overflow-hidden"
        >
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-16 max-lg:mt-10">
          {companies.map((company) => (
            <React.Fragment key={company.id}>
              <div className="flex md:max-w-60 max-w-32 gap-2">
                {/* Changed <img> to <Image /> using "fill" mode wrapped in
                a relative container instead of passing width/height props
                directly. Reason: setting width/height props and then
                resizing via Tailwind (even with h-auto) still triggered
                the "width or height modified, but not the other" warning,
                because next/image compares the rendered size against the
                original width/height attributes. "fill" mode does not set
                those attributes at all, so the comparison never happens.
                aspect-square keeps the container 1:1, matching the logo's
                square shape */}
                <div className="relative md:w-10 w-5 aspect-square">
                  <Image
                    src={company.img}
                    alt={company.name}
                    fill
                    className="object-contain"
                  />
                </div>
                {/* Changed <img> to <Image /> in "fill" mode, same reason
                as above. The aspectRatio style is set per company since
                the name logos are not all the same width-to-height ratio
                (100/40 for ids 4 and 5, 150/40 for the rest) */}
                <div
                  className="relative md:w-24 w-20"
                  style={{
                    aspectRatio:
                      company.id === 4 || company.id === 5
                        ? "100 / 40"
                        : "150 / 40",
                  }}
                >
                  <Image
                    src={company.nameImg}
                    alt={company.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Clients;
