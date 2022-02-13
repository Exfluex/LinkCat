export function utils(): string {
  return 'utils';
}


export interface Queue<I>{
  enqueue(val:I):boolean;
  dequeue():I|undefined;
}


export class DefaultQueue<I> implements Queue<I>{
  private nums:number=0;
  private queue:Array<I>;
  constructor(){
    this.queue = [];
  }
  length(){
    return this.nums;
  }
  enqueue(val:I){
    this.nums++;
    this.queue.unshift(val);
    return true;
  }
  dequeue(){
    this.nums--;
    return this.queue.pop();
  }
}


