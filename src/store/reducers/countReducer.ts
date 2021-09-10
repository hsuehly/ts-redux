import { CountAction } from "../actions/countAction"


export enum Count {
  ADD = "ADD",
  JIAN = "JIAN",
  // ASYNC = "ASYNC"

}
export interface InitState {
  count: number
}
const initState:InitState = {
  count: 0
}

export default (state = initState, action: CountAction) => {
  console.log(state,'===')
  console.log(action,'____')
  
  switch(action.type) {
    case Count.ADD:
      return {...state, count: state.count + action.payload};
    case Count.JIAN:
      return {...state, count: state.count - action.payload};
    default: 
      return state

  }

}