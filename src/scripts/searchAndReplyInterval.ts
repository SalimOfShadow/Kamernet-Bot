import { Browser, Page } from 'puppeteer';
import { Settings } from '../bot';
import { wait } from '../utils/randomActions';
import { processListings } from './processListings';
import { logMessage } from '../utils/logMessage';

export async function searchAndReplyInterval(
  page: Page,
  browser: Browser,
  settings: Settings,
  location: string
) {
  try {
    await page.reload();
    await wait(1000, 2000);
    logMessage(
      `Now processing listings for \x1b[37m ${location}\x1b[0m...`,
      'info',
      'cyan'
    );
    await processListings(page, browser, settings);
    logMessage(
      'All available listings were successfully processed.',
      'success',
      'green'
    );

    const nextSearchTime = new Date(
      Date.now() + settings.interval * 60 * 1000
    ).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true, // Use false for 24-hour format
    });
    logMessage(
      `Searching Again in: ${`\x1b[36m  ${settings.interval} minutes at ${nextSearchTime} \x1b[0m`}`,
      'info'
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      logMessage(
        `Encountered an error during the cronjob: ${error.message as string}`
      ),
        'error',
        'red';
    }
  } finally {
    setTimeout(() => {
      searchAndReplyInterval(page, browser, settings, location);
    }, settings.interval * 60 * 1000);
  }
}
