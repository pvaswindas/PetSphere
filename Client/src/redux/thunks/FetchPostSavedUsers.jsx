import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosinstance";


export const fetchPostSavedUsers = createAsyncThunk(
    "posts/fetchPostSavedUsers",
    async (post_id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`posts/saved-users/${post_id}/`);
            if (response.status === 204) {
                return {}
            } else if (response.status === 200) {
                return response.data
            } else {
                return rejectWithValue("Unexpected response status.")
            }
        } catch (error) {
            return rejectWithValue("Failed to fetch saved users. Please try again.")
        }
    }
)