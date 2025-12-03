import { configureStore } from "@reduxjs/toolkit";
import personalReducer from "./slices/authSlice";
import familyReducer from "./slices/familySlice";
import damageReducer from "./slices/damageSlice";
import locationReducer from "./slices/locationSlice";
import documentsReducer from "./slices/documentsSlice";
import authReducer from "./slices/authSlice";

const store = configureStore({
  reducer: {
    personal: personalReducer,
    family: familyReducer,
    damage: damageReducer,
    location: locationReducer,
    documents: documentsReducer,
    auth: authReducer,
  },
});

export type AppStore = typeof store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
