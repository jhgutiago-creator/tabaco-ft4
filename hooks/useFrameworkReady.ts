import { useEffect } from 'react';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export function useFrameworkReady() {
  useEffect(() => {
    // Verificar se estamos no ambiente web
    if (typeof window !== 'undefined') {
      // Chamar frameworkReady se existir
      if (window.frameworkReady) {
        window.frameworkReady();
      }
      
      // Fallback: marcar como pronto após um pequeno delay
      const timer = setTimeout(() => {
        console.log('Framework ready fallback triggered');
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, []);
}