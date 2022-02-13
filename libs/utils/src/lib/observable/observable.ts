export type SubscribeContext = {observed:Observable,data?:any};
export type SubscribeCallBack = ((ctx:SubscribeContext)=>void)|((ctx:SubscribeContext)=>number);
export enum SubscribeLife{
  transient,
  permanent,
  custome
}
interface Subscriber{
  callback:SubscribeCallBack;
  type:SubscribeLife;
  id:number;
}
interface ObserbaleTopic{
  topic:string;
  permanent:Subscriber[];
  transient:Subscriber[];
}
export class Observable{
  protected observer_max_id:number = 0;
  topics:{
    [topic:string]:ObserbaleTopic;
  }={
  };
  unsubscribe(id:number,topic:string){
    let res =false;
    this.topics[topic].permanent.filter((sub)=>{if(id!=sub.id){res = true;return false}return true;});
    if(res)return;
    this.topics[topic].transient.filter((sub)=>{if(id!=sub.id){res = true;return false}return true;});
    if(res)return;
  }
  subscribe(callback:SubscribeCallBack,config:{topic:string,type:SubscribeLife}={topic:"",type:SubscribeLife.permanent}){
    let topic = this.topics[config.topic];
    if(!topic){
      topic = {topic:config.topic,permanent:[],transient:[]};
      this.topics[config.topic]=topic;
    }
    return this._subscribe(topic,{callback:callback,type:config.type,id:this.observer_max_id++},config.type);
  }
  protected _subscribe(topic:ObserbaleTopic,sub:Subscriber,type:SubscribeLife){
    switch(type){
      case SubscribeLife.permanent:
        topic.permanent.push(sub);
        break;
      default:
        topic.transient.push(sub);
        this.transient++;
    }
    return  ()=>{this.unsubscribe(sub.id,topic.topic)};
  }
  transient:number=0;
  publish(topic:string,data?:any){
    let Topic =this.topics[topic];
    Topic.transient.filter((sub)=>{
      return sub.callback({observed:this,data});
    });
    Topic.permanent.forEach((sub)=>{
      sub.callback({observed:this,data});
    })
  }
}
