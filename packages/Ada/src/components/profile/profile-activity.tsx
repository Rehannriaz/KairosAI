'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  Briefcase,
  CheckCircle,
  FileText,
  MessageSquare,
  Star,
} from 'lucide-react';

export function ProfileActivity() {
  const activities = [
    {
      icon: <Briefcase className="h-5 w-5" />,
      title: 'Applied to Frontend Developer at TechCorp',
      time: '2 days ago',
      color: 'text-purple-400',
      delay: 0,
    },
    {
      icon: <CheckCircle className="h-5 w-5" />,
      title: 'Completed skill assessment for JavaScript',
      time: '3 days ago',
      color: 'text-green-400',
      delay: 0.1,
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: 'Updated resume with new experience',
      time: '1 week ago',
      color: 'text-blue-400',
      delay: 0.2,
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      title: 'Received interview invitation from DesignHub',
      time: '1 week ago',
      color: 'text-yellow-400',
      delay: 0.3,
    },
    {
      icon: <Star className="h-5 w-5" />,
      title: 'Saved UX Designer job at CreativeLabs',
      time: '2 weeks ago',
      color: 'text-orange-400',
      delay: 0.4,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: 0.5,
      }}
    >
      <Card className="bg-card/50 backdrop-blur-sm border-purple-800/30 glow-effect">
        <CardHeader>
          <CardTitle className="text-lg text-purple-300">
            Recent Activity
          </CardTitle>
          <CardDescription className="text-purple-300/70">
            Your latest actions and updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                type: 'spring',
                stiffness: 100,
                damping: 15,
                delay: 0.6 + activity.delay,
              }}
              className="flex items-start gap-3 pb-4 border-b border-purple-800/20 last:border-0 last:pb-0"
            >
              <div className={`mt-0.5 ${activity.color}`}>{activity.icon}</div>
              <div className="space-y-1">
                <p className="text-sm text-purple-200">{activity.title}</p>
                <p className="text-xs text-purple-300/70">{activity.time}</p>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
