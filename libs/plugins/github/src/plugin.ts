import { Annotation, Context, Payload } from "@linkcat/core";



export class GithubPlugin{
  constructor(ctx:Context,payload:Payload){
    let builder = ctx.onPage("resource.origin=https/com/github/www/:AccountOrProject/:Repository").build();
    builder.define("linkcat.github.repository","仓库",Annotation.BaseTypeDefinition.RawText,async (ctx,payload)=>{
      payload.set("linkcat.github.repository",payload.current["resource.origin"]["Repository"]);
    })
    builder.define("linkcat.github.owner","拥有者",Annotation.BaseTypeDefinition.RawText,async (ctx,payload)=>{
      payload.set("linkcat.github.owner",payload.current["resource.origin"]["AccountOrProject"]);
    })
    builder.define("linkcat.github.star","Starred",Annotation.BaseTypeDefinition.RawText,async (ctx,payload)=>{
      payload.set("linkcat.github.star",await payload.global.$page.$Content("svg.octicon-star ~ strong"));
    })
    builder.define("linkcat.github.watch","Watch",Annotation.BaseTypeDefinition.RawText,async (ctx,payload)=>{
      payload.set("linkcat.github.watch",await payload.global.$page.$Content("svg.octicon-eye ~ strong"));
    })
    builder.define("linkcat.github.fork","Fork",Annotation.BaseTypeDefinition.RawText,async (ctx,payload)=>{
      payload.set("linkcat.github.fork",await payload.global.$page.$Content("svg.octicon-repo-forked ~ strong"));
    })
    builder.register();
  }
}
