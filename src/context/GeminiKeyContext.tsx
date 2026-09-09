'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface GeminiKeyContextType {
  apiKey: string;
  isKeyConfigured: boolean;
  isValidating: boolean;
  isModalOpen: boolean;
  activeModel: string;
  setIsModalOpen: (open: boolean) => void;
  setActiveModel: (model: string) => void;
  saveApiKey: (key: string) => Promise<{ success: boolean; error?: string }>;
  removeApiKey: () => void;
}

const GeminiKeyContext = createContext<GeminiKeyContextType | undefined>(undefined);

export function GeminiKeyProvider({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKey] = useState<string>('');
  const [isKeyConfigured, setIsKeyConfigured] = useState<boolean>(false);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeModel, setActiveModel] = useState<string>('gemini-3.6-flash');

  useEffect(() => {
    // Check localStorage first, then env variables
    let stored: string | null = null;
    let storedModel: string | null = null;
    try {
      stored = localStorage.getItem('zeroprep_gemini_key') || localStorage.getItem('parakeet_gemini_key');
      storedModel = localStorage.getItem('zeroprep_gemini_model') || localStorage.getItem('parakeet_gemini_model');
    } catch (err) {
      console.warn('Storage read restricted:', err);
    }

    const envKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (stored && stored.trim()) {
      setApiKey(stored.trim());
      setIsKeyConfigured(true);
    } else if (envKey && envKey.trim()) {
      setApiKey(envKey.trim());
      setIsKeyConfigured(true);
    } else {
      setIsKeyConfigured(false);
    }

    if (storedModel) {
      setActiveModel(storedModel);
    }
  }, []);

  const saveApiKey = async (newKey: string): Promise<{ success: boolean; error?: string }> => {
    if (!newKey.trim()) {
      return { success: false, error: 'Please enter a valid Gemini API Key.' };
    }

    setIsValidating(true);
    try {
      // Test ping the API key via /api/gemini
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: newKey.trim(), ping: true, model: activeModel }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to validate API Key.');
      }

      try {
        localStorage.setItem('zeroprep_gemini_key', newKey.trim());
      } catch (storageErr) {
        console.warn('localStorage write failed (private browsing):', storageErr);
      }
      setApiKey(newKey.trim());
      setIsKeyConfigured(true);
      setIsModalOpen(false);
      return { success: true };
    } catch (err: unknown) {
      const error = err as Error;
      return {
        success: false,
        error: error.message || 'Validation failed. Please double check your Google AI Studio key.'
      };
    } finally {
      setIsValidating(false);
    }
  };

  const removeApiKey = () => {
    try {
      localStorage.removeItem('zeroprep_gemini_key');
      localStorage.removeItem('parakeet_gemini_key');
    } catch (err) {
      console.warn('Storage remove restricted:', err);
    }
    setApiKey('');
    setIsKeyConfigured(false);
  };

  const handleSetActiveModel = (model: string) => {
    setActiveModel(model);
    try {
      localStorage.setItem('zeroprep_gemini_model', model);
    } catch (err) {
      console.warn('Storage set restricted:', err);
    }
  };

  return (
    <GeminiKeyContext.Provider
      value={{
        apiKey,
        isKeyConfigured,
        isValidating,
        isModalOpen,
        activeModel,
        setIsModalOpen,
        setActiveModel: handleSetActiveModel,
        saveApiKey,
        removeApiKey,
      }}
    >
      {children}
    </GeminiKeyContext.Provider>
  );
}

export function useGeminiKey() {
  const context = useContext(GeminiKeyContext);
  if (!context) {
    throw new Error('useGeminiKey must be used within a GeminiKeyProvider');
  }
  return context;
}
