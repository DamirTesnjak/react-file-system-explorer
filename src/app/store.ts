import { configureStore } from '@reduxjs/toolkit'

import appReducer from "./appSlice";
import moveItemReducer from "./moveItemSlice";

export const store = configureStore({
  reducer: {
    appState: appReducer,
    moveItemState: moveItemReducer,
  },
})