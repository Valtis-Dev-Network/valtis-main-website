"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState } from "react";
import { ValtisMark } from "@/components/site/valtis-logo";

const cubes = [
  [2, 0, 1],
  [5, 0, 1],
  [2, 1, 1],
  [3, 1, 2],
  [4, 1, 2],
  [5, 1, 1],
  [3, 2, 2],
  [4, 2, 3],
  [5, 2, 2],
  [4, 3, 3],
  [1, 3, 1],
  [6, 3, 1],
  [2, 4, 1],
  [5, 4, 1]
];

export function VoxelHero() {
  const [active, setActive] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 90, damping: 24 });
  const smoothY = useSpring(mouseY, { stiffness: 90, damping: 24 });
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-7, 7]);

  return (
    <motion.div
      className="glass relative min-h-[410px] overflow-hidden rounded-lg p-6"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => {
        setActive(false);
        mouseX.set(0);
        mouseY.set(0);
      }}
    >
      <div className="absolute inset-0 grid-mask opacity-70" />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-r from-transparent via-cyan/15 to-transparent"
        animate={{ x: ["-50%", "50%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 grid-cols-8 gap-3"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={{ y: active ? -8 : [0, -10, 0] }}
        transition={{ duration: 7, repeat: active ? 0 : Infinity, ease: "easeInOut" }}
      >
        {cubes.map(([x, y, z], index) => (
          <motion.div
            key={`${x}-${y}-${index}`}
            className="h-12 w-12 rounded-[6px] border border-white/10 bg-gradient-to-br from-cyan via-primary to-indigo shadow-[0_0_34px_rgba(56,130,246,.34)]"
            style={{ gridColumn: x, gridRow: y + 1, transform: `translateZ(${z * 18}px)` }}
            initial={{ opacity: 0, y: 16, scale: 0.72 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.055, duration: 0.45, ease: "easeOut" }}
          />
        ))}
      </motion.div>
      <div className="absolute left-6 top-6 opacity-85">
        <ValtisMark size="lg" animated />
      </div>
      <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-md border border-white/10 bg-background/65 px-4 py-3 text-xs text-muted backdrop-blur">
        <span>Live network index</span>
        <span className="text-cyan">projects + creators + resources</span>
      </div>
    </motion.div>
  );
}
