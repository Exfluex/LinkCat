import { Box, Flex } from '@chakra-ui/react';
import { useCurrentRenderBlock } from '../../store';
import { Assembler } from './assembler';
import { Indicator } from './indicator';
export function Workspace() {
  const currentRenderBlock = useCurrentRenderBlock();
  return (
    <Box h={'100%'} w={'100%'} bg="gray.50">

      <Flex
        h={'100%'}
        w={'100%'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Indicator/>
        <Assembler blocks={currentRenderBlock} />
      </Flex>
    </Box>
  );
}
