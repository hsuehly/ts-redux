import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'


interface ICount {
  count: number,
  data: {name: string; phone: number; date: string}
}

const initialState: ICount = {
  count: 0,
  data: {
    name: '',
    phone: 0,
    date: ''
  }
}
/**
 * @param 第一个参数是action type 第二个为
 */
export const asyncReq = createAsyncThunk(
  'count_rtk/asyncJian',
  async (data: {num: number, time: number},thunkAPI)=> {
    // setTimeout(()=>{
    //   console.log(data.num,'______')
    //   thunkAPI.dispatch(count_rtk.actions.jian(data.num))
    // },data.time)
    // fetch('/api/data')
    // .then(res=> res.json())
    // .then(res=> console.log(res))
    const resdata = await (await fetch('/api/data')).json()
    // console.log(resdata,'4444')
    console.log(data,'7777')
    return resdata

  }
) 
export const count_rtk = createSlice({
  name: "count_rtk",
  initialState,
  // action 和redux 一起, 是对象, 每个对象对应一个action 和处理函数
  reducers: {
    add: (state)=> {
      // 可以使用之前的
      // return {...state,count: state.count + 1}

      state.count ++
    },
    jian: (state, action:PayloadAction<number>)=> {
      // console.log(action,"22222222")
      // console.log(state.count,'33333')
      state.count = state.count - action.payload
    },
    // addResDate: (state,action: PayloadAction<ICount["data"]>)=> {
    //   state.data = action.payload

    // }
  },
  //
  extraReducers: {
    [asyncReq.fulfilled.type]: (state,action: PayloadAction<ICount['data']>) => {
      console.log(action,'22222')
      state.data = action.payload
      // console.log(state,'666')

    },
    [asyncReq.rejected.type]: (state, action)=> {
      console.log(action,"3333")
    },
    [asyncReq.pending.type]: (state, action)=> {
      console.log(action,'55555')

    }

  }
})