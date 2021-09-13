import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import Reducer from './reducers'
import { actionLog } from './middlewares/actionLog'
import type { ThunkAction } from 'redux-thunk'
import type { Action } from 'redux'
import { CountAction } from './actions/countAction'


/**
 * 第一个为总reducer, 第二个为中间件
 */
const store = createStore(Reducer,composeWithDevTools(applyMiddleware(thunk,actionLog)))


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState,unknown, CountAction>;
// 暴露store 供 react-redux中Provider 使用
export default store


// redudefaultx 只能中间件公式
// const middleware = (store) => (next) => (action) => {}