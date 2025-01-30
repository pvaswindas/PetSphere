import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
    name: "profile",
    initialState: {
        profile_data: null,
        email: null,
        other_users_profile: {},
    },
    reducers: {
        setProfile(state, action) {
            state.profile_data = action.payload.profile_data;
        },
        setEmail(state, action) {
            state.email = action.payload;
        },
        clearProfile(state) {
            state.profile_data = null;
            state.email = null;
        },
        setOtherUsersProfile(state, action) {
            const { username, profileData } = action.payload;
            state.other_users_profile = {
                ...state.other_users_profile,
                [username]: profileData,
            };
        },
        clearOtherUsersProfile(state, action) {
            const { username } = action.payload;
            if (username in state.other_users_profile) {
                delete state.other_users_profile[username]
            }
        },
    },
});

export const { 
    setProfile, 
    setEmail, 
    clearProfile, 
    setOtherUsersProfile, 
    clearOtherUsersProfile 
} = profileSlice.actions;

export default profileSlice.reducer;
