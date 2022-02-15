/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { App } from "@linkcat/core";
import { PuppeteeerService } from "libs/core/src/lib/service/services/puppeteer_service/puppeteer_service";


let app = new App();
app.service("page",PuppeteeerService);
app.start();
// import * as puppeteer from 'puppeteer'

// (async () => {
//   const browser = await puppeteer.launch({executablePath:"F:\\Program2022\\Projects\\LinkCat\\linkcat\\node_modules\\puppeteer\\.local-chromium\\win64-950341\\chrome-win\\chrome.exe"});
//   const page = await browser.newPage();
//   await page.goto('https://example.com');
//   await page.screenshot({ path: 'example.png' });

//   await browser.close();
// })();
