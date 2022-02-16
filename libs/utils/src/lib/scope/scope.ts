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
    cloneObj.count = this.count;
    return cloneObj;
  }
  merge(scope:Scope){
    Object.keys(scope.pairs).forEach(key => {
      if(this.pairs[key] == undefined){
        this.count++;
      }
      this.pairs[key] =scope.pairs[key];
    });
  }
  constructor(){}
}

export namespace Scope{

}
