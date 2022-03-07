import { Box, Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { StackNode } from '../components/stack_node';
import { StackFrame } from '../entities/stack_frame';

export interface StackChainProps {
  current: StackFrame;
}

export function StackChain({ current }: StackChainProps) {
  const [chain, setChain] = useState<StackFrame[]>([]);

  useEffect(() => {
    const chain: StackFrame[] = [];
    let node = current;
    do {
      chain.push(node);
      node = node.parent;
    } while (node);
    setChain(chain);
  }, [current]);
  return (
    <Box pos={'fixed'} h={'120px'} w={'100%'} bg={"red.200"}>
      <Flex  h={'100%'} w={'100%'} direction={'row'} justifyContent={"flex-start"} alignItems={"center"}>
        {chain.map((stack) => (
          <StackNode key={stack.id} stack={stack} />
        ))}
      </Flex>
    </Box>
  );
}
