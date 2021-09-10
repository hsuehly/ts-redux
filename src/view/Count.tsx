import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'
import { Header, Footer} from '../components'
import { asyncAdd, changeAdd, changeJina, CountAction } from '../store/actions/countAction'
import { useSelector } from '../store/useSelect'
export const Count = () => {

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
  const clickHandle = () => {
    dispatch(changeAdd(selectVal))
  }
  const jianHandle =() => {
    dispatch(changeJina(selectVal,"Hook里的减"))
  }
  // 函数式异步更新方法
  const asyAdd = (data: number, time: number) => {
    dispatch(asyncAdd(data,time))
  }
  return <>
  <Header />
  <p>这是Hook组件</p>
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
    <button  onClick={()=> asyAdd(2,1000)}>异步更新整除2不更</button>
  <Footer/>
  </>
}