import { Page } from "puppeteer";
import { Settings } from "../bot";
import { wait } from "../utils/randomActions";

export async function filterByDescription(page: Page, settings: Settings) {
  const descriptionElement: string =
    "#page-content > div.ListingFound_gridContainer__4AReK > div.ListingFound_leftColumn__foKo2 > section.About_root__t6uAW > pre > p";
  const description: string = await page.$eval(
    descriptionElement,
    (description) => description.textContent?.trim().toLowerCase() || ""
  );
  if (settings.filteredWords) {
    for (const word of settings.filteredWords) {
      if (description.includes(word)) {
        console.log(
          `Listing discarded: The description contained the following blacklisted words: -[ ${word} ]-`
        );
        wait(1000, 12000);
        await page.close();
        return true;
      }
    }
  }
  return false;
}
