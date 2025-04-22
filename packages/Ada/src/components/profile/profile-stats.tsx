'use client';

import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Briefcase, CheckCircle, Clock, Star } from 'lucide-react';

export function ProfileStats() {
  const stats = [
    {
      icon: <Briefcase className="h-5 w-5" />,
      value: '124',
      label: 'Applications',
      color: 'bg-purple-800/30',
      iconColor: 'text-purple-400',
      delay: 0,
    },
    {
      icon: <CheckCircle className="h-5 w-5" />,
      value: '18',
      label: 'Interviews',
      color: 'bg-purple-800/30',
      iconColor: 'text-purple-400',
      delay: 0.1,
    },
    {
      icon: <Clock className="h-5 w-5" />,
      value: '45',
      label: 'Days Active',
      color: 'bg-purple-800/30',
      iconColor: 'text-purple-400',
      delay: 0.2,
    },
    {
      icon: <Star className="h-5 w-5" />,
      value: '92%',
      label: 'Profile Score',
      color: 'bg-purple-800/30',
      iconColor: 'text-purple-400',
      delay: 0.3,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 15,
            delay: stat.delay,
          }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-purple-800/30 glow-effect">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div
                className={`p-2 rounded-full ${stat.color} ${stat.iconColor} mb-2`}
              >
                {stat.icon}
              </div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 100,
                  damping: 10,
                  delay: 0.1 + stat.delay,
                }}
                className="text-2xl font-bold text-purple-200"
              >
                {stat.value}
              </motion.div>
              <p className="text-xs text-purple-300/70">{stat.label}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
