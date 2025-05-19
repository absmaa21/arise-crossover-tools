import {createContext} from "react";
import {Guild} from "../entities/guild.ts";

interface SettingsContextProps {
  animationsEnabled: boolean;
  toggleAnimations: () => void;
}

export const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);


type GuildContextProps = {
  guild?: Guild,
  isAuthorized: boolean,
  changeGuild: (newGuild: Guild, skipPost?: boolean) => Promise<void>,
  getCurHistoryValue: (history: {value: number, validFrom: number}[]) => number,
}

export const GuildContext = createContext<GuildContextProps | undefined>(undefined)