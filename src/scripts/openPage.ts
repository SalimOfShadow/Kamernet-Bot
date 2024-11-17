import { Browser } from "puppeteer";
import { randomNumber, wait } from "../utils/randomActions";

export async function openPage(browser: Browser, link: string) {
  const newTab = await browser.newPage();
  try {
    await newTab.goto(link, { waitUntil: "networkidle2" });
    await wait(randomNumber(1500, 2000)); // Add a short wait after navigation
  } catch (err) {
    console.log(`Failed to navigate to ${link}`);
    console.log(err);
  }
  return newTab;
}
