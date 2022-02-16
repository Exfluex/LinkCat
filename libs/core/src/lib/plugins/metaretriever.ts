import { Annotation } from "../annotation";
import { Context } from "../context";
import { Plugin } from "../plugin";


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
      "http":"linkcat.buildin.protocol.http",
      "https":"linkcat.buildin.protocol.https",
      "file":"linkcat.buildin.protocol.file",
      "ftp":"linkcat.buildin.protocol.ftp",
    }
    scoped.define("linkcat.buildin.protocol", "协议", "linkcat.buildin.protocol.ftp;linkcat.buildin.protocol.http;linkcat.buildin.protocol.https;linkcat.buildin.protocol.file;linkcat.buildin.protocol.unknown", (ctx, payload) => {
      let res = protocolRegex.exec(payload.origin);
      payload.set("linkcat.buildin.protocol",(res)?(protocol[res[1]] as any)??"linkcat.buildin.protocol.unknown":"linkcat.buildin.protocol.unknown");
    });
    scoped.define("linkcat.buildin.protocol.ftp", "文件传输协议", Annotation.BaseTypeDefinition.Boolean);
    scoped.define("linkcat.buildin.protocol.http", "超文本传输协议", Annotation.BaseTypeDefinition.Boolean);
    scoped.define("linkcat.buildin.protocol.https", "安全超文本传输协议", Annotation.BaseTypeDefinition.Boolean);
    scoped.define("linkcat.buildin.protocol.file", "本地文件", Annotation.BaseTypeDefinition.Boolean);
    scoped.define("linkcat.buildin.protocol.unknown","未知协议",Annotation.BaseTypeDefinition.Boolean);
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

