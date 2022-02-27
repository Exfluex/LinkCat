import {
  Box,
  BoxProps,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { ComponentPropertyManager } from './component_prop_manger';
import { ComponentHierachyTree } from './comp_hierachy_tree';
import { TestDirectionButtonGroups } from './test_direction_btngorups';
type ToolkitBarProps = BoxProps;
export function ToolkitBar({ ...rest }: ToolkitBarProps) {
  return (
    <Box {...rest} w={300} h={'100%'} right={0}>
      <Tabs variant="enclosed" h={"100%"}>
        <TabList>
          <Tab>Property</Tab>
          <Tab>Document</Tab>
        </TabList>
        <TabPanels h={"100%"}>
          <TabPanel  maxH={"100%"} overflowY={"scroll"}>
          <ComponentHierachyTree></ComponentHierachyTree>
            <ComponentPropertyManager />
            <TestDirectionButtonGroups />

          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
