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
  addGemCheckForMember: (rbxName: string, value: number, date: number) => void,
}

export const GuildContext = createContext<GuildContextProps | undefined>(undefined)