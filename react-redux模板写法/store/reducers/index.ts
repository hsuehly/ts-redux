import {combineReducers} from 'redux'

import Count from './countReducer'
//汇总所有的reducer
export default combineReducers({
  Count,
  // 有多个在这里写
})