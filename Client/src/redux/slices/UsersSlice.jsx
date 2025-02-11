import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
    name: "profile",
    initialState: {
        followers: [],
        followings: [],
    },
    reducers: {
        setFollowers(state, action) {
            state.followers = action.payload
        },
        clearFollowers(state) {
            state.followers = []
        },
        setFollowings(state, action) {
            state.followings = action.payload
        },
        clearFollowings(state) {
            state.followings = []
        },
    },
})

export const {
    setFollowers, clearFollowers, setFollowings, clearFollowings
} = usersSlice.actions

export default usersSlice.reducer
