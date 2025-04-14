import React, { useEffect, useState } from 'react';
import { SettingsContext } from './contexts';
import {LinearProgress} from "@mui/material";

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true)

  const [animationsEnabled, setAnimationsEnabled] = useState(true);


  useEffect(() => {
    const stored = localStorage.getItem('settings:animationsEnabled');
    if (stored !== null) {
      setAnimationsEnabled(stored === 'true');
    }
    setLoading(false)
  }, []);


  const toggleAnimations = () => {
    setAnimationsEnabled(!animationsEnabled);
    localStorage.setItem('settings:animationsEnabled', String(!animationsEnabled));
  };

  if (loading) return <LinearProgress/>

  return (
    <SettingsContext.Provider value={{ animationsEnabled, toggleAnimations }}>
      {children}
    </SettingsContext.Provider>
  );
};
