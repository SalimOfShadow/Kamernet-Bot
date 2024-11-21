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
    console.log(`Search and reply fired }`);
    await page.reload();
    await wait(1000, 2000);
    console.log(settings.interval);
    await processListings(page, browser, settings);
    logMessage("All available listings were successfully processed.", "green");

    const nextSearchTime = new Date(
      Date.now() + settings.interval * 60 * 1000
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Use false for 24-hour format
    });
    logMessage(
      `Searching Again in: ${`\x1b[36m${settings.interval} minutes   at ${nextSearchTime} \x1b[0m`}`
    );
  } catch (error: unknown) {
    logMessage(`Encountered an error during the cronjob: ${error as string}`),
      "red";
  } finally {
    setTimeout(() => {
      searchAndReplyInterval(page, browser, settings);
    }, settings.interval * 60 * 1000);
  }
}
