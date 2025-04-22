'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: ReactNode;
  delay?: number;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: delay * 0.1,
      }}
    >
      <Card className="bg-card/50 backdrop-blur-sm  glow-effect">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium ">{title}</CardTitle>
          <div className="h-4 w-4 ">{icon}</div>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 100,
              damping: 10,
              delay: 0.1 + delay * 0.1,
            }}
            className="text-2xl font-bold "
          >
            {value}
          </motion.div>
          <CardDescription className="text-xs mt-1 /70">
            {description}
          </CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
}
