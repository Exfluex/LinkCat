import { Context, Next } from "../../../context";
import { Payload } from "../../../payload";
import { EndPointService } from "../endpoint_service"
import * as express from "express";


export class ExpressEndPoint extends EndPointService{
  apply(ctx: Context, payload: Payload, next: Next): number {
    return 0;
  }
  port=3333;
  start(): void {
    this.server.listen(this.port,()=>{
      console.log(`Example app listening on port ${this.port}`);
    });
    this.server.post("/",(req,res)=>{
      res.send(req.query);
      const payload = new Payload(this.app);
      ;
      if(typeof req.query.origin === "string")
      {
        payload.origin = req.query.origin;
      }
      this.app.consume(payload);
    });
  }
  stop(): void {

  }
  server:express.Express;
  constructor(ctx:Context){
    super(ctx,"Express");
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    this.server = express();
  }

}
