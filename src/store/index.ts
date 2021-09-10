import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import devtool from 'redux-devtools-extension'
import Reducer from './reducers'
const store = createStore(Reducer,applyMiddleware(thunk))


export type RootState = ReturnType<typeof store.getState>
export default store