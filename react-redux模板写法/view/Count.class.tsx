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