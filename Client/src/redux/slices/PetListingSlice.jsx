import { createSlice } from "@reduxjs/toolkit";

const petListingSlice = createSlice({
    name: "profile",
    initialState: {
        petListing: [],
        petListings: [],
    },
    reducers: {
        setCurrentPetListing(state, action) {
            state.petListing = action.payload.petListing
        },
        clearCurrentPetListing(state) {
            state.petListing = []
        },
        setPetListings(state, action) {
            state.petListings = action.payload.petListings
        },
        clearsetPetListings(state, action) {
            state.petListings = []
        }
    },
})

export const { setCurrentPetListing, clearCurrentPetListing, setPetListings, clearsetPetListings } = petListingSlice.actions
export default petListingSlice.reducer 
