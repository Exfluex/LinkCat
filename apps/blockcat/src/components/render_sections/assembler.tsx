import { IconButton, Center } from '@chakra-ui/react';
import {
  PositionableBlockProps,
  CardRenderConfig,
} from '../../data/card_render_config';
import React, { ReactNode } from 'react';
import { Card } from './card';
import { ComponentWrapper } from './component_wrapper';
import { AiOutlinePlus } from 'react-icons/ai';
import { FactoryRingTestEnv } from '../tool_sections/composite/factory_ring/test_env';
export interface AssemblerProps {
  blocks?: CardRenderConfig;
}

export function Assembler(props: AssemblerProps) {
  return (
    <Card>
      {props.blocks ? (
        AssembleFn(props.blocks.comps, 0)
      ) : (
        <Center fontWeight={'bold'}>
          <FactoryRingTestEnv >
          <IconButton
            mb={0}
            rounded={"full"}
            colorScheme={"teal"}
            aria-label="Add Component"
            size={'sm'}
            {...props}
            pointerEvents={'all'}
            icon={<AiOutlinePlus />}
          />
          </FactoryRingTestEnv>
        </Center>
      )}
    </Card>
  );
}
export function AssembleFn(
  blocks: PositionableBlockProps[],
  root: number
): ReactNode {
  const block = blocks[root];
  if (block.children) {
    const children = block.children.map<ReactNode>((id) => {
      return AssembleFn(blocks, id);
    });
    return BlockAssembler(block, children);
  }
  return BlockAssembler(block);
}

export function BlockAssembler(
  props: PositionableBlockProps,
  children?: ReactNode[]
) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  return (
    <ComponentWrapper key={props.id} blockPorps={props}>
      {children}
    </ComponentWrapper>
  );
}
