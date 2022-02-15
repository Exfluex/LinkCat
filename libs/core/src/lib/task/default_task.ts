import { DefaultQueue } from "@linkcat/utils";
import { Context } from "../../index";
import { Payload } from "../../index";
import { Task, TaskLoop } from "./task";



export class DefaultTask extends Task<Context, Payload>{ };
export class DefaultTaskLoop implements TaskLoop<Context, Payload>{
  static TaskLoops: Record<string, DefaultTaskLoop> = {};
  normal_queue: DefaultQueue<Task<Context, Payload>>;
  async loopUntilEmpty(ctx: Context, payload: Payload, config?: any): Promise<Payload> {
    let task_nums = 0;
    do {
      task_nums = await this.consume(ctx, payload) + task_nums;
    } while (this.length() != 0);
    return payload;
  };
  constructor(public id: string) {
    if (undefined != DefaultTaskLoop.TaskLoops[id]) {
      throw new Error("Duplicate TaskLoop Name");
    }
    this.normal_queue = new DefaultQueue();
  }
  pend(task: Task<Context, Payload>): boolean {
    this.normal_queue.enqueue(task);
    return true;
  }
  length() { return this.normal_queue.length(); }
  async consume(ctx: Context, payload: Payload): Promise<number> {
    let task;
    if (undefined != (task = this.normal_queue.dequeue())) {
      ctx.variables["task.name"] = task.name;
      console.log(task.name);
      console.log(task);
      ctx.variables["taskloop.name"] = this.id;
      await task.execute(ctx, payload);
      return 1;
    }
    return 0;
  }
  execute() {

  }
}
