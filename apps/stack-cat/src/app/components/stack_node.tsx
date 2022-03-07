import { Box, Center } from "@chakra-ui/react";
import { StackFrame } from "../entities/stack_frame";





export interface StackFrameProps{
  stack:StackFrame;
}

export function StackNode({stack}:StackFrameProps){
  return (
    <Box mx={2} w={"140px"} h={"60px"} rounded={"md"} bg={"Background"}>
      <Center w={"100%"} h={"100%"}>
        <Box>{stack.name}</Box>
      </Center>
    </Box>
  )
}
