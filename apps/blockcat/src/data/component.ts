import { Box, HStack, VStack, Image } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { AllowActions } from "../utils/builder";
import { Middleware, MiddlwareEntry, SimpleDragEvent } from "../utils/utils";
import { CardRenderConfig, InnerOutDirection, PositionableBlockProps, Direction, MinimalBlockProps, InnerOuterMapDirection, CounterDirections } from "./card_render_config";

type CompMiddleware = Middleware<Context, Payload, { comp: PositionableBlockProps }>;
type CompGenMiddleware = Middleware<Context, unknown, { comp: PositionableBlockProps }>;
export class CompMiddlewares extends MiddlwareEntry<Context, Payload, { comp: PositionableBlockProps }>{
  static Gen() { return new CompMiddlewares(); }
};

export interface ComponentActions {
  InsertHorizontal?: CompMiddlewares;
  InsertVertical?: CompMiddlewares;
  InsertLeft?: CompMiddlewares;
  InsertRight?: CompMiddlewares;
  InsertUp?: CompMiddlewares;
  InsertDown?: CompMiddlewares;
  GeneralInsertHandler?: CompMiddlewares;
  WrapperHandler?: CompMiddlewares;
  GenerateHandler?: CompMiddlewares;
  Delete: CompMiddlewares;
}

export type CompActionResType = "Success" | "Failed" | "Forbidden" | "Async" | "Delayed";


interface InsertAction {
  basePoint: PositionableBlockProps;
  direction: "Left" | "Right" | "Up" | "Down" | "Center"
}
export type ComponentType = "structure" | "feature" | "end";
export type TextType = "none"|"dynamic"|"static"|"programmable";
export const TextTypePrefix:{[type in TextType]?:string}={
  "dynamic":"@",
  "static":"#",
  "programmable":"%"
}
export interface ComponentMeta {
  name: string;
  node: FunctionComponent,
  text:TextType[];
  type: ComponentType,
  // Actions?: ComponentActions;
  controller: CompActionController;
  defaultProps?: {
    [key: string]: string | number
  }
}

export interface ComponentGroup {
  components: ComponentMeta[];
  name: string;
}

