import { Page } from 'puppeteer';

// Handles 404 pages
export async function handle404(page: Page): Promise<boolean> {
  const pageNotFoundMessage: string =
    '#page-content > section > div > p.MuiTypography-root.MuiTypography-body2.mui-style-15ysfrf';

  const notAvailableMessage: string = '#page-content > section > h1';

  const pageNotFound = await page.$$(pageNotFoundMessage);
  const listingNotAvailable = await page.$$(notAvailableMessage);

  if (pageNotFound.length > 0 || listingNotAvailable.length > 0) {
    console.error('This page is no longer available.');
    console.warn(
      'Please make sure all the paramaters are set correctly in the .env config file!'
    );
    await page.close();
    return false;
  }
  return true;
}
