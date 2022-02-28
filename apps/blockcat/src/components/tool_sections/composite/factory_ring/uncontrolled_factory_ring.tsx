import { ReactNode } from 'react';
import { FactoryRing } from './factory_ring';
import { Mantle } from './mantle_manager';
import { Satellite } from './satellite_btn';

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



export function UncontrolledFactoryRing<T = never>({
  children,
  ...props
}: UncontrolledFactoryRingProps<T>) {
  return (
    <FactoryRing<T> duration={2} {...props}>
      {children}
    </FactoryRing>
  );
}
