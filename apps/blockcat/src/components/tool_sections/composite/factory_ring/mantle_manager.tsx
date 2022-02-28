import { Box, calc, Flex } from '@chakra-ui/react';
import { AiFillCloseCircle } from 'react-icons/ai';
import { MotionBox } from '../../../motioned';

export interface Mantle<T> {
  name: string;
  key: string;
  descrption?: string;
  item?: T;
}

export interface MantleManagerProps<T> {
  mantles: Mantle<T>[];
  mantleRadius: number;
  rotation: number;
  isOpen: boolean;
  duration: number;
  onClick:(key:string,item:T)=>void;
}

export function MantleManager<T>({
  mantles,
  mantleRadius,
  rotation,
  isOpen,
  duration,
  onClick
}: MantleManagerProps<T>) {
  if (mantles.length > 4) {
    console.log('??????');
  }
  const OnClickWraper = (index:number)=>{
    onClick(mantles[index].key,mantles[index].item);
  }
  const MantleNum = mantles.length;
  const OneMantle = () => (
    <MotionBox
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      bg={'red.100'}
      pointerEvents={'all'}
      position={'absolute'}
      rounded={'full'}
      w={'50%'}
      h={'100%'}
      zIndex={-1}
      borderRightRadius={0}
      left={'0%'}
      top={'0%'}
      onClick={()=>{OnClickWraper(0)}}
    ></MotionBox>
  );
  const TwoMantle = () => (
    <>
      <MotionBox
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        bg={'red.100'}
        pointerEvents={'all'}
        position={'absolute'}
        rounded={'full'}
        w={'50%'}
        h={'100%'}
        zIndex={-1}
        borderRightRadius={0}
        left={'0%'}
        top={'0%'}
        onClick={()=>{OnClickWraper(0)}}
      ></MotionBox>
      <MotionBox
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        bg={'blue.100'}
        position={'absolute'}
        pointerEvents={'all'}
        rounded={'full'}
        w={'50%'}
        h={'100%'}
        zIndex={-1}
        borderLeftRadius={0}
        left={'50%'}
        top={'0%'}
        onClick={()=>{OnClickWraper(1)}}
      ></MotionBox>
    </>
  );
  const FourMantles = () => (
    <>
      <MotionBox
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        bg={'red.100'}
        pointerEvents={'all'}
        position={'absolute'}
        rounded={'full'}
        w={'50%'}
        h={'50%'}
        zIndex={-1}
        borderRadius={'0 0 100% 0'}
        left={'0%'}
        top={'0%'}
        onClick={()=>{OnClickWraper(0)}}
      ></MotionBox>
      <MotionBox
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        bg={'blue.100'}
        position={'absolute'}
        pointerEvents={'all'}
        rounded={'full'}
        w={'50%'}
        h={'50%'}
        zIndex={-1}
        borderRadius={'0 0 0 100%'}
        left={'50%'}
        top={'0%'}
        onClick={()=>{OnClickWraper(1)}}
      ></MotionBox>
      <MotionBox
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        bg={'red.100'}
        pointerEvents={'all'}
        position={'absolute'}
        rounded={'full'}
        w={'50%'}
        h={'100%'}
        zIndex={-1}
        borderRightRadius={0}
        left={'0%'}
        top={'0%'}
        onClick={()=>{OnClickWraper(2)}}
      ></MotionBox>
      <MotionBox
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        bg={'blue.100'}
        position={'absolute'}
        pointerEvents={'all'}
        rounded={'full'}
        w={'50%'}
        h={'100%'}
        zIndex={-1}
        borderLeftRadius={0}
        left={'50%'}
        top={'0%'}
        onClick={()=>{OnClickWraper(3)}}
      ></MotionBox>
    </>
  );
  return (
    <MotionBox
      pointerEvents={'none'}
      animate={{
        rotate: rotation,
        scale: mantleRadius > 0 ? 1 : 0,
      }}
      transition={{ duration, delay: isOpen ? 0.5 : 0 }}
      position={'absolute'}
      w={`${mantleRadius}px`}
      h={`${mantleRadius}px`}
      left={calc('50%')
        .subtract(`${mantleRadius / 2}px`)
        .toString()}
      top={calc('50%')
        .subtract(`${mantleRadius / 2}px`)
        .toString()}
    >
      {MantleNum === 1
        ? OneMantle()
        : MantleNum === 2
        ? TwoMantle()
        : MantleNum === 4
        ? FourMantles()
        : OneMantle()}
    </MotionBox>
  );
}
