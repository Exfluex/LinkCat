import { AsyncForEach, FlowManager } from "@linkcat/utils";
import { Context, Next } from "../context";
import { Payload } from "../payload";
import { Service } from "../service";

namespace App {
  export interface Config {

  }
}


export interface App {
}




const startUpChain= ["notify", "endpoint", "annotate", "page", "render"] as const;
type RequiredService = typeof startUpChain[number];
type ExtendService<CustomService extends string> = RequiredService | CustomService;

export class App<CustomService extends string = never> extends Context {
  //TODO use WithDeps annotation to Enchance Flexibility. [IoC Feature]
  processFlow:FlowManager<ExtendService<CustomService>>=new FlowManager<ExtendService<CustomService>>();
  constructor(config?: App.Config) {
    super();
    this.processFlow.then("notify").then("endpoint").then("annotate").then("page").then("render");
  }
  start() {
    Promise.resolve(this.initalize0()).then(this.start0.bind(this));
  }
  service<T extends ExtendService<CustomService>>(name:T,ctor: { new(ctx: Context): Service }) {
    //@ts-ignore
    Context.ServiceCtors[name]=ctor;
  }
  private async start0() {
    //TODO check service status & emit Error to ErrorHub
    await this.processFlow.traverse(async (position,name)=>{
      await this.services[name].start();
    })
    // await this.services["endpoint"].start();
    // await this.services["page"].start();
    // await this.services["annotate"].start();
  }
  consume(data: Payload) {
    this.consume0(data);
  }
  private async consume0(payload: Payload) {
    let ctx = this.clone();
    let res = 0;
    let next: Next = (data) => {
      if (typeof data === "number") {
        res = data;
      }
      return 0;
    }
    let param = { ctx, payload, next };
    let p = Promise.resolve(param);
    await AsyncForEach(Context.middleware, (middleware) => {
      p = p.then(async ({ ctx, payload, next }) => {
        await middleware(ctx, payload, next);
        return { ctx, payload, next };
      })
    });

  }
  private async initalize0() {
    await AsyncForEach(Object.entries(Context.DefaultRequiredServices), ([key, ctor]) => {
      let service;
      if(Context.ServiceCtors[key] != undefined)
        service  = new Context.ServiceCtors[key](this);
      else{
        service = new ctor(this);
      }
      if (service.apply) this.middleware(service.apply.bind(service))
        Context.services[key] = service;
    });
    // if(Context.services["endpoint"] == undefined){
    //   let expressEndpoint = new ExpressEndPoint(this);
    //   let expressMiddleware = expressEndpoint.apply.bind(expressEndpoint);
    //   this.middleware(expressMiddleware);
    // }

    // if(Context.services["annotate"] == undefined){
    //   let annotateService = new AnnotateService(this);
    //   let annotateMiddleware = annotateService.apply.bind(annotateService);
    //   this.middleware(annotateMiddleware);
    // }
    // if(Context.services["puppeteer"] == undefined){
    //   let puppeteerService = new PuppeteeerService(this);
    //   let puppeteerMiddleware = puppeteerService.apply.bind(puppeteerService);
    //   this.middleware(puppeteerMiddleware);
    // }
    this.middleware((ctx, payload) => {
      console.log(ctx);
      console.log(payload);
      return 0;
    })
  }

}
