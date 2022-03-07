import { Box, Circle } from '@chakra-ui/react';
import { ReactNode, useEffect, useState } from 'react';
import { MotionBox, MotionBoxProps } from '../../../motioned';
import { Satellite } from './data';
import { OrbitManger } from './orbit_manger';
import {  SatelliteBtn, StatelliteRenderer } from './satellite_btn';

export interface SatelliteManagerProps<T> {
  satellites: Satellite<T>[];
  isOpen: boolean;
  radius: number;
  rotation: number;
  size?: number;
  isRound?: boolean;
  orbitInterval: number;
  duration: number;
  onClickSatellite: (satellite: Satellite<T>) => void;
}
export function SatelliteManager<T>({
  satellites,
  isOpen,
  duration,
  onClickSatellite,
  ...props
}: SatelliteManagerProps<T>) {
  const render: StatelliteRenderer<T> = (satellite, id) => (
    <SatelliteBtn<T>
      pointerEvents={isOpen ? 'all' : 'none'}
      whileHover={{ scale: 1.6 }}
      whileTap={{ scale: 0.9 }}
      key={satellite.key}
      posAngel={(360 / satellites.length) * id}
      angle={props.rotation}
      transition={{ duration }}
      radius={props.radius}
      size={'30px'}
      bg={'red'}
      satellite={satellite}
      overflow={'hidden'}
      satelliteName={satellite.name}
      onClickSatellite={onClickSatellite}
    >
      {satellite.children}
    </SatelliteBtn>
  );

  const [layers, setLayers] = useState<{
    orbits: { start: number; end: number; max: number; num: number,angle:number }[];
    orbit_num: number;
  }>({
    orbits: [],
    orbit_num: 0,
  });
  useEffect(() => {
    if (isOpen) {
      const length = satellites.length;
      let orbit_max_num;
      let cur_num;
      let last_num = satellites.length;
      let layer_no = 0;
      let angle;
      const orbits: { start: number; end: number; max: number; num: number,angle:number }[] =
        [];
      do {
        angle = (Math.asin(
          (5 + props.size / 2) /
            (props.radius + layer_no * props.orbitInterval)
        ) *
          2);
        orbit_max_num = Math.ceil(
          (Math.PI * 2) /
          angle
        );
        cur_num = last_num - orbit_max_num > 0 ? orbit_max_num : last_num;
        last_num -= cur_num;
        orbits.push({
          start: length - last_num - cur_num,
          end: length - last_num,
          max: orbit_max_num,
          num: cur_num,
          angle:angle
        });
        layer_no++;
      } while (last_num > 0);
      console.log(orbits);
      setLayers({ orbit_num: orbits.length, orbits: orbits });
    }
  }, [satellites, props.radius, props.size]);

  return (
    <Box pos={'absolute'} w={'100%'} h={'100%'}>
      {/* {satellites.map((satellite, id) =>
      (satellite.render ?? render)(satellite, id, {})
    )} */}
      {Array.from({ length: layers.orbit_num }, (v, k) => k).map((orbit_no) => {
        const orbit_satellite = satellites.slice(
          layers.orbits[orbit_no].start,
          layers.orbits[orbit_no].end
        );
        return (
          <Box key={orbit_no} pos={'absolute'} w={'100%'} h={'100%'}>
            <OrbitManger
              naxSatellite={layers.orbits[orbit_no].max}
              satellites={orbit_satellite}
              isOpen={isOpen}
              orbitInterval={props.orbitInterval}
              rotation={props.rotation}
              radius={props.radius}
              size={props.size}
              layer={orbit_no}
              duration={duration}
              satelliteNum={orbit_satellite.length}
              onClickSatellite={onClickSatellite}
            ></OrbitManger>
          </Box>
        );
      })}
    </Box>
  );
}
