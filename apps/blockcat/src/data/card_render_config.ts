import { TextType } from './component';

type CardRenderConfigType = "Component"|"Template"|"Card"



export interface ResourceConsumer{
  programmable:{[id:number]:string};
  programmable_num:number;
  dynamic:{[id:number]:string};
  dynamic_num:number;
}
export interface CardRenderConfig {
  id: number;
  name: string;
  maxChild: number;
  resources:ResourceConsumer;
  slot?: {
    count: number;
    required: number;
    slots: number[]
  };
  type:CardRenderConfigType;
  comps: PositionableBlockProps[];
}

export type MinimalBlockProps = Omit<PositionableBlockProps, "id" | "parent" | "children" | "directions">;
export interface PositionableBlockProps extends PlainTreeLike, Positionable {
  tag: string;
  nickName?: string;
  css?: {
    [key: string]: number | string
  };
  text: string;
  textType:TextType;
}

export interface PlainTreeLike {
  id: number;
  parent: number;
  children: number[];
}
export interface Positionable {
  directions: {
    [direction in Exclude<InnerOutDirection, "Unknow">]: number
  },
}
export type DirectionNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type Direction = "Up" | "Down" | "Left" | "Right"
export type InnerOutDirection = InnerDirection | OuterDirection | UnknowDirection;
export type UnknowDirection = "Unknow";
export type InnerDirection = `Inner${Direction}`;
export const InnerDirections: InnerOutDirection[] = ["InnerUp", "InnerDown", "InnerLeft", "InnerRight"];
export const OuterDirections: InnerOutDirection[] = ["OuterUp", "OuterDown", "OuterLeft", "OuterRight"];
export type OuterDirection = `Outer${Direction}`;
export const DirectionMapper: { [direction in InnerOutDirection]: InnerOutDirection } = {
  "Unknow": "Unknow",
  "InnerUp": "InnerUp",
  "InnerDown": "InnerDown",
  "InnerLeft": "InnerLeft",
  "InnerRight": "InnerRight",
  "OuterUp": "OuterUp",
  "OuterDown": "OuterDown",
  "OuterLeft": "OuterLeft",
  "OuterRight": "OuterRight",
}
export const InnerOuterMapDirection: { [direction in Exclude<InnerOutDirection, "Unknow">]: Direction } = {
  "InnerUp": "Up",
  "InnerDown": "Down",
  "InnerLeft": "Left",
  "InnerRight": "Right",
  "OuterUp": "Up",
  "OuterDown": "Down",
  "OuterLeft": "Left",
  "OuterRight": "Right",
}
export const InnerMapOuter: { [direction in InnerDirection]: OuterDirection } = {
  "InnerUp": "OuterUp",
  "InnerDown": "OuterDown",
  "InnerLeft": "OuterLeft",
  "InnerRight": "OuterRight",
}
export const OuterMapInner: { [direction in OuterDirection]: InnerDirection } = {
  "OuterUp": "InnerUp",
  "OuterDown": "InnerDown",
  "OuterLeft": "InnerLeft",
  "OuterRight": "InnerRight",
}
export const CounterDirections: { [direction in Direction]: Direction } = {
  "Down": "Up",
  "Left": "Right",
  "Right": "Left",
  "Up": "Down"
}
export const CounterDirectionMapper: { [direction in InnerOutDirection]: InnerOutDirection } = {
  "Unknow": "Unknow",
  "InnerUp": "InnerDown",
  "InnerDown": "InnerUp",
  "InnerLeft": "InnerRight",
  "InnerRight": "InnerLeft",
  "OuterUp": "OuterDown",
  "OuterDown": "OuterUp",
  "OuterLeft": "OuterRight",
  "OuterRight": "OuterLeft",
}
export const DirectionNumberTostring: { [directionNumber in DirectionNumber]: string } = {
  0: "Unknow",
  1: "InnerUp",
  2: "InnerDown",
  3: "InnerLeft",
  4: "InnerRight",
  5: "OuterUp",
  6: "OuterDown",
  7: "OuterLeft",
  8: "OuterRight",
}
