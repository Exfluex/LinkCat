import { Variant } from "framer-motion";
import { ReactNode } from "react";


export interface InteractionManager{
  // onClick
  onClick:()=>void;
}

export interface AnimatedBtn{
  whileTap:Variant;
  whileHover:Variant;
}

export type FactoryBtnType = "Core"|"Mantle"|"Satellite";
export interface Core<T>{
  name: string;
  key: string;
  descrption?: string;
  item?: T;
  // type:FactoryBtnType;
}

export type Mantle<T> = Core<T>

export interface Satellite<T> extends Core<T>{
  name: string;
  key: string;
  description: string;
  item?: T;
  children?: ReactNode;
  render?: (satellite: Satellite<T>, env) => ReactNode;
}

