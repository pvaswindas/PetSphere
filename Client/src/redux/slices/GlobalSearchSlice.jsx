import { createSlice } from "@reduxjs/toolkit";

const globalSearchSlice = createSlice({
    name: "globalSearch",
    initialState: {
        search: "",
    },
    reducers: {
        setGlobalSearch(state, action) {
            state.search = action.payload
        },
        clearGlobalSearch(state) {
            state.search = ""
        },
    },
})

export const { setGlobalSearch, clearGlobalSearch } = globalSearchSlice.actions
export default globalSearchSlice.reducer
