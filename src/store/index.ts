import homePageSlice from "./slices/homePageSlice";

// // reducers
import Auth from "./slices/authSlice";
import Tree from "./slices/treeSlice";
import UiReducer from "./slices/uiSlice";

import { createStore, Store } from "redux";

import { MakeStore, createWrapper, Context } from "next-redux-wrapper";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistStore,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
// reducers

let reducers = combineReducers({
  auth: Auth,
  trees: Tree,
  homePage: homePageSlice,
  ui: UiReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "trees"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  // .concat(logger),
});
export type RootState = ReturnType<typeof reducers>;
export type AppDispatch = typeof store.dispatch;
export interface State {
  tree: string;
}

const makeStore = (context: Context) => createStore(persistedReducer);
const persistor = persistStore(store);
export { persistor, store };

export const wrapper = createWrapper<Store>(makeStore, { debug: true });
