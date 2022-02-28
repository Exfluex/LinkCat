import { Circle, Tooltip } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { MotionBox, MotionBoxProps } from '../../../motioned';

export type StatelliteRenderer<T> = (
  satellite: Satellite<T>,
  id: number,
  env
) => ReactNode;

export interface Satellite<T> {
  name: string;
  key: string;
  description: string;
  item?: T;
  children?: ReactNode;
  render?: (satellite: Satellite<T>, env) => ReactNode;
}

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
  return (
    <MotionBox
      pos={'absolute'}
      left={0}
      top={0}
      w={'100%'}
      h={'100%'}
      transformOrigin={'center'}
      animate={{ rotate: angle + posAngel }}
      transition={{ ...transition }}
    >
      <MotionBox
        left={0}
        w={size}
        h={size}
        animate={{ x: radius, rotate: -(angle + posAngel) }}
        transition={{ ...transition }}
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
