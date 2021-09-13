import { useSelector as useReducerSelector, useDispatch as useReduxDisoatch } from "react-redux";
import type { TypedUseSelectorHook } from 'react-redux' 
import type { RootState, AppDispatch, AppThunk } from '../index'


/**
 * TypedUseSelectorHook 重新定义useSelect的类型
 */
// 如果不重新定义每次使用都要声明类型这样会很麻烦
export const useSelector: TypedUseSelectorHook<RootState> = useReducerSelector
// export const useDispatch = () => useReduxDisoatch<AppDispatch>();