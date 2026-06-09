import React, { useEffect, useState } from 'react';
import { Scissors } from 'lucide-react';
import { TailoringLoader } from './animations/TailoringLoader';

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
      <div className="text-center space-y-6 px-4">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Scissors className="w-12 h-12 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Darzee</h1>
            <p className="text-sm text-muted-foreground">Tailor Management</p>
          </div>
        </div>

        {/* Loading */}
        <TailoringLoader size="xl" text={currentText} />
        
        {/* Progress bar */}
        <div className="w-64 mx-auto">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}