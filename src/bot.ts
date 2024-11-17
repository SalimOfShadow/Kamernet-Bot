// Imports
require("dotenv").config({ path: "../.env" });
import * as puppeteer from "puppeteer";
import { loginToKamernet } from "./scripts/login";
import { searchListings } from "./scripts/searchListings";
import { randomNumber, wait } from "./utils/randomActions";
import { openPage, replyToListing } from "./scripts/openPageAndReply";

const isProd: boolean = process.env.CURRENT_ENV === "production" ? true : false;

export interface Settings {
  location: string;
  listingType: string[];
  maxPrice: number;
  minRooms: number;
  radius: number;
  interval: number;
  customReplyRoom?: string;
  customReplyApartment?: string;
}

const settings: Settings = {
  location: process.env.LOCATION || "",
  listingType: process.env.LISTING_TYPE?.split(",") || [],
  maxPrice: Number(process.env.MAX_PRICE || "0"),
  minRooms: Number(process.env.MIN_SIZE || "0"),
  radius: Number(process.env.RADIUS || "0"),
  interval: Number(process.env.INTERVAL || "15"), // Defaults to 15 minutes
  customReplyRoom: process.env.CUSTOM_REPLY_ROOM || "",
  customReplyApartment: process.env.CUSTOM_REPLY_APARTMENT || "",
};

// Launch Puppeteer
(async () => {
  if (!process.env.KAMERNET_EMAIL || !process.env.KAMERNET_PASSWORD) {
    throw new Error("Please provide your credentials to proceed.");
  }

  const email: string = process.env.KAMERNET_EMAIL;
  const password: string = process.env.KAMERNET_PASSWORD;

  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  try {
    browser = await puppeteer.launch({
      headless: isProd,
      args: ["--disable-blink-features=AutomationControlled"],
      defaultViewport: null,
    });

    const pages: puppeteer.Page[] = await browser.pages();
    page = pages.length === 0 ? await browser.newPage() : pages[0];

    // Website interaction :

    // Login
    await loginToKamernet(page, email, password);

    // Search for listings and retrieve their links
    const searchURL: string = searchListings(settings);
    await wait(randomNumber(500, 1740));
    await page.goto(searchURL, { waitUntil: "networkidle2" });
    await page.waitForSelector(
      "#page-content > section:nth-child(2) > div > div:nth-child(3)"
    );
    const links = await page.$$eval(
      "#page-content > section:nth-child(2) > div > div:nth-child(3) a",
      (anchors) => anchors.map((anchor) => anchor.href)
    );

    // Open the listings and send replies
    links.forEach(async (link) => {
      const newPage: puppeteer.Page = await openPage(browser, link);
      await replyToListing(newPage, settings);
    });
    await new Promise((resolve) => setTimeout(resolve, 1244200));

    // Close the main page
    await page.close();
  } catch (error: unknown) {
    console.log(error as string);
    setTimeout(async () => {
      if (page) await page.close();
    });
  }
})();
