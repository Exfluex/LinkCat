import { Context } from "../../context";
import { Service } from "../service";






export abstract class NotifyService extends Service{
  abstract notify(msg:NotifyService.Message):NotifyService.NotifyState;
  constructor(ctx:Context,nickName:string){
    super(ctx,"notify",nickName);
  }
}


export namespace NotifyService{
  export enum NotifyState{
    Schedule,
    Suspend,
    Send,
    Cancel
  }
  export interface Message{
    toString():string;
  }
}
