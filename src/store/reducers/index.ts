// import {combineReducers} from 'redux'
import { combineReducers } from '@reduxjs/toolkit'

import Count from './countReducer'

// rtk
import { count_rtk } from '../count-rtk/slice'
//汇总所有的reducer
export default combineReducers({
  Count,
  
  RtkCount: count_rtk.reducer
})