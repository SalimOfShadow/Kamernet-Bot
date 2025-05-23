import { Page } from "puppeteer";
import { Settings } from "../bot";
import { randomMouseClickDelay, wait } from "../utils/randomActions";
import { filterByDescription } from "./filterByDescription";
import { handle404 } from "../utils/handle404";
import { logMessage } from "../utils/logMessage";

// TODO - Handle the case where only one listing is present

export async function replyToListing(page: Page, settings: Settings) {
  // Check if the page exists
  const pagePresent = await handle404(page);
  if (!pagePresent) {
    return false;
  }

  const foundFilteredWord: boolean = await filterByDescription(page, settings);
  if (foundFilteredWord) return;

  const messageSentBox: string =
    "#page-content > div.ListingFound_gridContainer__4AReK > div.ListingFound_rightColumn__e5LwV > section > div.Overview_root__4rJz_ > section:nth-child(4) > div";

  if ((await page.$(messageSentBox)) !== null) {
    logMessage(
      `Already replied to this listing: \x1b[37m     ${page.url()}   \x1b[0m`,
      "skipped",
      "yellow"
    );
    await page.close();
    return;
  }

  await wait(1500, 2000);

  const listingURL: string = page.url();

  // Navigate to the message page
  const contactLandlordButton: string =
    "#page-content > div.ListingFound_gridContainer__4AReK > div.ListingFound_rightColumn__e5LwV > section > div.Overview_root__4rJz_ > section:nth-child(4) > a";

  await page.waitForSelector(contactLandlordButton);
  await wait(1000, 2000);

  // Wait for the redirect page to be fully loaded before proceeding
  await Promise.all([
    page.evaluate((buttonSelector) => {
      const button = document.querySelector(buttonSelector);
      if (button && button instanceof HTMLAnchorElement) {
        button.click();
      }
    }, contactLandlordButton),
    page.waitForNavigation({ waitUntil: "load", timeout: 0 }),
  ]);

  await contactLandlord(page, settings, listingURL, 0);
}

async function contactLandlord(
  page: Page,
  settings: Settings,
  listingURL: string,
  attempts: number
) {
  try {
    if (attempts > 5) {
      // console.log('Retried 5 times,exiting...');
      return;
    }
    const sendMessageButton =
      "body > main > div:nth-child(1) > div.container > div > form > div.barrier-questions__footer > button";
    const messageField: string = "#Message";

    await page.waitForSelector(messageField, { timeout: 0 });

    await page.click(messageField);

    const messageSelector = await page.$(messageField);
    if (messageSelector) {
      await page.click(messageField);
    } else {
      //Couldn't find the message selector,retrying in 2 seconds"
      await wait(1000, 2000);
      contactLandlord(page, settings, listingURL, attempts + 1);
      return;
    }

    // TODO - COPY AND PASTE THE TEXT INSTEAD OF TYPING
    await page.type(messageField, settings.customReplyRoom || "");

    await wait(4000, 5200); // TODO - FIND A BETTER APPROACH OF WAITING FOR THE MESSAGE TO BE FULLY TYPED

    await page.click(sendMessageButton, { delay: randomMouseClickDelay() });
    await page.waitForNavigation({ waitUntil: "load", timeout: 0 });
    await wait(1000, 1200);
    logMessage(
      `Successfully replied to this listing: \x1b[37m   ${listingURL}   \x1b[0m`,
      "success",
      "green"
    );
    await wait(1000, 2000);

    await page.close();
  } catch (err) {
    console.log(err);
  }
}
