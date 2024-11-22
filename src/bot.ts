// Imports
const path = require("path");
import * as puppeteer from "puppeteer";
import { loginToKamernet } from "./scripts/login";
import { searchListings } from "./scripts/searchListings";
import { wait } from "./utils/randomActions";
import { handle404 } from "./utils/handle404";
import { openTab } from "./scripts/openPage";
import { clearLogsAndConsole, logMessage } from "./utils/logMessage";
import { processSingleTab } from "./scripts/processSingleTab";
import { validateSettings } from "./utils/validateSettings";
import { askForPassword } from "./utils/askForPassword";
require("dotenv").config({ path: path.resolve(__dirname, "../config.env") });

// Initialize settings
const isDev: boolean = process.env.CURRENT_ENV === "development" ? false : true;

export interface Settings {
  location: string[];
  listingType: string[];
  maxPrice: number;
  minSize: number;
  radius: number;
  interval: number;
  customReplyRoom?: string;
  customReplyApartment?: string;
  filteredWords?: string[];
}

const settings: Settings = {
  location:
    Array.from(
      // Creates a Set and then stores converts it into an array,to avoid duplicates
      new Set(
        process.env.LOCATION?.split(",")
          .map((type) => type.trim().toLowerCase())
          // if it's not empty (truthy) nor a number we keep it
          .filter((type) => type && !/\d/.test(type))
      )
    ) || [],
  listingType: process.env.LISTING_TYPE
    ? Array.from(
        new Set(
          process.env.LISTING_TYPE.split(",")
            .map((type) => type.trim().toLowerCase())
            .filter((type) => type && !/\d/.test(type))
        )
      )
    : [],
  maxPrice: Number(process.env.MAX_PRICE || "0"),
  minSize: Number(process.env.MIN_SIZE || "0"),
  radius: Number(process.env.RADIUS || "1"),
  interval: Number(process.env.INTERVAL || "15"), // Defaults to 15 minutes
  customReplyRoom: process.env.CUSTOM_REPLY_ROOM || "",
  customReplyApartment: process.env.CUSTOM_REPLY_APARTMENT || "",
  filteredWords:
    process.env.FILTERED_WORDS?.split("-").map((word) =>
      word.trim().toLowerCase()
    ) || [],
};

// Helper functions

// Launch Puppeteer
(async () => {
  clearLogsAndConsole();
  if (!process.env.KAMERNET_EMAIL) {
    logMessage("Missing email address!", "error", "red");
    logMessage(
      "Please make sure all the parematers are set correctly in the .env config file, beware of typos!",
      "warning",
      "yellow"
    );
    return;
  }

  const email: string = process.env.KAMERNET_EMAIL;
  const password: string = await askForPassword();
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  try {
    // Validate the settings before starting Puppeteer
    const settingsValid: boolean = validateSettings(settings);
    if (!settingsValid) {
      process.exit();
    }
    browser = await puppeteer.launch({
      headless: isDev,
      args: ["--disable-blink-features=AutomationControlled"],
      pipe: true,
      defaultViewport: null,
    });

    let pages: puppeteer.Page[] = await browser.pages();
    page = pages.length === 0 ? await browser.newPage() : pages[0];

    // Login
    const loginResult: boolean = await loginToKamernet(page, email, password);

    if (!loginResult) {
      logMessage(
        "Invalid credentials! Make sure your email and password are correct.",
        "error",
        "red"
      );
      process.exit();
    } else {
      logMessage("Successfully logged into Kamernet.", "success", "green");
    }

    // Accounting for multiple locations selected
    for (const location of settings.location) {
      const searchURL: string = searchListings(settings, location);
      await wait(500, 1740);
      if (location === settings.location[0]) {
        await page.goto(searchURL, { waitUntil: "load" });
      } else {
        await openTab(browser, searchURL);
      }

      // await processSingleTab(settings, location);
    }

    await wait(1000, 1001);

    pages = await browser.pages();

    pages.forEach(async (page, index) => {
      const isPagePresent = await handle404(page);
      if (isPagePresent)
        await processSingleTab(
          page,
          browser,
          settings,
          settings.location[index]
        );
    });

    // Wait before closing
    await new Promise((resolve) => setTimeout(resolve, 1244200));

    // Close the main page
    await page.close();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error);
    }
    setTimeout(async () => {
      if (page) await page.close();
    });
  }
})();
