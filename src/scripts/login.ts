import { randomKeyDelay, randomNumber, wait } from "../utils/randomActions";
import { Page } from "puppeteer";

export async function loginToKamernet(
  page: Page,
  email: string,
  password: string
): Promise<void> {
  try {
    // Load the landing page
    await page.goto("https://kamernet.nl/en", { waitUntil: "networkidle2" });

    // Click the Login button
    await page.waitForSelector("#page-header > nav > button:nth-child(4)", {
      visible: true,
    });
    await page.click("#page-header > nav > button:nth-child(4)");

    // Wait for the Login page to load
    await page.waitForSelector("#email");
    await page.waitForSelector("#password");

    // Type the email and password in the fields
    await wait(randomNumber(400, 1000));

    await page.click("#email");
    await wait(randomNumber(300, 1000));
    await page.type("#email", email, { delay: randomKeyDelay() });

    await wait(randomNumber(800, 2000));

    await page.click("#password");
    await wait(randomNumber(300, 1000));
    await page.type("#password", password, { delay: randomKeyDelay() });

    // Click the login button and sign in
    await wait(randomNumber(1000, 2000));
    await page.click(
      "#login > div.mdc-touch-target-wrapper > button > span.mdc-button__touch"
    );
  } catch (err) {
    console.error("An error has accoured");
    console.error(err);
  }
}
