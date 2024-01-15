export function delay(time: number | undefined) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
