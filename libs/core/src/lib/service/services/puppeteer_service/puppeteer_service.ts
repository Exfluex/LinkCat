import { Context } from "../../../context";
import { Payload } from "../../../payload";
import * as puppeteer from 'puppeteer';
import { PageHelper, PageHelperFiller, PageService } from "../page_service";


export class PuppeteeerService extends PageService {
  static browser: puppeteer.Browser;
  private readonly regex = /^http([s]{0,1})(?:\/(.*))[\/#\?]?$/i;
  config: any = {
    timeout: 50
  };
  active: boolean = false;
  async start(): Promise<number> {
    this.active = true;
    PuppeteeerService.browser = await puppeteer.launch({ executablePath: "F:\\Program2022\\Projects\\LinkCat\\linkcat\\node_modules\\puppeteer\\.local-chromium\\win64-950341\\chrome-win\\chrome.exe" });
    return 0;
  }
  stop(): void {
    this.active = false;
    PuppeteeerService.browser.close();
  }
  constructor(ctx: Context) {
    super(ctx, "Puppeteer",PuppeteerPlugin);
    service = this;
  }

}
let service: PuppeteeerService;

class PuppeteerPlugin extends PageHelperFiller {
  async gen(ctx: Context, payload: Payload): Promise<PageHelper> {
    const page = await PuppeteeerService.browser.newPage();
    await page.goto(payload.origin);
    return {
      $Content: async (selector) => {
        try {
          const element = await page.waitForSelector(selector, service.config); // select the element
          if (element != null) {
            let value = await element.evaluate(el => el.textContent); // grab the textContent from the element, by evaluating this function in the browser context
            return value ?? `Cannot Fetch Data[${selector}]`;
          }
        }
        catch (error) {
        }
        return "";
      },
      raw: async (selector) => {
        return page.waitForSelector(selector, service.config);
      },
      provider: "puppeteer"
    };
  }
}