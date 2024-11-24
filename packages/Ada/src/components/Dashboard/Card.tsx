import React, { ReactNode } from 'react';

interface CardProps {
  title: string;
  number: number;
  text: string;
  icon: ReactNode; // Use ReactNode for the icon prop
}

const Card: React.FC<CardProps> = ({ title, number, text, icon }) => {
  return (
    <div className="card bg-white shadow-sm rounded-sm p-8">
      <div className="flex flex-row flex-1 items-center align-middle justify-between gap-x-10">
        <div className="flex flex-col">
          <h3 className="text-lg text-gray-500">{title}</h3>
          <p className="text-xl font-semibold">{number}</p>
          <p className="text-gray-600">{text}</p>
        </div>
        <div className="text-xl">{icon}</div>
      </div>
    </div>
  );
};

export default Card;
