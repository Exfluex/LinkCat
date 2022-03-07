import { createContext, ReactNode, useContext, useRef, useState } from 'react';
import { Core, Mantle, Satellite } from './data';
import { FactoryRing } from './factory_ring';
import { FactoryRingEnvironment, FactoryRingPhase } from './factory_ring_env';

interface UncontrolledFactoryRingProps<T> {
  mantles: Mantle<T>[];
  satellites: Satellite<T>[];
  coreRadius: number;
  mantleRadius: number;
  oribitRadius: number;
  satelliteRadius: number;
  orbitInterval: number;
  rotation: number;
  onClickSatellite: (satellite: Satellite<T>) => void;
  onClickMantle: (key: string, item: T) => void;
  children: ReactNode;
}

export const FactoryRingEnvrionmentContext =
  createContext<FactoryRingEnvironment>(null as any);
export const useRingEnvironment = () =>
  useContext(FactoryRingEnvrionmentContext);


export function UncontrolledFactoryRing<T = never>({
  children,
  mantles,
  satellites,
  ...props
}: UncontrolledFactoryRingProps<T>) {
  const hooksRef = useRef({});

  const [_satellites, setSatellites] = useState([]);
  const [_mantles,setMantles] = useState([]);
  const [_searchString,setSearchString]  =useState("");
  const [_phase,setPhase] = useState<FactoryRingPhase>("DidCollapse");
  const [_hovering,setHovering ] =useState<Core<T>>(null);
  const envValue:FactoryRingEnvironment = {
    mantles:_mantles,
    satellites:_satellites,
    searchString: _searchString,
    hovering: _hovering,
    phase: _phase,
    setHovering,
    setSatellites,
    setMantles,
    setPhase,
    setSearchString
  };
  return (
    <FactoryRingEnvrionmentContext.Provider value={envValue}>
      <FactoryRing<T>
        duration={2}
        satellites={satellites}
        mantles={mantles}
        {...props}
      >
        {children}
      </FactoryRing>
    </FactoryRingEnvrionmentContext.Provider>
  );
}
