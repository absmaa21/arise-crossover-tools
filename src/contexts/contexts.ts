import {createContext} from "react";
import {Guild} from "../entities/guild.ts";

interface SettingsContextProps {
  animationsEnabled: boolean;
  toggleAnimations: () => void;
}

export const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);


type GuildContextProps = {
  guild?: Guild,
  changeGuild: (newGuild: Guild) => void,
  getCurHistoryValue: (history: {value: number, validFrom: number}[]) => number,
}

export const GuildContext = createContext<GuildContextProps | undefined>(undefined)