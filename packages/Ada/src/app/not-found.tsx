'use client';

import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex items-center justify-center px-4">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
          }}
        >
          <AlertCircle className="text-black w-24 h-24 mx-auto mb-6" />
        </motion.div>
        <motion.h1
          className="text-6xl font-bold text-black mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          404
        </motion.h1>
        <motion.p
          className="text-xl text-gray-700 mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Oops! The page you're looking for doesn't exist.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            href="/dashboard"
            className="bg-green-800 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
          >
            Go Home
          </Link>
        </motion.div>
      </div>
      <motion.div
        className="absolute bottom-10 left-10"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: 'reverse',
        }}
      >
        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
      </motion.div>
      <motion.div
        className="absolute top-10 right-10"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: 'reverse',
        }}
      >
        <div className="w-20 h-20 bg-green-900 rounded-full opacity-20"></div>
      </motion.div>
    </div>
  );
}
