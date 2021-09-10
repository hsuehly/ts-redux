import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import Reducer from './reducers'
import { actionLog } from './middlewares/actionLog'


/**
 * 第一个为总reducer, 第二个为中间件
 */
const store = createStore(Reducer,composeWithDevTools(applyMiddleware(thunk,actionLog)))


export type RootState = ReturnType<typeof store.getState>
export default store


// redux 只能中间件公式
// const middleware = (store) => (next) => (action) => {}