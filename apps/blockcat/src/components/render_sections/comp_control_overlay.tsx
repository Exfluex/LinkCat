import {
  Box,
  BoxProps,
  calc,
  Center,
  Flex,
  HStack,
  IconButton,
  IconButtonProps,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import {
  DirectionMapper,
  InnerOutDirection,
} from '../../data/card_render_config';
import { addComponent, useAppDispatch } from '../../store';

interface ComponentControlOverlayProps extends BoxProps {
  belongto: number;
}
export function ComponentControlOverlay({
  belongto,
  ...props
}: ComponentControlOverlayProps) {
  const PlusButton = ({
    colorScheme = 'blue',
    ...props
  }: Omit<IconButtonProps, 'aria-label' | 'size' | 'icon'>) => (
    <IconButton
      mb={0}
      colorScheme={colorScheme}
      aria-label="Add Component"
      size={'xs'}
      {...props}
      pointerEvents={'all'}
      icon={<AiOutlinePlus />}
    />
  );
  const dispatch = useAppDispatch();
  const [hoveredPlusBtn, sethoveredPlusBtn] =
    useState<InnerOutDirection>('Unknow');
  function AddComponentRelatively(direction: InnerOutDirection) {
    dispatch(addComponent({ component: 'Box', direction }));
  }
  return (
    <Box boxShadow={'outline'} {...props} pointerEvents={"none"} onClick={(ev)=>ev.stopPropagation()}>
      <Box pos={'absolute'} h={'100%'} w={'100%'} pointerEvents={'none'}>
        <Flex
          h={'100%'}
          w={'100%'}
          pos={'absolute'}
          direction={'column'}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <Box
            hidden={hoveredPlusBtn !== DirectionMapper.InnerUp}
            border={'1px'}
            w={'80%'}
            h={'45%'}
          >
            VL
          </Box>
          <Box
            mt={'auto'}
            hidden={hoveredPlusBtn !== DirectionMapper.InnerDown}
            border={'1px'}
            w={'80%'}
            h={'45%'}
          >
            VR
          </Box>
        </Flex>
        <Flex
          h={'100%'}
          w={'100%'}
          pos={'absolute'}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <Box
            hidden={hoveredPlusBtn !== DirectionMapper.InnerLeft}
            border={'1px'}
            w={'45%'}
            h={'80%'}
          >
            HL
          </Box>
          <Box
            ml={'auto'}
            hidden={hoveredPlusBtn !== DirectionMapper.InnerRight}
            border={'1px'}
            w={'45%'}
            h={'80%'}
          >
            HR
          </Box>
        </Flex>
      </Box>
      <Box
        pos={'absolute'}
        h={calc('100%').add('80px').toString()}
        left={'-35px'}
        top={'-40px'}
        w={calc('100%').add('70px').toString()}
        // bg={"red.100"}
        pointerEvents={'none'}
      >
        <Flex p={2} w={'100%'} h={'100%'} direction={'column'}>
          <Center>
            <VStack>
              <PlusButton
                colorScheme={'red'}
                onClick={() => AddComponentRelatively(DirectionMapper.OuterUp)}
                onMouseEnter={() => sethoveredPlusBtn(DirectionMapper.OuterUp)}
                onMouseLeave={() => sethoveredPlusBtn(DirectionMapper.Unknow)}
              />
              <PlusButton
                onClick={() => AddComponentRelatively(DirectionMapper.InnerUp)}
                onMouseEnter={() => sethoveredPlusBtn(DirectionMapper.InnerUp)}
                onMouseLeave={() => sethoveredPlusBtn(DirectionMapper.Unknow)}
              />
            </VStack>
          </Center>
          <Flex
            h={'100%'}
            direction={'row'}
            w={'100%'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <HStack>
              <PlusButton
                colorScheme="red"
                onClick={() => AddComponentRelatively(DirectionMapper.OuterLeft)}
                onMouseEnter={() =>
                  sethoveredPlusBtn(DirectionMapper.OuterLeft)
                }
                onMouseLeave={() => sethoveredPlusBtn(DirectionMapper.Unknow)}
              />
              <PlusButton
              onClick={() => AddComponentRelatively(DirectionMapper.InnerLeft)}
                onMouseEnter={() =>
                  sethoveredPlusBtn(DirectionMapper.InnerLeft)
                }
                onMouseLeave={() => sethoveredPlusBtn(DirectionMapper.Unknow)}
              />
            </HStack>
            <HStack>
              <PlusButton
              onClick={() => AddComponentRelatively(DirectionMapper.InnerRight)}
                onMouseEnter={() =>
                  sethoveredPlusBtn(DirectionMapper.InnerRight)
                }
                onMouseLeave={() => sethoveredPlusBtn(DirectionMapper.Unknow)}
              />
              <PlusButton
                colorScheme="red"
                onClick={() => AddComponentRelatively(DirectionMapper.OuterRight)}
                onMouseEnter={() =>
                  sethoveredPlusBtn(DirectionMapper.OuterRight)
                }
                onMouseLeave={() => sethoveredPlusBtn(DirectionMapper.Unknow)}
              />
            </HStack>
          </Flex>
          <Center>
            <VStack>
              <PlusButton
              onClick={() => AddComponentRelatively(DirectionMapper.InnerDown)}
                onMouseEnter={() =>
                  sethoveredPlusBtn(DirectionMapper.InnerDown)
                }
                onMouseLeave={() => sethoveredPlusBtn(DirectionMapper.Unknow)}
              />
              <PlusButton
                colorScheme={'red'}
                onClick={() => AddComponentRelatively(DirectionMapper.OuterDown)}
                onMouseEnter={() =>
                  sethoveredPlusBtn(DirectionMapper.OuterDown)
                }
                onMouseLeave={() => sethoveredPlusBtn(DirectionMapper.Unknow)}
              />
            </VStack>
          </Center>
        </Flex>
        {/* <Flex w={'100%'} h={'100%'} p={2} direction={'column'}>
          <Center>
            <PlusButton color="red" />
          </Center>
          <Flex
            h={'100%'}
            direction={'row'}
            w={'100%'}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <PlusButton color="red" />
            <PlusButton color="red" />
          </Flex>
          <Center>
            <PlusButton color="red" />
          </Center>
        </Flex> */}
      </Box>
    </Box>
  );
}
