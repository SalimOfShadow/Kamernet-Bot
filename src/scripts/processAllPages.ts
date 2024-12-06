import { Browser, Page } from 'puppeteer';
import { wait } from '../utils/randomActions';
import { processListings } from './processListings';
import { Settings } from '../bot';
import { logMessage } from '../utils/logMessage';

export async function processAllPages(
  page: Page,
  browser: Browser,
  totalPages: number,
  searchURL: string,
  settings: Settings
) {
  let pageIndex: number = 1;

  do {
    const nextPageLink: string = searchURL + `&pageNo=${pageIndex}&sort=1`;
    await page.goto(nextPageLink, { waitUntil: 'load', timeout: 0 });
    await wait(1200, 2000);
    await processListings(page, browser, settings);
    pageIndex++;
  } while (pageIndex <= totalPages);
  logMessage('All pages have been processed', 'success', 'green');
  // Return to the first page after all the others have been processed
  await page.goto(searchURL, { waitUntil: 'networkidle2', timeout: 0 });
}
