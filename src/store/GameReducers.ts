import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

type Place = [{ lat: number; lng: number }, { country: string }];

export const places: Place[] = [
  // Todo
  [{ lat: 60.171001, lng: 24.93935 }, { country: "Finland" }], // Helsinki, Finland
  [{ lat: 48.858093, lng: 2.294694 }, { country: "France" }], // Paris, France
  [{ lat: 51.51002, lng: -0.13473 }, { country: "Great Britain" }], // London, Great Britain
  [{ lat: 41.8902, lng: 12.4922 }, { country: "Italy" }], // Rome, Italy
  [{ lat: 25.195302, lng: 55.272879 }, { country: "United Arab Emirates" }], // Dubai, United Arab Emirates
  [{ lat: 1.283404, lng: 103.863134 }, { country: "Singapore" }], // Marina Bay, Singapore
  [{ lat: 29.976768, lng: 31.135538 }, { country: "Egypt" }], // Cairo, Egypt
  [{ lat: 40.757876, lng: -73.985592 }, { country: "United States" }], // New York, USA
];

interface GameState {
  currentPlace: Place; // places[Math.floor(Math.random() * (places.length))]  // Pick a random place to be spawned
  score: number;
}

// Define the initial state using that type
const initialState: GameState = {
  currentPlace: places[Math.floor(Math.random() * places.length)], // Pick a random place to be spawned
  score: 0,
};

const getNewPlace = () => places[Math.floor(Math.random() * places.length)];

export const gameSlice = createSlice({
  name: "game",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    submitAns: (state, { payload: ans }: PayloadAction<string>) => {
      if (ans === state.currentPlace[1].country) {
        return {
          ...state,
          currentPlace: getNewPlace(),
          score: state.score + 1,
        };
      }
      return { ...state, currentPlace: getNewPlace() };
    },
  },
});

export const { submitAns } = gameSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const getCurCoordinates = (state: RootState) =>
  state.game.currentPlace[0];
export const getCurCountry = (state: RootState) =>
  state.game.currentPlace[1].country;
export const getScore = (state: RootState) => state.game.score;
export const GameReducer = gameSlice.reducer;
