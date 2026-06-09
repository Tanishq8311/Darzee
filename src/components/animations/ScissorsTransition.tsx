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
      const timer = setTimeout(() => {
        setShow(false);
        onComplete();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!show) return null;

  return createPortal(
    <div className="scissors-transition">
      ✂️
      <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
        <svg width="200" height="4" className="overflow-visible">
          <line 
            x1="0" 
            y1="2" 
            x2="200" 
            y2="2" 
            className="stitching-line"
          />
        </svg>
      </div>
    </div>,
    document.body
  );
}