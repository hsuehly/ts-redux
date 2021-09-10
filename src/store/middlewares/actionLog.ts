import { Middleware } from "redux";

// 自定义中间件
export const actionLog: Middleware = (store)=>(next)=>(action)=> {
  console.log("之前的值",store.getState())
  console.log("当前的action",action)
  next(action)
  console.log("更新后的值",store.getState())
}