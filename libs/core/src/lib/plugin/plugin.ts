import { Registry } from "@linkcat/utils";
import { Context } from "../context";



export namespace Plugin{
  export type Id = number;
  export interface Config{

  }
}


export interface  WithDep{
  deps:string[];
}
export interface Plugin{
  deps:string[];
}

export type Constructor<T> = new (ctx:Context,config:T)=>void;
export type PluginType = Constructor<any>;
export type FunctionPlugin<T> = (ctx:Context,config:T)=>void;
export interface Plugin extends Registry.Item<number>{
  id:number;
  name:string;
  config?:any;
  apply:PluginType;
}







