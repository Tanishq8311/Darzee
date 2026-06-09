import React from 'react';
import { Scissors } from 'lucide-react';

interface TailoringLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  showText?: boolean;
}

export function TailoringLoader({ size = 'md', text = 'Loading...', showText = true }: TailoringLoaderProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16', 
    lg: 'w-20 h-20',
    xl: 'w-24 h-24'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg', 
    xl: 'text-xl'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Main Loader Container */}
      <div className="relative">
        {/* Sewing Machine Base */}
        <div className={`${sizeClasses[size]} relative bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg shadow-lg overflow-hidden`}>
          {/* Needle Animation */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
            <div className="w-0.5 h-4 bg-silver animate-needle-bounce"></div>
          </div>
          
          {/* Thread Spool */}
          <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
            <div className="w-2 h-3 bg-gradient-to-b from-amber-400 to-amber-600 rounded-sm animate-thread-spin"></div>
          </div>
          
          {/* Scissors Icon */}
          <div className="absolute bottom-2 left-2">
            <Scissors className="w-3 h-3 text-amber-400 animate-scissors-cut" />
          </div>
          
          {/* Stitching Line */}
          <div className="absolute bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-stitching"></div>
        </div>

        {/* Measuring Tape */}
        <div className="absolute -top-1 -left-2 w-8 h-1 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded animate-tape-measure"></div>
        <div className="absolute -bottom-1 -right-2 w-6 h-1 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded animate-tape-measure-reverse"></div>

        {/* Floating Buttons */}
        <div className="absolute -top-2 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full animate-float-button"></div>
        <div className="absolute -bottom-2 left-1 w-1 h-1 bg-red-500 rounded-full animate-float-button-delayed"></div>
        
        {/* Fabric Particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1 left-1 w-1 h-1 bg-primary/30 rounded animate-fabric-float"></div>
          <div className="absolute top-3 right-2 w-0.5 h-0.5 bg-accent/50 rounded animate-fabric-float-delayed"></div>
          <div className="absolute bottom-2 right-1 w-1 h-1 bg-muted/40 rounded animate-fabric-float-slow"></div>
        </div>

        {/* Golden Glow Effect */}
        <div className="absolute inset-0 bg-gradient-radial from-amber-400/20 via-transparent to-transparent animate-pulse"></div>
      </div>

      {/* Loading Text */}
      {showText && (
        <div className="text-center">
          <p className={`${textSizeClasses[size]} font-medium text-foreground animate-text-fade`}>
            {text}
          </p>
          <div className="flex justify-center space-x-1 mt-2">
            <div className="w-1 h-1 bg-primary rounded-full animate-dot-bounce"></div>
            <div className="w-1 h-1 bg-primary rounded-full animate-dot-bounce-delayed-1"></div>
            <div className="w-1 h-1 bg-primary rounded-full animate-dot-bounce-delayed-2"></div>
          </div>
        </div>
      )}
    </div>
  );
}

// Minimal version for inline use
export function MiniTailoringLoader({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 rounded shadow-sm">
        <div className="absolute top-0.5 left-1/2 transform -translate-x-1/2 w-px h-2 bg-amber-400 animate-needle-bounce"></div>
        <Scissors className="absolute bottom-0.5 left-0.5 w-2 h-2 text-amber-400 animate-scissors-cut" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-amber-400 animate-stitching"></div>
      </div>
    </div>
  );
}