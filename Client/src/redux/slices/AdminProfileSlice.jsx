import { createSlice } from "@reduxjs/toolkit";

const adminprofileSlice = createSlice({
    name: "profile",
    initialState: {
        admin_profile: null,
        email: null,
    },
    reducers: {
        setAdminProfile(state, action) {
            state.admin_profile = action.payload.admin_profile
        },
        setAdminEmail(state, action) {
            state.email = action.payload
        },
        clearAdminProfile(state) {
            state.admin_profile = null
            state.email = null
        },
    },
})

export const { setAdminProfile, setAdminEmail, clearAdminProfile } = adminprofileSlice.actions
export default adminprofileSlice.reducer
