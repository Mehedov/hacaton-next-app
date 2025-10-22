import { configureStore } from '@reduxjs/toolkit'
import intervalSlice from './intervalSlice'

export const store = configureStore({
  reducer: {
    interval: intervalSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch