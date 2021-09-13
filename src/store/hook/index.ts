import { useSelector as useReducerSelector, TypedUseSelectorHook, useDispatch as useReduxDispatch} from "react-redux";
import type { AppDispatch, RootState } from '../index'

/**
 * TypedUseSelectorHook 重新定义useSelect的类型
 */
export const useSelector: TypedUseSelectorHook<RootState> = useReducerSelector 
export const useDispatch = () => useReduxDispatch<AppDispatch>();