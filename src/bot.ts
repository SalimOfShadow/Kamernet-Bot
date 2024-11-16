// Imports
require("dotenv").config({ path: "../.env" });
import * as puppeteer from "puppeteer";
import { loginToKamernet } from "./scripts/login";

const isProd: boolean = process.env.CURRENT_ENV === "production" ? true : false;

interface Settings {
  maxPrice: number;
  minRooms: number;
  location: string;
  interval: number;
  customReplyRoom?: string;
  customReplyApartment?: string;
}

const settings: Settings = {
  maxPrice: Number(process.env.MAX_PRICE || "0"),
  minRooms: Number(process.env.MIN_ROOMS || "1"),
  location: process.env.LOCATION || "",
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

    // Interact with the website :
    loginToKamernet(page, email, password);

    await new Promise((resolve) => setTimeout(resolve, 1244200));

    await page.close();
  } catch (error: unknown) {
    console.log(error as string);
    setTimeout(async () => {
      if (page) await page.close();
    });
  }
})();
