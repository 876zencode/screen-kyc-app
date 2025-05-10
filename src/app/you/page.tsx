'use client';

import { useMotionValue, useTransform, motion } from 'framer-motion';
import { Drawer } from '../components/Drawer';

export default function Home() {
  const progress = useMotionValue(0);

  // Text alignment logic (unchanged)
const shiftTrigger = useTransform(progress, [0, 0.9, 1], [0, 0, 1]);
const xText = useTransform(shiftTrigger, [0, 1], ['0%', '20%']);
const alignText = useTransform(shiftTrigger, [0, 1], ['center', 'left']);

// Image transformations
const imageX = useTransform(progress, [0, 1], ['0%', '45%']); // move to right
const imageY = useTransform(progress, [0, 1], ['0%', '-80%']); // move up
// Speed up the circle transition by adjusting borderRadius earlier (65% progress)
const borderRadius = useTransform(progress, [0, 0.30, 1], ['0%', '50%', '50%']);
// Scaling down the image more quickly
const imageScale = useTransform(progress, [0, 0.3, 1], [1, 0.5, 0.2]);



  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Title */}
      <motion.div className="absolute inset-0 z-50">
        <motion.h1
          style={{ x: xText }}
          className="text-black text-4xl pt-8 px-6"
        >
          <motion.span style={{ display: 'block', textAlign: alignText }}>
            Digital You
          </motion.span>
        </motion.h1>
      </motion.div>

      {/* Transforming Image */}
      <motion.div
        style={{
          borderRadius,
          x: imageX,
          y: imageY,
          scale: imageScale,
        }}
        className="absolute left-0 top-20 w-full h-1/2 bg-white overflow-hidden z-10"
      >
        <img
          src="/image.svg"
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Drawer */}
      <Drawer onProgressChange={(p) => progress.set(p)}>
        <div className="p-4">Drawer Content</div>
      </Drawer>
    </div>
  );
}
