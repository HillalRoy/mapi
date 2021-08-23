import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import firebase from "firebase";

interface UserState {
  username: string;
  uid: string;
  highScore: number;
}

// Define the initial state using that type
const initialState: UserState = {
  username: "",
  uid: "",
  highScore: 0,
};

export const setNewHighScoreThunk = createAsyncThunk(
  "user/newHighScore",
  async ({ newHighScore, id }: { newHighScore: number; id: string }) => {
    const db = firebase.firestore();
    const users = db.collection("users");
    const sfDocRef = users.doc(id);

    try {
      await db.runTransaction(async (transaction) => {
        return await transaction.update(sfDocRef, { highScore: newHighScore });
      });

      return newHighScore;
    } catch (e) {
      console.log("Transaction failed: ", e);
    }
  }
);

export const usersSlice = createSlice({
  name: "users",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setUsername: (
      state,
      action: PayloadAction<{ username: string; uid: string }>
    ) => {
      return {
        ...state,
        username: action.payload.username,
        uid: action.payload.uid,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      setNewHighScoreThunk.fulfilled,
      (state, { payload }): UserState => {
        return { ...state, highScore: payload ?? state.highScore };
      }
    );
  },
});

export const { setUsername } = usersSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const getUsername = (state: RootState) => state.users.username;
export const getUserUid = (state: RootState) => state.users.uid;
export const getHighScore = (state: RootState) => state.users.highScore;

export const usersReducer = usersSlice.reducer;
