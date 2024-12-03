import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import profileReducer from './slices/ProfileSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'profile'], // Persist only these reducers
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);
export default store;
