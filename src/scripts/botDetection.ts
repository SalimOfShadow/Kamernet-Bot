import puppeteer, { Browser, Page } from 'puppeteer';
declare global {
  interface Window {
    dummyFn: () => void;
  }
}
(async () => {
  const browser: Browser = await puppeteer.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled'],
    defaultViewport: null,
  });
  const page: Page = (await browser.pages())[0] || (await browser.newPage());

  // Call dummyFn in the main context
  await page.evaluate(() => {
    if (typeof window.dummyFn !== 'function') {
      window.dummyFn = () => console.log('dummyFn called');
    }
    window.dummyFn();
  });

  // Expose the exposedFn to test the exposeFunctionLeak
  //   await page.exposeFunction('exposedFn', () => console.log('exposedFn call'));

  // Trigger sourceUrlLeak by accessing detections-json
  await page.evaluate(() => document.getElementById('detections-json'));

  // Attempt isolated context evaluation to trigger mainWorldExecution
  const isolatedContext = await page.evaluateHandle(() =>
    document.getElementsByClassName('div')
  );
  console.log(await isolatedContext.jsonValue());
  await isolatedContext.dispose();

  // Open the rebrowser-bot-detector page to view the test results
  await page.goto('https://bot-detector.rebrowser.net');

  // Allow time to observe the results in the console
  await new Promise((resolve) => setTimeout(resolve, 1235000));
  await browser.close();
})();
