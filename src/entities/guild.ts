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
  discord: {
    id: string,
    display: string,
    lastUpdate: number,
  },
  joinedAt: number,
  gemChecks: {
    value: number,
    date: number,
  }[],
  note: string,
  prio: number,
}

export const emptyGuildMember: GuildMember = {
  rbxName: '',
  displayName: '',
  discord: {
    id: '',
    display: '',
    lastUpdate: 0,
  },
  joinedAt: Date.now(),
  gemChecks: [],
  note: '',
  prio: Number.MAX_SAFE_INTEGER,
}

export function descendingComparator<T extends GuildMember>(a: T, b: T, orderBy: keyof T) {
  if (orderBy === 'gemChecks') {
    const sumA = a.gemChecks.reduce((sum, gems) => sum + gems.value, 0)
    const sumB = b.gemChecks.reduce((sum, gems) => sum + gems.value, 0)
    if (sumB < sumA) return -1
    if (sumB > sumA) return 1
    return 0
  }

  if (typeof a[orderBy] === 'string' && typeof b[orderBy] === 'string') {
    if (b[orderBy].toLowerCase() < a[orderBy].toLowerCase()) return -1
    if (b[orderBy].toLowerCase() > a[orderBy].toLowerCase()) return 1
    return 0
  }

  if (b[orderBy] < a[orderBy]) return -1
  if (b[orderBy] > a[orderBy]) return 1
  return 0
}