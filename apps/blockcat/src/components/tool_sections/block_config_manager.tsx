import { Box, HStack, Divider,Text } from "@chakra-ui/react";
import { CardRenderConfig } from "../../data/card_render_config";
import { modifyRenderBlock, useAppDispatch } from "../../store";
import { EditableRow } from "./composite/editable_row";


interface BlockConfigMangerProps{
  currentRenderBlock:CardRenderConfig;
}
export function BlockConfigManger({currentRenderBlock}:BlockConfigMangerProps) {
  const dispatch = useAppDispatch();
  return (
    <Box p={2} rounded={'sm'} bg={'tomato'}>
      <HStack>
        <Text fontWeight={'bold'}>BlockConfig</Text>
      </HStack>
      <Divider></Divider>
      <HStack py={4}>
        <EditableRow
          defaultValue={currentRenderBlock.name}
          onSave={(value) => {
            dispatch(
              modifyRenderBlock({
                ...currentRenderBlock,
                name: value,
              })
            );
          }}
        ></EditableRow>
      </HStack>
    </Box>
  );
}
