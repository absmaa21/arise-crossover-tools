import {createContext} from "react";

interface SettingsContextProps {
  animationsEnabled: boolean;
  toggleAnimations: () => void;
}

export const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);