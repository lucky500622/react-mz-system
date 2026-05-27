import {configureStore} from '@reduxjs/toolkit'
import userStore from '@/store/modules/userStore'

const store = configureStore({
  reducer: {
    userStore
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store