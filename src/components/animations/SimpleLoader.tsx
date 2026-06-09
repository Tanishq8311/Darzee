import React from 'react';

interface SimpleLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function SimpleLoader({ size = 'md', text, className = '' }: SimpleLoaderProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      <div className={`flex space-x-1 ${sizeClasses[size]}`}>
        <div 
          className={`${dotSizes[size]} bg-gold rounded-full animate-bounce`}
          style={{ animationDelay: '0ms', animationDuration: '1s' }}
        />
        <div 
          className={`${dotSizes[size]} bg-gold rounded-full animate-bounce`}
          style={{ animationDelay: '150ms', animationDuration: '1s' }}
        />
        <div 
          className={`${dotSizes[size]} bg-gold rounded-full animate-bounce`}
          style={{ animationDelay: '300ms', animationDuration: '1s' }}
        />
      </div>
      
      {text && (
        <p className="text-xs text-silver animate-pulse font-medium">
          {text}
        </p>
      )}
    </div>
  );
}