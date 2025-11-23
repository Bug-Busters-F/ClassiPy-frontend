import React, { type ReactNode } from 'react';

interface GradientTextProps {
  children: ReactNode;
  className?: string;
}

const GradientText: React.FC<GradientTextProps> = ({ children, className }) => {
  return (
    <span
      className={`
        bg-gradient-to-r 
      from-blue-600 
      via-blue-600 
      to-purple-600 
        bg-[linear-gradient(to_right,theme(colors.blue.600) 0%,theme(colors.blue.600) 70%,theme(colors.purple.600) 100%)]
        bg-clip-text text-transparent
        ${className || ''}
      `}
    >
      {children}
    </span>
  );
};

export default GradientText;