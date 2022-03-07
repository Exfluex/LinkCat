import { Flex, IconButton } from "@chakra-ui/react";
import { AiFillCloseCircle } from "react-icons/ai";
import { MotionBox } from "../../../motioned";

export function CoreManager() {
  return (
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
          onClick={() => {}}
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
  );
}

