import { App } from "../application";
import { Context, Next } from "../context/context";
import { Payload } from "../payload/payload";




export namespace Service {

}

export interface Service{

}

export abstract class Service{
  constructor(ctx:Context,public name:string,public nickName:string=name){
    this.app = ctx as App;
    Context.services[name]=this;
  }
  app:App;
  apply?(ctx:Context,payload:Payload,next:Next):number|Promise<number>;
  abstract start():any | Promise<any>;
  abstract stop():void;
}
