import { Box, BoxProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

export interface CardProps extends BoxProps {
  children: ReactNode;
}

export function Card({ children }: CardProps) {
  return (
    <Box w={320} h={'auto'}  rounded='md' bg='pink' boxShadow='2xl' p={6}>
      {children}
    </Box>
  );
}
