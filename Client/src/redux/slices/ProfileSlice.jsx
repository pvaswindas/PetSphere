import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
    name: "profile",
    initialState: {
        profile_data: null,
        email: null,
    },
    reducers: {
        setProfile(state, action) {
            state.profile_data = action.payload.profile_data
        },
        setEmail(state, action) {
            state.email = action.payload
        },
        clearProfile(state) {
            state.profile_data = null
            state.email = null
        },
    },
})

export const { setProfile, setEmail, clearProfile } = profileSlice.actions
export default profileSlice.reducer
