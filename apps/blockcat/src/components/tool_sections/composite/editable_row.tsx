import {
  Box,
  Editable,
  EditableInput,
  EditablePreview,
  HStack,
  IconButton,
  useEditableControls,
} from '@chakra-ui/react';
import { useState } from 'react';
import { AiFillEdit, AiFillSave } from 'react-icons/ai';

interface EditableRowProps {
  defaultValue: string;
  onSave: (value) => void;
}
export function EditableRow({ defaultValue, onSave }: EditableRowProps) {
  const [content] = useState(defaultValue)
  function EditableControls() {
    const { isEditing, getSubmitButtonProps, getEditButtonProps } =
      useEditableControls();

    return isEditing ? (
      <IconButton
        aria-label="Save"
        icon={<AiFillSave />}
        {...getSubmitButtonProps()}
      />
    ) : (
      <IconButton
        aria-label="Edit"
        size="sm"
        icon={<AiFillEdit />}
        {...getEditButtonProps()}
      />
    );
  }

  return (
    <Editable
      onSubmit={onSave}
      defaultValue={content}
      fontSize="2xl"
      isPreviewFocusable={false}
    >
      <HStack>
        <Box  px={2}>
          <EditablePreview />
          <EditableInput />
        </Box>

        <EditableControls />
      </HStack>
    </Editable>
  );
}
