import { Annotation } from "../annotation";
import { Context } from "../context";
import { Plugin } from "../plugin";


export namespace MetaRetrieverPlugin {
  export interface Config {

  }

}
//TODO move to @linkcat/utils
type Pair = {[key:string]:string};
export class MetaRetrieverPlugin {
  constructor(ctx: Context, _config: Plugin.Config) {
    //定义该插件的作用域
    //这里使用onPage而不是on，因为onPage是依赖Puppeteer服务模块的一个语法糖，其中实际是在作用域中添加了：$page=true，表明该注解只有在页面服务成功建立时才执行。
    //如果资源是http、https资源才执行，这里的路径是 协议/顶级域名/主域名/次级域名.../剩余路径 构成,这种方式有很多好处，也是域名DNS定位的实际逻辑
    //这里的language()还没有实现，只有个空方法
    //prepare()函数为所有后续注解解析函数前的数据预处理函数，整个注解构建器下的注解解析函数执行前会先将prepare中函数执行。
    //注解解析器中函数执行顺序为 prepare[] => [processor,processor，processor] => finalizer[] 其中define中定义的是processor,finalizer由finalize函数定义
    const scoped = ctx.onPage("resource.origin=:protocol(http|https)/:rest(.*)").language("zh-cn").build().prepare((_ctx, _payload) => {
      console.log("multi-children resolver");
    });
    scoped.define("linkcat.buildin.title", "标题", Annotation.BaseTypeDefinition.RawText, async (ctx, payload) => {
      //由于使用ctx.onPage，所以只有$page服务有效时才会执行该注解解析函数
      //payload.global 包含各种服务为该资源解析Session下提供的各种工具，这里的 $page是页面服务（默认使用Puppeteer页面服务模块）提供的网页内容获取器。
      //$Content为通过document.querySelector()获取特定标签内容，如果无法获取或超时则返回空串。
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
    //协议正则
    const protocolRegex = /([^/]+):(.+)/;
    const protocol:Pair={
      "http":"linkcat.buildin.protocol.http",
      "https":"linkcat.buildin.protocol.https",
      "file":"linkcat.buildin.protocol.file",
      "ftp":"linkcat.buildin.protocol.ftp",
    }
    //定义协议注解，同时定义该注解值为 linkcat.buildin.protocol.ftp等注解
    scoped.define("linkcat.buildin.protocol", "协议", "linkcat.buildin.protocol.ftp;linkcat.buildin.protocol.http;linkcat.buildin.protocol.https;linkcat.buildin.protocol.file;linkcat.buildin.protocol.unknown", (ctx, payload) => {
      const res = protocolRegex.exec(payload.origin);
      //这里直接填入注解的meta name，LinkCat将自动填入对应注解
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      payload.set("linkcat.buildin.protocol",(res)?(protocol[res[1]] as any)??"linkcat.buildin.protocol.unknown":"linkcat.buildin.protocol.unknown");
    });
    //定义protocol值类型注解，不传入注解解析函数在创建注解是会给true作为值
    scoped.define("linkcat.buildin.protocol.ftp", "文件传输协议", Annotation.BaseTypeDefinition.Boolean);
    scoped.define("linkcat.buildin.protocol.http", "超文本传输协议", Annotation.BaseTypeDefinition.Boolean);
    scoped.define("linkcat.buildin.protocol.https", "安全超文本传输协议", Annotation.BaseTypeDefinition.Boolean);
    scoped.define("linkcat.buildin.protocol.file", "本地文件", Annotation.BaseTypeDefinition.Boolean);
    scoped.define("linkcat.buildin.protocol.unknown","未知协议",Annotation.BaseTypeDefinition.Boolean);
    //注册注解解析器
    scoped.register();
  }
  //还没有实现的Service IoC能力
  deps: string[] = ["annotate", "puppeteer"];
}


