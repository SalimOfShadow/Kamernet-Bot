import { Page } from 'puppeteer';
import { Settings } from '../bot';
import { wait } from '../utils/randomActions';

export async function filterByDescription(page: Page, settings: Settings) {
  const descriptionElement: string =
    '#page-content > div.ListingFound_gridContainer__4AReK > div.ListingFound_leftColumn__foKo2 > section.About_root__t6uAW > pre > p';
  const description: string = await page.$eval(
    descriptionElement,
    (description) => description.textContent?.trim().toLowerCase() || ''
  );
  const descriptionsWords: string[] = description.split(' ');

  const filteredWords = settings.filteredWords || [];

  // Remove each empty word
  const filteredWordsParsed: string[] = filteredWords.filter(
    (word) => word !== ''
  );

  if (filteredWordsParsed.length !== 0) {
    for (const word of descriptionsWords) {
      if (filteredWordsParsed.some((filteredWord) => filteredWord === word)) {
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
