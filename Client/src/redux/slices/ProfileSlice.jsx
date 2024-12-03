import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
    name: "profile",
    initialState: {
        profile_data: null,
    },
    reducers: {
        setProfile(state, action) {
            state.profile_data = action.payload.profile_data;
        },
        clearProfile(state) {
            state.profile_data = null;
        },
    },
});

export const { setProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
