"use client";

import { motion } from "framer-motion";
import { ValtisMark } from "@/components/site/valtis-logo";

export function MoodboardHexHero() {
  return (
    <motion.div
      className="glass relative min-h-[440px] overflow-hidden rounded-lg"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
    >
      <img
        src="/brand/valtis-voxel-hero.png"
        alt="Glowing voxel cube structure on a dark technical grid"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-background/35 via-transparent to-background/20" />
      <div className="absolute left-8 top-8">
        <ValtisMark size="lg" animated />
      </div>
      <div className="absolute bottom-6 left-6 rounded-full border border-cyan/25 bg-background/65 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan backdrop-blur">
        Build · Connect · Elevate
      </div>
    </motion.div>
  );
}
