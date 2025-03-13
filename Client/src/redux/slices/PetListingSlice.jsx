import { createSlice } from "@reduxjs/toolkit";

const LISTING_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds

const petListingSlice = createSlice({
    name: "petListings",
    initialState: {
        petListing: [],
        petListings: [],
        newListing: null,
        newListingTimestamp: null,
    },
    reducers: {
        setCurrentPetListing(state, action) {
            state.petListing = action.payload.petListing;
        },
        clearCurrentPetListing(state) {
            state.petListing = [];
        },
        setPetListings(state, action) {
            state.petListings = action.payload.petListings;
        },
        clearsetPetListings(state) {
            state.petListings = [];
        },
        setNewListing(state, action) {
            state.newListing = action.payload;
            state.newListingTimestamp = Date.now();
        },
        clearNewListing(state) {
            state.newListing = null;
            state.newListingTimestamp = null;
        }
    },
});

export const { 
    setCurrentPetListing, clearCurrentPetListing, setPetListings, 
    clearsetPetListings, setNewListing, clearNewListing
} = petListingSlice.actions;

export const checkNewListingExpiration = () => (dispatch, getState) => {
    const { newListing, newListingTimestamp } = getState().petListings;
    
    if (newListing && newListingTimestamp) {
        const now = Date.now();
        const elapsed = now - newListingTimestamp;
        
        if (elapsed >= LISTING_TIMEOUT) {
            // If listing has expired, clear it
            dispatch(clearNewListing());
        } else {
            const remainingTime = LISTING_TIMEOUT - elapsed;
            setTimeout(() => {
                dispatch(clearNewListing());
            }, remainingTime);
        }
    }
};

export const setNewListingWithTimeout = (newListingData) => (dispatch) => {
    dispatch(setNewListing(newListingData));
    
    setTimeout(() => {
        dispatch(clearNewListing());
    }, LISTING_TIMEOUT);
};

export default petListingSlice.reducer;