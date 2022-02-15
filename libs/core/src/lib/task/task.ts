
export class Task<Context,Payload>{
  constructor(public name:string,private dataProcessor:Task.DataProcessor<Context,Payload>,priority:number=0){

  }
  async execute(ctx:Context,payload:Payload){
    await this.dataProcessor.process(ctx,payload);
  }
  toString(){
    return this.name;
  }
}

export namespace Task{
  export type DataProcessorFn<Context,Payload> = (ctx:Context,payload:Payload)=>any;
  export interface DataProcessor<Context,Payload>{
    process:DataProcessorFn<Context,Payload>;
  }
}

export interface TaskLoop<Context,Payload>{
  loopUntilEmpty(ctx:Context,payload:Payload,config?:any):Promise<Payload>;
  pend(task:Task<Context,Payload>):boolean;
  length():number;
  id:string;
}

