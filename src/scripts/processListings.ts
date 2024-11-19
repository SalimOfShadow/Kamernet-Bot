import { Page, Browser } from "puppeteer";
import { replyToListing } from "./replyToListing";
import { wait } from "../utils/randomActions";
import { Settings } from "../bot";
import { openPage } from "./openPage";
export async function processLinks(
  links: string[],
  browser: Browser,
  settings: Settings
) {
  for (const link of links) {
    try {
      const newPage = await openPage(browser, link);
      await replyToListing(newPage, settings);
      await wait(800, 1000);
    } catch (error) {
      console.error(`Error replying to listing ${link}:`, error);
    }
  }
}

export async function processListings(
  page: Page,
  browser: Browser,
  settings: Settings
) {
  // Search for listings
  const listingContainer: string = ".MuiContainer-root";
  await page.waitForSelector(listingContainer);

  const listingGrids = await page.$$(
    `${listingContainer} > .GridGenerator_root__gJhqx`
  );

  // Process containers and replies to each listing
  for (const grid of listingGrids) {
    const gridLinks = await grid.$$eval("a", (anchors) =>
      anchors.map((anchor) => anchor.href)
    );
    await processLinks(gridLinks, browser, settings);
  }
}
