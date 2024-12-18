import { createSlice } from "@reduxjs/toolkit";

const petSlice = createSlice({
    name: "pets",
    initialState: {
        petTypes: [],
        petBreeds: [],
    },
    reducers: {
        setPetType(state, action) {
            state.petTypes = action.payload.petTypes
        },
        clearPetType(state) {
            state.petTypes = []
        },
        setPetBreed(state, action) {
            state.petBreeds = action.payload.petBreeds
        },
        clearPetBreed(state, action) {
            state.petBreeds = []
        }
    },
})

export const { setPetType, clearPetType, setPetBreed, clearPetBreed } = petSlice.actions
export default petSlice.reducer
