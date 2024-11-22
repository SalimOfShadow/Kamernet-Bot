import { Settings } from '../bot';
import { logMessage } from './logMessage';

export const possiblePrices: number[] = [
  0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400,
  1500, 1750, 2000, 2250, 2500, 2750, 3000, 3250, 3500, 3750, 4000, 4250, 4500,
  4750, 5000, 5250, 5500, 5750, 6000,
];

export const possibleDimensions: number[] = [
  0, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 45,
  50, 60, 70, 80, 90, 100,
];

export const possibleRadii: number[] = [0, 1, 2, 5, 10, 20];

export function validateSettings(settings: Settings) {
  // TODO - Finish this
  if (!settings.location) {
    logMessage(
      `Missing location! Please config the .env file correctly before retrying.`,
      'error',
      'red'
    );
    return false;
  }

  if (!possiblePrices.includes(settings.maxPrice)) {
    logMessage(
      `Invalid maxPrice! Please select one of the following:\n` +
        `\x1b[37m${possiblePrices.join('  ')}\x1b[0m`,
      'error',
      'red'
    );
    return false;
  }
  return true;
}
