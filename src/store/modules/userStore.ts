import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'

import {getUserInfoService} from '@/api/user'

import { setStorage } from '@/utils/storage'

type UserInfo = {
  user_name: string
  user_role: string
}

// 获取用户信息
export const fetchUserInfo = createAsyncThunk('userStore/fetchUserInfo', async () => {
  const res = await getUserInfoService()
  setStorage('role', res.data.user_role)
  setStorage('user_name', res.data.user_name)
  return res.data
})

const userStore = createSlice({
  name: 'userStore',
  initialState: {
    userInfo: {} as UserInfo
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 处理获取用户信息成功
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.userInfo = action.payload
      })
  }
})

export default userStore.reducer