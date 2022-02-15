import { Service } from "..";
import { Context } from "../../context";
// export interface EndpointService{

// }

export interface EndPointService{

}

export abstract class EndPointService extends Service{
  constructor(ctx:Context,nickName:string){
    super(ctx,"endpoint",nickName);
  }
}
