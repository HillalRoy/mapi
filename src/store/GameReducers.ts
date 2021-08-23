import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import firebase from "firebase";
import { sleep } from "../utils/tools";
import { RootState } from "./store";

type GameState = {
  currentPlace: Place;
  places: Place[];
  showAns: boolean,
  shownPlaces: Place[];
  score: number;
};

// Define the initial state using that type
const initialState: GameState = {
  currentPlace: { location: { lat: 0, lng: 0 }, country: "" },
  shownPlaces: [],
  showAns: false,
  places: [],
  score: 0,
};

const getNewPlace = (places: Place[]) =>
  places[Math.floor(Math.random() * places.length)];

export const loadPlacesThunk = createAsyncThunk("game/setPlaces", async () => {
  const locationCollection = firebase.firestore().collection("locations");

  const places = await locationCollection.get();
  const countryList: Place[] = [];
  places.forEach((v) => (countryList as any[]).push(v.data()));

  return countryList;
});

export const showAnsThunk = createAsyncThunk("game/showAns", async (ans: string) => {
  await sleep(1500)
  return ans
});

export const gameSlice = createSlice({
  name: "game",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    submitAns: (state, { payload: ans }: PayloadAction<string>) => {
      if (ans === state.currentPlace.country) {
        return {
          ...state,
          currentPlace: getNewPlace(state.places),
          score: state.score + 1,
        };
      }
      return { ...state, currentPlace: getNewPlace(state.places) };
    },
    restartGame: (state, _: PayloadAction<any>) => {
      // Todo time reset
      return {
        ...state,
        currentPlace: getNewPlace(state.places),
        score: 0,
      };
    },
    giveupGame: (state, _: PayloadAction<any>) => {
      // Todo move back to home
      return {
        ...state,
        currentPlace: getNewPlace(state.places),
        score: 0,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadPlacesThunk.fulfilled, (state, { payload: places }) => ({
      ...state,
      places,
      currentPlace: getNewPlace(places),
    }))

    builder.addCase(showAnsThunk.fulfilled, (state, { payload: ans }) => ({
      ...state,
      showAns: false,
      currentPlace: getNewPlace(state.places),
      score: ans === state.currentPlace.country ? state.score + 1 : state.score,
    }))
    builder.addCase(showAnsThunk.pending, (state, { payload: ans }) => ({
      ...state,
      showAns: true,
      // currentPlace: getNewPlace(state.places),
      // score: ans === state.currentPlace.country ? state.score + 1 : state.score,
    }))
  }
});

export const { submitAns, restartGame, giveupGame } =
  gameSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const getCurCoordinates = (state: RootState) =>
  state.game.currentPlace.location;
export const getCurCountry = (state: RootState) =>
  state.game.currentPlace.country;
export const getPlaces = (state: RootState) => state.game.places;
export const getScore = (state: RootState) => state.game.score;
export const getShowAns = (state: RootState) => state.game.showAns;

export const GameReducer = gameSlice.reducer;
