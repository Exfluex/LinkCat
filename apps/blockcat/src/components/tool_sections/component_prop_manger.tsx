import { Box, BoxProps, Divider, Flex, HStack, Text } from '@chakra-ui/react';
import { useCurrentRenderBlock, useFocusedComponent } from '../../store';
import { BlockConfigManger } from './block_config_manager';
import { ComponentConfigManager } from './component_config_manager';

type ComponentPropertyManagerProps = BoxProps;
export function ComponentPropertyManager(props: ComponentPropertyManagerProps) {
  const focusedComponent = useFocusedComponent();
  const currentRenderBlock = useCurrentRenderBlock();

  return (
    <Box {...props}>
      <Flex direction={'column'}>
        <Divider />
        <BlockConfigManger currentRenderBlock={currentRenderBlock} />
        {focusedComponent && (
          <ComponentConfigManager
            currentRenderBlock={currentRenderBlock}
            focusedComponent={focusedComponent}
          />
        )}
      </Flex>
    </Box>
  );
}
