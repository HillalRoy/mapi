import { configureStore } from "@reduxjs/toolkit";
import { GameReducer } from "./GameReducers";
import { usersReducer } from "./UserReducers";
// ...

export const store = configureStore({
  reducer: {
    users: usersReducer,
    game: GameReducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
