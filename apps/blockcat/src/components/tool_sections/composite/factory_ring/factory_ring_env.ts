import { Core, Mantle, Satellite } from "./data";
import { FactoryRingHooks } from "./infrastructure/factory_ring_hooks";

export type PhaseTarget = "Core"|"Mantle"|"Satellite";
export type PhaseTargetRelatePhase = `${PhaseTarget}Spread`|  `${PhaseTarget}Collapse`;
export type BaseFactoryPhase = "BeforeSpread"|"DidSpread"|"BeforeCollapse"|"DidCollapse"|"Closed"|"Opened"

export type FactoryRingPhase = BaseFactoryPhase | PhaseTargetRelatePhase;
export const FactoryRingPhaseIdMapper:{[key in FactoryRingPhase]:number} = {
  "Opened":1,
  "BeforeSpread":2,
  "CoreSpread":3,
  "MantleSpread":4,
  "SatelliteSpread":5,
  "DidSpread":6,
  "Closed":-1,
  "BeforeCollapse":-2,
  "CoreCollapse":-3,
  "MantleCollapse":-4,
  "SatelliteCollapse":-5,
  "DidCollapse":-6,
}
export interface FactoryRingEnvironment<T = any> extends FactoryRingHooks{
  satellites: Satellite<T>[];
  setSatellites:(satellites:Satellite<T>[])=>void;
  mantles: Mantle<T>[];
  setMantles:(satellites:Mantle<T>[])=>void;
  setSearchString:(search:string)=>void;
  searchString: string;
  setHovering:(hovering:Core<T>)=>void;
  hovering: Core<T> | null;
  setPhase:(phase:FactoryRingPhase)=>void;
  phase: FactoryRingPhase;

}


