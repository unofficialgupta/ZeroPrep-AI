'use client';

import React, { useEffect } from 'react';
import StealthOverlay from '@/components/StealthOverlay';

export default function OverlayStandalonePage() {
  useEffect(() => {
    document.documentElement.classList.add('overlay-transparent');
    document.body.classList.add('overlay-transparent');
    document.documentElement.style.background = 'transparent';
    document.body.style.background = 'transparent';

    return () => {
      document.documentElement.classList.remove('overlay-transparent');
      document.body.classList.remove('overlay-transparent');
      document.documentElement.style.background = '';
      document.body.style.background = '';
    };
  }, []);

  return (
    <div className="overlay-transparent-root h-screen w-screen bg-transparent select-none overflow-hidden p-2 flex items-end justify-end">
      <StealthOverlay
        isOpen={true}
        onClose={() => {
          const desktop = (window as any).zeroPrepDesktop || (window as any).parakeetDesktop;
          if (desktop?.toggleNativeHud) {
            desktop.toggleNativeHud();
          }
        }}
        isNativeWindow={true}
      />
    </div>
  );
}
