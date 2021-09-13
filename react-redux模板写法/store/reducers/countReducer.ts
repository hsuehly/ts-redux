import type { CountAction } from "../actions/countAction"

//ts中的枚举
export enum Count {
  ADD = "ADD",
  JIAN = "JIAN",
  // ASYNC = "ASYNC"

}
//ts中的接口 关键词interface
// 定义初始值的类型
export interface InitState {
  count: number
}
// 定义初始值
const initState:InitState = {
  count: 0
}


export default (state = initState, action: CountAction) => {
  console.log(state,'===')
  console.log(action,'____')
  
  //根据传入的type 执行相对应的步骤,保证数据的不可变性
  switch(action.type) {
    case Count.ADD:
      return {...state, count: state.count + action.payload};
    case Count.JIAN:
      return {...state, count: state.count - action.payload};
    default: 
      return state

  }

}