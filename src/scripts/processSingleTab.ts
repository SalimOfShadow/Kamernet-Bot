import { Browser, Page } from 'puppeteer';
import { Settings } from '../bot';
import { searchAndReplyInterval } from './searchAndReplyInterval';
import { processAllPages } from './processAllPages';
import { logMessage } from '../utils/logMessage';
// Generate URL and navigate into it
export async function processSingleTab(
  page: Page,
  browser: Browser,
  settings: Settings,
  location: string
) {
  // Fetch the number of pages
  const lastPageButton: string =
    '#page-content > section:nth-child(2) > div > nav > ul > li:nth-last-child(2) > button'; // From the <ul>, pick the second to last child (li:nth-last-child("2"))

  // Process all the possible pages and reply to each insertion
  try {
    console.log('Waiting for the page button');
    await page.waitForSelector(lastPageButton, { timeout: 5000 });
    console.log('Stopped waiting for the page button');

    const availablePages: number = await page.$eval(lastPageButton, (button) =>
      Number(button.textContent?.trim())
    );
    console.log(`These are the avaialblePages : ${availablePages}`);

    if (availablePages !== 0) {
      console.log(`Should process all ${availablePages} pages for ${location}`);
      const currentPageURL = await page.url();
      await processAllPages(
        page,
        browser,
        availablePages,
        currentPageURL,
        settings
      );
    }
    console.log(
      `Got to the end of processSingleLocation,i should now start the interval: `
    );
    // Start the cronjob to search for and reply to new listings every N minutes
  } catch (err: unknown) {
    logMessage(err as string, 'red');
    console.log('No page button found,continuing...');
  } finally {
    await searchAndReplyInterval(page, browser, settings);
  }
}
