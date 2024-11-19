export function randomKeyDelay() {
  return Math.floor(Math.random() * (24 - 126 + 1) + 126);
}
export function randomMouseClickDelay() {
  return Math.floor(Math.random() * (39 - 101) + 101);
}

export async function wait(minTime: number, maxTime: number) {
  function randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  return new Promise(function (resolve) {
    setTimeout(resolve, randomNumber(minTime, maxTime));
  });
}
