export interface Guild {
  name: string,
  gemCheckDay: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[],
  gemsPerCheck: {
    value: number,
    validFrom: number,
  }[],
  entryFee: {
    value: number,
    validFrom: number,
  }[],
  members: GuildMember[],
}

export interface GuildMember {
  rbxName: string,
  displayName: string,
  discord: string,
  joinedAt: number,
  gemChecks: {
    value: number,
    date: number,
  }[],
}
