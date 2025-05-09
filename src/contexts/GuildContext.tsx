import {GuildContext} from "./contexts.ts";
import {ReactNode, useEffect, useState} from "react";
import {emptyGuildMember, Guild} from "../entities/guild.ts";
import axios from "axios";
import {useNotifications} from "@toolpad/core";

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

  const notify = useNotifications()
  const [guild, setGuild] = useState<Guild | undefined>()

  useEffect(() => {
    loadGuild().then(() => console.log('Guild loaded'))
  }, []);

  const loadGuild = async () => {
    const response = await axios.get<Guild>('rent-catalyst.gl.at.ply.gg:17625/load')
    if (axios.isAxiosError(response)) {
      console.log('Loading guild was invalid! ', response.data)
      return
    }
    setGuild(response.data)
    notify.show('Guild loaded.', {autoHideDuration: 1000, severity: 'success'})
  }

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

  return (
    <GuildContext.Provider value={{guild, changeGuild, getCurHistoryValue}}>
      {children}
    </GuildContext.Provider>
  );
}

export default GuildProvider;