

export class Flow<T>{
  position:number=-1;
  next:Flow<T>|null=null;
  pre:Flow<T>=this;
  constructor(public name:string,public item?:T){

  }
}

export class FlowManager<N extends string,T=never>{
  protected head:Flow<T>;
  protected tail:Flow<T>
  constructor(){
    this.head = new Flow("*");
    this.tail = this.head;
  }
  then<RN extends N>(name:RN,item?:T):FlowManager<Exclude<N,RN>>{
    let n = new Flow(name,item);
    n.pre = this.tail;
    n.position = this.tail.position+1;
    this.tail = this.tail.next = n;
    //@ts-ignore
    return this;
  }
  async traverse(fn:(position:number,name:string,item?:T)=>void){
    let node = this.head.next;
    while(node){
      await fn(node.position,node.name,node.item);
      node = node.next;
    }
  }
}
