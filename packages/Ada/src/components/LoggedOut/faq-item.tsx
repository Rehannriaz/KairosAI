'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
}

export function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-purple-500/20 rounded-lg overflow-hidden backdrop-blur-sm">
      <button
        className="flex justify-between items-center w-full p-4 text-left bg-purple-900/20 hover:bg-purple-900/30 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-semibold text-white">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-purple-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-purple-400" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 bg-purple-900/10">
          <p className="text-gray-300">{answer}</p>
        </div>
      )}
    </div>
  );
}
