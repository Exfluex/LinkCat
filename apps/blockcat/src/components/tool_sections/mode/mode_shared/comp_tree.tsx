import {
  Box,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import {
  UncontrolledTreeEnvironment,
  Tree,
  StaticTreeDataProvider,
  TreeItem,
  TreeEnvironmentRef,
} from 'react-complex-tree';
import {
  DirectionMapper,
} from '../../../../data/card_render_config';
import { addComponent, useAppDispatch, useAppSelector } from '../../../../store';
export function ComponentsTree() {
  const components = useAppSelector((state) => state.renderblock.components);
  const [treeData] = useState(ComponentGroupTreeAdapter(components));
  const environment = useRef<TreeEnvironmentRef<string>>();
  const dispatch = useAppDispatch();
  return (
    <Box>
      {/* <style>{`
        :root {
          --rct-color-tree-bg: #F6F8FA;
          --rct-color-tree-focus-outline: #d60303;
          --rct-color-nonfocustree-item-selected-bg:#fff;
          --rct-color-focustree-item-selected-bg: #ffff;
          --rct-color-focustree-item-focused-border: #fff0;
          --rct-color-focustree-item-draggingover-bg: #ecdede;
          --rct-color-focustree-item-draggingover-color: inherit;
          --rct-color-search-highlight-bg: #fffff;
          --rct-color-drag-between-line-bg:#fffff;
          --rct-color-arrow: #b48689;
          --rct-item-height: 30px;
        }
      `}</style> */}
      {
        <UncontrolledTreeEnvironment<string>
          ref={environment}
          canReorderItems={false}
          canRename={false}
          canDragAndDrop={false}

          canSearch={false}
          canInvokePrimaryActionOnItemContainer={false}
          onSelectItems={(item) => {
            if(treeData[item[0]] && !treeData[item[0]].children){
              dispatch(addComponent({component:item[0] as string,direction:DirectionMapper.OuterDown}))
            }
          }}
          autoFocus={false}
          dataProvider={
            new StaticTreeDataProvider(treeData)
          }
          getItemTitle={(item) => item.data}
          defaultInteractionMode={{
            mode: 'custom',
            createInteractiveElementProps: (
              item,
              id,
              actions,
              renderFlags
            ) => ({
              onClick: (e) => {
                if (item.hasChildren) {
                  actions.toggleExpandedState();
                } else {
                  actions.selectItem();
                }
              },
              onFocus: () => {
                // actions.focusItem();
              },
            }),
          }}
          // renderItemTitle={({ title }) => <Text>{title}</Text>}
          // renderItemArrow={({ item, context }) =>
          //   item.hasChildren ? (
          //     context.isExpanded ? (
          //       <span>{'v '}</span>
          //     ) : (
          //       <span>{'> '}</span>
          //     )
          //   ) : null
          // }
          // defaultInteractionMode={{
          //   mode: 'custom',
          //   createInteractiveElementProps: (
          //     item,
          //     treeId,
          //     actions,
          //     renderFlags
          //   ) => ({
          //     onClick: (e) => {
          //       console.log(item);
          //       actions.expandItem();
          //     },
          //     onMouseOver: () => {
          //       document
          //         .querySelectorAll(
          //           `[data-rct-tree="comp_tree"] [data-rct-item-id]`
          //         )
          //         .forEach(
          //           (element: HTMLElement) =>
          //             (element.style.background = 'transparent')
          //         );
          //       const focused = document.querySelector(
          //         `[data-rct-tree="comp_tree"]  [data-rct-item-id="${item.index}"]`
          //       ) as HTMLElement;
          //       focused.style.background = 'red';
          //     },
          //   }),
          // }}
          viewState={{
            'tree-4': {
              expandedItems: ['Fruit', 'Meals'],
            },
          }}
        >
          <Tree treeId="comp_tree" rootItem="root" treeLabel="Tree Example" />
        </UncontrolledTreeEnvironment>
      }
      {!components && <Box>None</Box>}
    </Box>
  );
}

export function ComponentGroupTreeAdapter(
  comps: { name: string; components: { name: string }[] }[]
) {
  const treeData: { [index: string]: TreeItem<string> } = {};
  const root: TreeItem<string> = {
    index: 'root',
    hasChildren: true,
    children: [],
    data: 'root',
  };
  treeData[root.index] = root;
  comps.forEach((group) => {
    root.children.push(group.name);
    treeData[group.name] = {
      index: group.name,
      canMove: false,
      hasChildren: true,
      children: group.components.map((comp) => {
        treeData[comp.name] = {
          index: comp.name,
          canMove: false,
          hasChildren: false,
          data: comp.name,
          canRename: false,
        };
        return comp.name;
      }),
      data: group.name,
      canRename: false,
    };
  });
  return treeData;
}
