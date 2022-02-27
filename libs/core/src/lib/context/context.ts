import { Constructor, DefaultNumberRegistry, Scope } from "@linkcat/utils";
import { Annotation } from "../annotation/annotation";
import { Languages } from "../localize/language";
import { Payload } from "../payload/payload";
import { PluginType } from "../plugin/plugin";
import { ExpressEndPoint, Service } from "../service/";
import { AnnotateService } from "../service/services/annotate_service";
import { EndPointService } from "../service/services/endpoint_service";
import { FakeNotifyService } from "../service/services/notify/fake_notify_service";
import { PuppeteerService } from "../service/services/puppeteer_service/puppeteer_service";
import { CardRenderService } from "../service/services/render_service/card_render_service";


enum MiddlewareReturns{
  Next,
  StopAndReturn,
  StopAndThrow
}
export type Next = (data:any)=>number;
export type Middleware = (ctx:Context,payload:Payload,next:Next)=>number|Promise<number>;
export type SyncMiddleware = (ctx:Context,payload:Payload,next:Next)=>number;
export type AsyncMiddleware = (ctx:Context,payload:Payload,next:Next)=>Promise<number>;

interface ScopeParse{
  parse(ctx:Context,selection:Context.ScopeString):Context;
}

export class DefaultScopeParser implements ScopeParse{
  regex = /(?:([^=]+?)=([^;]+));{0,1}/g;
  parse(ctx: Context, selection: string): Context {
    const ret: { [key: string]: string } = {};
    const scope = new Scope();
    if(selection == "*"){
      scope.count = 0;
    }
    else{
      let res = this.regex.exec(selection);
      while (res) {
        console.log(res);
        scope.count++;
        ret[res[1]] = res[2];
        res = this.regex.exec(selection);
      }
    }

    const nctx = ctx.clone();

    scope.pairs =ret;
    nctx.scope = scope;
    return nctx;
  }

}

export class AnnotationDefinitionRegistry{
  annotations:Annotation.Definition[]=[];
  register(annotation:Annotation.Definition):boolean{
    if(this.annotations.filter(an=>an.key == annotation.key).length != 0){
      return false;
    }
    this.annotations.push(annotation);
    return true;
  }
  remove(key:string){
    return this.annotations = this.annotations.filter(an=>an.key != key);
  }
  get(name:string):Annotation.Definition[]{
    return this.annotations.filter(an=>an.is(name));
  }

}

export const annotationRegistry = new AnnotationDefinitionRegistry();


export interface Context{

  services:Context.Services;
}

export class Context{
  static middleware:AsyncMiddleware[]=[];
  static chainedMiddleware:AsyncMiddleware[]=[];
  variables:Record<string,any>={};
  static plugins:DefaultNumberRegistry<{id:number,name:string,gen:PluginType}> = new DefaultNumberRegistry();
  static scopeParser:ScopeParse=new DefaultScopeParser();
  env:any=null;
  private _language="zh-cn";
  annotations:AnnotationDefinitionRegistry=new AnnotationDefinitionRegistry();
  scope:Scope=new Scope();
  constraints = 0;
  plugin(plugin:PluginType){
    const id = Context.plugins.generateId();
    const p ={id,name:plugin.name,gen:plugin};
    Context.plugins.register(p);
    this.env = p;
    this.env=null;
  }
  constructor(){
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    this.services = Context.services as Context.Services;
  }
  clone(){
    const ctx = new Context();
    ctx.annotations = this.annotations;
    ctx.services = this.services;
    ctx.variables = this.variables;
    ctx.scope = new Scope();
    return ctx;
  }
  middleware(middleware:Middleware){
    if(middleware instanceof Promise){
      Context.middleware.push(middleware as AsyncMiddleware);
    }
    else{
      const asyncMiddleware:AsyncMiddleware=(ctx,payload,next) => {
        return new Promise((resolve)=>resolve(middleware(ctx,payload,next)));
      }
      Context.middleware.push(asyncMiddleware);
    }
  }
  annotation(){
    return new Annotation.Builder(this);
  }
  build(){
    return new Annotation.Builder(this);
  }
  onPage(scope:Context.ScopeString|Scope):Context{
    const ctx = this.on(scope).on("$page=true");
    return ctx;
  }
  on(scope:Context.ScopeString|Scope):Context{
    let ctx:Context;
    if(scope instanceof Scope){
      ctx = this.clone();
      ctx.scope = scope;
    }else{
      ctx = Context.scopeParser.parse(this,scope);
    }
    ctx.env = this.env;
    ctx.variables = this.variables;
    ctx.scope.merge(this.scope);
    return ctx;
  }
  language(languageShort:string){
    let lang;
    if(undefined == (lang = Languages[languageShort])){
      //TODO logs here
      return this;
    }
    this._language = languageShort;
    return this;
  }
}


export namespace Context{
  export interface Services{
    [name:string]:Service;
    endpoint:EndPointService;
    annotate:AnnotateService;
  }
  export const services:{[name:string]:Service} = {
  }
  export type RequiredService="endpoint"|"annotate"|"notify"|"render"|"page";
  export const ServiceCtors:{[key:string]:Constructor<Service,[Context]>}={

  }
  export const DefaultRequiredServices:{[key:string]:Constructor<Service,[Context]>}={
    "endpoint":ExpressEndPoint,
    "annotate":AnnotateService,
    "notify":FakeNotifyService,
    "render":CardRenderService,
    "page":PuppeteerService,
  }
  export type BuildinServiceType = "endpoint"|"annotate"|"notify"|"render";

  export type ScopeString = string;
  export type Scope = Record<string,string>;
}
