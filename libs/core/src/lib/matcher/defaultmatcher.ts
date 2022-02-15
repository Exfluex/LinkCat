import {AsyncForEach, Registry } from "@linkcat/utils";
import { Annotation } from "../annotation";
import { match, MatchFunction } from "path-to-regexp";
import { Payload } from "../payload";
import { DefaultMatcherFactory, DefaultMatcherProto, MatcherCallback, MatcherEnv } from "./matcher";
export const defaultCallback:MatcherCallback=(matcher,env)=>{
  const {ctx ,payload,data} = env;
  const config = matcher.config;
  if(payload.plugin[config.resolver] == undefined)
  payload.plugin[config.resolver] ={
    [Payload.Count]:1
  }
  else{
    payload.plugin[config.resolver][Payload.Count]+=1;
  }
  let pluginScopeData = payload.plugin[config.resolver];
  pluginScopeData[matcher.config.name]=data??"";
  let service = ctx.services.annotate;
  let resolver = service.resolverRegistry.find(matcher.config.resolver)[0] as Annotation.Resolver;
  if(resolver && pluginScopeData[Payload.Count] == (resolver.scope.count??-1)){
    service.pendByType("Add Resolver Execution",{resolver:resolver});
  }
};
export interface ExactMatcherConfig extends DefaultMatcherProto.Config{
}
export class ExactMatcher implements DefaultMatcherProto<ExactMatcherConfig>{
  match(target: string, data?: MatcherEnv) {
    return this.config.goal == target;
  }
  constructor(public id:number,public config:ExactMatcherConfig){

  }
}
export class ExactMatcherFactory implements DefaultMatcherFactory<ExactMatcher,ExactMatcherConfig> {
  match(target: string, env: MatcherEnv):number {
    let num = 0;
    this.matchers.forEach(matcher =>{
      let res = matcher.match(target);
      if(res != false){
        num++;
        let cb = matcher.config.callback??this._callback;
        cb(matcher,env);
      }
    })
    return num;
  }
  _callback:MatcherCallback=defaultCallback;
  matchers:ExactMatcher[]=[];
  constructor(public id:number,public config:DefaultMatcherProto.Config){
  }
  private maxId:number=0;
  private  generateId():number{
    return this.maxId++;
  }
  gen(config: ExactMatcherConfig): ExactMatcher {
    let matcher = new ExactMatcher(this.generateId(),config);
    this.register(matcher);
    return matcher;
  }
  register(item: ExactMatcher): this {
    this.matchers.push(item);
    return this;
  }
  unregister(id: number): this {
    throw new Error("Method not implemented.");
  }
  traverse(traverse: Registry.traverseFn<number>): this {
    this.matchers.forEach(matcher=>traverse(matcher,{}));
    return this;
  }
  find(id: number): Registry.Item<number>[] {
    throw new Error("Method not implemented.");
  }

}
export interface PathMatcherConfig extends DefaultMatcherProto.Config{
  // path:string;
  // callback?:PathMatcherCallback;
}

type PickFunction<T,M extends string> = M extends keyof T ? (T[M] extends Function ? T[M]: never):never;
type PathMatcherCallback = PickFunction<PathMatcherFactory,"_callback">;
export class PathMatcher implements DefaultMatcherProto<PathMatcherConfig>{
  matchFn:MatchFunction;
  withParam:boolean=false;
  match(target:string){
    let res = this.matchFn(target);
    if(res == false)
      return false;
    return this.withParam?res.params:true;
  };
  // com/github/www/:AccountOrProject/:Repository
  constructor(public id:number,public config:PathMatcherConfig){
    this.matchFn = match(this.config.goal);
  }
}


export class PathMatcherFactory implements DefaultMatcherFactory<PathMatcher,PathMatcherConfig>{
  root:PathMatcherFactory.QuickSearchBranch=new PathMatcherFactory.QuickSearchBranch();
  prior:PathMatcher[]=[];
  constructor(public id:number,public config:DefaultMatcherProto.Config){
  }
  gen(config: PathMatcherConfig): PathMatcher {
    let matcher = new PathMatcher(this.generateId(),config);
    this.register(matcher);
    return matcher;
  }
  private maxId:number=0;
  private  generateId():number{
    return this.maxId++;
  }
  _callback:MatcherCallback=defaultCallback;
  async match(target: string, env:MatcherEnv): Promise<number> {
    let num  =0;
    this.prior.forEach(async matcher=>{
      let res = matcher.match(target);
      if(res != false){
        num++;
        let cb = matcher.config.callback??this._callback;
        cb(matcher,env);
      }
    });
    let res = PathMatcherFactory.pathMatcher.exec(target);
    if(res == null){
      //TODO Throw Warnning
      return -1;
    };
    let branch:PathMatcherFactory.QuickSearchBranch;
    branch =this.root[res[1]] as PathMatcherFactory.QuickSearchBranch;
    if(!branch){
      return num;
    }
    branch = branch[res[2]] as PathMatcherFactory.QuickSearchBranch;
    if(!branch){
      return num;
    }
    let leaf = branch[res[3]] as PathMatcherFactory.QuickSearchLeaf;
    if(!leaf){
      return num;
    }
    leaf.matchers.forEach(matcher =>{
      let res = matcher.match(target);
      if(res != false){
        num++;
        let cb = matcher.config.callback??this._callback;
        cb(matcher,env);
      }
    });
    return num;
  }
  register(matcher: PathMatcher): this {
    if(matcher.config.priority > 0){
      this.prior.push(matcher);
      return this;
    }
    let res = PathMatcherFactory.pathMatcher.exec(matcher.config.goal);
    if(res == null){
      //TODO Throw Warnning
      this.prior.push(matcher);
      return this
    };
    let branch:PathMatcherFactory.QuickSearchBranch;
    let leaf:PathMatcherFactory.QuickSearchLeaf;
    this.root[res[1]] = branch = (this.root[res[1]]??new PathMatcherFactory.QuickSearchBranch()) as PathMatcherFactory.QuickSearchBranch;
    branch[res[2]] = branch  =  (branch[res[2]]??new PathMatcherFactory.QuickSearchBranch()) as PathMatcherFactory.QuickSearchBranch;
    branch[res[3]] = leaf = (branch[res[3]]??new PathMatcherFactory.QuickSearchLeaf()) as PathMatcherFactory.QuickSearchLeaf;
    leaf.matchers.push(matcher);
    return this;
  }
  unregister(id: number): this {
    return this;
  }
  traverse(traverse: Registry.traverseFn<number>): this {
    return this;
  }
  find(id: number): Registry.Item<number>[] {
    return [];
  }
}


export namespace PathMatcherFactory{
  export interface Config extends DefaultMatcherProto.Config{

  }
  export const leaf = Symbol("leaf");
  export const index = Symbol("index");
  export let pathMatcher = /\/([^\/]+)\/([^\/]+)\/([^\/]{1})/;
  export class Node{
    [leaf]:boolean=false;
  }
  export class QuickSearchBranch extends Node{
    [key:string]:Node;
  }
  export class QuickSearchLeaf extends Node{
    [leaf]:boolean = true;
    constructor(public matchers:PathMatcher[]=[]){
      super();
    }

  }
}
