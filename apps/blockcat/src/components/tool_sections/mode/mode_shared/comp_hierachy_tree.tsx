import { Box } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
  Tree,
  TreeItem,
  ControlledTreeEnvironment,
  DraggingPosition,
} from 'react-complex-tree';
import { CardRenderConfig } from '../../../../data/card_render_config';
import {
  changeFocusedComponent,
  moveComponent,
  useAppDispatch,
  useAppSelector,
  useCurrentRenderBlock,
} from '../../../../store';

export function ComponentHierachyTree() {
  const currentRenderBlock = useCurrentRenderBlock();
  const focused = useAppSelector((state) => state.renderblock.focusedComponent);
  const [focusedItem, setFocusedItem] = useState<number>();
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [selectedItems, setSelectedItems] = useState([-1]);
  useEffect(() => {
    setFocusedItem(focused);
    setSelectedItems([focused]);
  }, [focused]);
  useEffect(() => {
    if (currentRenderBlock) convertor();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRenderBlock]);
  const convertor = () => {
    if (!currentRenderBlock) return null;
    const data = BlockPropertyComponentTreeAdapter(currentRenderBlock);
    return data;
  };
  const onDropHandler = (item:TreeItem<{nickName?: string;componentName: string;}>[],target:DraggingPosition)=>{
    if(target.targetType === "item"){
      if(target.targetItem === item[0].index){return;}
      dispatch(moveComponent({type:"DropIn",target:target.targetItem as number,dragged:item[0].index as number}));
    }
    else{
      if(target.parentItem === item[0].index){return;}
      dispatch(moveComponent({type:"DropBettwen",position:target.linePosition==="top"?"Up":"Down",parent:Number.parseInt(target.parentItem as string),target:target.childIndex,dragged:item[0].index as number}));
    }
  }
  const dispatch = useAppDispatch();
  const treeData = convertor();
  return (
    <Box>
      {currentRenderBlock && (
        <ControlledTreeEnvironment<{
          nickName?: string;
          componentName: string;
        }>
          onDrop={onDropHandler}
          defaultInteractionMode={{
            mode: 'custom',
            createInteractiveElementProps: (
              item,
              treeId,
              actions,
              renderFlags
            ) => ({
              onDragStart: e => {
                e.dataTransfer.dropEffect = 'move'; // TODO
                // e.dataTransfer.setDragImage(environment.renderDraggingItem(viewState.selectedItems), 0, 0);
                actions.startDragging();
              },
              onDragOver: e => {
                e.preventDefault(); // Allow drop
              },
              onDragEnd:e=>{

              },

              draggable: renderFlags.canDrag && !renderFlags.isRenaming,
              tabIndex: !renderFlags.isRenaming ? (renderFlags.isFocused ? 0 : -1) : undefined,
              onClick: (e) => {
                actions.focusItem();
                if (item.hasChildren) {
                  if (renderFlags.isExpanded) {
                    setSelectedItems([item.index as number]);
                    dispatch(
                      changeFocusedComponent({ id: item.index as number })
                    );
                  } else {
                    actions.expandItem();
                  }
                } else {
                  setSelectedItems([item.index as number]);
                  dispatch(
                    changeFocusedComponent({ id: item.index as number })
                  );
                }
              },
              onFocus: () => {
                actions.focusItem();
              },
            }),
          }}
          canDragAndDrop={true}
          canReorderItems={true}
          canDropOnItemWithChildren={true}
          canDropOnItemWithoutChildren={true}
          onFocusItem={(item) => setFocusedItem(item.index as number)}
          onExpandItem={(item) => {
            setExpandedItems([...expandedItems, item.index as number]);
          }}
          onCollapseItem={(item) =>
            setExpandedItems(
              expandedItems.filter(
                (expandedItemIndex) => expandedItemIndex !== item.index
              )
            )
          }
          items={treeData}
          getItemTitle={(item) => item.data.nickName ?? item.data.componentName}
          viewState={{
            hierachy: {
              focusedItem,
              expandedItems,
              selectedItems,
            },
          }}
        >
          <Tree treeId="hierachy" rootItem="0" treeLabel="Tree Example" />
        </ControlledTreeEnvironment>
      )}
      {!currentRenderBlock && <Box>None</Box>}
    </Box>
  );
}

export function BlockPropertyComponentTreeAdapter(config: CardRenderConfig) {
  const blocks = config.comps;
  const treeData: {
    [index: string]: TreeItem<{ nickName?: string; componentName: string }>;
  } = {};
  let i = 0;
  blocks.forEach((block) => {
    i++;
    const item: TreeItem<{ nickName?: string; componentName: string }> = {
      index: block.id,
      canMove: true,
      hasChildren: block.children.length !== 0,
      children: block.children,
      data: {
        componentName: block.tag,
        nickName: block.tag + i,
      },
      canRename: true,
    };
    treeData[block.id] = item;
  });
  return treeData;
}
