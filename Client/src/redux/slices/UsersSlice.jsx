import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
    name: "profile",
    initialState: {
        followers: [],
        followings: [],
        otherUser: null,
    },
    reducers: {
        setFollowers(state, action) {
            state.followers = action.payload.followers
        },
        clearFollowers(state) {
            state.followers = []
        },
        setFollowings(state, action) {
            state.followings = action.payload.followings
        },
        clearFollowings(state) {
            state.followings = []
        },
        setOtherUser(state, action) {
            state.otherUser = action.payload.otherUser
        },
        clearOtherUser(state) {
            state.otherUser = null
        },
    },
})

export const {
    setFollowers, clearFollowers, setFollowings, clearFollowings, setOtherUser, clearOtherUser
} = usersSlice.actions

export default usersSlice.reducer
