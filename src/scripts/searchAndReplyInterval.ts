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
    // TODO - Write a log message to alert the user of the incoming search ( logMessage("Started searching for rooms in ${location}..."))
    await page.reload();
    await wait(1000, 2000);
    await processListings(page, browser, settings);
    logMessage(
      "[Info] -  All available listings were successfully processed.",
      "green"
    );

    const nextSearchTime = new Date(
      Date.now() + settings.interval * 60 * 1000
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Use false for 24-hour format
    });
    logMessage(
      `[Info] -  Searching Again in: ${`\x1b[36m${settings.interval} minutes   at ${nextSearchTime} \x1b[0m`}`
    );
  } catch (error: unknown) {
    logMessage(
      `[Error] -  Encountered an error during the cronjob: ${error as string}`
    ),
      "red";
  } finally {
    setTimeout(() => {
      searchAndReplyInterval(page, browser, settings);
    }, settings.interval * 60 * 1000);
  }
}
