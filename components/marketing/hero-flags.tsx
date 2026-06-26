"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

// A handful of recognisable flags for the hero (ISO alpha-2 → flagcdn).
const FLAGS = ["fr", "jp", "br", "za", "ca", "in", "de", "au", "eg", "mx", "kr", "gb"];

/** Subtly floating grid of flags — "drapeaux animés" hero (spec §10.1, §12). */
export function HeroFlags() {
  const reduce = useReducedMotion();

  return (
    <div className="grid grid-cols-4 gap-3 sm:gap-4" aria-hidden>
      {FLAGS.map((code, i) => (
        <motion.span
          key={code}
          // Visible by default; the float is purely decorative so the hero never
          // depends on an animation frame to be readable.
          className="relative block aspect-[3/2] overflow-hidden rounded-md shadow-sm ring-1 ring-border"
          animate={reduce ? undefined : { y: [0, -5, 0] }}
          transition={
            reduce
              ? undefined
              : {
                  delay: i * 0.12,
                  duration: 3.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
        >
          <Image
            src={`https://flagcdn.com/${code}.svg`}
            alt=""
            fill
            sizes="120px"
            className="object-cover"
          />
        </motion.span>
      ))}
    </div>
  );
}
