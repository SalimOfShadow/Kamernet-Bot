import { Browser } from "puppeteer";
import { wait } from "../utils/randomActions";

export async function openPage(browser: Browser, link: string) {
  const newTab = await browser.newPage();
  try {
    await newTab.goto(link, { waitUntil: "networkidle2" });
    // TODO - FIGURE OUT IF
    // Error: Attempted to use detached Frame && TargetCloseError: Protocol error (Page.reload): Session closed. Most likely the page has been closed.
    // CAN BE TEMPORARILY FIXED WITH  await wait(randomNumber(1500, 2000));
    await wait(1500, 2000);
  } catch (err) {
    console.log(`Failed to navigate to ${link}`);
    console.log(err);
  }
  return newTab;
}
