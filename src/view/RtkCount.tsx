import React, { FC, useEffect, useRef, useState } from 'react'
import { Dispatch } from 'redux'
import { Header, Footer} from '../components'
import { count_rtk, asyncReq } from '../store/count-rtk/slice'
import { useDispatch, useSelector } from '../store/hook'

interface IProps {
}
export const RtkCount: FC<IProps> = () => {

  const [num, setNum] = useState(0)
  const [selectVal, setSelectVal] = useState(0)
  const [btn, setBtn] = useState(true)
  useEffect(() => {
    selectVal ? setBtn(false) : setBtn(true) 
  }, [selectVal])
  // const selectRef = useRef<HTMLSelectElement>(null)
  // const state = useSelector<RootState>(state => state.Count)
  //获取数据
  const Count = useSelector(state=>state.RtkCount)
  // console.log(Count,'---')
  const resdata = useSelector(state=>state.RtkCount.data)
  console.log(resdata,'0000')

  // 这种更规范 但是比较麻烦
  // const dispatch = useDispatch<Dispatch<CountAction>>()

  const dispatch = useDispatch()
  // console.log(dispatch,'+++')

// store 钩子
// const store = useStore()
// console.log(store.getState(),'------hook')




  const clickHandle = () => {
    // 加上括号
    dispatch(count_rtk.actions.add())
  }
  const jianHandle =() => {
    dispatch(count_rtk.actions.jian(selectVal))
  }
  // 函数式异步更新方法
  const asyAdd = () => {
    dispatch(asyncReq({num: selectVal,time: 500}))
  }
  return <>
  <Header />
  <p>这是Hook组件</p>
  <p>state &nbsp; {num}</p>
    <div>RTK &nbsp;{Count.count}</div>
    <select onChange={(e)=>setSelectVal(Number(e.target.value))} >
      <option value="0">0</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
    </select>
    <button onClick={clickHandle}>+1</button>
    <button disabled={btn}  onClick={jianHandle}>-{selectVal}</button>
    <button  onClick={asyAdd}>发送异步请求</button>
    <p>异步数据:</p>
   {
     resdata.name ?  <div>
     <p>名字: {resdata.name}</p>
     <p>手机: {resdata.phone}</p>
     <p>日期: {resdata.date}</p>
   </div> 
   : null
   }
  <Footer/>
  </>
}