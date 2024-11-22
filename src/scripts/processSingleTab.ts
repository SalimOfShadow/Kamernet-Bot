import { Browser, Page } from "puppeteer";
import { Settings } from "../bot";
import { searchAndReplyInterval } from "./searchAndReplyInterval";
import { processAllPages } from "./processAllPages";
import { logMessage } from "../utils/logMessage";
// Generate URL and navigate into it
export async function processSingleTab(
  page: Page,
  browser: Browser,
  settings: Settings,
  location: string
) {
  // Fetch the number of pages
  const lastPageButton: string =
    "#page-content > section:nth-child(2) > div > nav > ul > li:nth-last-child(2) > button"; // From the <ul>, pick the second to last child (li:nth-last-child("2"))

  // Process all the possible pages and reply to each insertion
  try {
    await page.waitForSelector(lastPageButton, { timeout: 5000 });

    const availablePages: number = await page.$eval(lastPageButton, (button) =>
      Number(button.textContent?.trim())
    );

    if (availablePages !== 0) {
      const currentPageURL = await page.url();
      logMessage(
        `Your research for listings in ${location} returned ${availablePages} pages. Processing them now...`,
        "info",
        "blue"
      );
      await processAllPages(
        page,
        browser,
        availablePages,
        currentPageURL,
        settings
      );
    }
  } catch (err: unknown) {
    logMessage(
      `Your research for listings in ${location} returned only 1 page. Processing it now...`,
      "info",
      "blue"
    );
  } finally {
    // Start the cronjob to search for and reply to new listings every N minutes
    await searchAndReplyInterval(page, browser, settings, location);
  }
}
