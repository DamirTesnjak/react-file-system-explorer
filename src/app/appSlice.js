import { createSlice } from '@reduxjs/toolkit'

import { initialValues } from "../constants/constants";

export const AppSlice = createSlice({
  name: 'app',
  initialState: initialValues,
  reducers: {
    setState: (state, action) => {
      const stateKeys = Object.keys(action.payload);
      stateKeys.forEach((key) => state[key] = action.payload[key])
    }
  },
})

// Action creators are generated for each case reducer function
export const { setState } = AppSlice.actions

export default AppSlice.reducer