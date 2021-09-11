
export const random = (n: number, max?: number) => max === undefined ? Math.floor(Math.random() * n) :  Math.floor(Math.random() * (max - n + 1)) + n;
export function randomChoice<T>(arr: T[]) {
  return arr[random(arr.length)];
}
export const sleep = (ms: number) => new Promise(resolve=> setTimeout(resolve, ms))