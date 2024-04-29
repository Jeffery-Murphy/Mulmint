import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import WalletReducer from "./slices";
import { thunk }from 'redux-thunk';

const reducers = combineReducers({
    wallet: WalletReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: []
};

const persistedReducer = persistReducer(persistConfig, reducers);

const middleware = [
  thunk, // Include thunk middleware
  ...getDefaultMiddleware({
    serializableCheck: false,
    immutableCheck: false,
  }),
];

export const store = configureStore({
  reducer: persistedReducer,
  middleware,
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);
