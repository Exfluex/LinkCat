import { Box, Center, Flex, Input } from '@chakra-ui/react';
import { useRingEnvironment } from './uncontrolled_factory_ring';

export interface FactoryRingSearchBarProps {
  searchString: string;
}

export function FactoryRingSearchBar({
  searchString,
}: FactoryRingSearchBarProps) {
  const env = useRingEnvironment();

  return (
    <Box pos={'absolute'} top={'0'} left={'0'} w={'100%'} h={'100%'}>
      <Box pos={'absolute'} left={"calc(50% - 6a0px)"} top={'200px'} w={'120px'}>
        <Input autoFocus={true} onChange={(ev)=>{
          env.searchString = ev.target.value;
        }} defaultValue={''} />
      </Box>
    </Box>
  );
}
