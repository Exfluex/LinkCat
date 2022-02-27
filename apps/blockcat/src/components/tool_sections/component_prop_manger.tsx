import {
  Box,
  BoxProps,
  Divider,
  Flex,
  HStack,
  Text,
} from '@chakra-ui/react';
import {
  modifyRenderBlock,
  useAppDispatch,
  useCurrentRenderBlock,
  useFocusedComponent,
} from '../../store';
import { EditableRow } from './composite/editable_row';
import { CssPropertyCard } from './property_type_card';
import { TextPropertyManager } from './text_property_manager';

type ComponentPropertyManagerProps = BoxProps;
export function ComponentPropertyManager(props: ComponentPropertyManagerProps) {
  const focusedComponent = useFocusedComponent();
  const currentRenderBlock = useCurrentRenderBlock();
  const dispatch = useAppDispatch();
  return (
    <Box {...props}>
      <Flex direction={'column'}>
        {focusedComponent && (
          <>
            <Divider />
            <Box p={2} rounded={"sm"} bg={'tomato'}>
              <HStack><Text fontWeight={"bold"}>BlockConfig</Text></HStack>
              <Divider></Divider>
              <HStack py={4}>
                <EditableRow defaultValue={currentRenderBlock.name} onSave={(value) => {
                    dispatch(
                      modifyRenderBlock({
                        ...currentRenderBlock,
                        name: value,
                      })
                    );
                  }} ></EditableRow>
                {/* <KeyValueRow property="BlockName" value={currentRenderBlock.name} onChange={(value) => {
                    dispatch(
                      modifyRenderBlock({
                        ...currentRenderBlock,
                        name: value,
                      })
                    );
                  }}/>
                <Text px={1}>BlockName</Text>
                <Input
                  size="md"
                  onChange={}
                  defaultValue={currentRenderBlock.name}
                /> */}
              </HStack>
            </Box>
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
          </>
        )}
      </Flex>
    </Box>
  );
}
