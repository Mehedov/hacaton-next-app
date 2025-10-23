import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IntervalState {
	min: number
	max: number
	count: number
}

const initialState: IntervalState = {
	min: 1,
	max: 100,
	count: 1,
}

const intervalSlice = createSlice({
	name: 'interval',
	initialState,
	reducers: {
		setMin: (state, action: PayloadAction<number>) => {
			state.min = action.payload
		},
		setMax: (state, action: PayloadAction<number>) => {
			state.max = action.payload
		},
		setCount: (state, action: PayloadAction<number>) => {
			state.count = action.payload
		},
		setInterval: (
			state,
			action: PayloadAction<{ min: number; max: number }>
		) => {
			state.min = action.payload.min
			state.max = action.payload.max
		},
	},
})

export const { setMin, setMax, setCount, setInterval } = intervalSlice.actions
export default intervalSlice.reducer
