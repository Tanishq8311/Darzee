import React from 'react';

export function ThreadLoader() {
  return (
    <div className="thread-loader">
      <style jsx>{`
        .thread-loader {
          position: relative;
          width: 40px;
          height: 40px;
        }
        
        .thread-loader::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 30px;
          height: 30px;
          margin: -15px 0 0 -15px;
          border: 3px solid hsl(var(--gold) / 0.3);
          border-top-color: hsl(var(--gold));
          border-radius: 50%;
          animation: threadSpin 1s linear infinite;
        }
        
        .thread-loader::after {
          content: '✂️';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 16px;
          animation: threadSpin 2s linear infinite reverse;
        }
      `}</style>
    </div>
  );
}