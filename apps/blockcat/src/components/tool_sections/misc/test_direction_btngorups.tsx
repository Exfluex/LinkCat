import { Box, Button, Flex, Grid, GridItem } from '@chakra-ui/react';
import { changeFocusedComponent, useAppDispatch } from '../../../store';

export function TestDirectionButtonGroups() {
  const dispatch = useAppDispatch();
  return (
    <Box>
      <Flex
        alignItems={'center'}
        justifyContent={'flex-start'}
        direction={'column'}
      >
        <Button colorScheme="blue" onClick={()=>{dispatch(changeFocusedComponent({id:-1,direction:"Up"}))}}>Up</Button>
        <Flex direction={'row'} justifyContent={'space-between'}>
          <Button colorScheme="blue"  onClick={()=>{dispatch(changeFocusedComponent({id:-1,direction:"Left"}))}}>Left</Button>
          <Button colorScheme="blue"  onClick={()=>{dispatch(changeFocusedComponent({id:-1,direction:"Right"}))}}>Right</Button>
        </Flex>
        <Button colorScheme="blue"  onClick={()=>{dispatch(changeFocusedComponent({id:-1,direction:"Down"}))}}>Down</Button>
      </Flex>
    </Box>
  );
}
