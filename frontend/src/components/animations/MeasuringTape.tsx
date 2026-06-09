import React from 'react';

interface MeasuringTapeProps {
  length?: number;
  showMeasurement?: boolean;
  measurement?: string;
}

export function MeasuringTape({ length = 100, showMeasurement = false, measurement }: MeasuringTapeProps) {
  return (
    <div className="relative">
      <div 
        className="measure-tape"
        style={{ width: `${length}%` }}
      />
      {showMeasurement && measurement && (
        <div className="absolute -top-6 right-0 text-xs text-gold font-medium">
          {measurement}
        </div>
      )}
    </div>
  );
}