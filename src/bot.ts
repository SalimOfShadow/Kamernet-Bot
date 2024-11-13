// Imports
require('dotenv').config();
import * as puppeteer from 'puppeteer';

const isProd: boolean = process.env.CURRENT_ENV === 'production' ? true : false;
// Setup Puppeteer

(async () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  try {
    browser = await puppeteer.launch({
      headless: isProd,
      args: ['--disable-blink-features=AutomationControlled'],
      defaultViewport: null,
    });

    const pages = await browser.pages();
    page = pages.length === 0 ? await browser.newPage() : pages[0];

    // RUN THE SCRIPTS HERE

    await page.goto('https://bot-detector.rebrowser.net');
    await new Promise((resolve) => setTimeout(resolve, 1244200));

    await page.close();
  } catch (error: unknown) {
    setTimeout(async () => {
      if (page) await page.close();
    });
  }
})();
