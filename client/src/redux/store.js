import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js";
import postSlice from "./postSlice.js";
import profileSlice from "./profileSlice.js";
import commentSlice from "./commentSlice.js";
import bookmarkSlice from "./bookmarkSlice.js";
import followSlice from "./followSlice.js";
import likeSlice from "./likeSlice.js";

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  auth: authSlice,
  post: postSlice,
  profile: profileSlice,
  comment: commentSlice,
  bookmark: bookmarkSlice,
  follow: followSlice,
  like: likeSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export default store;
