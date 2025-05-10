import {GuildContext} from "./contexts.ts";
import {ReactNode, useEffect, useState} from "react";
import {emptyGuildMember, Guild} from "../entities/guild.ts";
import axios, {isAxiosError} from "axios";

const apiUrl: string = 'https://f580-2a00-79c0-646-5500-1ceb-f4ba-d85f-5466.ngrok-free.app'
const headers: Record<string, string> = {
  'ngrok-skip-browser-warning': 'true',
}

interface Props {
  children: ReactNode,
}

function checkForMissingFields(guild: Guild): Guild {
  return {
    ...guild,
    members: guild.members?.map(m => ({
      ...emptyGuildMember,
      ...m,
    })) || []
  }
}

function GuildProvider({children}: Props) {

  const [guild, setGuild] = useState<Guild | undefined>()
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false)

  const loadGuild = async () => {
    const rawValidUntil = localStorage.getItem('guild-valid-until')
    if (rawValidUntil) {
      if (Date.now() < parseInt(rawValidUntil)) {
        console.log('Guild is still valid.')
        const loadedGuild = localStorage.getItem('guild')
        if (loadedGuild) {
          await changeGuild(JSON.parse(loadedGuild), true)
        }
        return
      }
    }

    try {
      const response = await axios.get<Guild>(`${apiUrl}/load`, {headers})
      console.log('Loaded Guild: ', response.data.name)
      localStorage.setItem('guild-valid-until', String(Date.now() + 5 * 60 * 1000))
      await changeGuild(response.data, true)
    } catch(e) {
      if (axios.isAxiosError(e)) {
        console.log('Loading guild was invalid! ', e.response?.data || '');
      } else {
        console.error('Something else went wrong while loading guild. ', e);
      }
    }
  }

  useEffect(() => {
    loadGuild()
    refreshAuthorized()
  }, []);

  const refreshAuthorized = async () => {
    const password = localStorage.getItem('api-auth')
    if (!password || password.length < 64) {
      localStorage.removeItem('api-auth')
      return
    }

    try {
      const response = await axios.get(`${apiUrl}/authorized`, {
        params: {password},
        headers
      })
      if (response.status === 200) {
        setIsAuthorized(true)
      } else {
        localStorage.removeItem('api-auth')
        setIsAuthorized(false)
      }
    } catch {
      localStorage.removeItem('api-auth')
      setIsAuthorized(false)
    }
  }

  const changeGuild = async (newGuild: Guild, skipPost: boolean = false) => {
    newGuild = checkForMissingFields(newGuild)
    localStorage.setItem('guild', JSON.stringify(newGuild))
    setGuild(newGuild)

    if (skipPost) return
    try {
      const response = await axios.post(`${apiUrl}/save`, newGuild, {
        params: {"password": localStorage.getItem('api-auth')},
        headers
      })
      if (response.status === 200) console.log('Guild saved.')
      else if (response.status === 401) console.log('Not authorized')
    } catch (e) {
      if (isAxiosError(e)) {
        console.log('Error while saving guild. ', e)
      } else {
        console.error('Something else went wrong while saving guild. ', e)
      }
    }
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
    <GuildContext.Provider value={{guild, isAuthorized, changeGuild, getCurHistoryValue}}>
      {children}
    </GuildContext.Provider>
  );
}

export default GuildProvider;