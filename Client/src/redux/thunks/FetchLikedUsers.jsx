import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosinstance";


export const fetchLikedUsers = createAsyncThunk(
    "posts/fetchLikedUsers",
    async (post_id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`posts/likedusers/${post_id}/`);
            if (response.status === 204) {
                return {}
            } else if (response.status === 200) {
                return response.data
            } else {
                return rejectWithValue("Unexpected response status.")
            }
        } catch (error) {
            return rejectWithValue("Failed to fetch liked users. Please try again.")
        }
    }
)
