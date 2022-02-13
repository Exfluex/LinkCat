import { Registry } from "../registry";







export namespace Matcher{
  export type MathFunc = (target:string,data?:any)=>any;
  export interface Factory<T,D,C,M extends Matcher<T,D>>{
    gen(config:C):M;
  }
}
export interface NamedMatcher<T=string,D=never,C=NamedMatcher.Config> extends Matcher<T,D>{
  config:C;
};
export namespace NamedMatcher{
  export interface Config{
    name:string;
  }
}
export interface PriorityMatcher<T=string,D=never,C=PriorityMatcher.Config> extends NamedMatcher<T,D,C>,Registry.Item<number>{
}
export namespace PriorityMatcher{
  export interface Config extends NamedMatcher.Config{
    priority:number;
  }
}
export interface Matcher<T=string,D=never>{
  match(target:T,data?:D):any;
}





