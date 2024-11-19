import {
  randomKeyDelay,
  randomMouseClickDelay,
  wait,
} from "../utils/randomActions";
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
    const loginButtonMainPage: string =
      "#page-header > nav > button:nth-child(4)";
    await page.waitForSelector(loginButtonMainPage, {
      visible: true,
    });
    await page.click(loginButtonMainPage, {
      delay: randomMouseClickDelay(),
    });

    // Wait for the Login page to load
    await page.waitForSelector("#email");
    await page.waitForSelector("#password");

    // Type the email and password in the fields
    await wait(400, 1000);

    await page.click("#email", { delay: randomMouseClickDelay() });
    await wait(300, 1000);
    await page.type("#email", email, { delay: randomKeyDelay() });

    await wait(800, 2000);

    await page.click("#password", { delay: randomMouseClickDelay() });
    await wait(300, 1000);
    await page.type("#password", password, { delay: randomKeyDelay() });

    // Click the login button and sign in
    await wait(1000, 2000);
    const loginButton: string =
      "#login > div.mdc-touch-target-wrapper > button > span.mdc-button__touch";
    await page.click(loginButton, { delay: randomMouseClickDelay() });
  } catch (err) {
    console.error("An error has accoured");
    console.error(err);
  }
}
