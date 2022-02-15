import { App } from "../../../application";
import { Context } from "../../../context";
import { NotifyService } from "../notify_service"




export class FakeNotifyService extends NotifyService{
  start() {
  }
  stop(): void {
  }
  notify(msg: NotifyService.Message): NotifyService.NotifyState {
    console.log(msg);
    return NotifyService.NotifyState.Send;
  }
  constructor(ctx:Context){
    super(ctx,"FakeNotifyService");
  }
}
