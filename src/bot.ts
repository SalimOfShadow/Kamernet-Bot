// Imports
require('dotenv').config({ path: '../.env' });
import * as puppeteer from 'puppeteer';
import { loginToKamernet } from './scripts/login';
import { searchListings } from './scripts/searchListings';
import { wait } from './utils/randomActions';
import { processAllPages } from './scripts/processAllPages';
import { searchAndReplyInterval } from './scripts/searchAndReplyInterval';

// Initialize settings
const isProd: boolean = process.env.CURRENT_ENV === 'production' ? true : false;

export interface Settings {
  location: string;
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
  location: process.env.LOCATION || '',
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
  if (!process.env.KAMERNET_EMAIL || !process.env.KAMERNET_PASSWORD) {
    throw new Error('Please provide your credentials to proceed.');
  }

  const email: string = process.env.KAMERNET_EMAIL;
  const password: string = process.env.KAMERNET_PASSWORD;

  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  try {
    browser = await puppeteer.launch({
      headless: isProd,
      args: ['--disable-blink-features=AutomationControlled'],
      pipe: true,
      defaultViewport: null,
    });

    const pages: puppeteer.Page[] = await browser.pages();
    page = pages.length === 0 ? await browser.newPage() : pages[0];

    // Login
    await loginToKamernet(page, email, password);

    // Generate URL and navigate into it
    const searchURL: string = searchListings(settings);

    await wait(500, 1740);
    await page.goto(searchURL, { waitUntil: 'networkidle2' });

    // Fetch the number of pages
    const lastPageButton: string =
      '#page-content > section:nth-child(2) > div > nav > ul > li:nth-last-child(2) > button'; // From the <ul>, pick the second to last child (li:nth-last-child("2"))

    // Process all the possible pages and reply to each insertion
    try {
      const availablePages: number = await page.$eval(
        lastPageButton,
        (button) => Number(button.textContent?.trim())
      );
      if (availablePages !== 0) {
        await processAllPages(
          page,
          browser,
          availablePages,
          searchURL,
          settings
        );
        console.log(`Last Page Button Message : ${availablePages}`);
      }
    } catch (err) {
      console.log('No page button found,continuing...');
    }

    // Start the cronjob to reply to search for and reply to new listings every N minutes

    await searchAndReplyInterval(page, browser, settings);

    // Wait before closing
    await new Promise((resolve) => setTimeout(resolve, 1244200));

    // Close the main page
    await page.close();
  } catch (error: unknown) {
    console.log(error as string);
    setTimeout(async () => {
      if (page) await page.close();
    });
  }
})();
