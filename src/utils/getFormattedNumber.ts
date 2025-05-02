import {Potency} from "../entities/potency.ts";

export function getFormattedNumber(num: number): string {
  if (num < Potency.k) return num.toFixed(0)

  const potencyKey = Object.keys(Potency)
    .filter(key => isNaN(Number(key)))
    .find(k => num / Potency[k as keyof typeof Potency] < 1000)

  if (potencyKey)
    return (num / Potency[potencyKey as keyof typeof Potency]).toFixed(0) + ' ' + potencyKey

  return (num / Potency.No).toFixed(0)
}


/**
 * Not working!!!
 * @param str
 */
export function getRawNumber(str: string): number {
  const match = str.match('(^d+)(.*)')
  if (!match) {
    console.log(`getRawNumber: no match found`)
    return 0
  }

  const num = parseFloat(match[1]) || 0
  const suffix = match[2].trim().toLowerCase()

  const foundSuffix = Object.keys(Potency).find(p => p.toLowerCase() === suffix)
  if (!foundSuffix) return 0

  const multiplier = Potency[foundSuffix as keyof typeof Potency] ?? 0
  return num * multiplier
}


export function getHighestPotency(num: number): Potency {
  if (num < 1000) return Potency.None

  const potencies = Object.values(Potency)
    .filter(v => typeof v === 'number')
    .sort((a, b) => b - a) as number[]

  const logNum = Math.log10(Math.abs(num))
  const found = potencies.find(p => logNum >= Math.log10(p))

  return found ?? Potency.None
}