'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';

interface DrawerProps {
  height?: number;
  onProgressChange?: (progress: number) => void;
  children: React.ReactNode;
}

export function Drawer({ height = 750, onProgressChange, children }: DrawerProps) {
  const constraintsRef = useRef(null);

  return (
    <div ref={constraintsRef} className="fixed inset-0 z-50 touch-none">
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: height }}
        dragElastic={0.2}
        onDrag={(event, info) => {
          const progress = Math.min(1, Math.max(0, info.point.y / height));
          onProgressChange?.(progress);
        }}
        initial={{ y: height / 2 }}
        className="absolute left-0 right-0 bottom-0 bg-white rounded-t-2xl shadow-xl"
        style={{ height }}
      >
        {/* Top-left extension with a diagonal cut on the right */}
        <div
          className="absolute -top-10 -left-4 w-88 h-24 bg-white"
          style={{
            clipPath: 'polygon(0% 0%, 60% 0%, 100% 100%, 0% 100%)',
            borderTopLeftRadius: '1rem',
          }}
        />

        {/* Drag handle */}
        <div className="h-2 w-10 bg-gray-300 rounded-full mx-auto my-2" />

        {children}
      </motion.div>
    </div>
  );
}
