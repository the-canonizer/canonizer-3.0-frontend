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
import homePageSlice from "./slices/homePageSlice";
import filtersSlice from "./slices/filtersSlice";
import recentActivitiesSlice from "./slices/recentActivitiesSlice";
import Auth from "./slices/authSlice";
import Tree from "./slices/campDetailSlice";
import UiReducer from "./slices/uiSlice";
import TopicSlice from "./slices/topicSlice";
import ForumSlice from "./slices/campForumSlice";
import campNewsSlice from "./slices/news";
import notifications from "./slices/notificationSlice";
import supportTreeCard from "./slices/supportTreeCard";
import utilsSlice from "./slices/utilsSlice";
// reducers

let combinedReducer = combineReducers({
  auth: Auth,
  topicDetails: Tree,
  homePage: homePageSlice,
  recentActivities: recentActivitiesSlice,
  ui: UiReducer,
  topic: TopicSlice,
  filters: filtersSlice,
  campNews: campNewsSlice,
  forum: ForumSlice,
  supportTreeCard: supportTreeCard,
  notifications,
  utils: utilsSlice,
});

const rootReducer = (state, action) => {
  if (action.type === "auth/setLogout") {
    state.filters = undefined;
  }
  return combinedReducer(state, action);
};

const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "auth",
    "filters",
    "topic",
    "forum",
    "supportTreeCard",
    "topicDetails",
    "utils",
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

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

const makeStore = (context: Context) => createStore(persistedReducer);
const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export interface State {
  tree: string;
}
export { persistor, store };

export const wrapper = createWrapper(makeStore, { debug: true });
