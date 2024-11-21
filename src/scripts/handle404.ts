import { Page } from "puppeteer";
import { logMessage } from "../utils/logMessage";

// Handles 404 pages
export async function handle404(page: Page): Promise<boolean> {
  const pageTitle = await page.title();
  if (pageTitle.includes("Error")) {
    logMessage("404 Error detected.", "red");
    logMessage(
      "Please make sure all the paramaters are set correctly in the .env config file!",
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
    logMessage("This page is no longer available.", "red");
    logMessage(
      "Please make sure all the paramaters are set correctly in the .env config file!",
      "yellow"
    );
    page.close();
    return false;
  }
  return true;
}
