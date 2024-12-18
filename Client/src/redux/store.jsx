import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import profileReducer from './slices/ProfileSlice'
import postReducer from './slices/PostSlice'
import adminReducer from "./slices/AdminProfileSlice"
import petReducer from "./slices/PetSlice"

const rootReducer = combineReducers({
    profile: profileReducer,
    posts: postReducer,
    admin: adminReducer,
    pets: petReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['profile', 'admin',],
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
