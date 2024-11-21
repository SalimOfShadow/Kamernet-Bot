import { logMessage } from "../utils/logMessage";
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
): Promise<boolean> {
  try {
    // Load the landing page
    await page.goto("https://kamernet.nl/en", { waitUntil: "load" });

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
    logMessage("Logging in...", "blue");
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

    // Wait a bit for the page to process the login
    await wait(2000, 3000);

    // Check if the login failed (error message visible)
    const invalidCredentialsElement: string = "#form-error";
    const invalidCredentials = await page.$(invalidCredentialsElement);

    if (invalidCredentials) {
      return false;
    }

    return true;
  } catch (err: unknown) {
    if (err instanceof Error) {
      // Now TypeScript knows `err` is of type `Error`, so it has the `message` property
      console.error("An error has occurred");
      if (
        err.message ===
        "Execution context was destroyed, most likely because of a navigation."
      ) {
        // TODO - CHANGE THIS INTO A MORE ROBUST WAY OF CHECKING FOR SUCCESSFULL LOGIN
        return true;
      }
    } else {
      console.error("An unknown error occurred");
      console.error(err);
    }
    return false;
  }
}
