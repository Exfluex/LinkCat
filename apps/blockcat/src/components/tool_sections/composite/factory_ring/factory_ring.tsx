import {
  Box,
  Circle,
  calc,
  Center,
  ColorModeProvider,
  Flex,
  IconButton,
  tokenToCSSVar,
  useColorModeValue,
  useDisclosure,
  Input,
} from '@chakra-ui/react';
import { useMotionValue } from 'framer-motion';
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import { FiPlus } from 'react-icons/fi';
import { useOutsideClick } from '@chakra-ui/react';
import { MotionBox, MotionBoxProps, MotionCircle } from '../../../motioned';
import {  SatelliteManager } from './satellite_manager';
import {  MantleManager } from './mantle_manager';
import { FactoryRingSearchBar } from './search_bar';

import { FactoryRingDescriptionBar } from './description_bar';
import { Mantle, Satellite } from './data';
//TODO Make it better. Extract it as A individual component
export interface FactoryRingProps<T> {
  children?: ReactNode;
  mantles: Mantle<T>[];
  satellites: Satellite<T>[];
  coreRadius: number;
  mantleRadius: number;
  oribitRadius: number;
  satelliteRadius: number;
  orbitInterval: number;
  onClickSatellite: (satellite: Satellite<T>) => void;
  onClickMantle: (key: string, item: T) => void;
  rotation: number;
  duration: number;
}


export function FactoryRing<T = any>({
  children,
  ...props
}: FactoryRingProps<T>) {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: false });
  const [circleBtnAnim, setCircleBtnAnim] = useState<{
    orbitRadius: number;
    mantleRadius: number;
    rotate: number;
  }>({
    orbitRadius: 0,
    mantleRadius: 0,
    rotate: 0,
  });
  const ringRef = useRef();
  useOutsideClick({
    ref: ringRef,
    handler: () => CloseHandler(),
  });
  const [isSearching, setIsSearching] = useState(false);
  const [searchString, setSearchString] = useState('');

  const CloseHandler = () => {
    document.onkeydown = null;
    setIsSearching(false);
    onClose();
  };
  useEffect(() => {
    if (isOpen) {
      document.onkeydown = (ev) => {
        setSearchString(ev.key);
        setIsSearching(true);
        document.onkeydown = null;
      };
      setCircleBtnAnim({
        orbitRadius: props.oribitRadius,
        mantleRadius: props.mantleRadius,
        rotate: props.rotation,
      });
    } else {
      setCircleBtnAnim({ orbitRadius: 0, mantleRadius: 0, rotate: 0 });
    }
  }, [isOpen]);
  useEffect(() => {
    if (isOpen) {
      setCircleBtnAnim({
        rotate: props.rotation,
        mantleRadius: props.mantleRadius,
        orbitRadius: props.oribitRadius,
      });
    }
  }, [props.rotation, props.mantleRadius, props.oribitRadius]);
  const SearchWidget = (
    <Box w={'100px'}>
      <Input autoFocus={true} defaultValue={searchString} />
    </Box>
  );
  const onClickS = () => {
    console.log('click Satellite');
  };
  const onClickM = () => {
    console.log('click mantle');
  };
  return (
    <Box pos={'relative'} ref={ringRef}>
      <Box onClick={onOpen}>{children}</Box>
      <MotionBox
        pointerEvents={'none'}
        animate={{
          rotate: circleBtnAnim.rotate,
          scale: circleBtnAnim.mantleRadius > 0 ? 1 : 0,
        }}
        transition={{ duration: props.duration, delay: isOpen ? 0.5 : 0 }}
        position={'absolute'}
        w={`${props.mantleRadius}px`}
        h={`${props.mantleRadius}px`}
        left={calc('50%')
          .subtract(`${props.mantleRadius / 2}px`)
          .toString()}
        top={calc('50%')
          .subtract(`${props.mantleRadius / 2}px`)
          .toString()}
      >
        <MantleManager
          mantles={props.mantles}
          mantleRadius={props.mantleRadius}
          rotation={circleBtnAnim.rotate}
          isOpen={isOpen}
          duration={props.duration}
          onClick={onClickM}
        />
        <MotionBox w={'100%'} h={'100%'} pos={'absolute'}>
          <Flex
            w={'100%'}
            zIndex={1}
            h={'100%'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <IconButton
              aria-label="Close"
              rounded={'full'}
              onClick={() => CloseHandler()}
              icon={
                <AiFillCloseCircle
                  pointerEvents={'all'}
                  color={'green'}
                  size={'full'}
                />
              }
            ></IconButton>
          </Flex>
        </MotionBox>
      </MotionBox>

      <MotionBox
        pointerEvents={'none'}
        pos={'absolute'}
        left={'0%'}
        top={0}
        w={'100%'}
        h={'100%'}
      >
        <SatelliteManager
        orbitInterval={props.orbitInterval}
          onClickSatellite={props.onClickSatellite}
          satellites={props.satellites}
          isOpen={isOpen}
          radius={circleBtnAnim.orbitRadius}
          size={props.satelliteRadius}
          isRound={true}
          duration={2}
          rotation={circleBtnAnim.rotate}
        />
      </MotionBox>
      <FactoryRingDescriptionBar desc={'asadasd'} showing={true}/>
      {isSearching && (
        <FactoryRingSearchBar searchString={searchString}/>
      )}

    </Box>
  );
}

// interface FactorySearchAbility{
//   onSearch:(input:string,satellites:Satellite<T>[])=>void;
// }
// type FactoryRingEnvironment<T = any> = InteractionManager<T>;
// interface InteractionManager<T> {
//   createMantleInteractiveObject: (
//     satellite: Satellite<T>,
//     env
//   ) => InteractiveCapabilities<T>;
//   createSatelliteInteractiveObject: (
//     satellite: Satellite<T>,
//     env
//   ) => InteractiveCapabilities<T>;
// }
// interface InteractiveCapabilities<T> {
//   onClick?: (satellite: Satellite<T>) => void;
// }

export function ObritManager() {
  return <Box></Box>;
}
