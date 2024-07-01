import { createSlice } from '@reduxjs/toolkit'

import { initialValues } from "../constants/constants";
import { ReducerItems } from '../types/ReducerItems';

interface State extends ReducerItems {
  [x:string]: any
}

export const MoveItemSlice = createSlice({
  name: 'moveItem',
  initialState: initialValues,
  reducers: {
    setStateMoveItem: (state: State, action) => {
      const stateKeys = Object.keys(action.payload);
      stateKeys.forEach((key: string) => state[key] = action.payload[key])
    }
  },
})

// Action creators are generated for each case reducer function
export const { setStateMoveItem } = MoveItemSlice.actions

export default MoveItemSlice.reducer