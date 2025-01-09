import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import profileReducer from './slices/ProfileSlice';
import postReducer from './slices/PostSlice';
import adminReducer from "./slices/AdminProfileSlice";
import petReducer from "./slices/PetSlice";
import locationReducer from "./slices/LocationSlice";
import petListingReducer from "./slices/PetListingSlice"
import globalSearchReducer from "./slices/GlobalSearchSlice"
import subscriptionReducer from "./slices/SubscriptionSlice"

const EXPIRY_TIME = 60 * 60 * 25

const expiryTransform = createTransform(
    (inboundState) => {
        return {
        ...inboundState,
        timestamp: Date.now(),
        };
    },
    (outboundState) => {
        if (outboundState && outboundState.timestamp) {
        const isExpired = Date.now() - outboundState.timestamp > EXPIRY_TIME;
        if (isExpired) {
            return undefined;
        }
        }
        return outboundState;
    },
    { whitelist: ['petListings'] }
);

const rootReducer = combineReducers({
    profile: profileReducer,
    posts: postReducer,
    petListings: petListingReducer,
    admin: adminReducer,
    pets: petReducer,
    location: locationReducer,
    globalSearch: globalSearchReducer,
    subscriptions: subscriptionReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    transforms: [expiryTransform],
    whitelist: ['profile', 'admin', 'globalSearch', 'subscriptions',],
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

export function clearStore() {
    store.dispatch({ type: 'RESET' })
    persistor.purge()
}

export default store;
