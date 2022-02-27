import { CardRenderConfig, CounterDirections, Direction, InnerOutDirection } from '../data/card_render_config'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { ComponentGroups, ComponentsList, TextType } from '../data/component';
import { createStandaloneToast } from '@chakra-ui/react';
import { SimpleDragEvent } from '../utils/utils';

// Define a type fo  the slice state
interface RenderBlockState {
  loadedRenderBloks: CardRenderConfig[];
  currentRenderBlockId: number;
  focusedComponent: number;
  previousFocusedComponent: number;
  previousMoveDirection: Direction | "Unknow";
  hoveringComponent: number;
  notifications: string[];
  components: { name: string; components: { name: string }[] }[];
  indicator: {
    left: number;
    top: number;
    width: number;
    height: number;
  }
}


function GenDefaultConfig(): CardRenderConfig {
  return {
    id: -1,
    name: "unamed",
    maxChild: 0,
    type: "Card",
    resources: {
      programmable: {},
      dynamic: {},
      programmable_num: 0,
      dynamic_num: 0
    },
    comps: [
      {
        id: 0,
        tag: "Box",
        parent: 0,
        nickName: "Root",
        text: "",
        textType: "none",
        children: [],
        directions: {
          OuterUp: -1,
          OuterDown: -1,
          OuterLeft: -1,
          OuterRight: -1,
          InnerDown: -1,
          InnerLeft: -1,
          InnerRight: -1,
          InnerUp: -1,
        }
      }
    ]
  }
}
// Define the initial state using that type
const initialState: RenderBlockState = {
  loadedRenderBloks: [],
  focusedComponent: 0,
  previousMoveDirection: "Down",
  previousFocusedComponent: 0,
  hoveringComponent: -1,
  currentRenderBlockId: -2,
  notifications: [],
  indicator: {
    left: 0,
    top: 0,
    width: 0,
    height: 0
  },
  components: [...ComponentGroups.map(
    group => { return { name: group.name, components: group.components.map(comp => ({ name: comp.name })) } })
  ]
}
const toast = createStandaloneToast()
export const renderBlockSlice = createSlice({
  name: 'renderBlock',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addRenderBlock: state => {
    },
    renderRenderBlock: (state, action: PayloadAction<number>) => {
    },
    modifyRenderBlock: (state, action: PayloadAction<CardRenderConfig>) => {
      const block = state.loadedRenderBloks.find(block => block.id === state.currentRenderBlockId);
      state.loadedRenderBloks.splice(state.loadedRenderBloks.indexOf(block), 1, action.payload);
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    deleteRenderBlock: (state, action: PayloadAction<number>) => {
      console.log("delete renderblock");
    },
    changeFocusedProps: (state, action: PayloadAction<{ left: number; top: number; width: number; height: number }>) => {
      state.indicator = {
        left: action.payload.left - 5,
        top: action.payload.top - 5,
        width: action.payload.width + 10,
        height: action.payload.height + 10,
      };
    },
    changeHovering: (state, action: PayloadAction<{ id: number, mouse: "in" | "out" }>) => {
      if (action.payload.mouse === 'in') {
        state.hoveringComponent = action.payload.id;

      }
      else {
        if (action.payload.id === 0) {
          state.hoveringComponent = state.focusedComponent;
        }
      }
    },
    changeFocusedComponent: (state, action: PayloadAction<{ id: number, direction?: Direction }>) => {
      if (action.payload.direction) {
        if (state.previousFocusedComponent === 0 && state.focusedComponent === 0) {
          toast({
            title: "Please Add Component to Card",
            status: 'error',
            duration: 1500,
            isClosable: true
          })
          return;
        }
        const direction = action.payload.direction;
        const previousDirection = state.previousMoveDirection === "Unknow" ? "Down" : state.previousMoveDirection;
        const block = state.loadedRenderBloks.find(block => block.id === state.currentRenderBlockId);
        let next = -1;
        const previous = block.comps.find(comp => comp.id === state.previousFocusedComponent);
        const current = block.comps.find(comp => comp.id === state.focusedComponent);

        if (previous.parent === current.id) {
          //Previous is child
          if (CounterDirections[direction] === previousDirection) {
            //Back to children
            next = current.directions[`Inner${CounterDirections[direction]}`];
            next = next === -1 ? current.directions[`Outer${direction}`] : next;
          }
          else {
            //Out
            next = current.directions[`Outer${direction}`];
          }
        }
        else if (previous.parent === current.parent) {
          if (direction === CounterDirections[previousDirection]) {
            //Back to previous sibling
            next = state.previousFocusedComponent;
          }
          else if (direction === previousDirection) {
            //Go forward
            next = current.directions[`Inner${CounterDirections[direction]}`];
            next = next === -1 ? current.directions[`Outer${direction}`] : next;
          }
          else {
            //Not back or forward just change direction
            next = current.directions[`Outer${direction}`];
          }
        }
        else if (previous.id === current.parent) {
          //Previous is parent
          if (previousDirection === CounterDirections[direction]) {
            //back to parent
            next = state.previousFocusedComponent;
          }
          else if (previousDirection === direction) {
            next = current.directions[`Inner${CounterDirections[direction]}`];
            next = next === -1 ? current.directions[`Outer${direction}`] : next;
          }
          else {
            next = next === -1 ? current.directions[`Outer${direction}`] : next;
          }
        }
        else {
          next = current.directions[`Outer${direction}`];
        }
        if (next === -1) {
          toast({
            title: `-1?????`,
            description: `Reach Card ${direction} Boundary`,
            status: 'error',
            duration: 1500,
            isClosable: true,
          })
          next = 0;
        }
        if (next === 0) {
          const root = block.comps.find(comp => comp.id === 0);
          next = root.directions[`Inner${CounterDirections[direction]}`];
          console.log(next);
          toast({
            title: `Reach Boundary`,
            description: `Reach Card ${direction} Boundary`,
            status: 'error',
            duration: 1500,
            isClosable: true,
          })
        }
        state.previousFocusedComponent = state.focusedComponent;
        state.previousMoveDirection = direction;
        state.focusedComponent = next;
        return;
      }
      else {
        state.previousMoveDirection = "Unknow";
      }
      state.previousFocusedComponent = state.focusedComponent;
      state.focusedComponent = action.payload.id;
    },
    addComponent: (state, action: PayloadAction<{ component: string, direction: InnerOutDirection }>) => {
      let direction: InnerOutDirection;
      let block: CardRenderConfig;
      let target;
      const meta = ComponentsList[action.payload.component];
      if (state.currentRenderBlockId === -2) {
        block = GenDefaultConfig();
        direction = "InnerUp";
        target = block.comps[0];
        state.loadedRenderBloks.push(block);
        state.currentRenderBlockId = block.id;
      }
      else {
        direction = action.payload.direction;
        block = state.loadedRenderBloks.find(block => block.id === state.currentRenderBlockId);
        target = block.comps.find(comp => comp.id === state.focusedComponent);
      }
      const res = meta.controller.tryGenerateAt(direction, block, target);
      if (typeof res === undefined) {
        toast({
          title: `Cannot Generate Component ${action.payload.component}`
        });
        return;
      }
      state.previousFocusedComponent = state.focusedComponent;
      state.focusedComponent = res.comp;
      state.previousMoveDirection = "Unknow";
      console.log(res.comp);
      console.log(state.focusedComponent);
    },
    moveComponent: (state, action: PayloadAction<SimpleDragEvent>) => {
      const ev = action.payload;
      const block = state.loadedRenderBloks.find(config => config.id === state.currentRenderBlockId);
      const dragged = block.comps.find(block => block.id === ev.dragged);
      const meta = ComponentsList[dragged.tag];
      const res = meta.controller.tryMove(block, dragged, ev);
      if (typeof res === undefined) {
        toast({
          title: `Cannot Generate Component ${dragged.tag}`
        });
        return;
      }
      if (res.result === "Forbidden") {
        toast({
          title: res.message,
          duration: 1500,
          isClosable: true
        });
      }
      state.previousFocusedComponent = state.focusedComponent;
      state.focusedComponent = dragged.id;
      state.previousMoveDirection = "Unknow";
    },
    // changeText:(state,action:PayloadAction<{type:TextType,text:string}>)=>{
    //   const block = state.loadedRenderBloks.find(config => config.id === state.currentRenderBlockId);
    //     const comp = block.comps.find(block => block.id === state.focusedComponent);
    // },
    modComponent: (state, action: PayloadAction<{ property: string; value: string | number, action: "modify" | "delete" | "new" }>) => {
      console.log(action.payload);
      if (state.focusedComponent !== undefined) {
        const block = state.loadedRenderBloks.find(config => config.id === state.currentRenderBlockId);
        const comp = block.comps.find(block => block.id === state.focusedComponent);
        if (action.payload.property === "text") {
          comp.text = action.payload.value as string;
        }
        else if (action.payload.action === "delete") {
          delete comp.css[action.payload.property];
        }
        else {
          comp.css[action.payload.property] = action.payload.value;
        }
      }
    },
    modComponentText: (state, action: PayloadAction<{ text: string, type: TextType }>) => {
      const block = state.loadedRenderBloks.find(config => config.id === state.currentRenderBlockId);
      const comp = block.comps.find(block => block.id === state.focusedComponent);
      const type = action.payload.type;
      const removeResource = (type:TextType)=>{
        if(block.resources[type] && block.resources[type][comp.id]){
          delete block.resources[type][comp.id];
          block.resources[`${type}_num`]--;
        }
      }
      const addResource=(type:TextType,text:string)=>{
        if(block.resources[type]){
          if(!block.resources[type][comp.id])block.resources[`${type}_num`]++;
          block.resources[type][comp.id] = text;
        }
      }
      comp.text =type === "none"?"":action.payload.text;
      removeResource(comp.textType);
      addResource(action.payload.type,action.payload.text);
      comp.textType = type;
    }
    // reloadRenderBlocks:state=>{

    // }
  }
})

export const { addRenderBlock, changeHovering, modComponentText, renderRenderBlock, moveComponent, modComponent, modifyRenderBlock, deleteRenderBlock, changeFocusedProps, changeFocusedComponent, addComponent } = renderBlockSlice.actions


