import { createSlice } from "@reduxjs/toolkit";

const adminSearchSlice = createSlice({
    name: "globalSearch",
    initialState: {
        search: "",
    },
    reducers: {
        setAdminSearch(state, action) {
            state.search = action.payload
        },
        clearAdminSearch(state) {
            state.search = ""
        },
    },
})

export const { setAdminSearch, clearAdminSearch } = adminSearchSlice.actions
export default adminSearchSlice.reducer
