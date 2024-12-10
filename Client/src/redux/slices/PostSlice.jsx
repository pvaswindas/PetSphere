import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name: "profile",
    initialState: {
        pawstories: [],
        currentPawstory: [],
    },
    reducers: {
        setPosts(state, action) {
            state.pawstories = action.payload.pawstories
        },
        clearPost(state) {
            state.pawstories = []
        },
        setCurrentPawstory(state, action) {
            state.currentPawstory = action.payload.currentPawstory
        },
        clearCurrentPawstory(state, action) {
            state.currentPawstory = []
        }
    },
})

export const { setPosts, clearPosts, setCurrentPawstory, clearCurrentPawstory } = postSlice.actions
export default postSlice.reducer
