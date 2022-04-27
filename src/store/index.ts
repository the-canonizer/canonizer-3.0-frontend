import homePageSlice from "./slices/homePageSlice";
import filtersSlice from "./slices/filtersSlice";

// // reducers
import Auth from "./slices/authSlice";
import Tree from "./slices/campDetailSlice";
import UiReducer from "./slices/uiSlice";
import TopicSlice from "./slices/topicSlice";
import ForumSlice from "./slices/campForumSlice";

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
import campNewsSlice from "./slices/news";
// reducers

let reducers = combineReducers({
  auth: Auth,
  topicDetails: Tree,
  homePage: homePageSlice,
  ui: UiReducer,
  topic: TopicSlice,
  filters: filtersSlice,
  campNews: campNewsSlice,
  forum: ForumSlice,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "filters", "topic"],
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

export const wrapper = createWrapper(makeStore, { debug: true });
