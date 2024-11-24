import React, { ReactElement } from 'react';
import Link from 'next/link';

interface LogoPageProps {
  title: string;
  llink: string;
  iconn?: ReactElement; // ReactElement to type the icon component
  active?: boolean;
}

const LogoPage: React.FC<LogoPageProps> = ({
  title,
  llink,
  iconn,
  active = false,
}) => {
  return (
    <div
      className={`pl-6 mr-2 mb-2 py-3 ${
        active ? `bg-[#222222] text-white` : 'bg-white'
      } rounded-r-md hover:bg-[#222222] hover:text-white transition duration-100 ease-in`}
    >
      <Link href={llink}>
        <div className="flex flex-1 justify-start gap-8">
          {iconn && React.cloneElement(iconn, { className: 'w-7 h-7' })}
          <p
            className={`text-base w-4/6 text-wrap ${
              title === 'Home' ? 'font-semibold' : ''
            }`}
          >
            {title}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default LogoPage;
