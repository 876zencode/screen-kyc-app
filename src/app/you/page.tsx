'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Drawer } from '../components/Drawer';

export default function Home() {
  const [scale, setScale] = useState(1);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
      <motion.div
        style={{ scale }}
        className="absolute inset-0  z-0 transition-transform"
      >
        <h1 className="text-white text-4xl p-8">Digital You</h1>
      </motion.div>

      <Drawer onProgressChange={(progress) => setScale(1 - 0.1 * (1 - progress))}>
        <div className="p-4">Drawer Content</div>
      </Drawer>
    </div>
  );
}
