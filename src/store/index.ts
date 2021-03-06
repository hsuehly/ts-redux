import { createStore, applyMiddleware } from 'redux'
import { configureStore, ThunkAction } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import Reducer from './reducers'
import { actionLog } from './middlewares/actionLog'
import { CountAction } from './actions/countAction'



/**
 * 第一个为总reducer, 第二个为中间件
 */
// const store = createStore(Reducer,composeWithDevTools(applyMiddleware(thunk,actionLog)))
//RTK
 const store = configureStore({
   reducer: Reducer,
   middleware: (getDefaultMiddleware)=> [...getDefaultMiddleware(),actionLog],
   devTools: true
 })
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState,unknown, CountAction>;
// export type AppAction = ReturnType<typeof store.dispatch>
export default store


// redux 只能中间件公式
// const middleware = (store) => (next) => (action) => {}