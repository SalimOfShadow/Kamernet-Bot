import { Page } from 'puppeteer';
import { Settings } from '../bot';
import { randomMouseClickDelay, wait } from '../utils/randomActions';
import { filterByDescription } from './filterByDescription';
import { handle404 } from './handle404';

// TODO - Handle the case where only one listing is present

export async function replyToListing(page: Page, settings: Settings) {
  // Close the page if a description contains one of the specified words
  const foundFilteredWord: boolean = await filterByDescription(page, settings);
  if (foundFilteredWord) return;
  // Close the page if a reply has already been sent
  const messageSentBox: string =
    '#page-content > div.ListingFound_gridContainer__4AReK > div.ListingFound_rightColumn__e5LwV > section > div.Overview_root__4rJz_ > section:nth-child(4) > div';

  if ((await page.$(messageSentBox)) !== null) {
    console.log('Already replayed to this listing.');
    await page.close();
    return;
  }

  await wait(1500, 2000); // Add a short wait after navigation

  // Check if the page exists
  const isPagePresent = await handle404(page);
  if (!isPagePresent) {
    await page.close();
    return;
  }

  // Navigate to the message page
  const contactLandlordButton: string =
    '#page-content > div.ListingFound_gridContainer__4AReK > div.ListingFound_rightColumn__e5LwV > section > div.Overview_root__4rJz_ > section:nth-child(4) > a';

  await page.waitForSelector(contactLandlordButton);
  await wait(1000, 2000);

  await page.evaluate((buttonSelector) => {
    const button = document.querySelector(buttonSelector);
    if (button && button instanceof HTMLAnchorElement) {
      // Cast the element to HTMLAnchorElement to access the 'click' method
      button.click();
    }
  }, contactLandlordButton);
  // await page.click(contactLandlordButton, { delay: randomMouseClickDelay() });

  // Fill out the reply field and send a message to the landlord
  await contactLandlord(page, settings);
}

async function contactLandlord(page: Page, settings: Settings) {
  const replyField: string = '#Message';
  const sendMessageButton =
    'body > main > div:nth-child(1) > div.container > div > form > div.barrier-questions__footer > button';

  await wait(2000, 2001); // TODO - FIGURE OUT WHY WE NEED TO WAIT 2 SECONDS TO GUARANTEE THAT THE REPLY FIELD IS LOADED

  const messageSelector = await page.$$(replyField);

  if (messageSelector.length > 0) {
    console.log('Found the message selector!');
    await page.click(replyField);
  } else {
    console.log("Couldn't find the message selector,retrying in 2 seconds");
    await wait(1000, 2000);
    contactLandlord(page, settings);
    return;
  }

  await page.waitForSelector(replyField);
  // TODO - COPY AND PASTE THE TEXT INSTEAD OF TYPING
  await page.type(replyField, settings.customReplyRoom || '');

  console.log('SHOULD CLICK THE BUTTON');
  // await page.click(sendMessageButton, { delay: randomMouseClickDelay() });
  console.log(`Replied to this listing :  ${page.url()}`);
  await wait(1000, 2000);

  await page.close();
}
