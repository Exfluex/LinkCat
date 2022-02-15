import { Annotation } from "../annotation";
import { Context } from "../context";
import { PathMatcherFactory } from "../matcher";
import { Plugin } from "../plugin";
import { PluginType, WithDep } from "../plugin/plugin";


export namespace MetaRetrieverPlugin {
  export interface Config {

  }

}

export class MetaRetrieverPlugin {
  constructor(ctx: Context, config: Plugin.Config) {
    //TODO localize

    let scoped = ctx.onPage("resource.origin=http([s]{0,1})/(.*)").language("zh-cn").build().prepare((ctx, payload) => {
      console.log("multi-children resolver");
    });
    scoped.define("linkcat.buildin.title", "标题", Annotation.BaseTypeDefinition.RawText, async (ctx, payload) => {
      // payload.plugin["$puppeteer"].$("title");
        payload.set("linkcat.buildin.title",await payload.global.$page.$Content("title"));
    });
    scoped.define("linkcat.buildin.favicon", "图标", Annotation.BaseTypeDefinition.RawText, (ctx, payload) => {
      payload.set("linkcat.buildin.favicon","fakeData");
    });
    scoped.define("linkcat.buildin.excerpt", "摘要", Annotation.BaseTypeDefinition.RawText, (ctx, payload) => {
      payload.set("linkcat.buildin.excerpt","fakeData");
    });
    scoped.define("linkcat.buildin.description", "描述", Annotation.BaseTypeDefinition.RawText, (ctx, payload) => {
      payload.set("linkcat.buildin.description","fakeData");
    });
    const protocolRegex = /([^\/]+):(.+)/;
    const protocol:Pair={
      "http":"linkcat.buildin.prococol.http",
      "https":"linkcat.buildin.prococol.https",
      "file":"linkcat.buildin.prococol.file",
      "ftp":"linkcat.buildin.prococol.ftp",
    }
    scoped.define("linkcat.buildin.protocol", "协议", "linkcat.buildin.prococol.ftp;linkcat.buildin.prococol.http;linkcat.buildin.prococol.https;linkcat.buildin.prococol.file;linkcat.buildin.prococol.unknow", (ctx, payload) => {
      let res = protocolRegex.exec(payload.origin);
      payload.set("linkcat.buildin.protocol",(res)?(protocol[res[1]] as any)??"linkcat.buildin.prococol.unknow":"linkcat.buildin.prococol.unknow");
    });
    scoped.define("linkcat.buildin.prococol.ftp", "文件传输协议", Annotation.BaseTypeDefinition.Boolean);
    scoped.define("linkcat.buildin.prococol.http", "超文本传输协议", Annotation.BaseTypeDefinition.Boolean);
    scoped.define("linkcat.buildin.prococol.https", "安全超文本传输协议", Annotation.BaseTypeDefinition.Boolean);
    scoped.define("linkcat.buildin.prococol.file", "本地文件", Annotation.BaseTypeDefinition.Boolean);
    scoped.define("linkcat.buildin.prococol.unknow","未知协议",Annotation.BaseTypeDefinition.Boolean);
    scoped.register();
  }
  deps: string[] = ["annotate", "puppeteer"];
}
type Pair = {[key:string]:string};
export type ObjHasKey<Key extends string>= string extends Key?never:Key extends `${infer AnnoKey}`?{[P in AnnoKey]:string}:never;
export interface Define{
  <Key extends string,Anns extends {[key in Key]:string}>(key:Key,ann:Anns):void;
}
let d:Define=(s,a)=>{
  return
};
d("sssss",{sssss:"sss"});

let a:ObjHasKey<"sssss">;

