import { useState, useCallback } from 'react';

export function usePageTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextPage, setNextPage] = useState<string | null>(null);

  const transitionToPage = useCallback((pageName: string, onPageChange: (page: string) => void) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setNextPage(pageName);
    
    // Start scissors animation
    setTimeout(() => {
      onPageChange(pageName);
      setIsTransitioning(false);
      setNextPage(null);
    }, 1500);
  }, [isTransitioning]);

  return {
    isTransitioning,
    nextPage,
    transitionToPage,
  };
}