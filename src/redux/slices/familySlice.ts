import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ApplicationData } from '../../interfaces/types'


const initialState: Partial<ApplicationData> = {
  numberOfChildren: 0,
}

export const familySlice = createSlice({
  name: 'family',
  initialState,
  reducers: {
    setFamilyInfo: (state, action: PayloadAction<Partial<ApplicationData>>) => {
      Object.assign(state, action.payload)
    },
  },
})

export const { setFamilyInfo } = familySlice.actions
export default familySlice.reducer
