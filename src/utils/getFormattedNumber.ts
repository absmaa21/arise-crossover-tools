import {Potency} from "../entities/potency.ts";

const numFormatFraction = Intl.NumberFormat('us', {minimumFractionDigits: 2, maximumFractionDigits: 2})
const numberFormat = Intl.NumberFormat('us')

export function getFormattedNumber(num: number, ignoreSuffix: boolean = false): string {
  if (num < Potency.k) return num.toFixed(2)

  const potencyKey = Object.keys(Potency)
    .filter(key => isNaN(Number(key)))
    .find(k => num / Potency[k as keyof typeof Potency] < 1000)

  if (potencyKey)
    return numFormatFraction.format(num / Potency[potencyKey as keyof typeof Potency]) + (ignoreSuffix ? '' : ' ' + potencyKey)

  return numberFormat.format(num / Potency.Dc) + (ignoreSuffix ? '' : ' Dc')
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