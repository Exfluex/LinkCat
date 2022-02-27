import {
  Box,
  BoxProps,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { ComponentPropertyManager } from '../mode/build_mode/component_prop_manger';
import { ComponentHierachyTree } from '../mode/mode_shared/comp_hierachy_tree';
import { TestDirectionButtonGroups } from '../misc/test_direction_btngorups';
type ToolkitBarProps = BoxProps;
export function ToolkitBar({ ...rest }: ToolkitBarProps) {
  return (
    <Box {...rest} w={300} h={'100%'} right={0}>
      <Tabs variant="enclosed" h={'100%'}>
        <Flex flexDirection={"column"} h={"100%"}>
        <Box flex={0}>
          <TabList>
            <Tab>Property</Tab>
            <Tab>Document</Tab>
          </TabList>
        </Box>
        <TabPanels flexGrow={1} h={"100%"} overflowY={'scroll'} overflowX={'scroll'}>
          <TabPanel pr={0}>
            <Flex direction={'column'}>
              <ComponentHierachyTree></ComponentHierachyTree>
              <ComponentPropertyManager />
              <TestDirectionButtonGroups />
            </Flex>
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
        </TabPanels>
        </Flex>
      </Tabs>
    </Box>
  );
}
