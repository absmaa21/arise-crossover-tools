export enum Potency {
  M = 10**6,
  B = 10**9,
  T = 10**12,
  Qa = 10**15,
  Qi = 10**18,
  Sx = 10**21,
  Sp = 10**24,
  Ot = 10**27,
  No = 10**30,
}

export const ITER_POTENCY: string[] = Object.keys(Potency).filter((key) => isNaN(Number(key)))
