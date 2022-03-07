



export const currentStackFrame:StackFrame=null as any;

export interface StackFrame{
  id:number;
  name:string;
  description?:string;
  parent:StackFrame;
  preSibling:StackFrame;
  nextSibling:StackFrame;
  children:StackFrame|null;
}


export interface VirtualLink{
  from:StackFrame;
  to:StackFrame|null;
  name:string;
}