export class BlockLinkTool {
  comp: PositionableBlockProps;
  // hasChildren: boolean;
  constructor(public target: PositionableBlockProps, public block: CardRenderConfig, partialComp: MinimalBlockProps | PositionableBlockProps, partial = true) {
    // this.hasChildren = target.children.length > 0;
    if (partial) {
      this.comp = BlockLinkTool.convertToBlock(partialComp);
      this.comp.id = ++block.maxChild;
    }
    else {
      this.comp = partialComp as PositionableBlockProps;
    }
  }
  static setId(block: CardRenderConfig, comp: PositionableBlockProps) {
    comp.id = ++block.maxChild;
  }
  //static repleace
  static wrapper(parent: PositionableBlockProps, wrapped: PositionableBlockProps, container: PositionableBlockProps) {
    container.parent = wrapped.parent;
    wrapped.parent = container.id;
    BlockLinkTool.fillOuter(container, wrapped);
    BlockLinkTool.fillInner(container, wrapped.id);
    BlockLinkTool.fillOuter(wrapped, container.id);
    container.children.push(wrapped.id);
    parent.children.splice(parent.children.indexOf(wrapped.id), 1, container.id);
  }
  static convertToBlock(comp: Omit<PositionableBlockProps, "id" | "parent" | "children" | "directions">, parent = -1) {
    const real:PositionableBlockProps = {
      ...comp,
      id: -1,
      directions: {
        OuterUp: parent,
        OuterDown: parent,
        OuterLeft: parent,
        OuterRight: parent,
        InnerDown: -1,
        InnerLeft: -1,
        InnerRight: -1,
        InnerUp: -1,
      },
      children: [],
      parent: parent,
    };
    console.log(real);
    return real;
  }
  static InsertInto(container: PositionableBlockProps, inner: PositionableBlockProps) {
    container.children.push(inner.id);
    BlockLinkTool.fillInner(container, inner.id);
    BlockLinkTool.fillOuter(inner, container.id);
    inner.parent = container.id;
  }
  static fill(inner: boolean, comp: PositionableBlockProps, value: number, horizontal: boolean);
  static fill(inner: boolean, comp: PositionableBlockProps, value: number);
  static fill(inner: boolean, comp: PositionableBlockProps, left: number, right?: number | boolean, up?: number, down?: number) {
    if (inner)
      this.fillInner(comp, left, right, up, down);
    else
      this.fillOuter(comp, left, right, up, down);
  }
  static fillInner(comp: PositionableBlockProps, from: PositionableBlockProps);
  static fillInner(comp: PositionableBlockProps, value: number, horizontal: boolean);
  static fillInner(comp: PositionableBlockProps, value: number);
  static fillInner(comp: PositionableBlockProps, left: number, right: number | boolean, up: number, down: number)
  static fillInner(comp: PositionableBlockProps, left: number | PositionableBlockProps, right?: number | boolean, up?: number, down?: number) {
    if (typeof left != "number") {
      comp.directions.InnerLeft = left.directions.InnerLeft;
      comp.directions.InnerRight = left.directions.InnerRight;
      comp.directions.InnerUp = left.directions.InnerUp;
      comp.directions.InnerDown = left.directions.InnerDown;
      return;
    }
    if (typeof right == "boolean") {
      if (right) {
        comp.directions.InnerLeft = left;
        comp.directions.InnerRight = left;
      }
      else {
        comp.directions.InnerDown = left;
        comp.directions.InnerUp = left;
      }
      return;
    }
    if (!right) {
      comp.directions.InnerDown = left;
      comp.directions.InnerUp = left;
      comp.directions.InnerLeft = left;
      comp.directions.InnerRight = left;
      return;
    }
    comp.directions.InnerDown = down;
    comp.directions.InnerUp = up;
    comp.directions.InnerLeft = left;
    comp.directions.InnerRight = right;
  }
  static fillOuter(comp: PositionableBlockProps, from: PositionableBlockProps);
  static fillOuter(comp: PositionableBlockProps, value: number, horizontal: boolean);
  static fillOuter(comp: PositionableBlockProps, value: number);
  static fillOuter(comp: PositionableBlockProps, left: number, right: number | boolean, up: number, down: number)
  static fillOuter(comp: PositionableBlockProps, left: number | PositionableBlockProps, right?: number | boolean, up?: number, down?: number) {
    if (typeof left != "number") {
      comp.directions.OuterLeft = left.directions.OuterLeft;
      comp.directions.OuterRight = left.directions.OuterRight;
      comp.directions.OuterUp = left.directions.OuterUp;
      comp.directions.OuterDown = left.directions.OuterDown;
      return;
    }
    if (typeof right == "boolean") {
      if (right) {
        comp.directions.OuterLeft = left;
        comp.directions.OuterRight = left;
      }
      else {
        comp.directions.OuterDown = left;
        comp.directions.OuterUp = left;
      }
      return;
    }
    if (!right) {
      comp.directions.OuterDown = left;
      comp.directions.OuterUp = left;
      comp.directions.OuterLeft = left;
      comp.directions.OuterRight = left;
      return;
    }
    comp.directions.OuterDown = down;
    comp.directions.OuterUp = up;
    comp.directions.OuterLeft = left;
    comp.directions.OuterRight = right;
  }
  direction: InnerOutDirection = "Unknow";
  static insertBettwen(parent: PositionableBlockProps, from: PositionableBlockProps, direction: Direction | "Center", to: PositionableBlockProps, inserted: PositionableBlockProps) {
    inserted.parent = parent.id;
    if (direction === "Center") {
      parent.children.push(inserted.id);
      BlockLinkTool.fillInner(parent, inserted.id);
      BlockLinkTool.fillOuter(inserted, parent.id);
      return;
    }
    if (from.parent !== to.parent || from.id===0 || to.id === 0) {
      //
      console.log(to.children);
      switch (direction) {
        case "Down":
        case "Right":
          //P=>C
          if (from.id === to.parent) {
            parent.directions.InnerLeft = inserted.id;
            parent.directions.InnerRight = inserted.id;
            parent.children.unshift(inserted.id)
          }

          else {
            parent.children.push(inserted.id)
          }

          break;
        case "Up":
        case "Left":
          if (from.id === to.parent) {
            parent.children.push(inserted.id)
          }
          else {
            parent.directions.InnerLeft = inserted.id;
            parent.directions.InnerRight = inserted.id;
            parent.children.unshift(inserted.id)
          }
          break;
      }
    }
    else {

      switch (direction) {
        case "Down":
        case "Right":
          parent.children.splice(parent.children.indexOf(from.id) + 1, 0, inserted.id);
          break;
        case "Up":
        case "Left":
          // eslint-disable-next-line no-case-declarations
          const index = parent.children.indexOf(to.id);
          if (index === 0) {
            parent.directions.InnerLeft = inserted.id;
            parent.directions.InnerRight = inserted.id;
          }
          parent.children.splice(index, 0, inserted.id);
          break;
      }
    }
    this.link(from, direction, inserted);
    this.link(inserted, direction, to);
  }
  static link(from: PositionableBlockProps, direction: Direction | "Center", to: PositionableBlockProps) {
    if (to.parent === from.id) {
      switch (direction) {
        case "Up":
          from.directions["InnerUp"] = to.id;
          to.directions["OuterDown"] = from.id;
          break;
        case "Down":
          from.directions["InnerDown"] = to.id;
          to.directions["OuterUp"] = from.id;
          break;
        case "Left":
          from.directions["InnerLeft"] = to.id;
          to.directions["OuterRight"] = from.id;
          break;
        case "Right":
          from.directions["InnerRight"] = to.id;
          to.directions["OuterLeft"] = from.id;
          break;
      }
    }
    switch (direction) {
      case "Up":
        from.directions["OuterUp"] = to.id;
        if (to.id === from.parent)
          to.directions["InnerUp"] = from.id;
        else
          to.directions["OuterDown"] = from.id;
        break;
      case "Down":
        from.directions["OuterDown"] = to.id;
        if (to.id === from.parent)
          to.directions["InnerDown"] = from.id;
        else
          to.directions["OuterUp"] = from.id;
        break;
      case "Left":
        from.directions["OuterLeft"] = to.id;
        if (to.id === from.parent)
          to.directions["InnerLeft"] = from.id;
        else
          to.directions["OuterRight"] = from.id;
        break;
      case "Right":
        from.directions["OuterRight"] = to.id;
        if (to.id === from.parent)
          to.directions["InnerRight"] = from.id;
        else
          to.directions["OuterLeft"] = from.id;
        break;
    }
  }
  InsertIn(position: InsertAction) {
    const direction = position.direction;
    const basepoint = position.basePoint;
    const effectedChildId = position.basePoint.directions[`Outer${direction}`];
    const effectedChild = this.block.comps.find(comp => comp.id === effectedChildId);
    switch (direction) {
      case "Up":
        BlockLinkTool.link(basepoint, "Up", this.comp);
        BlockLinkTool.link(effectedChild, "Down", this.comp);
        this.target.children.splice(this.target.children.indexOf(basepoint.id), 0, this.comp.id);
        break;
      case "Down":
        BlockLinkTool.link(basepoint, "Down", this.comp);
        BlockLinkTool.link(effectedChild, "Up", this.comp);
        this.target.children.splice(this.target.children.indexOf(effectedChildId), 0, this.comp.id);
        break;
      case "Left":
        BlockLinkTool.link(basepoint, "Left", this.comp);
        BlockLinkTool.link(effectedChild, "Right", this.comp);
        this.target.children.splice(this.target.children.indexOf(basepoint.id), 0, this.comp.id);
        break;
      case "Right":
        BlockLinkTool.link(basepoint, "Right", this.comp);
        BlockLinkTool.link(effectedChild, "Left", this.comp);
        this.target.children.splice(this.target.children.indexOf(effectedChildId), 0, this.comp.id);
        break;
      case "Center":
        BlockLinkTool.fillOuter(this.comp, this.target.id);
        BlockLinkTool.fillInner(this.target, this.comp.id);
    }
  }
  // InsertByDirection(direction: Exclude<InnerOutDirection, "Unknow">) {
  //   this.direction = direction;
  //   if (InnerDirections.includes(direction)) {
  //     this.fill(false, this.comp, this.target.id);
  //     if (!this.hasChildren) {
  //       this.fillInner(this.target, this.comp.id);
  //       this.target.children.push(this.comp.id);
  //     }
  //     else {
  //       const effectedChild = this.block.blocks.find(comp => comp.id === this.target.directions[direction]);
  //       this.target.directions[direction] = this.comp.id;
  //       this.comp.directions[InnerMapOuter[direction]] = this.target.id;
  //       this.comp.directions[CounterDirectionMapper[direction]] = effectedChild;
  //       effectedChild.directions[InnerMapOuter[direction]] = this.comp.id;
  //       if (["InnerLeft", "InnerUp"].includes(direction)) {
  //         this.target.children.unshift(this.comp.id);
  //       }
  //       else {
  //         this.target.children.push(this.comp.id);
  //       }
  //     }
  //   }
  //   else {
  //     this.fill(false, this.comp, this.target.parent);
  //     const effectedChildId = this.target.directions[direction];
  //     const effectedChild = this.block.blocks.find(comp => comp.id === this.target.directions[direction]);
  //     if (effectedChildId == this.target.parent) {
  //       effectedChild.directions[OuterMapInner[direction]] = this.comp.id;
  //       this.comp.directions[direction] = effectedChild.id;
  //       this.comp.directions[CounterDirectionMapper[direction]] = this.target.id;
  //       this.target.directions[direction] = this.comp.id;
  //       if (["InnerLeft", "InnerUp"].includes(direction)) {
  //         effectedChild.children.unshift(this.comp.id);
  //       }
  //       else {
  //         effectedChild.children.push(this.comp.id);
  //       }
  //     }
  //     else {
  //       effectedChild.directions[CounterDirectionMapper[direction]] = this.comp.id;
  //       this.comp.directions[direction] = effectedChild.id;
  //       this.comp.directions[CounterDirectionMapper[direction]] = this.target.id;
  //       this.target.directions[direction] = this.comp.id;
  //       const parent = this.block.blocks.find(comp=>comp.id == this.target.parent);
  //       if (["OuterLeft", "OuterUp"].includes(direction)) {
  //         parent.children.splice(parent.children.indexOf(this.target.id), 0, this.comp.id);
  //       }
  //       else {
  //         parent.children.splice(parent.children.indexOf(effectedChildId), 0, this.comp.id);
  //       }
  //     }
  //   }
  //   this.block.blocks.push(this.comp);
  // }
}
//Change("InnerUp").
export interface ComponentFactory {
  gen(tagName: string): PositionableBlockProps;
}
export class DefaultComponentFactory implements ComponentFactory {

