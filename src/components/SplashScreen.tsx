import React, { useEffect, useState } from 'react';
import { Scissors, Crown, Sparkles } from 'lucide-react';
import { StitchingLoader } from './animations/StitchingLoader';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState('Initializing Atelier...');

  const loadingSteps = [
    'Initializing Atelier...',
    'Threading the needles...',
    'Preparing fabric samples...',
    'Setting up workstation...',
    'Ready to craft!'
  ];

  useEffect(() => {
    const duration = 3000; // 3 seconds
    const steps = 100;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep += 1;
      setProgress(currentStep);

      // Update text at certain progress points
      const textIndex = Math.floor((currentStep / steps) * loadingSteps.length);
      if (textIndex < loadingSteps.length) {
        setCurrentText(loadingSteps[textIndex]);
      }

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(onComplete, 500);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-background z-[10000] flex items-center justify-center">
      {/* Animated background pattern */}
      <div className="absolute inset-0 fabric-texture opacity-20 animate-weave"></div>
      
      <div className="relative text-center space-y-8 px-4">
        {/* Logo section */}
        <div className="relative">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="relative">
              <Scissors className="w-16 h-16 sm:w-20 sm:h-20 text-gold animate-float" />
              <Crown className="absolute -top-2 -right-2 w-8 h-8 text-gold animate-pulse" />
              <Sparkles className="absolute -bottom-1 -left-1 w-6 h-6 text-gold animate-ping" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-display font-bold text-gold mb-2 animate-slide-down">
            Darzee
          </h1>
          <p className="text-lg sm:text-xl text-silver animate-slide-up">
            Luxury Tailor Management
          </p>
        </div>

        {/* Loading animation */}
        <div className="space-y-6">
          <StitchingLoader size="lg" text="" />
          
          {/* Progress bar */}
          <div className="w-64 sm:w-80 mx-auto">
            <div className="luxury-card p-2 rounded-full">
              <div className="h-2 bg-navy-light rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-gold to-gold-dark rounded-full transition-all duration-300 ease-out animate-shimmer"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            
            {/* Progress text */}
            <p className="mt-3 text-silver text-sm font-medium animate-pulse">
              {currentText}
            </p>
          </div>
        </div>

        {/* Decorative stitching */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <svg width="200" height="4">
            <line 
              x1="0" 
              y1="2" 
              x2="200" 
              y2="2" 
              className="stitching-line"
              strokeWidth="1"
            />
          </svg>
        </div>

        {/* Version info */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-silver/60">
          v1.0.0 - Crafted with Excellence
        </div>
      </div>
    </div>
  );
}