import { Matcher, MatcherRegistry, PriorityMatcher } from "@linkcat/utils";
import { Context } from "../context";
import { Payload } from "../payload";

export type MatcherEnv = {ctx:Context,payload:Payload,data?:any};
export type MatcherCallback = (matcher:DefaultMatcherProto,env: MatcherEnv)=>any;
export interface DefaultMatcherRegistry<M extends DefaultMatcherProto<C>,C extends DefaultMatcherProto.Config> extends Matcher.Factory<string,never,C,M>, MatcherRegistry<string,MatcherEnv,M>{
  // addMatcher(goal:string,cb:(matcher:M,env:MatcherEnv) => void):boolean;
}
export interface DefaultMatcherProto<C extends DefaultMatcherProto.Config = DefaultMatcherProto.Config> extends PriorityMatcher<string,MatcherEnv,C>{
}
export namespace DefaultMatcherProto{
  export interface Config extends PriorityMatcher.Config{
    resolver:number;
    goal:string;
    callback?:MatcherCallback;
  }
}

export interface DefaultMatcherFactory<M extends DefaultMatcherProto<C>,C extends DefaultMatcherProto.Config> extends DefaultMatcherProto,DefaultMatcherRegistry<M,C>{

}



