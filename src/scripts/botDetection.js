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
    const browser = yield puppeteer_1.default.launch({
        headless: false,
        args: ['--disable-blink-features=AutomationControlled'],
        defaultViewport: null,
    });
    const page = (yield browser.pages())[0] || (yield browser.newPage());
    // Call dummyFn in the main context
    yield page.evaluate(() => {
        if (typeof window.dummyFn !== 'function') {
            window.dummyFn = () => console.log('dummyFn called');
        }
        window.dummyFn();
    });
    // Expose the exposedFn to test the exposeFunctionLeak
    //   await page.exposeFunction('exposedFn', () => console.log('exposedFn call'));
    // Trigger sourceUrlLeak by accessing detections-json
    yield page.evaluate(() => document.getElementById('detections-json'));
    // Attempt isolated context evaluation to trigger mainWorldExecution
    const isolatedContext = yield page.evaluateHandle(() => document.getElementsByClassName('div'));
    console.log(yield isolatedContext.jsonValue());
    yield isolatedContext.dispose();
    // Open the rebrowser-bot-detector page to view the test results
    yield page.goto('https://bot-detector.rebrowser.net');
    // Allow time to observe the results in the console
    yield new Promise((resolve) => setTimeout(resolve, 1235000));
    yield browser.close();
}))();
