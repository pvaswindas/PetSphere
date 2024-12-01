import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
    name: "profile",
    initialState: {
        profile: null,
    },
    reducers: {
        setProfile(state, action) {
            state.user = action.payload;
        },
        clearProfile(state) {
            state.user = null;
        },
    },
});

export const { setProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
