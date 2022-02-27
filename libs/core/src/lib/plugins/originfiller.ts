import { Annotation } from "../annotation";
import { Context } from "../context";
import { PathMatcherFactory } from "../matcher";




export class ResourceOriginFillerPlugin {
  constructor(ctx: Context) {
    //将该插件上下文的作用域定义为 * ，即所有资源
    const wild = ctx.on("*");//[^:]+:\/\/[^\/]+
    //协议提取正则
    const protocol = /^(?<protocol>[^:]+):\/\/(?<domain>[^\/]+)(?<path>\/.+)/;
    //注解的builder直接从作用域下生成
    //wild.build() 就生成了一个注解构建器
    //bulder.define()定义了该注解
    //builder.define(注解名称,注解中文,注解类型,注解函数)
    const builder = wild.build();
    builder.define("resource.origin", "来源", Annotation.BaseTypeDefinition.RawText, (ctx, payload) => {
      //payload中包含当前资源创建Session下的所有插件产生的资源
      //该函数为注解函数，在匹配到对应上下文时，LinkCat会自动执行该函数
      let res;
      if ((res = protocol.exec(payload.origin)) != null) {
        const node = res[2].split(".");
        if (node.length == 2)
          node.reverse().push("www");
        //设置payload中对应的注解
        payload.set("resource.origin",`${res[1]}/${node.join("/")}${res[3]}`);
        console.log(payload.annotations["resource.origin"]);
      }
      else {
        //TODO throow Error and Stop
      }
      //设置该注解类型的Matcher
      //此处为resource.origin优化的pathmatcher
    }).matcher(new PathMatcherFactory(0, { resolver: -1, goal: "*", priority: 0, name: "Resource.Origin.Matcher" }))
    //注解的别名，后续考虑增加不同语言适配
    .alias("资源链接");

    //注册注解到系统
    builder.register();
  }
}