  constructor(private metas: { [tagName: string]: ComponentMeta }) {
  }
  gen(tagName: string): PositionableBlockProps {
    const meta = this.metas[tagName];
    return BlockLinkTool.convertToBlock({ tag: meta.name,textType:"none", css: meta.defaultProps,text:"" });
  }
}
export type Context = {
  meta: ComponentMeta;
  factory: ComponentFactory;
};
export type Payload = {
  target: PositionableBlockProps;
  action: InsertAction;
  effected: PositionableBlockProps;
  block: CardRenderConfig;
  comp: PositionableBlockProps;
}

const InsertBettwenBsePoint2Effected: CompMiddleware = (ctx, payload, next) => {
  next();
  return { comp: InsertBettwenMacro(ctx, payload) };
};
export const DefaultInsertMiddlewares = CompMiddlewares.Gen().use(InsertBettwenBsePoint2Effected);
const InsertBettwenMacro = (ctx: Context, payload: Payload) => {
  const action = payload.action;
  BlockLinkTool.fillOuter(payload.comp, payload.target.id);
  BlockLinkTool.insertBettwen(payload.target, action.basePoint, action.direction, payload.effected, payload.comp);
  if(payload.block.comps.find(comp=>comp.id === payload.comp.id) === undefined)payload.block.comps.push(payload.comp);
  return payload.comp;
}
const WrappWith: (tagName: string, cb?: (ctx: Context, payload: Payload, wrapper: PositionableBlockProps) => void) => CompMiddleware = (tagName: string, cb) => (ctx, payload, next) => {
  const wrapper = ctx.factory.gen(tagName);
  BlockLinkTool.setId(payload.block, wrapper);
  if (cb)
    cb(ctx, payload, wrapper);
  else {
    BlockLinkTool.wrapper(payload.target, payload.action.basePoint, wrapper);
    BlockLinkTool.insertBettwen(payload.target, payload.action.basePoint, payload.action.direction, wrapper, payload.comp);
  }
  next();
  return { comp: payload.comp };
}
const Stop: CompMiddleware = (ctx, payload, next) => {
  return { comp: payload.comp };
}
const GenerateTag: (tagName: string, cb?: (ctx: Context, payload: Payload, comp: PositionableBlockProps) => void) => CompGenMiddleware = (tagName: string, cb) => (ctx, payload, next) => {
  next();
  return { comp: ctx.factory.gen(tagName) };
}
const DefaultComponentDeleter: CompMiddleware = (ctx, payload, next) => {
  const parent = payload.target;
  const deleted = payload.action.basePoint;
  const Former = payload.effected;
  const Later = payload.comp;
  const direction = payload.action.direction;
  //Erase Direction information
  if (parent.children.length === 1) {

    BlockLinkTool.fillInner(parent, -1);
  }
  else if (parent.children[0] === deleted.id) {
    if (direction === "Up") {
      parent.directions.InnerLeft=deleted.directions.OuterDown;
      parent.directions.InnerRight=deleted.directions.OuterDown;
      parent.directions.InnerUp = deleted.directions.OuterDown;
      Later.directions.OuterUp = parent.id;
    }
    else {
      parent.directions.InnerLeft = Later.id;
      Later.directions.OuterLeft = parent.id;
      parent.directions.InnerUp=Later.id;
      parent.directions.InnerDown=Later.id;
    }
  }
  else if (parent.children[parent.children.length - 1] === deleted.id) {
    if (direction === "Up") {
      parent.directions.InnerDown = Former.id;
      Former.directions.OuterDown = parent.id;
    }
    else {
      parent.directions.InnerRight = Former.id;
      Former.directions.OuterRight = parent.id;
    }
  }
  else {
    if (direction === "Up") {
      Former.directions.OuterDown = Later.id;
      Later.directions.OuterUp = Former.id;
    }
    else {
      Former.directions.OuterRight = Later.id;
      Later.directions.OuterLeft = Former.id;
    }
  }
  //Remove from children
  parent.children.splice(parent.children.indexOf(deleted.id), 1);
  next();
  return { comp: deleted };
}
export interface CompActionController {
  tryGenerateAt(direction: InnerOutDirection, block: CardRenderConfig, target: PositionableBlockProps): { result: CompActionResType, comp: number };
  tryInsert(comp: PositionableBlockProps, direction: InnerOutDirection, block: CardRenderConfig, target: PositionableBlockProps): { result: CompActionResType, comp: number };
  tryDelete(block: CardRenderConfig, target: PositionableBlockProps): {message:string;result:CompActionResType} ;
  tryMove(block: CardRenderConfig, dragged: PositionableBlockProps, ev: SimpleDragEvent): {message:string;result:CompActionResType} ;
  actions: ComponentActions;
  meta: ComponentMeta;
}
export class ComponentDefBuilder {
  private compMeta: Partial<ComponentMeta>;
  constructor(private tagName: string, private node: FunctionComponent) {
    this.compMeta = {
      name: tagName,
      node: node
    };
  }
  static def(tagName: string, node: FunctionComponent): AllowActions<"type", ComponentDefBuilder> {
    return new ComponentDefBuilder(tagName, node);
  }
  defaultCss(css: { [key: string]: string | number }): AllowActions<"text"|"action"|"generate", this> {
    this.compMeta.defaultProps = css;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    return this;
  }
  action(controller: CompActionController): AllowActions<"text"|"defaultCss" | "generate", this> {
    this.compMeta.controller = controller;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    return this;
  }
  type(type: ComponentType): AllowActions<"text"|"defaultCss" | "action" | "generate", this> {
    this.compMeta.type = type;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    return this;
  }
  text(...types:TextType[]):AllowActions<"defaultCss" | "action" | "generate", this>{
    this.compMeta.text = types;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    return this;
  }
  generate() {
    const { name, node, type,text } = this.compMeta;
    const comp: ComponentMeta = {
      controller: this.compMeta.controller ?? DefaultCompActionController.set(),
      text:text??["none"],
      name,
      node,
      // text:text??["none"],
      type,
      defaultProps: this.compMeta.defaultProps
    }
    comp.controller.meta = comp;
    return comp;
  }
}


