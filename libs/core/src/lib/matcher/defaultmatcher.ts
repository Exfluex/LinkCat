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
  const pluginScopeData = payload.plugin[config.resolver];
  pluginScopeData[matcher.config.name]=data??null;
  const service = ctx.services.annotate;
  const resolver = service.resolverRegistry.find(matcher.config.resolver)[0] as Annotation.Resolver;
  if(resolver && pluginScopeData[Payload.Count] == (resolver.scope.count??-1)){
    service.pendByType("Add Resolver Execution",{resolver:resolver});
  }
};
export type ExactMatcherConfig = DefaultMatcherProto.Config
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
      const res = matcher.match(target);
      if(res != false){
        num++;
        const cb = matcher.config.callback??this._callback;
        cb(matcher,env);
      }
    })
    return num;
  }
  _callback:MatcherCallback=defaultCallback;
  matchers:ExactMatcher[]=[];
  constructor(public id:number,public config:DefaultMatcherProto.Config){
  }
  private maxId=0;
  private  generateId():number{
    return this.maxId++;
  }
  gen(config: ExactMatcherConfig): ExactMatcher {
    const matcher = new ExactMatcher(this.generateId(),config);
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
  traverse(traverse: Registry.traverseFn<ExactMatcher>): this {
    this.matchers.forEach(matcher=>traverse(matcher,{}));
    return this;
  }
  find(id: number): Registry.Item<number>[] {
    throw new Error("Method not implemented.");
  }

}
export interface PathMatcherConfig extends DefaultMatcherProto.Config{
  withParam?:boolean;
}

type PickFunction<T,M extends string> = M extends keyof T ? (T[M] extends Function ? T[M]: never):never;
export class PathMatcher implements DefaultMatcherProto<PathMatcherConfig>{
  matchFn:MatchFunction;
  match(target:string){
    const res = this.matchFn(target);
    if(res == false)
      return null;
    return res.params;
  };
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
    const matcher = new PathMatcher(this.generateId(),config);
    this.register(matcher);
    return matcher;
  }
  private maxId=0;
  private  generateId():number{
    return this.maxId++;
  }
  _callback:MatcherCallback=defaultCallback;
  async match(target: string, env:MatcherEnv): Promise<number> {
    let num  =0;
    this.prior.forEach(async matcher=>{
      const res = matcher.match(target);
      if(res != null){
        num++;
        env.data = res;
        const cb = matcher.config.callback??this._callback;
        cb(matcher,env);
      }
    });
    const res = PathMatcherFactory.pathMatcher.exec(target);
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
    const leaf = branch[res[3]] as PathMatcherFactory.QuickSearchLeaf;
    if(!leaf){
      return num;
    }
    leaf.matchers.forEach(matcher =>{
      const res = matcher.match(target);
      if(res != null){
        num++;
        env.data = res;
        const cb = matcher.config.callback??this._callback;
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
    const res = PathMatcherFactory.pathMatcher.exec(matcher.config.goal);
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
  traverse(traverse: Registry.traverseFn<PathMatcher>): this {
    return this;
  }
  find(id: number): Registry.Item<number>[] {
    return [];
  }
}


export namespace PathMatcherFactory{
  export type Config = DefaultMatcherProto.Config
  export const leaf = Symbol("leaf");
  export const index = Symbol("index");
  export const pathMatcher = /\/([^\/]+)\/([^\/]+)\/([^\/]{1})/;
  export class Node{
    [leaf]=false;
  }
  export class QuickSearchBranch extends Node{
    [key:string]:Node;
  }
  export class QuickSearchLeaf extends Node{
    [leaf] = true;
    constructor(public matchers:PathMatcher[]=[]){
      super();
    }

  }
}
