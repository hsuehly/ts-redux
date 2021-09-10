import { useSelector as useReducerSelector, TypedUseSelectorHook} from "react-redux";
import { RootState } from './index'

/**
 * TypedUseSelectorHook 重新定义useSelect的类型
 */
export const useSelector: TypedUseSelectorHook<RootState> = useReducerSelector 