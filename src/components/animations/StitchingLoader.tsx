import React from 'react';

interface StitchingLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function StitchingLoader({ size = 'md', text = 'Stitching...' }: StitchingLoaderProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Spool */}
        <div className="absolute inset-0 bg-gold rounded-full opacity-20"></div>
        
        {/* Thread */}
        <svg className="w-full h-full animate-spin" viewBox="0 0 40 40">
          <circle
            cx="20"
            cy="20"
            r="16"
            fill="none"
            stroke="hsl(var(--gold))"
            strokeWidth="2"
            strokeDasharray="20 10"
            className="animate-pulse"
          />
          <circle
            cx="20"
            cy="20"
            r="12"
            fill="none"
            stroke="hsl(var(--gold))"
            strokeWidth="1"
            strokeDasharray="15 5"
            className="animate-pulse"
            style={{ animationDelay: '0.5s' }}
          />
        </svg>
        
        {/* Needle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-1 h-6 bg-silver rounded-full animate-sewing-needle"></div>
        </div>
      </div>
      
      {text && (
        <div className="text-sm text-muted-foreground font-medium">
          {text}
          <span className="animate-pulse">...</span>
        </div>
      )}
      
      {/* Stitching line */}
      <svg width="100" height="4" className="opacity-60">
        <line 
          x1="0" 
          y1="2" 
          x2="100" 
          y2="2" 
          className="stitching-line"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}