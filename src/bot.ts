// Imports
require('dotenv').config({ path: '../.env' });
import * as puppeteer from 'puppeteer';
import { loginToKamernet } from './scripts/login';
import { searchListings } from './scripts/searchListings';
import { wait } from './utils/randomActions';
import { processAllPages } from './scripts/processAllPages';
import { searchAndReplyInterval } from './scripts/searchAndReplyInterval';
import { handle404 } from './scripts/handle404';
import { openTab } from './scripts/openPage';
import { clearLogs, logMessage } from './utils/logMessage';
import { processSingleTab } from './scripts/processSingleTab';
import { validateSettings } from './utils/validateSettings';

// Initialize settings
const isProd: boolean = process.env.CURRENT_ENV === 'production' ? true : false;

export interface Settings {
  location: string[];
  listingType: string[];
  maxPrice: number;
  minRooms: number;
  radius: number;
  interval: number;
  customReplyRoom?: string;
  customReplyApartment?: string;
  filteredWords?: string[];
}

const settings: Settings = {
  location: process.env.LOCATION?.split(',') || [],
  listingType: process.env.LISTING_TYPE?.split(',') || [],
  maxPrice: Number(process.env.MAX_PRICE || '0'),
  minRooms: Number(process.env.MIN_SIZE || '0'),
  radius: Number(process.env.RADIUS || '1'),
  interval: Number(process.env.INTERVAL || '15'), // Defaults to 15 minutes
  customReplyRoom: process.env.CUSTOM_REPLY_ROOM || '',
  customReplyApartment: process.env.CUSTOM_REPLY_APARTMENT || '',
  filteredWords:
    process.env.FILTERED_WORDS?.split('-').map((word) =>
      word.trim().toLowerCase()
    ) || [],
};

// Helper functions

// Launch Puppeteer
(async () => {
  clearLogs();
  if (!process.env.KAMERNET_EMAIL || !process.env.KAMERNET_PASSWORD) {
    throw new Error('Please provide your credentials to proceed.');
  }

  const email: string = process.env.KAMERNET_EMAIL;
  const password: string = process.env.KAMERNET_PASSWORD;

  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  try {
    // Validate the settings before starting Puppeteer
    const settingsValid: boolean = validateSettings(settings);
    if (!settingsValid) {
      process.exit();
    }

    browser = await puppeteer.launch({
      headless: isProd,
      args: ['--disable-blink-features=AutomationControlled'],
      pipe: true,
      defaultViewport: null,
    });

    let pages: puppeteer.Page[] = await browser.pages();
    page = pages.length === 0 ? await browser.newPage() : pages[0];

    // Login
    const loginResult: boolean = await loginToKamernet(page, email, password);

    if (!loginResult) {
      logMessage('Invalid credentials!', 'error', 'red');
      process.exit();
    } else {
      logMessage('Successfully logged in to Kamernet', 'success', 'green');
    }

    // Accounting for multiple locations selected
    for (const location of settings.location) {
      const searchURL: string = searchListings(settings, location);
      await wait(500, 1740);
      if (location === settings.location[0]) {
        await page.goto(searchURL, { waitUntil: 'load' });
      } else {
        await openTab(browser, searchURL);
      }

      // await processSingleTab(settings, location);
    }

    await wait(1000, 1001);

    pages = await browser.pages();

    pages.forEach(async (page, index) => {
      const isPagePresent = await handle404(page);
      if (isPagePresent)
        await processSingleTab(
          page,
          browser,
          settings,
          settings.location[index]
        );
    });

    // Wait before closing
    await new Promise((resolve) => setTimeout(resolve, 1244200));

    // Close the main page
    await page.close();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error);
    }
    setTimeout(async () => {
      if (page) await page.close();
    });
  }
})();
