import homePageSlice from "./slices/homePageSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
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
import Auth from "./slices/authSlice";
import Tree from "./slices/treeSlice";
import UiReducer from "./slices/ui/uiSlice";

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

const persistor = persistStore(store);
export { persistor, store };
