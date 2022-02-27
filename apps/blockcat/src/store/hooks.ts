import { useEffect, useState } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export function useCurrentRenderBlock() {
  return useAppSelector(state => state.renderblock.loadedRenderBloks.find(block => block.id === state.renderblock.currentRenderBlockId));
}
export function useFocusedComponent() {
  return useAppSelector(state => state.renderblock.loadedRenderBloks.find(block => block.id === state.renderblock.currentRenderBlockId)?.comps.find(comp =>{return  comp.id === state.renderblock.focusedComponent;}) ?? null);
}

export function useBlockById(id: number) {
  return useAppSelector(state => state.renderblock.loadedRenderBloks.find(block => block.id === id))
}
export function useFocused(id:number){
  const focused = useFocusedComponent();
  const [isFocused, setIsFocused] = useState(false);
  useEffect(()=>{
    setIsFocused(focused.id === id);
  },[focused, id]);
  return [isFocused,focused] as const;
}

export function useHovered(id: number) {
  const hoveredId = useAppSelector((state) => state.renderblock.hoveringComponent);
  return [hoveredId===id?1:hoveredId===-1?-1:0] as const;
}
