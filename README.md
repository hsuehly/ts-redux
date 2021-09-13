​组件先分别导出,最后汇总到index 统一导出
ts类型导入 在后面添加 type 示列:
````js
 //bad:
 import {} from ''
 // good
 import type {} from ''
````




                           Redux工作流

![image-20210913115656770](https://cdn.jsdelivr.net/gh/hsuehly/blogimg/markdown/image-20210913115656770.png)

1. 用户在页面上进行某些操作，通过 `dispatch` 发送一个 `action`。
2. Redux 接收到这个 `action` 后通过 `reducer` 函数获取到下一个状态。
3. 将新状态更新进 `store`，`store` 更新后通知页面进行重新渲染。

Redux 的核心就是一个 **「发布-订阅」** 模式。view 订阅了 store 的变化，一旦 store 状态发生修改就会通知所有的订阅者，view 接收到通知之后会进行重新渲染。

store 整体是一个大的对象



一般来说，Redux 遵守下面三大原则：

- 单一数据源

在 Redux 中，所有的状态都放到一个 store 里面，一个应用中一般只有一个 store。

- State 是只读的

在 Redux 中，唯一改变 state 的方法是通过 dispatch 触发 action，action 描述了这次修改行为的相关信息。只允许通过 action 修改可以避免一些 mutable 的操作，保证状态不会被随意修改

- 通过纯函数来修改

为了描述 action 使状态如何修改，需要你编写 reducer 函数来修改状态。reducer 函数接收前一次的 state 和 action，返回新的 state。无论被调用多少次，只要传入相同的 `state 和 action，那么就一定返回同样的结果

#### action 和 reducer

action 是把数据传到 store 的载体，一般我们通过 `dispatch` 将 action 传给 reducer，reducer 来计算出新的值。一个 action 就是一个对象，类似这样：

````js
{
 type: "ADD_TODO", //定义的类型
 payload: { // 传递的参数
  text: "今天要洗衣服"
 }
}
````

也可以使用action 工厂创建 要返回一个action 对象

````js
const addTodo = (text) => ({
 type: "ADD_TODO",
 payload: {
  text: "今天要洗衣服"
 }
})
````

action.type 是作为一个唯一标志来和 reducer 匹配起来的,reducer 里面会拿到 `action.type` 和 传入的数据来进行处理



````js
const reducer = (state, action) => {
  switch(action.type):
 case "ADD_TODO":
   state.todos = [...state.todos, action.payload];
  return { ...state };
 default:
  return state;
}
````

这里的reducer必须返回一个新的对象,

如果这里返回一个旧的对象，想要知道前后两次状态是否更新的成本就会很大。因为两次状态都是同一份引用，想要比较属性是否变化，只能通过深比较的形式。

但如果对对象进行深比较，性能上的消耗太大了。所以 Redux 每次只会进行一次浅比较，这样就需要我们在修改的地方返回一个新的对象。

![image-20210913120928274](https://cdn.jsdelivr.net/gh/hsuehly/blogimg/markdown/image-20210913120928274.png)

middleware 是在发起 action 之后，到 reducer 之前的扩展，它相当于对 dispatch 进行了一个增强，让其拥有更多的能力。

以 redux-thunk 为例子，只需要在创建 store 的时候通过 `applyMiddleware` 来注册中间件就可以了。

````js
import thunk from 'redux-thunk';
const store = createStore(reducers, applyMiddleware(thunk));
````

这样就允许我们的 action 作为一个函数来发送异步请求了。如下例子， `FETCH_LIST` 会在请求返回后发送出去。

使用thunk管理异步要求返回一个函数

````js
const fetchList = () =>{
  return async (dispatch) => {
    const list = await api.getList();
    dispatch({
      type: FETCH_LIST,
      payload: {
        list
      }
    });
  };
};
dispatch(fetchList());
````

自定义中间件公式:

````ts
const middleware = (store) => (next) => (action) => {}
// 下面子自定义log中间件
import type { Middleware } from "redux";
export const actionLog: Middleware = (store)=>(next)=>(action)=> {
  console.log("之前的值",store.getState())
  console.log("当前的action",action)
  next(action)
  console.log("更新后的值",store.getState())
}

````



````js
const createStore = (reducer, initialState, enhancer) => {   // 如果传入了 applyMiddleware，那就调用它   
  if (enhancer && typeof enhancer === 'function') { 
      return enhancer(createStore)(reducer, initialState) 
  } 
    let state = initialState, 
        listeners = [], 
        isDispatch = false;
  // 获取 store    
  const getState = () => state;
  // 发送一个 action    
  const dispatch = (action) => {      // action 不能同时发送        
    if (isDispatch) return action; 
      isDispatch = true; 
      state = reducer(state, action); 
      isDispatch = false;
    // 执行注册的事件        
    listeners.forEach(listener => listener(state)); 
     return action;
  }    // 监听 store 变化，注册事件    
  const subscribe = (listener) => { 
      if (typeof listener === "function") { 
          listeners.push(listener); 
      } 
      return () => unsubscribe(listener); }
  // 移除注册的事件    
  const unsubscribe = (listener) => {
    const index = listeners.indexOf(listener);
    listeners.splice(index, 1);
  }    
  return { getState, dispatch, subscribe, unsubscribe }
}
````

connect 本身也是一个高阶组件，我们通过 Provider 将 store 传给子孙组件。在 `connect` 里面通过 `subscribe` 监听了 store，一旦 store 变化，它就让 React 组件重新渲染

````js
const connect = (mapStateToProps, mapDispathToProps) => (WrappedComponent) => {
  return class extends React.Component {
    static contextType = ReactReduxContext;
    constructor(props) {
      super(props);
      this.store = this.context.store;
      this.state = {
        state: this.store.getState()
      };
    }
   componentDidMount() {
      this.store.subscribe((nextState) => {
        // 浅比较
        if (!shadowCompare(nextState, this.state.state)) {
            this.setState({ state: nextState });
        }
      });
    }
    render() {
      const props = {
        ...mapStateToProps(this.state.state),
        ...mapDispathToProps(this.state.state),
        ...this.props
      }
      return <WrappedComponent {...props} />
    }
  }
}
````

combineReducers则是在每次更新的时候去遍历执行最初传入的 `reducer`。

````js
const combineReducers = reducers => {
    const finalReducers = {},
        nativeKeys = Object.keys;
    nativeKeys(reducers).forEach(reducerKey => {
       // 过滤掉不是函数的 reducer
        if(typeof reducers[reducerKey] === "function") {
            finalReducers[reducerKey] = reducers[reducerKey];
        }
    })
   // 返回了一个新的函数
    return (state, action) => {
      let hasChanged = false;
      let nextState = {};
       // 遍历所有的 reducer 函数并执行
        nativeKeys(finalReducers).forEach(key => {
            const reducer = finalReducers[key];
            nextState[key] = reducer(state[key], action);
            hasChanged = hasChanged || nextState[key] !== state[key]
        })
        return hasChanged ? nextState : state;
    }
}
````

从上面的源码也可以看出来，Redux 存在一个很明显的问题，那就是需要通过遍历 `reducer` 来匹配到对应的 `action.type`。

那么这里有没有优化空间呢？为什么 `action` 和 `reducer` 必须手写 `switch...case` 来匹配呢？如果将 `action.type` 作为函数名，这样是否就能减少心智负担呢？

这些很多人都想到了，所以 Rematch 和 Dva 就在这之上做了一系列优化，Redux 也吸取了他们的经验，重新造了 @reduxjs/toolkit。

提取于: https://mp.weixin.qq.com/s/-iUyiQf50iIBVCgxeY5ppw



#### 下面是ts-redux的模板写法

#### 项目目录结构

├── index.html
├── package.json
├── package-lock.json

├── README.md
├── server
│   └── app.js // 模拟的请求
├── src
│   ├── App.tsx
│   ├── components // 自定义组件
│   │   ├── footer // 底部组件
│   │   │   ├── Footer.module.css
│   │   │   ├── Footer.tsx
│   │   │   └── index.ts // 在这暴露当前组件
│   │   ├── header // 头部组件
│   │   │   ├── Header.module.css
│   │   │   ├── Header.tsx
│   │   │   └── index.ts
│   │   └── index.ts // 统一暴露组件
│   ├── layout // 页面布局组件
│   │   ├── MainLayout
│   │   │   ├── index.ts
│   │   │   ├── MainLayout.module.css
│   │   │   └── MainLayout.tsx
│   │   └── OtherLaout
│   │       ├── index.ts
│   │       ├── OtherLayout.module.css
│   │       └── OtherLayout.tsx
│   ├── main.tsx
│   ├── store
│   │   ├── actions // actions 目录
│   │   │   └── countAction.ts
│   │   ├── count-rtk // rtk 写法目录
│   │   │   └── slice.ts
│   │   ├── hook // 自定义hook的目录
│   │   │   └── index.ts
│   │   ├── index.ts  //store 仓库
│   │   ├── middlewares // 自定义中间件
│   │   │   └── actionLog.ts
│   │   └── reducers // reducer目录
│   │       ├── countReducer.ts
│   │       └── index.ts
│   ├── view // 带有路由的页面
│   │   ├── Count.class.tsx
│   │   ├── Count.tsx
│   │   ├── RtkCount.class.tsx
│   │   └── RtkCount.tsx
│   └── vite-env.d.ts
├── tsconfig.json
└── vite.config.ts

1.首先创建一个reducer

````ts
import type { CountAction } from "../actions/countAction"


export enum Count {
  ADD = "ADD",
  JIAN = "JIAN",
  // ASYNC = "ASYNC"

}
// 定义初始值的类型
export interface InitState {
  count: number
}
// 定义初始值
const initState:InitState = {
  count: 0
}


export default (state = initState, action: CountAction) => {  
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
````

2.汇总所有的reducer

````ts
import {combineReducers} from 'redux'

import Count from './countReducer'
//汇总所有的reducer
export default combineReducers({
  Count,
  // 有多个在这里写
})
````



3.创建一个action工厂

````ts
import type { ThunkAction } from "redux-thunk"
import type { RootState } from "../index"
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

export const asyncAdd = (data: number, time: number): ThunkAction<void, RootState,unknown, CountAction> => (dispatch, getState)=> {
    
  const { Count:{count} } = getState()

  if(count %2 === 0) {
    console.log("2的倍数不更新")
    return
  }
  setTimeout(()=>{
        // 然后调用action的方法更改state 和vuex中action用法差不多
    dispatch(changeAdd(data))
  },time)
}
````

4.创建store

````ts
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import Reducer from './reducers'
import { actionLog } from './middlewares/actionLog'
import type { ThunkAction } from 'redux-thunk'
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
````

5.

````ts
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import store from './store'

ReactDOM.render(
  <React.StrictMode>
    {/* 用Provider 提供store 保住根组件, 全局推荐只有一个store */}
    <Provider store={store}>
        <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
````

6. class类组件写法参考

````tsx
import React, { Component } from 'react'
import { connect } from 'react-redux'
import type { ThunkDispatch } from 'redux-thunk'
import type { RootState } from '../store'
import { asyncAdd, changeAdd, changeJina, CountAction } from '../store/actions/countAction'

// 可以使用工具泛型函数获取mapStateToProps和 mapDispatchToProps 的定义类型
interface IProps extends ReturnType<typeof mapStateToProps>,
 ReturnType<typeof mapDispatchToProps> {
  sname: string;
}
interface IState {
  num: number
}

class CountComponent extends Component<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state= {
      num: 3
    }

  }

  asyncHandle = (data: number,time: number )=> {
    return ()=> {
      this.props.asyncAdd(data, time)
    }
  }



  render() {
    console.log(this)
    return <>
      <p>这是class组件</p>
      <div>props传递的数据&nbsp; &nbsp; &nbsp; &nbsp; {this.props.sname}</div>
      <p>state里的数据&nbsp; &nbsp; &nbsp; &nbsp; {this.state.num}</p>
      <div>这是redux里的数据&nbsp; &nbsp; &nbsp; &nbsp; {this.props.num.count}</div>
      <button onClick={()=>this.props.add(3)}>+3</button>
      <button onClick={()=> this.props.jian(6)}>-6</button>
      <button onClick={this.asyncHandle(3,500)}>异步更新,被2整除不更</button>
    </>
  }

}
/**
 *  函数
 * @param state 从store传递过来的
 * @returns  映射到props的数据, 以对象形式返回
 */
const mapStateToProps = (state: RootState) => {

  return {
    //映射到props的数据
    num: state.Count
  }
}
// 由于redux 的Dispatch 的类型定义没有定义异步的类型所以需要thunk里面的Dispatch定义
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, void, CountAction>) => {
return {
  add: (num: number)=>{
    dispatch(changeAdd(num))
  },
  jian: (num: number)=>{
    dispatch(changeJina(num,"class的减"))
  },
  asyncAdd: (data: number, time: number) =>{
    dispatch(asyncAdd(data,time))
  }
}
}
export default connect(mapStateToProps,mapDispatchToProps)(CountComponent)
````

7.函数组件写法参考

````tsx
import React, { FC, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Header, Footer} from '../components'
import { asyncAdd, changeAdd, changeJina} from '../store/actions/countAction'
import { useSelector } from '../store/hook'

interface IProps {
  uname: string
}
export const Count: FC<IProps> = ({uname}) => {

  const [num, setNum] = useState(0)
  const [selectVal, setSelectVal] = useState(0)
  const [btn, setBtn] = useState(true)
  useEffect(() => {
    selectVal ? setBtn(false) : setBtn(true) 
  }, [selectVal])
  // const selectRef = useRef<HTMLSelectElement>(null)
  // const state = useSelector<RootState>(state => state.Count)
  //获取数据
  const Count = useSelector(state=>state.Count)
  // console.log(Count,'---')


  // 这种更规范 但是比较麻烦
  // const dispatch = useDispatch<Dispatch<CountAction>>()

// 这种会推断为any 不过不影响
  const dispatch = useDispatch()
  // console.log(dispatch,'+++')

// store 钩子
// const store = useStore()
// console.log(store.getState(),'------hook')


  const clickHandle = () => {
    dispatch(changeAdd(selectVal))
  }
  const jianHandle =() => {
    dispatch(changeJina(selectVal,"Hook里的减"))
  }
  // 函数式异步更新方法
  const asyAdd = () => {
    dispatch(asyncAdd(selectVal,500))
  }
  return <>
  <Header />
  <p>这是Hook组件</p>
  <p>props &nbsp; {uname}</p>
  <p>state &nbsp; {num}</p>
    <div>redux &nbsp;{Count.count}</div>
    <select onChange={(e)=>setSelectVal(Number(e.target.value))} >
      <option value="0">0</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
    </select>
    <button disabled={btn} onClick={clickHandle}>+{selectVal}</button>
    <button disabled={btn}  onClick={jianHandle}>-{selectVal}</button>
    <button  onClick={asyAdd}>异步更新整除2不更</button>
  <Footer/>
  </>
}
````



