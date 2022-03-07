import { Transition, Variant, Variants } from "framer-motion";




export interface FactoryBtnBaseAnim{
  whileHover:Variant;
  whileTap:Variant;

}

export interface EnterLeaveAnim{
  Show:Variant;
  Hide:Variant;
}

export interface CoreBtnAnim extends FactoryBtnBaseAnim,EnterLeaveAnim{
  Show:Variant;
  Hide:Variant;
  transition:Transition;
}

export interface MantleBtnAnim extends FactoryBtnBaseAnim,EnterLeaveAnim{
  Show:Variant;
  Hide:Variant;
  transition:Transition;
}

export interface SatelliteBtnAnim extends FactoryBtnBaseAnim{
  Show:Variants;
  Hide:Variants;
  transition:Transition;
}

export type OrbitAnim = EnterLeaveAnim;
