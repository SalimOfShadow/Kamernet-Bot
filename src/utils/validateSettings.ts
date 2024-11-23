import { Settings } from '../bot';
import { logMessage } from './logMessage';

export const possibleListingTypes: string[] = [
  'room',
  'apartment',
  'studio',
  'anti-squat',
  'student-housing',
] as const;
// TODO - Turn these into enums
export const possiblePrices: number[] = [
  0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400,
  1500, 1750, 2000, 2250, 2500, 2750, 3000, 3250, 3500, 3750, 4000, 4250, 4500,
  4750, 5000, 5250, 5500, 5750, 6000,
] as const;

export const possibleDimensions: number[] = [
  0, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 45,
  50, 60, 70, 80, 90, 100,
] as const;

export const possibleRadii: number[] = [0, 1, 2, 5, 10, 20] as const;

export function validateSettings(settings: Settings) {
  // TODO - Finish this

  // Validate location
  if (!settings.location || settings.location.length === 0) {
    logMessage(
      `Missing location! Please configure the config.json file correctly before retrying.`,
      'error',
      'red'
    );
    return false;
  }

  if (settings.location.length >= 5) {
    logMessage(
      "You've selected 5 or more locations. This has not been fully tested yet and yield unexpected results.",
      'warning',
      'yellow'
    );
  }

  for (const location of settings.location) {
    if (location.length > 25) {
      logMessage(
        `Your selected location has more than 25 characters...This is most likely a misconfiguration.`,
        'error',
        'red'
      );
      return false;
    }
  }

  // Validate listing type
  if (!settings.listingType || settings.listingType.length === 0) {
    logMessage(
      `Missing listing type! Please configure the config.json file correctly before retrying.`,
      'error',
      'red'
    );
    return false;
  }

  for (const type of settings.listingType) {
    if (!possibleListingTypes.includes(type)) {
      logMessage(
        `${type} is not a valid listing type! Please select one or more of the following:\n` +
          `\n\x1b[37m${possibleListingTypes.join('  ')}\x1b[0m\n` +
          '\nIf you need to add more than one,you can chain them using a comma ( , ).',
        'error',
        'red'
      );
      return false;
    }
  }

  // Validate max price
  if (!possiblePrices.includes(settings.maxPrice) || !settings.maxPrice) {
    logMessage(
      `Invalid max price field! Please select one of the following:\n` +
        `\n\x1b[37m${possiblePrices.join('  ')}\x1b[0m\n`,
      'error',
      'red'
    );
    return false;
  }

  // Validate min size
  if (!possibleDimensions.includes(settings.minSize) || !settings.minSize) {
    logMessage(
      `Invalid minimum size field! Please select one of the following:\n` +
        `\n\x1b[37m${possibleDimensions.join('  ')}\x1b[0m\n`,
      'error',
      'red'
    );
    return false;
  }

  // Validate radius
  if (!possibleRadii.includes(settings.radius) || !settings.radius) {
    logMessage(
      `Invalid kilometers radius field! Please select one of the following:\n` +
        `\n\x1b[37m${possibleRadii.join('  ')}\x1b[0m\n`,
      'error',
      'red'
    );
    return false;
  }

  // Validate interval
  if (isNaN(settings.interval)) {
    logMessage("The interval you've provided is not a number.", 'error', 'red');
    return false;
  }
  if (settings.interval < 3) {
    logMessage(
      "You've selected the interval to be less than 3 minutes. This has not been fully tested yet and may lead to unexpected behavior.",
      'warning',
      'yellow'
    );
  }

  // Validate replies
  if (settings.customReplyRoom === '' || !settings.customReplyRoom) {
    logMessage(
      `Missing reply field! Please configure the config.json file correctly before retrying.`,
      'error',
      'red'
    );
    return false;
  }
  if (settings.customReplyRoom.length < 50) {
    logMessage(
      'Your reply is too short. Please provide a reply with at least 50 characters.',
      'error',
      'red'
    );
    return false;
  }
  //     TODO -IMPLEMENT MULTIPLE REPLIES
  // if (settings.customReplyApartment === "" || !settings.customReplyApartment) {
  //   logMessage(
  //     `Missing reply field! Please configure the config.json file correctly before retrying.`,
  //     "error",
  //     "red"
  //   );
  //   return false;
  // }
  // if (settings.customReplyApartment.length < 50) {
  //   logMessage(
  //     "Your reply is too short. Please provide a reply with at least 50 characters.",
  //     "error",
  //     "red"
  //   );
  //   return false;
  // }

  return true;
}
