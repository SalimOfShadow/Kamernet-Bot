import { Browser, Page } from "puppeteer";
import { Settings } from "../bot";
import { wait } from "../utils/randomActions";
import { processListings } from "./processListings";
import { logMessage } from "../utils/logMessage";

export async function searchAndReplyInterval(
  page: Page,
  browser: Browser,
  settings: Settings
) {
  try {
    await page.reload();
    await wait(1200, 2000);
    console.log(settings.interval);
    await processListings(page, browser, settings);
    logMessage("All available listings were successfully processed.", "green");
    logMessage(
      `Searching Again in: ${`\x1b[36m${settings.interval} minutes\x1b[0m`}`
    );
  } catch (error) {
    console.error("Encountered an error during the cronjob:", error);
  } finally {
    setTimeout(() => {
      searchAndReplyInterval(page, browser, settings);
    }, settings.interval * 60 * 1000);
  }
}
