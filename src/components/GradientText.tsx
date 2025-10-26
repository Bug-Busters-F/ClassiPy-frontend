import React, { type ReactNode } from 'react';

interface GradientTextProps {
  children: ReactNode;
  className?: string;
}

const GradientText: React.FC<GradientTextProps> = ({ children, className }) => {
  return (
    <span
      className={`
        bg-gradient-to-r from-blue-600 to-purple-600 
        bg-clip-text text-transparent
        ${className || ''}
      `}
    >
      {children}
    </span>
  );
};

export default GradientText;