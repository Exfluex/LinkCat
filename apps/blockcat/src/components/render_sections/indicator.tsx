import { Box } from '@chakra-ui/react';
import { changeHovering, useAppDispatch, useAppSelector, useFocusedComponent } from '../../store';
import { MotionBox } from '../motioned';
import { ComponentControlOverlay } from './comp_control_overlay';

export function Indicator() {
  const position = useAppSelector((state) => state.renderblock.indicator);
  const dispatch = useAppDispatch();
  const focused = useFocusedComponent();
  return (
    <>
    <MotionBox
      zIndex={2}
      animate={{
        scale: [1, 1.1,1.1, 1],
      }}
      transition={{
        duration: 2,
        ease:"easeOut",
        repeat: Infinity,
      }}
      boxShadow="outline"
      {...position}
      position={'fixed'}
      pointerEvents={"none"}
      onMouseEnter={(ev)=>{ev.stopPropagation();dispatch(changeHovering({id:focused.id,mouse:"in"}))}}
      onMouseOut={(ev)=>{ev.stopPropagation();dispatch(changeHovering({id:focused.id,mouse:"out"}))}}
      rounded="md"
    >
    </MotionBox>
    {focused && position.left !==0 && <Box zIndex={10} pointerEvents={"none"} {...position} pos={"fixed"}><ComponentControlOverlay pos={"absolute"} w={"100%"} h={"100%"} zIndex={2} belongto={focused.id} /></Box>}
    </>
  );
}
