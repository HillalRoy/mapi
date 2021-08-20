import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface UserState{
    username: string
}


// Define the initial state using that type
const initialState: UserState = {
    username: ''
};

export const usersSlice = createSlice({
  name: "counter",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
        return {...state, username: action.payload}
    }
  },
});

export const { setUsername } = usersSlice.actions
// Other code such as selectors can use the imported `RootState` type
export const  username = (state: UserState) => state.username;

export const usersReducer =  usersSlice.reducer;
