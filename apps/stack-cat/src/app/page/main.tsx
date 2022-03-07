import { Box, Button } from '@chakra-ui/react';
import { useState } from 'react';
import { StackChain } from '../compositions/StackChain';
import { StackTree } from '../compositions/StackTree';
import { fakeStack, RandomNode, StackGen } from '../data/fake_data';
import { StackFrame } from '../entities/stack_frame';

export interface MainPageProps {
  app: string;
}

export function MainPage({ app }: MainPageProps) {
  const [current, setNode] = useState(RandomNode());
  return (
    <Box>
      <StackChain current={current}></StackChain>
      <StackTree current={current}></StackTree>
      <Button onClick={()=>{setNode(RandomNode())}}>Variant</Button>
    </Box>
  );
}
