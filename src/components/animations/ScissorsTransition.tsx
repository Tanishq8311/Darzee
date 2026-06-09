import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ScissorsTransitionProps {
  isActive: boolean;
  onComplete: () => void;
}

export function ScissorsTransition({ isActive, onComplete }: ScissorsTransitionProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isActive) {
      setShow(true);
      // Generate cutting sparks
      setTimeout(() => {
        generateSparks();
      }, 800);
      
      const timer = setTimeout(() => {
        setShow(false);
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  const generateSparks = () => {
    const sparksContainer = document.querySelector('.cutting-sparks');
    if (!sparksContainer) return;

    for (let i = 0; i < 15; i++) {
      const spark = document.createElement('div');
      spark.className = 'spark';
      
      const angle = (Math.PI * 2 * i) / 15;
      const distance = 50 + Math.random() * 100;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;
      
      spark.style.setProperty('--dx', `${dx}px`);
      spark.style.setProperty('--dy', `${dy}px`);
      spark.style.animationDelay = `${Math.random() * 0.5}s`;
      
      sparksContainer.appendChild(spark);
      
      setTimeout(() => {
        spark.remove();
      }, 1300);
    }
  };

  if (!show) return null;

  return createPortal(
    <div className="cloth-cutting-container">
      {/* Cloth overlay that gets cut */}
      <div className="cloth-cutting-overlay" />
      
      {/* Animated scissors */}
      <div className="scissors-cutter">
        <div className="scissors-blade">✂️</div>
      </div>
      
      {/* Cutting sparks */}
      <div className="cutting-sparks"></div>
      
      {/* Sound effect indicator */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gold/60 text-sm font-medium animate-pulse"
        style={{ animationDelay: '0.5s' }}
      >
        *snip snip* ✂️
      </div>
    </div>,
    document.body
  );
}