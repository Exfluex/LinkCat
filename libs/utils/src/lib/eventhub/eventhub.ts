import { Observable, SubscribeCallBack, SubscribeLife } from "../observable/observable";




export const ErrorHubName:string = "error";
export type EventHubStatus = "running"|"suspend"|"stop";
export interface HubEvent{
  topic:string;
  data?:any;
}
export class EventHub extends Observable{
  status:EventHubStatus="running";
  suspended:HubEvent[]=[];
  private static hubs:{[hubName:string]:EventHub}={
  };
  suspend(event:HubEvent){
    this.suspended.push(event);
  }
  resume(){
    this.suspended.forEach((ev)=>{
      this.publish(ev.topic,ev.data);
    })
  }
  static publish(hubName:string,topic: string, data?: any): void {
    let hub = EventHub.hubs[hubName];
    if(hub){
      switch(hub.status){
        case "running":
          hub.publish(topic,data);

          break;
        case "suspend":
          hub.suspend({topic,data});
          break;
        case "stop":
      }
    }
    else{
      EventHub.hubs[ErrorHubName].publish("publish",{hubName,topic,data});
    }
  }
  static subscribe(hubName:string="default",callback:SubscribeCallBack,config:{topic:string,type:SubscribeLife}={topic:"",type:SubscribeLife.permanent}){
    let hub = EventHub.hubs[hubName];
    if(!hub){
      hub = new EventHub(hubName);
      EventHub.hubs[hubName] = hub;
    }
    hub.subscribe(callback,config);
  }
  name:string;
  constructor(name:string){
    super();
    this.name=name;
  }
}

