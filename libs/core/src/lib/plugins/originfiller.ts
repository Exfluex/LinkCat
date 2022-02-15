import { Annotation } from "../annotation";
import { Context } from "../context";
import { PathMatcherFactory } from "../matcher";




export class ResourceOriginFillerPlugin {
  constructor(ctx: Context) {
    let wild = ctx.on("*");//[^:]+:\/\/[^\/]+
    const protocol = /^(?<protocol>[^:]+):\/\/(?<domain>[^\/]+)(?<path>\/.+)/;
    let builder = wild.build().define("resource.origin", "来源", Annotation.BaseTypeDefinition.RawText, (ctx, payload) => {
      let res;
      if ((res = protocol.exec(payload.origin)) != null) {
        let node = res[2].split(".");
        if (node.length == 2)
          node.reverse().push("www");
        payload.set("resource.origin",`${res[1]}/${node.join("/")}${res[3]}`);
        console.log(payload.annotations["resource.origin"]);
      }
      else {
        //TODO throow Error and Stop
      }
    }).matcher(new PathMatcherFactory(0, { resolver: -1, goal: "*", priority: 0, name: "Resource.Origin.Matcher" })).alias("资源链接");
    builder.register();
  }
}
