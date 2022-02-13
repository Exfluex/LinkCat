import { Matcher } from "../../index";



export interface Scope{

}


export class Scope{
  count:number=0;
  pairs:{[key:string]:string;}={}
  clone(){
    var cloneObj = new Scope();
    for (var key in this.pairs) {
        if(undefined != this.pairs[key]){
          cloneObj.pairs[key] = this.pairs[key];
        }
    }
    return cloneObj;
  }
  constructor(){}
}

export namespace Scope{
  // export class  Definition<Context,Payload,Data>{
  //   [key:string]:[Constraint<Context,Payload>,Data];
  // }
  // export namespace Constraint{

  // }
  // export class Constraint<Context,Payload> extends Matcher{
  //   constructor(public name:string,public match:Matcher.MathFunc,public parent:Scope){
  //     super();
  //   }
  // }
}
