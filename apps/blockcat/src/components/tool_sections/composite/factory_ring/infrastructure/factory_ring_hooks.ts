import { jsx } from "@emotion/react";




type FactoryRingLifeCycleHook = ()=>void;
export interface FactoryRingHooks{
  willOpen?:FactoryRingLifeCycleHook;
  //-----
  willOrbitSpread?:FactoryRingLifeCycleHook;
  didOrbitSpread?:FactoryRingLifeCycleHook;
  willMantleSpread?:FactoryRingLifeCycleHook;
  didMantleSpread?:FactoryRingLifeCycleHook;
  willCoreSpread?:FactoryRingLifeCycleHook;
  didCoreSpread?:FactoryRingLifeCycleHook;
  //------
  didOpen?:FactoryRingLifeCycleHook;
  //==========on=Collapse========
  willCollapse?:FactoryRingLifeCycleHook;
  //-----
  willCoreCollapse?:FactoryRingLifeCycleHook;
  didCoreCollapse?:FactoryRingLifeCycleHook;
  willMantleCollapse?:FactoryRingLifeCycleHook;
  didMantleCollapse?:FactoryRingLifeCycleHook;
  willOrbitCollapse?:FactoryRingLifeCycleHook;
  didOrbitCollapse?:FactoryRingLifeCycleHook;
  //------
  didCollapse?:FactoryRingLifeCycleHook;
}



const defaultFactoryRingHooks:FactoryRingHooks = {

}


type From<L extends string> =L extends  `From ${infer Rest}` ? Rest : never;

// type SemanticLog<L extends string> =  From<L> extends never?never:L;


type File<T extends string> = T;
type Hooks="useEffect"
type Line<T extends string> = T extends `${number}`|`Hook[${number}]:${Hooks}`?T:never;
let line:Line<"123">;

type LogPosition<T extends string> = T extends `${infer F}=>${infer P}`?File<F> extends never?never:Line<P> extends never?never:T:never;

let lp:LogPosition<"asdasd=>Hook[1]:useEffect">

//From xxx Occur xxxx 
//From xxx Done Task[] 

//? Parsing error: Type expected.
type SemanticWord="Occur"|"Done"|"Fail"|"Change"|"Create";
type M<T extends string> = T extends `${SemanticWord} in`?T:never;
let aa:M<"Occur in">

//:LogPosition :SemanticWord :UserDefined
type SemanticLog<S extends string> = From<S> extends `${infer P} ${infer Rest}` ? LogPosition<P> extends never?never:Rest extends `${SemanticWord} ${string}`? S:never: never;
let log:SemanticLog<"From asd=>Hook[1]:useEffect Occur sss">;
// let from:From<"From asd=>Hook[1]useEffect Occur sss">;
// type FirstPart<S> = From<S> extends `${infer P} ${infer Rest}`?P:never;
// let first:FirstPart<"From asd=>Hook[1]useEffect Occur sss">;
// type Position<S extends string> = LogPosition<FirstPart<S>> extends never?never:LogPosition<FirstPart<S>>;
// let pos:Position<"From asd=>Hook[1]useEffect Occur sss">

