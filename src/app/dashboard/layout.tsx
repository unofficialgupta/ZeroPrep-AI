'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import StealthOverlay from '@/components/StealthOverlay';
import NewSessionModal from '@/components/NewSessionModal';
import { CallSession } from '@/lib/storage';
import { SearchProvider } from '@/context/SearchContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isStealthOpen, setIsStealthOpen] = useState(false);
  const [isNewSessionOpen, setIsNewSessionOpen] = useState(false);
  const [isElectronApp, setIsElectronApp] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const desktop = (window as any).zeroPrepDesktop || (window as any).parakeetDesktop;
      if (desktop?.isElectron) {
        setIsElectronApp(true);
        const cleanup = desktop.onStealthHudStatus?.((active: boolean) => {
          setIsStealthOpen(active);
        });
        return () => cleanup?.();
      }
    }
  }, []);

  const handleToggleStealth = async () => {
    if (typeof window !== 'undefined') {
      const desktop = (window as any).zeroPrepDesktop || (window as any).parakeetDesktop;
      if (desktop?.toggleNativeHud) {
        const active = await desktop.toggleNativeHud();
        setIsStealthOpen(active);
        return;
      }
    }
    setIsStealthOpen((prev) => !prev);
  };

  const handleSessionCreated = (session: CallSession) => {
    handleToggleStealth();
    window.dispatchEvent(new CustomEvent('session-created', { detail: session }));
  };

  return (
    <SearchProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900">
        {/* Fixed Left Navigation Sidebar */}
        <Sidebar />

        {/* Main Content View with sticky header */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header
            onNewSessionClick={() => setIsNewSessionOpen(true)}
            onToggleStealth={handleToggleStealth}
            isStealthActive={isStealthOpen}
          />

          <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
            {children}
          </main>
        </div>

        {/* When in web browser, render the in-page floating HUD. In Electron, the native floating window handles this! */}
        {!isElectronApp && (
          <StealthOverlay
            isOpen={isStealthOpen}
            onClose={() => setIsStealthOpen(false)}
          />
        )}

        {/* New Real/Mock Session Modal */}
        <NewSessionModal
          isOpen={isNewSessionOpen}
          onClose={() => setIsNewSessionOpen(false)}
          onSessionCreated={handleSessionCreated}
        />
      </div>
    </SearchProvider>
  );
}
