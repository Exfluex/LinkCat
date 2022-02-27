import { Divider, Box, VStack, Text } from '@chakra-ui/react';
import {
  CardRenderConfig,
  PositionableBlockProps,
} from '../../data/card_render_config';
import { BlockConfigManger } from './block_config_manager';
import { CssPropertyCard } from './property_type_card';
import { TextPropertyManager } from './text_property_manager';

interface ComponentConfigManagerProps {
  focusedComponent: PositionableBlockProps;
  currentRenderBlock: CardRenderConfig;
}
export function ComponentConfigManager({
  focusedComponent,
  currentRenderBlock,
}: ComponentConfigManagerProps) {
  return (
    <VStack>
      <Box pb={2}>
        <Text fontSize={'xl'}>
          {focusedComponent.nickName
            ? `${focusedComponent.nickName}(${focusedComponent.tag})`
            : focusedComponent.tag}
        </Text>
      </Box>
      <Divider />
      <CssPropertyCard target={focusedComponent} />
      <Divider />
      <TextPropertyManager focused={focusedComponent} />
    </VStack>
  );
}
