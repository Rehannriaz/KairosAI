'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface AnimatedLayoutProps {
  children: ReactNode;
}

export function AnimatedLayout({ children }: AnimatedLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 15,
        duration: 0.2,
      }}
      className="flex-1"
    >
      {children}
    </motion.div>
  );
}
