export function randomKeyDelay() {
  return Math.floor(Math.random() * (24 - 126 + 1) + 126);
}
export function randomMouseClickDelay() {
  return Math.floor(Math.random() * (39 - 101) + 101);
}
export function randomNumber(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export async function wait(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}
