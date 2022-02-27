import {
  Box,
  BoxProps,
  Text,
  Divider,
} from '@chakra-ui/react';
import { ComponentsTree } from './comp_tree';
interface ComponentListProps extends BoxProps {
  name?: string;
}
export function ComponentsSideBar(props: ComponentListProps) {
  return (
    <Box h={"100%"}  borderRight={"1px"} overflow={"scroll"}>
      <Box p={2}><Text fontWeight={"bold"}>Components</Text></Box>
      <Divider></Divider>
      <Box ><ComponentsTree /></Box>
    </Box>
  );
}
