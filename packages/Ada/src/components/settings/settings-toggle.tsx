'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface SettingsToggleProps {
  title: string;
  description: string;
  defaultChecked?: boolean;
  disabled?: boolean;
}

export function SettingsToggle({
  title,
  description,
  defaultChecked = false,
  disabled = false,
}: SettingsToggleProps) {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  return (
    <div
      className={cn(
        'flex items-center justify-between p-2 rounded-md transition-colors',
        isChecked ? 'bg-purple-800/20' : 'hover:bg-purple-800/10',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <div className="space-y-0.5">
        <p className="font-medium text-purple-300">{title}</p>
        <p className="text-sm text-purple-300/70">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        disabled={disabled}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2',
          isChecked ? 'bg-purple-600' : 'bg-purple-800/50',
          disabled && 'cursor-not-allowed'
        )}
        onClick={() => !disabled && setIsChecked(!isChecked)}
      >
        <motion.span
          layout
          className="pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg"
          animate={{
            x: isChecked ? 20 : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
        />
      </button>
    </div>
  );
}
