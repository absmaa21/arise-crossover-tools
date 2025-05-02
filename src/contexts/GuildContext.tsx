import {GuildContext} from "./contexts.ts";
import {ReactNode, useEffect, useState} from "react";
import {Guild} from "../entities/guild.ts";

interface Props {
  children: ReactNode,
}

function GuildProvider({children}: Props) {

  const [guild, setGuild] = useState<Guild | undefined>()

  useEffect(() => {
    const loaded = localStorage.getItem('guild')
    if (loaded) {
      const loadedGuild: Guild = JSON.parse(loaded)
      loadedGuild.members = loadedGuild.members.filter((m, i, s) => i === s.findIndex(o => o.rbxName === m.rbxName))
      setGuild(loadedGuild)
    }
  }, []);

  const changeGuild = (newGuild: Guild) => {
    localStorage.setItem('guild', JSON.stringify(newGuild))
    setGuild(newGuild)
  }

  const getCurHistoryValue = (history: {value: number, validFrom: number}[]): number => {
    let value: number = -1
    let valueDate: number = -1
    if (!guild) return value

    history.filter(h => h.validFrom <= Date.now()).forEach(h => {
      if (h.validFrom >= valueDate) {
        valueDate = h.validFrom
        value = h.value
      }
    })

    return value
  }

  return (
    <GuildContext.Provider value={{guild, changeGuild, getCurHistoryValue}}>
      {children}
    </GuildContext.Provider>
  );
}

export default GuildProvider;