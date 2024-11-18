import { Browser, Page } from "puppeteer";
import { Settings } from "../bot";
import {
  randomMouseClickDelay,
  randomNumber,
  wait,
} from "../utils/randomActions";

// TODO - Handle the case where only one listing is present

export async function replyToListing(page: Page, settings: Settings) {
  // Close the page if a reply has already been sent
  const messageSentBox: string =
    "#page-content > div.ListingFound_gridContainer__4AReK > div.ListingFound_rightColumn__e5LwV > section > div.Overview_root__4rJz_ > section:nth-child(4) > div";

  if ((await page.$(messageSentBox)) !== null) {
    console.log("Already replayed to this listing.");
    await page.close();
    return;
  }

  await wait(randomNumber(1500, 2000)); // Add a short wait after navigation

  // Handles 404 pages
  const pageNotFoundMessage: string =
    "#page-content > section > div > p.MuiTypography-root.MuiTypography-body2.mui-style-15ysfrf";
  const notAvailableMessage: string = "#page-content > section > h1";

  const pageNotFound = await page.$$(pageNotFoundMessage);
  const listingNotAvailable = await page.$$(notAvailableMessage);

  if (pageNotFound.length > 0 || listingNotAvailable.length > 0) {
    console.log("This advert is no longer available.");
    await page.close();
    return;
  }

  // Navigate to the message page
  const contactLandlordButton: string =
    "#page-content > div.ListingFound_gridContainer__4AReK > div.ListingFound_rightColumn__e5LwV > section > div.Overview_root__4rJz_ > section:nth-child(4) > a";

  await page.waitForSelector(contactLandlordButton);
  await wait(randomNumber(1000, 2000));

  await page.click(contactLandlordButton, { delay: randomMouseClickDelay() });
  // Fill the reply field and send the message to the landlord
  await contactLandlord(page, settings);
}

async function contactLandlord(page: Page, settings: Settings) {
  const replyField: string = "#Message";
  const sendMessageButton =
    "body > main > div:nth-child(1) > div.container > div > form > div.barrier-questions__footer > button";

  await wait(randomNumber(2000, 2001)); // TODO - FIGURE OUT WHY WE NEED TO WAIT 2 SECONDS TO GUARANTEE THAT THE REPLY FIELD IS LOADED

  const messageSelector = await page.$$(replyField);

  if (messageSelector.length > 0) {
    console.log("Found the message selector!");
    await page.click(replyField);
  } else {
    console.log("Couldn't find the message selector,retrying in 2 seconds");
    await wait(randomNumber(1000, 2000));
    contactLandlord(page, settings);
    return;
  }

  await page.waitForSelector(replyField);
  // TODO - COPY AND PASTE THE TEXT INSTEAD OF TYPING
  await page.type(replyField, settings.customReplyRoom || "");

  await page.click(sendMessageButton, { delay: randomMouseClickDelay() });

  console.log(`Replied to this listing :  ${page.url()}`);
  await wait(randomNumber(1000, 2000));

  await page.close();
}