export class DefaultCompActionController implements CompActionController {

  meta: ComponentMeta;
  static defaultActions: ComponentActions = {
    GenerateHandler: CompMiddlewares.Gen().use(GenerateTag("Box")).use(Stop),
    WrapperHandler: CompMiddlewares.Gen().use(WrappWith("Box")).use(Stop),
    Delete: CompMiddlewares.Gen().use(DefaultComponentDeleter).use(Stop),
    GeneralInsertHandler: CompMiddlewares.Gen().use(InsertBettwenBsePoint2Effected).use(Stop)
  };
  static set(actions?: Partial<ComponentActions>) {
    const real: ComponentActions = {
      ...DefaultCompActionController.defaultActions,
      ...actions,
    };
    const controller = new DefaultCompActionController();
    controller.actions = real;
    return controller;
  }
  tryInsert(comp: PositionableBlockProps, direction: InnerOutDirection, block: CardRenderConfig, target: PositionableBlockProps): { result: CompActionResType, comp: number } {
    const meta = this.meta;
    //TODO change to handler adapter pattern
    const shortDirection = InnerOuterMapDirection[direction];
    let effected;
    let payload: Payload;
    if (direction.startsWith("Outer")) {
      effected = block.comps.find(comp => comp.id === target.directions[direction]);
      payload = {
        target: block.comps.find(comp => comp.id === target.parent),
        action: {
          basePoint: target,
          direction: shortDirection
        },
        effected,
        block,
        comp
      }
    }
    else {
      if (target.children.length === 0) {
        payload = {
          target,
          action: {
            basePoint: target,
            direction: "Center"
          },
          effected: target,
          block,
          comp
        }
      }
      else {
        let basepoint: PositionableBlockProps;
        //Insert in first last
        if (shortDirection === "Up" || shortDirection === "Left") {
          basepoint = block.comps.find(comp => comp.id === target.children[0]);
          effected = target;
        } else {
          const lastId = target.children[target.children.length - 1];
          basepoint = block.comps.find(comp => comp.id === lastId);
          effected = target;
        }
        payload = {
          target,
          action: {
            basePoint: basepoint,
            direction: shortDirection
          },
          effected,
          block,
          comp
        }
      }
    }
    const ctx: Context = {
      meta: meta,
      factory: ComponentFactory
    }
    payload.comp.id = payload.comp.id === -1?++payload.block.maxChild:payload.comp.id;
    const action = this.actions;
    const handler: CompMiddlewares = action[`Insert${payload.action.direction}`] ?? action[shortDirection === "Up" || shortDirection === "Down" ? "InsertVertical" : "InsertHorizontal"] ?? action["GeneralInsertHandler"] ?? DefaultInsertMiddlewares;
    const res = handler.dispatch(ctx, payload);
    if (res === undefined) {
      console.log("WIP");
      return;
    }
    return {
      result: "Success",
      comp: payload.comp.id
    };
  }
  tryGenerateAt(direction: InnerOutDirection, block: CardRenderConfig, target: PositionableBlockProps): { result: CompActionResType; comp: number; } {
    const comp = ComponentFactory.gen(this.meta.name);
    const res = this.tryInsert(comp, direction, block, target);
    if (res === undefined) {
      console.log("WIP");
      return;
    }
    return {
      result: "Success",
      comp: comp.id
    };
  }
  tryDelete(block: CardRenderConfig, target: PositionableBlockProps): {message:string;result:CompActionResType}  {
    const findById = (id: number) => (block.comps.find(comp => comp.id === id));
    const parent = findById(target.parent);
    let direction;
    let former;
    let later;
    switch (parent.tag) {
      case "VStack":
        direction = "Up";
        former = findById(target.directions[`Outer${direction}`]);
        later = findById(target.directions[`Outer${CounterDirections[direction]}`]);
        break;
      case "HStack":
        direction = "Left";
        former = findById(target.directions[`Outer${direction}`]);
        later = findById(target.directions[`Outer${CounterDirections[direction]}`]);
        break;
      default:
        direction = "Up";
        former = findById(target.directions[`Outer${direction}`]);
        later = findById(target.directions[`Outer${CounterDirections[direction]}`]);
        break;
    }
    const handler = this.actions["Delete"] ?? DefaultCompActionController.defaultActions.Delete;
    const res = handler.dispatch({ factory: ComponentFactory, meta: this.meta }, {
      target: parent,
      action: {
        basePoint: target,
        direction
      },
      effected: former,
      block,
      comp: later
    });
    if (res === undefined) {
      console.log("WIP");
      return;
    }
    return {message:"Success",result:"Success"};
  }
  tryMove(block: CardRenderConfig, dragged: PositionableBlockProps, ev: SimpleDragEvent): {message:string;result:CompActionResType} {

    const findById = (id: number) => (block.comps.find(comp => comp.id === id));
    if (ev.type === "DropIn") {
      const comp = dragged;
      const target = findById(ev.target);
      if(ComponentsList[target.tag].type === "end"){
        return {message:`Cannot insert Elements in ${target.tag}`,result:"Forbidden"};
      }
      else if(dragged.id === target.id){
        console.log("Drag Parent to Children")
        return {message:`Cannot Drop parent in Children`,result:"Forbidden"};
      }
      else if(dragged.id === target.parent){
        return {message:`Cannot Drop parent in Children`,result:"Forbidden"};
      }
      this.tryDelete(block, comp);
      const res = this.tryInsert(comp, "InnerUp", block, target);
      if (res === undefined) {
        console.log("WIP");
      }
      return {message:"Success",result:"Success"};
    }
    else {
      //Drop Bettwen
      const comp = dragged;
      const parent = findById(ev.parent);
      const effected = findById(parent.children[ev.position==="Up"?ev.target:ev.target-1]);
      if(dragged.id === effected.id){
        return {message:`Cannot Drop parent in Children`,result:"Forbidden"};
      }
      else if(dragged.id === effected.parent){
        return {message:`Cannot Drop parent in Children`,result:"Forbidden"};
      }
      this.tryDelete(block, comp);
      const res = this.tryInsert(comp, `Outer${ev.position}`, block, effected);
      if (res === undefined) {
        console.log("WIP");
      }
      return {message:"Success",result:"Success"};
    }
  }
  delete(ctx: Context, payload: Payload): CompActionResType {
    throw new Error("Method not implemented.");
  }
  actions: ComponentActions;
}

