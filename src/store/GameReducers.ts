import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import firebase from "firebase";
import { RootState } from "./store";

type GameState = {
  currentPlace: Place;
  places: Place[];
  shownPlaces: Place[];
  score: number;
};

// Define the initial state using that type
const initialState: GameState = {
  currentPlace: { location: { lat: 0, lng: 0 }, country: "" },
  shownPlaces: [],
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
  console.log("lld");

  return countryList;
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
export const GameReducer = gameSlice.reducer;
