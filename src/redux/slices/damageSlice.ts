import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ApplicationData } from '../../interfaces/types'

const initialState: Partial<ApplicationData> = {
  propertySize: 0,
  numberOfRooms: 0,
  isInhabitable: false,
}

export const damageSlice = createSlice({
  name: 'damage',
  initialState,
  reducers: {
    setDamageAssessment: (state, action: PayloadAction<Partial<ApplicationData>>) => {
      Object.assign(state, action.payload)
    },
  },
})

export const { setDamageAssessment } = damageSlice.actions
export default damageSlice.reducer