export const BoxComponent: ComponentMeta = ComponentDefBuilder.def("Box", Box).type("structure").text("dynamic","programmable","static").defaultCss({
  h: "100px",
  w: "100%",
  bg: "green"
}).generate();
//Move this to AMD module and async load.
export const ComponentGroups: ComponentGroup[] = [{
  name: "Default",
  components: [BoxComponent,
    ComponentDefBuilder.def("Image", Image).type("end").defaultCss({
      h: "100px",
      w: "100%"
    }).generate(),
    ComponentDefBuilder.def("VStack", VStack).type("structure").action(DefaultCompActionController.set({
      InsertHorizontal: CompMiddlewares.Gen().use(InsertBettwenBsePoint2Effected).use(Stop),
      InsertVertical: CompMiddlewares.Gen().use(WrappWith("HStack")).use(Stop),
    })).defaultCss({
      h: "100px",
      w: "100%"
    }).generate(),
    ComponentDefBuilder.def("HStack", HStack).type("structure").action(DefaultCompActionController.set({
      InsertHorizontal: CompMiddlewares.Gen().use(WrappWith("VStack")).use(Stop),
      InsertVertical: CompMiddlewares.Gen().use(InsertBettwenBsePoint2Effected).use(Stop),
    })).defaultCss({
      h: "100px",
      w: "100%"
    }).generate(),
  ]
}];

export const ComponentsList: {
  [name: string]: ComponentMeta
} = {};
ComponentGroups.forEach(group => (group.components.forEach(comp => { ComponentsList[comp.name] = comp })));
export const ComponentFactory = new DefaultComponentFactory(ComponentsList);
