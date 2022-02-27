import React, { ReactNode, useEffect, useRef } from 'react';
import { PositionableBlockProps } from '../../data/card_render_config';
import {
  BoxComponent,
  ComponentMeta,
  ComponentsList,
} from '../../data/component';
import {
  changeFocusedComponent,
  changeFocusedProps,
  useAppDispatch,
  useFocused,
} from '../../store';
export interface ComponentWrapperProps {
  blockPorps: PositionableBlockProps;
  children?: ReactNode[];
}
export function ComponentWrapper({
  blockPorps,
  children,
}: ComponentWrapperProps) {
  const node: ComponentMeta = ComponentsList[blockPorps.tag] ?? BoxComponent;
  const [isFocused] = useFocused(blockPorps.id);
  const compRef = useRef<HTMLElement>(null);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (isFocused) {
      const comp = compRef.current;
      const pos = comp.getBoundingClientRect();
      dispatch(
        changeFocusedProps({
          left: pos.x,
          top: pos.y,
          width: pos.width,
          height: pos.height,
        })
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused, blockPorps.css]);
  const events = {
    onClick: (ev) => {
      ev.stopPropagation();
      dispatch(changeFocusedComponent({ id: blockPorps.id }));
    },
  };
  return (
    <>
      {React.createElement(
        node.node,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        { ...blockPorps.css, ref: compRef, ...events },
        node.type === 'end' ? undefined : children ?? blockPorps.text
      )}
    </>
  );
}
