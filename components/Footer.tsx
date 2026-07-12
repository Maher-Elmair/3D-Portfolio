import Image from "next/image";
import { Send } from "lucide-react";

import { socialMedia } from "@/data";
import MagicButton from "./MagicButton";

const Footer = () => {
  return (
    <footer className="w-full pt-20 pb-10 relative" id="contact">
      {/* background grid */}
      <div className="w-full absolute left-0 bottom-0 min-h-96">
        {/* <img> -> <Image />, fixes no-img-element. fill used since this
        image just needs to cover its container */}
        <Image
          src="/footer-grid.svg"
          alt="grid"
          fill
          className="opacity-50 object-cover"
        />
      </div>

      <div className="flex flex-col items-center">
        <h1 className="heading lg:max-w-[45vw]">
          Ready to take <span className="text-purple">your</span> digital
          presence to the next level?
        </h1>
        <p className="text-white-200 md:mt-10 my-5 text-center">
          Reach out to me today and let&apos;s discuss how I can help you
          achieve your goals.
        </p>
        <a href="mailto:contact@jsmastery.pro">
          <MagicButton
            title="Let's get in touch"
            icon={<Send size={16} />}
            position="right"
          />
        </a>
      </div>
      {/* added gap-6: spacing between the copyright text and icons row
      when they stack vertically below the md breakpoint */}
      <div className="flex mt-16 md:flex-row flex-col justify-between items-center gap-6">
        <p className="md:text-base text-sm md:font-normal font-light">
          Copyright © 2026 Maher Elmair
        </p>

        <div className="flex items-center md:gap-3 gap-6">
          {socialMedia.map((info) => (
            <div
              key={info.id}
              className="w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 rounded-lg border border-black-300"
            >
              {/* added h-5 w-5 (20px): overrides Tailwind's default
              "height: auto" on img, which caused the aspect-ratio warning */}
              <Image
                src={info.img}
                alt="icons"
                width={20}
                height={20}
                className="h-5 w-5"
              />
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
