import {useContext} from "react";
import {SettingsContext} from "../contexts/contexts.ts";

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
};