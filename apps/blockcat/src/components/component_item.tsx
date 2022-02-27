import {FlexProps, Box} from '@chakra-ui/react'
import {ReactText} from 'react'

export interface NavItemProps extends FlexProps {

  children: ReactText;
}
export const ComponentItem = ({  children, ...rest }: NavItemProps) => {
  return (
      <Box
        align="center"
        py="2"
        borderRadius="md"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}>
        {children}
      </Box>
  );
};
