import { Box, Show, useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Satellite } from './data';
import {  SatelliteBtn, StatelliteRenderer } from './satellite_btn';



export interface OrbitMangerProps<T> {
  satellites: Satellite<T>[];
  isOpen: boolean;
  radius: number;
  orbitInterval: number;
  rotation: number;
  size?: number | string;
  isRound?: boolean;
  layer: number;
  duration: number;
  satelliteNum: number;
  naxSatellite:number;
  onClickSatellite: (satellite: Satellite<T>) => void;
}
export function OrbitManger<T>({
  satellites,
  isOpen,
  orbitInterval,
  duration,
  onClickSatellite,
  layer,
  ...props
}: OrbitMangerProps<T>) {
  const [orbit, setOrbit] = useState({
    orbitRadius: props.radius,
    rotation: props.rotation,
    orbitInterval: orbitInterval,
  });
  useEffect(() => {
    if(isOpen){
      setOrbit({
        orbitRadius: props.radius + layer * orbitInterval,
        rotation: props.rotation,
        orbitInterval: orbitInterval,
      });
    }
    else{
      setOrbit({
        orbitRadius:0,
        rotation: 0,
        orbitInterval: 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.rotation, props.radius, layer, orbitInterval]);
  const render: StatelliteRenderer<T> = (satellite, id) => (
    <SatelliteBtn<T>
      pointerEvents={isOpen ? 'all' : 'none'}
      whileHover={{ scale: 1.6 }}
      whileTap={{ scale: 0.9 }}
      key={satellite.key}
      posAngel={(360 / props.naxSatellite) * id}
      angle={orbit.rotation}
      transition={{ duration }}
      radius={orbit.orbitRadius}
      size={'30px'}
      bg={'red'}
      satellite={satellite}
      satelliteName={satellite.name}
      onClickSatellite={onClickSatellite}
    >
      {satellite.children}
    </SatelliteBtn>
  );
  return (
    <Box pos={'absolute'} h={'100%'} w={'100%'}>
      {satellites.map((satellite, id) =>
        (satellite.render ?? render)(satellite, id, {})
      )}
    </Box>
  );
}
