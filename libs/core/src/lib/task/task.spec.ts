// import {Task, TaskLoop} from './task'

// class Payload{
//   [key:string]:string;
// }

// class Context{
//   taskService:TaskLoop<Context,Payload>;
//   variables:{
//     [key:string]:any;
//   }={}
//   constructor(){
//     this.taskService = new TestTaskLoop("test");
//   }
// }

// class TestTask extends Task<Context,Payload>{

// }


// class TestTaskLoop implements TaskLoop<Context,Payload>{
//   queue:Task<Context,Payload>[]=[];
//   task_nums:number =0;
//   constructor(public name:string){
//   }
//   length(): number {
//     throw new Error('Method not implemented.');
//   }
//   id: string="test";
//   pend(task: Task<Context, Payload>): boolean {
//     this.queue.push(task);
//     this.task_nums++;
//     return true;
//   }
//   consume(ctx:Context,payload:Payload):number{
//     let task;
//     if(undefined != (task = this.queue.shift())){
//       this.task_nums--;
//       ctx.variables["task.name"]=task.name;
//       task.execute(ctx,payload);
//       return 1;
//     }
//     return 0;
//   }
//   loopUntilEmpty(ctx:Context,payload:Payload,config:{initTasks:Task<Context,Payload>[]}): Payload {
//     config.initTasks.forEach(t=>{
//       this.pend(t);
//     });
//     let task_nums= 0;
//     do{
//       task_nums +=this.consume(ctx,payload);
//     }while(this.task_nums != 0);
//     return payload;
//   }

// }
// describe('task_test', () => {
//   it('should work', () => {
//     const consoleDataProcessr:Task.DataProcessor<Context,Payload> = {process:(ctx,pld)=>{console.log(`I'm ${ctx.variables["task.name"]??"undefined name"}`)}};

//     type RTask = Task<Context,Payload>;
//     let processors:Task.DataProcessor<Context,Payload>[] = [{process:(ctx,pld)=>{
//       ctx.taskService.pend(new TestTask("2nd",consoleDataProcessr));
//       ctx.taskService.pend(new TestTask("3rd",consoleDataProcessr))
//       ctx.taskService.pend(new TestTask("4th",consoleDataProcessr))
//       return 0;
//     }}];
//     let initTasks:RTask[]= [new Task<Context,Payload>("1st",processors[0])];
//     let loop = new TestTaskLoop("test_loop");
//     let ctx = new Context();
//     ctx.taskService = loop;
//     expect(loop.loopUntilEmpty(ctx,new Payload(),{initTasks:initTasks})).toEqual(4);

//   });
// });
