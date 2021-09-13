import type { ThunkAction } from "redux-thunk"
import type {  AppThunk, RootState } from "../index"
import  { Count } from "../reducers/countReducer"

/**
 * 定义hangeadd的类型
 */
interface ChangeAddAction {
  type: Count.ADD;
  payload: number
}
interface ChangeJianAction {
  type: Count.JIAN;
  payload: number
  str: string
}
// interface AsyncAdd {
//   type: Count.ASYNC;
//   payload: number
// }
//

// 汇总action的类型
export type CountAction = ChangeAddAction | ChangeJianAction 

// action 工厂函数
export const changeAdd = (num: number):ChangeAddAction => {


  return {
    type: Count.ADD,
    payload: num

  }
}

export const changeJina = (num: number,str: string): ChangeJianAction => {

  return {
    type: Count.JIAN,
    payload: num,
    str

  }
}
// 异步的action 返回一个函数
/**
 *  @param  里面传递接受的参数
 * @returns  ThunkAction 1,参数为输出类型 2,store的state  4,action中额外的参数
 */

export const asyncAdd = (data: number, time: number): AppThunk=> (dispatch, getState)=> {
  const { Count:{count} } = getState()

  if(count %2 === 0) {
    console.log("2的倍数不更新")
    return
  }
  // 然后调用action的方法更改state 和vuex中action用法差不多
  setTimeout(()=>{
    dispatch(changeAdd(data))
  },time)
}