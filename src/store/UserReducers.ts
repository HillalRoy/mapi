import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { audioEngine } from "../audios/audioEngine";
import { firestore } from "./Firebase";

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
  async ({
    newHighScore,
    id,
    username,
  }: {
    newHighScore: number;
    id: string;
    username: string;
  }) => {
    const users = firestore.collection("users");
    const sfDocRef = users.doc(id);

    try {
      await sfDocRef.set(
        { username, highScore: newHighScore },
        { merge: true }
      );
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
    setUser: (
      state,
      action: PayloadAction<{ username: string; uid: string }>
    ) => {
      if ((action.payload.username ?? "") !== "") {
        audioEngine.play(audioEngine.bgmusic);
        setTimeout(() => {
          audioEngine.play(audioEngine.introspeech);
        }, 1000);
      }
      return {
        ...state,
        username: action.payload.username ?? "",
        uid: action.payload.uid,
      };
    },
    setUsername: (
      state,
      action: PayloadAction<{ username: string}>
    ) => {
      if ((action.payload.username ?? "") !== "") {
        audioEngine.play(audioEngine.bgmusic);
        setTimeout(() => {
          audioEngine.play(audioEngine.introspeech);
        }, 1000);
      }
      return {
        ...state,
        username: action.payload.username,
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

export const { setUser, setUsername } = usersSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const getUsername = (state: RootState) => state.users.username;
export const getUserUid = (state: RootState) => state.users.uid;
export const getHighScore = (state: RootState) => state.users.highScore;

export const usersReducer = usersSlice.reducer;
