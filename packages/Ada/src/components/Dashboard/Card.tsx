'use client';

import { Card as MuiCard, CardContent, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import type React from 'react'; // Added import for React

interface CardProps {
  title: string;
  number: number;
  description: string;
  icon: React.ReactNode;
}

export default function Card({ title, number, description, icon }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <MuiCard
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          },
        }}
      >
        <CardContent
          sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h5" component="div" fontWeight="bold">
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {number}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {description}
          </Typography>
          <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'center' }}>
            <div className="text-xl">{icon}</div>
          </Box>
        </CardContent>
      </MuiCard>
    </motion.div>
  );
}
