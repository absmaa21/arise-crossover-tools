import {useContext} from "react";
import {GuildContext} from "../contexts/contexts.ts";

export const useGuild = () => {
  const context = useContext(GuildContext);
  if (!context) {
    throw new Error('useGuild must be used within a GuildProvider');
  }
  return context;
};