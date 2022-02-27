import {
  Box,
  BoxProps,
  Input,
  Button,
  IconButton,
  HStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { modComponent, useAppDispatch } from '../../store';
import { KeyValueRow } from './composite/property_row';
const MotionIconButton = motion(IconButton);
interface DictionaryManagerProps extends BoxProps {
  dictionary?: {
    [key: string]: string | number;
  };
  parent: number;
}
export function DictionaryManager({
  dictionary,
  parent,
  ...props
}: DictionaryManagerProps) {
  const dispatch = useAppDispatch();
  const [newProp, setNewProp] = useState('');
  return (
    <Box {...props}>
      {dictionary &&
        Object.keys(dictionary).map((key) => {
          return (
            <HStack rounded="md" p={3} key={`${parent}-${key}`}>
              <KeyValueRow
                property={key}
                value={dictionary[key]}
                onChange={(value) => {
                  if(value !== dictionary[key])
                  dispatch(
                    modComponent({
                      property: key,
                      value: value,
                      action: 'modify',
                    })
                  );
                }}
              ></KeyValueRow>
              <MotionIconButton
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                variant="outline"
                colorScheme="teal"
                aria-label="Call Sage"
                fontSize="20px"
                icon={<AiOutlineClose />}
                onClick={(value) => {
                  dispatch(
                    modComponent({ property: key, value: '', action: 'delete' })
                  );
                }}
              />
            </HStack>
          );
        })}
      <HStack>
        <Input
          placeholder="Property Name..."
          onChange={(value) => setNewProp(value.target.value)}
          size={'sm'}
        />
        <Button
          onClick={() =>
            newProp !== '' &&
            dispatch(
              modComponent({ property: newProp, value: '', action: 'new' })
            )
          }
          w={'100%'}
        >
          New Property
        </Button>
      </HStack>
    </Box>
  );
}
