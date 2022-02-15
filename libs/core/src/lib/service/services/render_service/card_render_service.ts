import { Context } from "../../../context";
import { Payload } from "../../../payload";
import { RenderService } from "../render_service";




export class CardRenderService extends RenderService{
  apply(ctx: Context, payload: Payload): number | Promise<number> {
    console.log(ctx);
    console.log(payload);
    return 0;
  }
  start() {

  }
  stop(): void {

  }
  constructor(ctx:Context){
    super(ctx,"CardRenderService");
  }
}
