import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'

import {getUserInfoService} from '@/api/user'
import { setStorage } from '@/utils/storage'
import type { HandleWarehouseInfo } from '@/api/warehouse'
import { getHandleWarehouseInfo } from '@/api/warehouse'
import { getApplyInfo } from '@/api/apply'

type UserInfo = {
  user_name: string
  user_role: string
}
// 获取用户信息
export const fetchUserInfo = createAsyncThunk('userStore/fetchUserInfo', async () => {
  const res = await getUserInfoService()
  setStorage('role', res.data?.user_role ?? '')
  setStorage('user_name', res.data?.user_name ?? '')
  return res.data
})
// 获取用户经手仓库信息
export const fetchHandleWarehouseInfo = createAsyncThunk('userStore/fetchHandleWarehouseInfo', async () => {
  const res = await getHandleWarehouseInfo()
  return res.data?.handleWarehouseInfo ?? []
})
// 获取用户权限变更申请信息
export const fetchApplyInfo = createAsyncThunk('userStore/fetchApplyInfo', async () => {
  const res = await getApplyInfo()
  return res.data
})

const userStore = createSlice({
  name: 'userStore',
  initialState: {
    userInfo: {} as UserInfo,
    handleWarehouseInfo: [] as HandleWarehouseInfo[],
    existApply: false
  },
  reducers: {
    setExistApply: (state, action) => {
      state.existApply = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // 处理获取用户信息成功
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        if (action.payload) {
          state.userInfo = action.payload
        }
      })
      // 处理获取用户经手仓库信息成功
      .addCase(fetchHandleWarehouseInfo.fulfilled, (state, action) => {
        state.handleWarehouseInfo = action.payload
      })
      .addCase(fetchApplyInfo.fulfilled, (state, action) => {
        const payload = action.payload ?? {}
        if (Object.keys(payload).length === 0) {
          state.existApply = false
        } else {  
          state.existApply = true
        }
      })
  }
})

export const { setExistApply } = userStore.actions

export default userStore.reducer