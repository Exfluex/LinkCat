import { Box,Text, Flex, BoxProps } from '@chakra-ui/react';
import { PositionableBlockProps } from '../../../../data/card_render_config';
import { DictionaryManager } from '../../composite/dictionary_manager';


interface CssPropertyCardProps extends BoxProps{
  target:PositionableBlockProps;
}
export function CssPropertyCard({target,...props}:CssPropertyCardProps) {
  return (
    <Box>
      <Box><Text fontSize={"md"}>CSS Property</Text></Box>
      <Flex direction={'column'}>
        {
          target && <DictionaryManager parent={target.id} dictionary={target.css} />
        }
      </Flex>
    </Box>
  );
}
