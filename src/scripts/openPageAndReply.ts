import { Browser, Page } from "puppeteer";
import { Settings } from "../bot";
import {
  randomMouseClickDelay,
  randomNumber,
  wait,
} from "../utils/randomActions";

export async function openPage(browser: Browser, link: string) {
  const newTab = await browser.newPage();
  await newTab.goto(link);
  return newTab;
}
export async function replyToListing(page: Page, settings: Settings) {
  const contactLandlordButton: string =
    "#page-content > div > div.ListingFound_rightColumn__e5LwV > section > div.Overview_root__4rJz_ > section:nth-child(4) > a > button";
  await page.waitForSelector(contactLandlordButton);

  await wait(randomNumber(1000, 2000));
  // Press the "Contact landlord" button
  await page.click(contactLandlordButton, { delay: randomMouseClickDelay() });
  console.log("SHOULD REPLY TO LISTING");
}
