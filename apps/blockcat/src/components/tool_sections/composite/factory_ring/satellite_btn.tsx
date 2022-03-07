import { Circle, Tooltip } from '@chakra-ui/react';
import { Variants } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';
import { MotionBox, MotionBoxProps } from '../../../motioned';
import { Satellite } from './data';
import { useRingEnvironment } from './uncontrolled_factory_ring';

export type StatelliteRenderer<T> = (
  satellite: Satellite<T>,
  id: number,
  env
) => ReactNode;

const satelliteAncherVariants: Variants = {
  Show: ({
    angle,
    posAngle,
  }: {
    angle: number;
    posAngle: number;
  }) => ({
    rotate: angle + posAngle,
  }),
  Hide: {
    rotate: 0,
  },
};

const satelliteContainerVariants: Variants = {
  Show: ({
    angle,
    radius,
    posAngle,
  }: {
    radius: number;
    angle: number;
    posAngle: number;
  }) => ({
    x: radius,
    rotate: -(angle + posAngle),
  }),
  Hide: {
    x: 0,
    rotate: 0,
  },
};

export interface SatelliteBtnProps<T> extends MotionBoxProps {
  angle: number;
  posAngel: number;
  radius: number;
  size?: number | string;
  isRound?: boolean;
  satelliteName: string;
  satellite: Satellite<T>;
  onClickSatellite: (satellite: Satellite<T>) => void;
}

export function SatelliteBtn<T>({
  angle,
  radius,
  size,
  children,
  posAngel,
  transition,
  isRound = true,
  key,
  pointerEvents,
  satelliteName,
  onClickSatellite,
  satellite,
  ...props
}: SatelliteBtnProps<T>) {
  const env = useRingEnvironment();

  const [phase, setPhase] = useState('Show');
  useEffect(() => {
    if (radius > 0) {
      setPhase('Show');
    } else {
      setPhase('Hide');
    }
  }, [radius]);
  return (
    <MotionBox //Ancher
      pos={'absolute'}
      left={0}
      top={0}
      w={'100%'}
      h={'100%'}
      custom={{posAngle:posAngel,angle}}
      transformOrigin={'center'}
      animate={phase}
      variants={satelliteAncherVariants}
      onAnimationComplete={(def:string)=>{
        console.log(`Satellite[${key}]:${def}`);
      }}
      transition={{ ...transition }}
    >
      <MotionBox //Container
        left={0}
        w={size}
        h={size}
        variants={satelliteContainerVariants}
        custom={{posAngle:posAngel,angle,radius}}
        transition={{ ...transition }}
        animate={phase}
      >
        <MotionBox
          userSelect={'none'}
          h={'100%'}
          w={'100%'}
          onClick={() => {
            onClickSatellite(satellite);
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Tooltip
            defaultIsOpen
            isDisabled={env.phase !== "DidSpread"}
            label={`${satellite.name}as`}
            placement={
              posAngel < 90 || posAngel > 270 ? 'right-start' : 'left-start'
            }
            hasArrow
            arrowSize={5}
          >
            <Circle
              pointerEvents={pointerEvents}
              bg={'red'}
              size={'100%'}
              overflow={'hidden'}
            >
              {children ?? satelliteName}
            </Circle>
          </Tooltip>
        </MotionBox>
      </MotionBox>
    </MotionBox>
  );
}
