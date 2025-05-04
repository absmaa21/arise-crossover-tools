import {GuildContext} from "./contexts.ts";
import {ReactNode, useEffect, useState} from "react";
import {emptyGuildMember, Guild} from "../entities/guild.ts";

interface Props {
  children: ReactNode,
}

function checkForMissingFields(guild: Guild): Guild {
  return {
    ...guild,
    members: guild.members.map(m => ({
      ...emptyGuildMember,
      ...m,
    }))
  }
}

function GuildProvider({children}: Props) {

  const [guild, setGuild] = useState<Guild | undefined>()

  useEffect(() => {
    const loaded = localStorage.getItem('guild')
    if (loaded) {
      const loadedGuild: Guild = JSON.parse(loaded)
      loadedGuild.members = loadedGuild.members.filter((m, i, s) => i === s.findIndex(o => o.rbxName === m.rbxName))
      setGuild(checkForMissingFields(loadedGuild))
    }
  }, []);

  const changeGuild = (newGuild: Guild) => {
    newGuild = checkForMissingFields(newGuild)
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

  const addGemCheckForMember = (rbxName: string, gems: number, date: number = Date.now()) => {
    if (!guild) return

    const member = guild.members.find(m => m.rbxName === rbxName)
    if (!member) {
      console.log(`Member ${rbxName} not found!`)
      return
    }

    member.gemChecks.push({value: gems, date})
    changeGuild({...guild, members: [...guild.members.filter(m => m.rbxName !== rbxName), member]})
  }

  return (
    <GuildContext.Provider value={{guild, changeGuild, getCurHistoryValue, addGemCheckForMember}}>
      {children}
    </GuildContext.Provider>
  );
}

export default GuildProvider;