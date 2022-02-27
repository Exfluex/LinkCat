import { Box, calc, Circle, Flex, useDisclosure } from '@chakra-ui/react';
import { useMotionValue } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import { MotionBox, MotionBoxProps } from '../../motioned';

//TODO Make it better. Extract it as A individual component
export interface FactoryRingProps {
  children?: ReactNode;
}

const RoundBox = ({
  children,
  radius = '30px',
  ...props
}: MotionBoxProps & { radius?: number | string }) => (
  <MotionBox {...props} h={radius} w={radius} rounded="full">
    {children}
  </MotionBox>
);
const pi180 = (Math.PI/180);
const angles =[...new Array(360).fill(0)].map((_,i) => ({
  cos: Math.cos(i * pi180),
  sin: Math.sin(i * pi180)
}));
export function FactoryRing({ children }: FactoryRingProps) {
  const { isOpen, onOpen,onClose } = useDisclosure({ defaultIsOpen: false });
  const [circleBtnAnim, setCircleBtnAnim] = useState<{circleOffset:number;rotate:number}>({
    circleOffset: 0,
    rotate: 0,
  });
  const duration = 2;
  const coreRadius=45;
  const mantleRadius = 120;
  const SatelliteRadius = 30;
  const OrbitInterval = 80;
  const Rotation=360;
  useEffect(() => {
    if (isOpen) {
      setCircleBtnAnim({ circleOffset: OrbitInterval, rotate: Rotation });
    } else {
      setCircleBtnAnim({ circleOffset: 0, rotate: 0 });
    }
  }, [isOpen]);
  return (
    <Box pos={'relative'}>
      <Box onClick={onOpen}>{children}</Box>
      <MotionBox pointerEvents={'none'} animate={{rotate:circleBtnAnim.rotate,scale:circleBtnAnim.circleOffset>0?1:0}} transition={{duration,delay:isOpen?0.5:0}} position={"absolute"} w={`${mantleRadius}px`} h={`${mantleRadius}px`} left={calc("50%").subtract(`${mantleRadius/2}px`).toString()} top={calc("50%").subtract(`${mantleRadius/2}px`).toString()} >
        <MotionBox whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} backgroundColor={"tomato"} pointerEvents={"all"} position={"absolute"} rounded={"full"} w={"50%"} h={"100%"} zIndex={-1} borderRightRadius={0} left={"0%"} top={"0%"} >1</MotionBox>
        <MotionBox  w={"100%"}  h={"100%"} pos={"absolute"} ><Flex w={"100%"} zIndex={1} h={"100%"} justifyContent={"center"}alignItems={"center"}><AiFillCloseCircle pointerEvents={"all"} onClick={()=>onClose()} color={"green"} size={coreRadius}/></Flex></MotionBox>
        <MotionBox whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} bg={'blue'} position={"absolute"} pointerEvents={"all"} rounded={"full"} w={"50%"} h={"100%"} zIndex={-1} borderLeftRadius={0} left={"50%"} top={"0%"}></MotionBox>
      </MotionBox>

      <MotionBox
        pointerEvents={'none'}
        pos={'absolute'}
        left={"0%"}
        top={0}
        w={'100%'}
        h={'100%'}
        // animate={{ rotate: circleBtnAnim.rotate }}
        transition={{ duration }}

      >
        {[0].map((vl)=>{
          return <SatelliteBtn
          pointerEvents={isOpen?"all":"none"}
          key={vl}
          posAngel={360*vl}
          angle={circleBtnAnim.rotate}
          transition={{ duration }}
          radius={circleBtnAnim.circleOffset}
          size={'30px'}
          bg={'red'}
          overflow={"hidden"}
        >Box</SatelliteBtn>
        })}
      </MotionBox>
    </Box>
  );
}

export interface SatelliteBtnProps extends MotionBoxProps {
  angle: number;
  posAngel:number;
  radius: number;
  size?: number | string;
  isRound?: boolean;
}
export function SatelliteBtn({
  angle,
  radius,
  size,
  children,
  posAngel,
  isRound = true,
  transition,
  ...props
}: SatelliteBtnProps) {
  const sin= angles[Math.floor((angle+posAngel) % 360)].sin;
  const cos = angles[Math.floor((angle+posAngel) % 360)].cos;
  return (
    // <MotionBox
    //   h={size}
    //   animate={{ x: `${cos*radius}px`,y:`${sin*radius}px`, rotate: -angle }}
    //   rounded={isRound ? 'full' : undefined}
    //   w={size}
    //   pos={'absolute'}
    //   {...props}
    // >
    //   <Flex justifyContent={"center"} alignItems={"center"}>{children}</Flex>
    // </MotionBox>
    <MotionBox w={"100%"} h={"100%"} transformOrigin={"center"} animate={{rotate:angle+posAngel}}  transition={{...transition}}>
      <MotionBox left={0} animate={{x:radius,rotate:-(angle+posAngel)}} transition={{...transition}}>
        <Circle bg={"red"} size={"100%"}>{children}</Circle>
      </MotionBox>
    </MotionBox>
  );
}
