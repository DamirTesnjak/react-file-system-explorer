import { createSlice } from '@reduxjs/toolkit'

import { initialValues } from "../constants/constants";

export const MoveItemSlice = createSlice({
  name: 'moveItem',
  initialState: initialValues,
  reducers: {
    setStateMoveItem: (state, action) => {
      const stateKeys = Object.keys(action.payload);
      stateKeys.forEach((key) => state[key] = action.payload[key])
    }
  },
})

// Action creators are generated for each case reducer function
export const { setStateMoveItem } = MoveItemSlice.actions

export default MoveItemSlice.reducer