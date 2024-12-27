import { createSlice } from "@reduxjs/toolkit";

const petListingSlice = createSlice({
    name: "profile",
    initialState: {
        petListing: [],
        petListings: [],
    },
    reducers: {
        setPetListing(state, action) {
            state.petListing = action.payload.petListing
        },
        clearPetListing(state) {
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

export const { setPetListing, clearPetListing, setPetListings, clearsetPetListings } = petListingSlice.actions
export default petListingSlice.reducer 
