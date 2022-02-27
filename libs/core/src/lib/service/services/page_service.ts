import { Annotation } from "../../annotation";
import { Context, Next } from "../../context";
import { Payload } from "../../payload";
import { Service } from "../service";




export abstract class PageService extends Service {
  constructor(ctx: Context, nickName: string,public plugin:new (ctx: Context) => PageHelperFiller=FakePageHelperFiller) {
    super(ctx, "page", nickName);
    ctx.plugin(this.plugin);
  }
}



export abstract class PageHelperFiller {
  name = "puppeteer";
  constructor(ctx: Context) {
    const scope = ctx.on("resource.origin=:protocol(http|https)/:rest(.*)");
    const builder = scope.build().define("$page", "PageService", Annotation.BaseTypeDefinition.Boolean, async (ctx, payload) => {
      const helper = await this.gen(ctx, payload);
      if(helper){
        payload.global["$page"]=helper;
      }
      payload.annotations["$page"] = "true";
    });
    builder.register();
  }
  abstract gen(ctx: Context, payload: Payload, data?: any): PageHelper | Promise<PageHelper> | null;
}

export class FakePageHelperFiller extends PageHelperFiller {
  gen(ctx: Context): PageHelper | null {
    return null;
  }

}

export namespace FakePageHelperFiller {
  export class FakePageHelper implements PageHelper {
    $Content(selector: string): string {
      return "Fake Data";
    }

    raw(selector: string): any {
      return null;
    }
    provider = "fake";

  }
}
export interface PageHelper {
  $Content(selector: string): Promise<string> | string;
  raw(selector: string): Promise<any> | string;
  provider: string;
}
