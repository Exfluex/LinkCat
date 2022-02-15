import { Context, Next } from "../../context";
import { Payload } from "../../payload";
import { Service } from "../service";




export abstract class RenderService extends Service{
  constructor(ctx:Context,nickName:string){
    super(ctx,"render",nickName);
  }
  abstract apply(ctx:Context,payload:Payload,next:Next):number|Promise<number>;
}
