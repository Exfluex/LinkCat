import { addComponent, useAppDispatch } from 'apps/blockcat/src/store';
import { ReactNode } from 'react';
import { Mantle, Satellite } from './data';



import { UncontrolledFactoryRing } from './uncontrolled_factory_ring';

interface FactoryRingEnvironmentProps {
  children: ReactNode;
}
const Satellites: Satellite<never>[] = [
  {
    name: 'Box',
    key: 'Box',
    description: 'Box component',
    children: 'Box',
  },
  {
    name: 'Image',
    key: 'Image',
    description: 'Image component',
    children: 'Image',
  },
  {
    name: 'VStack',
    key: 'VStack',
    description: 'VStack component',
    children: 'VStack',
  },
  {
    name: 'HStack',
    key: 'HStack',
    description: 'HStack component',
  }
];
const Mantles: Mantle<never>[] = [
  {
    name: 'PreviousPage',
    key: 'P',
  },
  {
    name: 'NextPage',
    key: 'N',
  },
];
const props = {
  mantles: Mantles,
  satellites: Satellites,
  coreRadius: 30,
  mantleRadius: 100,
  oribitRadius: 80,
  satelliteRadius: 30,
  orbitInterval: 35,
  rotation: 360,
  onClickMantle: (key) => {
    console.log(key);
  },
};

export function FactoryRingTestEnv({ children }: FactoryRingEnvironmentProps) {
  const dispatch = useAppDispatch();
  const clickOnSatellite:(satellite: Satellite<never>) => void = (satelite) => {
    console.log(satelite);
    dispatch(addComponent({component:satelite.name,direction:"OuterDown"}));
  }
  return (
    <UncontrolledFactoryRing onClickSatellite={clickOnSatellite} {...props}>{children}</UncontrolledFactoryRing>
  );
}
