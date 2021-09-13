import React, { Component } from 'react'
import { connect } from 'react-redux'
import type { AppDispatch, RootState } from '../store'
import { AsyncThunk} from '@reduxjs/toolkit'
import { asyncReq } from '../store/count-rtk/slice'
import { count_rtk } from '../store/count-rtk/slice'
interface IProps extends ReturnType<typeof mapStateToProps>, ReturnType<typeof mapDispatchToProps>{

}
class CountComponent extends Component<IProps, {}> {


  render() {


    return <>
    <p>这是class组件</p>
    <p>RTK:{this.props.count}</p>
    <button onClick={this.props.add}>+1</button>
    <button onClick={()=>this.props.jian(2)}>-2</button>
    <button onClick={()=>this.props.asyncq(2,500)}>发布异步请求</button>
    <p>
      请求数据:
    </p>
    {
     this.props.data.name ?  <div>
     <p>名字: {this.props.data.name}</p>
     <p>手机: {this.props.data.phone}</p>
     <p>日期: {this.props.data.date}</p>
   </div> 
   : null
   }
    </>
  }

}

const mapStateToProps = (state: RootState) => {
return {
  count: state.RtkCount.count,
  data: state.RtkCount.data
}

}
const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    asyncq  (num: number, time: number) {
      dispatch(asyncReq({num,time}))
    },
    add() {
      dispatch(count_rtk.actions.add())
    },
    jian(num: number) {
      dispatch(count_rtk.actions.jian(num))
    }
  }

}

export default connect(mapStateToProps,mapDispatchToProps)(CountComponent)