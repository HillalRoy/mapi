import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { audioEngine } from "../audios/audioEngine";
import { random, sleep } from "../utils/tools";
import { RootState } from "./store";

type GameState = {
  currentPlace: Place;
  places: Place[];
  placesState: "loading" | "loaded" | "empty",
  showAns: boolean;
  shownPlaces: Place[];
  score: number;
  showHints: boolean;
};

// Define the initial state using that type
const initialState: GameState = {
  currentPlace: { location: { lat: 0, lng: 0 }, code: "", country: "" },
  shownPlaces: [],
  placesState: "empty",
  showAns: false,
  places: [],
  score: 0,
  showHints: false,
};

const getNewPlace = (places: Place[]): Place => {
  if(places.length > 0)
    return places[Math.floor(Math.random() * places.length)] 
  else return { location: { lat: 0, lng: 0 }, code: "", country: "" };
}


export const loadPlacesThunk = createAsyncThunk("game/setPlaces", async () => {
  // const locationCollection = firebase.firestore().collection("locations");

  // const places = await locationCollection.get();
  const reqs = Array(10).fill(0).map(c=> fetch(`/assets/loc/loc-${random(409)}.json`).then(v=> v.json()));
  const ress = await Promise.all(reqs) as Place[][]
  const places = ress.flat()
  console.log(places);
  return places
  // places.forEach((v) => (countryList as any[]).push(v.data()));

});

export const showAnsThunk = createAsyncThunk(
  "game/showAns",
  async (ans: string) => {
    await sleep(2000);
    return ans;
  }
);
export const RESTART_TIMER = "restart-timer";
export const gameSlice = createSlice({
  name: "game",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updateLoacation: (state) => ({...state, currentPlace: getNewPlace(state.places)}),
    submitAns: (state, { payload: ans }: PayloadAction<string>) => {
      if (ans === state.currentPlace.country) {
        audioEngine.play(audioEngine.onClick)
        return {
          ...state,
          currentPlace: getNewPlace(state.places),
          score: state.score + 1,
        };
      }
      audioEngine.play(audioEngine.wrongClick)
      return { ...state, currentPlace: getNewPlace(state.places) };
    },
    restartGame: (state, _: PayloadAction<any>) => {
      // Todo time reset
      document.dispatchEvent(new Event(RESTART_TIMER));
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

    startNewGame: (state, _: PayloadAction<any>) => {
      return {
        ...state,
        currentPlace: getNewPlace(state.places),
        shownPlaces: [],
        showAns: false,
        score: 0,
      };
    },
    showHints: (state, {payload: show}: PayloadAction<boolean>) => {
      // Todo move back to home
      return {
        ...state,
        showHints: show
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      loadPlacesThunk.fulfilled,
      (state, { payload: places }) => ({
        ...state,
        places,
        currentPlace: getNewPlace(places),
        placesState: "loaded",

      })
    );

    builder.addCase(loadPlacesThunk.pending, (state) => ({
      ...state,
      placesState: "loading",
    }));

    builder.addCase(loadPlacesThunk.rejected, (state) => ({
      ...state,
      placesState: "empty",
    }));


    builder.addCase(showAnsThunk.fulfilled, (state, { payload: ans }) => ({
      ...state,
      showAns: false,
      currentPlace: getNewPlace(state.places),
      score: ans === state.currentPlace.country ? state.score + 1 : state.score,
    }));

    builder.addCase(showAnsThunk.pending, (state, { payload: ans }) => ({
      ...state,
      showAns: true,
      // currentPlace: getNewPlace(state.places),
      // score: ans === state.currentPlace.country ? state.score + 1 : state.score,
    }));
  },
});

export const { submitAns, restartGame, giveupGame, showHints, startNewGame, updateLoacation } =
  gameSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const getCurCoordinates = (state: RootState) =>
  state.game.currentPlace.location;
export const getCurCountry = (state: RootState) =>
  state.game.currentPlace.country;
  export const getCurCountryCode = (state: RootState) =>
  state.game.currentPlace.code;
export const getPlaces = (state: RootState) => state.game.places;
export const getScore = (state: RootState) => state.game.score;
export const getShowAns = (state: RootState) => state.game.showAns;
export const getShowHints = (state: RootState) => state.game.showHints;
export const GameReducer = gameSlice.reducer;
