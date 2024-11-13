"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    // Launch the browser and open a new blank page
    const browser = yield puppeteer_1.default.launch({
        headless: false,
        args: ['--disable-blink-features=AutomationControlled'],
        defaultViewport: null,
    });
    const page = yield browser.newPage();
    // Navigate the page to a URL
    yield page.goto('https://developer.chrome.com/');
    // Set screen size
    yield page.setViewport({ width: 1080, height: 1024 });
    // Type into search box
    yield page.type('.devsite-search-field', 'automate beyond recorder');
    // Wait and click on first result
    const searchResultSelector = '.devsite-result-item-link';
    yield page.waitForSelector(searchResultSelector);
    yield page.click(searchResultSelector);
    // Locate the full title with a unique string
    const textSelector = yield page.waitForSelector('text/Customize and automate');
    const fullTitle = yield (textSelector === null || textSelector === void 0 ? void 0 : textSelector.evaluate((el) => el.textContent));
    // Print the full title
    console.log('The title of this blog post is "%s".', fullTitle);
    yield browser.close();
}))();
