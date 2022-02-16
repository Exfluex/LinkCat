import { Service } from "../service";
import { Context } from "../../context";

export interface EndPointService{

}

export abstract class EndPointService extends Service{
  constructor(ctx:Context,nickName:string){
    super(ctx,"endpoint",nickName);
  }
}
