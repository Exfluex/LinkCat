import { AsyncForEach, FlowManager } from "@linkcat/utils";
import { Context, Next } from "../context";
import { Payload } from "../payload";
import { Service } from "../service";

namespace App {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Config {

  }
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    Context.ServiceCtors[name]=ctor;
  }
  private async start0() {
    //TODO check service status & emit Error to ErrorHub
    await this.processFlow.traverse(async (position,name)=>{
      await this.services[name].start();
    })
  }
  consume(data: Payload) {
    this.consume0(data);
  }
  private async consume0(payload: Payload) {
    const ctx = this.clone();
    let res = 0;
    const next: Next = (data) => {
      if (typeof data === "number") {
        res = data;
      }
      return 0;
    }
    const param = { ctx, payload, next };
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
    this.middleware((ctx, payload) => {
      console.log(ctx);
      console.log(payload);
      return 0;
    })
  }

}
