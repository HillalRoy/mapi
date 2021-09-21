import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

type UIState = {
  showHint: boolean
}

const initialState : UIState = {
  showHint: false
}

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    showHints: (state, action: PayloadAction<boolean>) => {
      return {...state, showHint: action.payload}
    }
  }
})


export const setUI = uiSlice.actions 

// Getters
export const getUI = {
  showHints: (state: RootState) => state.ui.showHint
}