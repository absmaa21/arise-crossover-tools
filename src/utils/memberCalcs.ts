import {Guild, GuildMember} from "../entities/guild.ts";

export function getFeeForDate(guild: Guild, date: number = Date.now()) {
  let value: number = 0
  let valueDate: number = -1
  if (!guild) return value

  guild.entryFee.filter(h => h.validFrom <= date).forEach(h => {
    if (h.validFrom >= valueDate) {
      valueDate = h.validFrom
      value = h.value
    }
  })

  return value
}

interface getMissingGemsReturn {
  curMissing: number,
  overallNeeded: number,
}
export function getMissingGems(guild: Guild, member: GuildMember): getMissingGemsReturn {

  let needed: number = getFeeForDate(guild, member.joinedAt)

  for (const weekly of guild.gemsPerCheck) {
    needed += weekly.value
  }

  return {
    curMissing: needed - (member.gemChecks[member.gemChecks.length-1]?.value || 0),
    overallNeeded: needed,
  }
}