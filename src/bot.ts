// Imports
import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';
import { loginToKamernet } from './scripts/login';
import { searchListings } from './scripts/searchListings';
import { wait } from './utils/randomActions';
import { handle404 } from './utils/handle404';
import { openTab } from './scripts/openPage';
import { clearLogsAndConsole, logMessage } from './utils/logMessage';
import { processSingleTab } from './scripts/processSingleTab';
import { validateSettings } from './utils/validateSettings';
import { askForPassword } from './utils/askForPassword';
import { ConfigJSON, loadConfigFile } from './utils/loadConfig';

// Initialize settings

export interface Settings {
  location: string[];
  listingType: string[];
  maxPrice: number;
  minSize: number;
  radius: number;
  interval: number;
  customReplyRoom?: string;
  customReplyApartment?: string;
  filteredWords?: string[];
}

// Load configuration
const configJSON: ConfigJSON = loadConfigFile(
  path.resolve(__dirname, '../config.json')
);
// Convert config to `Settings` with appropriate handling for arrays and defaults
const settings: Settings = {
  location:
    Array.from(
      new Set(
        configJSON.LOCATION?.map((location) =>
          location.trim().toLowerCase()
        ).filter(
          (location) =>
            // if it's not empty (truthy)
            location &&
            // nor contains numbers we keep it
            !/\d/.test(location) &&
            // nor contains only special characters
            !/^[^a-zA-Z0-9]*$/.test(location)
        )
      )
    ) || [],
  listingType: Array.from(
    new Set(
      configJSON.LISTING_TYPE?.map((type) => type.trim().toLowerCase())
        // if it's not empty (truthy) nor a number we keep it
        .filter((type) => type && !/\d/.test(type))
    )
  ),
  maxPrice: configJSON.MAX_PRICE || 0,
  minSize: configJSON.MIN_SIZE || 0,
  radius: configJSON.RADIUS || 1,
  interval: configJSON.INTERVAL || 15, // Defaults to 15 minutes if not provided
  customReplyRoom: configJSON.CUSTOM_REPLY.ROOM || '',
  customReplyApartment: configJSON.CUSTOM_REPLY.APARTMENT || '',
  filteredWords: Array.from(
    new Set(
      configJSON.FILTERED_WORDS?.map((word) =>
        word.trim().toLowerCase()
      ).filter((word) => word) || []
    )
  ),
};

// Launch Puppeteer
(async () => {
  clearLogsAndConsole();
  if (!configJSON.KAMERNET_EMAIL) {
    logMessage('Missing email address!', 'error', 'red');
    logMessage(
      'Please make sure all the parematers are set correctly in the .json config file, beware of typos!',
      'warning',
      'yellow'
    );
    return;
  }

  const email: string = configJSON.KAMERNET_EMAIL;
  const password: string = await askForPassword();
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  try {
    // Validate the settings before starting Puppeteer
    const settingsValid: boolean = validateSettings(settings);
    if (!settingsValid) {
      process.exit();
    }
    browser = await puppeteer.launch({
      headless: true,
      args: ['--disable-blink-features=AutomationControlled'],
      pipe: true,
      defaultViewport: null,
    });

    let pages: puppeteer.Page[] = await browser.pages();
    page = pages.length === 0 ? await browser.newPage() : pages[0];

    // Login
    const loginResult: boolean = await loginToKamernet(page, email, password);

    if (!loginResult) {
      logMessage(
        'Invalid credentials! Make sure your email and password are correct.',
        'error',
        'red'
      );
      process.exit();
    } else {
      logMessage('Successfully logged into Kamernet.', 'success', 'green');
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
