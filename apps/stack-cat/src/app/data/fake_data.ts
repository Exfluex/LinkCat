import { StackFrame } from "../entities/stack_frame";


let maxStackId = -1;
let _max_children = 5;
let _remain_node = 0;
let _max_node = 25;

export const fakeStack: StackFrame = StacksGenerater(3, 25, 6);

type Action = (current: StackFrame) => StackFrame;
type ActionType = "StepBackParent" | "StepInChildren" | "MoveToNextSibling" | "MoveToPreviousSibling";
const ActionIndexMaper: { [index: number]: ActionType } = {
  0: "MoveToPreviousSibling",
  1: "MoveToNextSibling",
  2: "MoveToNextSibling",
  3: "StepInChildren",
  4: "StepInChildren",
  5: "StepInChildren",
  6: "StepBackParent",
}
const executions: { [key in ActionType]: Action } = {
  MoveToNextSibling: c => c.nextSibling,
  StepInChildren: c => c.children ?? c,
  MoveToPreviousSibling: c => c.nextSibling,
  StepBackParent: c => c.parent ?? c,
}
export function getNextAction() {
  return ActionIndexMaper[Math.floor(Math.random() * 6.5)];
}
export function RandomNode() {
  let maxExecution = Math.floor(Math.random() * 12);
  let preNode = fakeStack;
  let node = fakeStack.children;
  const preAction = "StepBackParent";
  if (node)
    do {
      const action = getNextAction();
      node = executions[action](node);
      if (!node) {
        console.log(`restore to ${preNode}`);
        node = preNode;
      }
      console.log(`${action}:${preNode.name} to ${node.name}`)
      preNode = node;

    } while (maxExecution-- > 0)
  return node ?? fakeStack;
}

function StacksGenerater(max_deps: number, max_node: number, max_children: number) {
  maxStackId = -1;
  _max_children = max_children;
  _remain_node = max_node;
  _max_node = max_node;
  const root = StacksGen(max_deps, null as unknown as StackFrame);
  Object.defineProperty(root, "tree_num", { value: max_node - _remain_node });
  return root;
}

function StacksGen(max_deps: number, parent: StackFrame): StackFrame {
  if (max_deps === 0 || _remain_node === 0) {
    const current = StackGen();
    current.parent = parent;
    StackNextConnector(current, current);
    return current;
  }
  else {
    //has Children
    const current = StackGen();
    current.parent = parent;
    current.preSibling = current;
    current.nextSibling = current;

    let childrenNum = Math.floor(Math.random() * _max_children)
    childrenNum = childrenNum > _remain_node ? _remain_node : childrenNum;
    _remain_node -= childrenNum;
    let node: StackFrame;
    let preNode: StackFrame;
    preNode = StacksGen(max_deps - 1, current);
    current.children = preNode;
    for (let i = 1; i < childrenNum; i++) {
      node = StacksGen(max_deps - 1, current);
      StackNextConnector(node, preNode.nextSibling);
      StackNextConnector(preNode, node);
      preNode = node;
    }
    return current;
  }
}

export function StackGen(): StackFrame {
  maxStackId++;
  return {
    id: maxStackId,
    name: `Function[${maxStackId}]`,
    description: `Function[${maxStackId}]:Description`,
    parent: null as any,
    preSibling: null as any,
    nextSibling: null as any,
    children: null
  }
}

function StackConnector(former: StackFrame, later: StackFrame, inserted: StackFrame) {
  StackNextConnector(former, inserted);
  StackNextConnector(inserted, later);
  inserted.parent = former.parent;
}
function StackNextConnector(former: StackFrame, next: StackFrame) {
  former.nextSibling = next;
  next.preSibling = former;
}
