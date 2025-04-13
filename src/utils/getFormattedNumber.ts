import {Potency} from "../entities/potency.ts";

export function getFormattedNumber(num: number): string {
  if (num < Potency.M) return num.toFixed(2)

  const potencyKey = Object.keys(Potency)
    .filter(key => isNaN(Number(key)))
    .find(k => num / Potency[k as keyof typeof Potency] < 1000)

  if (potencyKey)
    return (num / Potency[potencyKey as keyof typeof Potency]).toFixed(2) + potencyKey

  return (num / Potency.No).toFixed(2)
}