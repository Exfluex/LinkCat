import { Box, BoxProps, useColorModeValue, Flex } from '@chakra-ui/react';
import { Workspace } from '../render_sections/workspace';
import { ComponentsList } from './component_menu';
import { ToolkitBar } from './right_bar';
import { SideBar } from './sidebar';

type CardBlockWorkShop = BoxProps;
export function CardBlockWorkShop(props: CardBlockWorkShop) {
  return (
    <Box h={'100%'} w={'100%'} {...props}>
      <Flex
        h={'100%'}
        w={'100%'}
        direction={'row'}
        justifyContent={'flex-start'}
      >
        <SideBar justifySelf={'flex-start'} w={'240px'}>
          <ComponentsList />
        </SideBar>
        <Box w={'100%'}>
          <Workspace />
        </Box>
        <SideBar
          borderLeftWidth="1px"
          borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
          justifySelf={'flex-end'}
          w={'320px'}
        >
          <ToolkitBar />
        </SideBar>
      </Flex>
    </Box>
  );
}
