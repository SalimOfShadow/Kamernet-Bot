import { Page } from "puppeteer";
import { logMessage } from "../utils/logMessage";

// Handles 404 pages
export async function handle404(page: Page): Promise<boolean> {
  const pageTitle = await page.title();
  if (pageTitle.includes("Error")) {
    logMessage(`[Error] -  This page does not exists ${page.url()}.`, "red");
    logMessage(
      "[Warning] -  Please make sure all the paramaters are set correctly in the .env config file, beware of typos!",
      "yellow"
    );
    page.close();
    return false;
  }

  const pageNotFoundMessage: string =
    "#page-content > section > div > p.MuiTypography-root.MuiTypography-body2.mui-style-15ysfrf";
  const notAvailableMessage: string = "#page-content > section > h1";

  const pageNotFound = await page.$$(pageNotFoundMessage);
  const listingNotAvailable = await page.$$(notAvailableMessage);

  if (pageNotFound.length > 0 || listingNotAvailable.length > 0) {
    logMessage(`[Error] -  This page does not exists ${page.url()}.`, "red");
    logMessage(
      "[Warning] -  Please make sure all the paramaters are set correctly in the .env config file, beware of typos!",
      "yellow"
    );
    page.close();
    return false;
  }
  return true;
}
