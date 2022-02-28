import { Box, Center, Flex, Input } from '@chakra-ui/react';

export interface FactoryRingSearchBarProps {
  searchString: string;
}

export function FactoryRingSearchBar({
  searchString,
}: FactoryRingSearchBarProps) {
  console.log(searchString);
  return (
    <Box pos={'absolute'} top={'0'} left={'0'} w={'100%'} h={'100%'}>
      <Box pos={'absolute'} left={"calc(50% - 6a0px)"} top={'200px'} w={'120px'}>
        <Input autoFocus={true} defaultValue={''} />
      </Box>
    </Box>
  );
}
