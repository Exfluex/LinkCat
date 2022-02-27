import { Box, Flex, Grid } from '@chakra-ui/react';
import { CardBlockWorkShop } from '../mode/mode_shared/card_blok_workshop';
import { TopBar } from './top_bar';

export function FullView() {
  return (
    <Box height={"100%"} w={"100%"} position={"fixed"}>
      <TopBar w={'100%'} h={'60px'}></TopBar>
      <CardBlockWorkShop h={'calc(100% - 60px)'} />
    </Box>
  );
}
