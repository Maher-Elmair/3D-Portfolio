"use client";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export const BackgroundGradientAnimation = ({
  gradientBackgroundStart = "rgb(108, 0, 162)",
  gradientBackgroundEnd = "rgb(0, 17, 82)",
  firstColor = "18, 113, 255",
  secondColor = "221, 74, 255",
  thirdColor = "100, 220, 255",
  fourthColor = "200, 50, 50",
  fifthColor = "180, 180, 50",
  pointerColor = "140, 100, 255",
  size = "80%",
  blendingValue = "hard-light",
  children,
  className,
  interactive = true,
  containerClassName,
}: {
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  firstColor?: string;
  secondColor?: string;
  thirdColor?: string;
  fourthColor?: string;
  fifthColor?: string;
  pointerColor?: string;
  size?: string;
  blendingValue?: string;
  children?: React.ReactNode;
  className?: string;
  interactive?: boolean;
  containerClassName?: string;
}) => {
  const interactiveRef = useRef<HTMLDivElement>(null);

  // Current and target position of the mouse-following blob
  const [curX, setCurX] = useState(0);
  const [curY, setCurY] = useState(0);
  const [tgX, setTgX] = useState(0);
  const [tgY, setTgY] = useState(0);

  // Push all color/size props onto the <body> as CSS custom properties,
  // so the Tailwind classes below (var(--first-color) etc.) can read them.
  useEffect(() => {
    document.body.style.setProperty(
      "--gradient-background-start",
      gradientBackgroundStart,
    );
    document.body.style.setProperty(
      "--gradient-background-end",
      gradientBackgroundEnd,
    );
    document.body.style.setProperty("--first-color", firstColor);
    document.body.style.setProperty("--second-color", secondColor);
    document.body.style.setProperty("--third-color", thirdColor);
    document.body.style.setProperty("--fourth-color", fourthColor);
    document.body.style.setProperty("--fifth-color", fifthColor);
    document.body.style.setProperty("--pointer-color", pointerColor);
    document.body.style.setProperty("--size", size);
    document.body.style.setProperty("--blending-value", blendingValue);
  }, [
    gradientBackgroundStart,
    gradientBackgroundEnd,
    firstColor,
    secondColor,
    thirdColor,
    fourthColor,
    fifthColor,
    pointerColor,
    size,
    blendingValue,
  ]);
  // Smoothly ease the interactive blob toward the mouse position.
  // Functional updates avoid needing curX/curY in the dependency array —
  // each update reads the latest value instead of a stale closure.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setCurX((c) => c + (tgX - c) / 20);
      setCurY((c) => c + (tgY - c) / 20);
    });
    return () => cancelAnimationFrame(frame);
  }, [tgX, tgY]);

  // Keep the blob's transform in sync with the eased position above.
  useEffect(() => {
    if (!interactiveRef.current) {
      return;
    }
    interactiveRef.current.style.transform = `translate(${Math.round(
      curX,
    )}px, ${Math.round(curY)}px)`;
  }, [curX, curY]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (interactiveRef.current) {
      const rect = interactiveRef.current.getBoundingClientRect();
      setTgX(event.clientX - rect.left);
      setTgY(event.clientY - rect.top);
    }
  };

  // Safari doesn't support the SVG goo filter well, so it gets a plain blur
  // instead. This is applied by mutating the DOM node directly through a ref
  // (not React state), since it's a one-time browser check with no need to
  // re-render — this keeps the effect a pure "sync with an external system"
  // with no setState call inside it.
  const gradientsContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
      gradientsContainerRef.current?.classList.remove(
        "filter-[url(#blurMe)_blur(40px)]",
      );
      gradientsContainerRef.current?.classList.add("blur-2xl");
    }
  }, []);

  return (
    <div
      className={cn(
        "w-full h-full absolute overflow-hidden top-0 left-0 bg-[linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))]",
        containerClassName,
      )}
    >
      {/* Hidden SVG filter that creates the "goo" blob-merging effect */}
      <svg className="hidden">
        <defs>
          <filter id="blurMe">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* Content passed by the parent renders on top of the animated background */}
      <div className={cn("", className)}>{children}</div>

      <div
        ref={gradientsContainerRef}
        className={cn(
          "gradients-container h-full w-full blur-lg",
          // Default to the goo filter — swapped for blur-2xl on Safari
          // by the effect above (see gradientsContainerRef).
          "filter-[url(#blurMe)_blur(40px)]",
        )}
      >
        {/* Blob 1 — slow vertical drift (see animate-first in globals.css) */}
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,var(--first-color)_0,var(--first-color)_50%)_no-repeat]`,
            `[mix-blend-mode:var(--blending-value)] w-(--size) h-(--size) top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`,
            `origin-[center_center]`,
            `animate-first`,
            `opacity-100`,
          )}
        ></div>

        {/* Blob 2 — reverse circular motion */}
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,rgba(var(--second-color),0.8)_0,rgba(var(--second-color),0)_50%)_no-repeat]`,
            `[mix-blend-mode:var(--blending-value)] w-(--size) h-(--size) top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`,
            `origin-[calc(50%-400px)]`,
            `animate-second`,
            `opacity-100`,
          )}
        ></div>

        {/* Blob 3 — slow circular motion */}
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,rgba(var(--third-color),0.8)_0,rgba(var(--third-color),0)_50%)_no-repeat]`,
            `[mix-blend-mode:var(--blending-value)] w-(--size) h-(--size) top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`,
            `origin-[calc(50%+400px)]`,
            `animate-third`,
            `opacity-100`,
          )}
        ></div>

        {/* Blob 4 — horizontal drift, slightly dimmer */}
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,rgba(var(--fourth-color),0.8)_0,rgba(var(--fourth-color),0)_50%)_no-repeat]`,
            `[mix-blend-mode:var(--blending-value)] w-(--size) h-(--size) top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`,
            `origin-[calc(50%-200px)]`,
            `animate-fourth`,
            `opacity-70`,
          )}
        ></div>

        {/* Blob 5 — circular motion from an off-center origin */}
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,rgba(var(--fifth-color),0.8)_0,rgba(var(--fifth-color),0)_50%)_no-repeat]`,
            `[mix-blend-mode:var(--blending-value)] w-(--size) h-(--size) top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`,
            `origin-[calc(50%-800px)_calc(50%+800px)]`,
            `animate-fifth`,
            `opacity-100`,
          )}
        ></div>

        {/* Interactive blob that follows the mouse (only if interactive=true) */}
        {interactive && (
          <div
            ref={interactiveRef}
            onMouseMove={handleMouseMove}
            className={cn(
              `absolute [background:radial-gradient(circle_at_center,rgba(var(--pointer-color),0.8)_0,rgba(var(--pointer-color),0)_50%)_no-repeat]`,
              `[mix-blend-mode:var(--blending-value)] w-full h-full -top-1/2 -left-1/2`,
              `opacity-70`,
            )}
          ></div>
        )}
      </div>
    </div>
  );
};
