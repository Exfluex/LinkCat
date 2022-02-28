import { ReactNode } from 'react';
import { Mantle } from './mantle_manager';
import { Satellite } from './satellite_btn';

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
  },
  {
    name: 'Test1',
    key: 'Test1',
    description: 'HStack component',

  },
  {
    name: 'Test2',
    key: 'Test2',
    description: 'HStack component',

  },
  {
    name: 'Test3',
    key: 'Test3',
    description: 'HStack component',

  },
  {
    name: 'Test4',
    key: 'Test4',
    description: 'HStack component',

  },
  {
    name: 'Test5',
    key: 'Test5',
    description: 'HStack component',

  },
  {
    name: 'Test6',
    key: 'Test6',
    description: 'HStack component',

  },
  {
    name: 'Test7',
    key: 'Test7',
    description: 'HStack component',

  },
  {
    name: 'Test8',
    key: 'Test8',
    description: 'HStack component',

  },
  {
    name: 'Test9',
    key: 'Test9',
    description: 'HStack component',

  },
  {
    name: 'Test10',
    key: 'Test10',
    description: 'HStack component',

  },
  {
    name: 'Test11',
    key: 'Test11',
    description: 'HStack component',

  },
  {
    name: 'Test12',
    key: 'Test12',
    description: 'HStack component',

  },
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
  onClickSatellite: (satelite) => {
    console.log(satelite);
  },
  onClickMantle: (key) => {
    console.log(key);
  },
};

export function FactoryRingTestEnv({ children }: FactoryRingEnvironmentProps) {
  return (
    <UncontrolledFactoryRing {...props}>{children}</UncontrolledFactoryRing>
  );
}
