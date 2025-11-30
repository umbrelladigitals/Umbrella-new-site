'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UIContextType {
  isLetsTalkOpen: boolean;
  openLetsTalk: () => void;
  closeLetsTalk: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLetsTalkOpen, setIsLetsTalkOpen] = useState(false);

  const openLetsTalk = () => setIsLetsTalkOpen(true);
  const closeLetsTalk = () => setIsLetsTalkOpen(false);

  return (
    <UIContext.Provider value={{ isLetsTalkOpen, openLetsTalk, closeLetsTalk }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
