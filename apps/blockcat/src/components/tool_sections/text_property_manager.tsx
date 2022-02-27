import {
  Box,
  BoxProps,
  Text,
  HStack,
  VStack,
  Divider,
  Select,
  IconButton,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { AiFillSave } from 'react-icons/ai';
import { PositionableBlockProps } from '../../data/card_render_config';
import { ComponentsList, TextType } from '../../data/component';
import { modComponentText, useAppDispatch } from '../../store';
import { KeyValueRow } from './composite/property_row';

interface TextPropertyManagerProps extends BoxProps {
  focused: PositionableBlockProps;
}
export function TextPropertyManager({
  focused,
  ...props
}: TextPropertyManagerProps) {
  const meta = ComponentsList[focused.tag];
  const [text, setText] = useState({
    text: '',
    type: focused.textType,
  });
  useEffect(() => {
    if (text.type === 'none' && text.text !== '') {
      dispatch(
        modComponentText({
          text: text.text,
          type: 'none',
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);
  const hasText = !meta.text.includes('none');
  useEffect(() => {
    setText({ text: focused.text, type: focused.textType });
  }, [focused]);
  const dispatch = useAppDispatch();
  const TextEditor = () => (
    <>
      <HStack spacing={3}>
        <Text>TextType</Text>
        <Select
          variant="filled"
          onChange={(ev) => {
            setText({
              text: text.text,
              type: ev.target.value as TextType,
            });
          }}
          value={text.type}
        >
          {meta.text.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
          <option key={'none'} value={'none'}>
            none
          </option>
        </Select>
      </HStack>
      {text.type !== 'none' && (
        <HStack>
          <KeyValueRow
            property="Text"
            value={text.text}
            onChange={(value) => {
              setText({ text: value, type: text.type });
            }}
          />
          <IconButton
            aria-label="Save Text Property"
            onClick={(value) => {
              dispatch(
                modComponentText({
                  text: text.text,
                  type: text.type,
                })
              );
            }}
            icon={<AiFillSave />}
          />
        </HStack>
      )}
    </>
  );
  return (
    <Box>
      {focused.nickName ?? focused.tag}
      <VStack>
        <Text>Component Text Manager</Text>
        <Divider></Divider>
        {focused.children.length > 0 ? (
          <Box>Elmeent with Children cannot have text</Box>
        ) : !hasText ? (
          <Box>This element cannot have text</Box>
        ) : (
          <TextEditor />
        )}
      </VStack>
    </Box>
  );
}
