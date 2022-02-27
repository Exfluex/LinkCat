import { Box, Flex } from '@chakra-ui/react';
import { CardBlockWorkShop } from './card_blok_workshop';
import { TopBar } from './top_bar';

export function FullView() {
  return (
    <Flex direction={'column'} pos={'fixed'} h={'100%'} w={'100%'}>
      <TopBar w={'100%'} h={'60px'}></TopBar>
      <Box h={'100%'}>
        <CardBlockWorkShop />
      </Box>
    </Flex>
  );
}
