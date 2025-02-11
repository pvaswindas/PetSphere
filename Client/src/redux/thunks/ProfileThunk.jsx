import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosinstance";
import { setProfile, setOtherUsersProfile } from "../slices/ProfileSlice";

export const fetchProfile = createAsyncThunk(
    "profile/fetchProfile",
    async ({ auth_username, username }, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`user/profile/?username=${username}`);
            
            if (response.status === 200) {
                if (auth_username === username) {
                    dispatch(setProfile({ profile_data: response.data }));
                } else {
                    dispatch(setOtherUsersProfile({ username, profileData: response.data }));
                }
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            return rejectWithValue(error.response?.data || "Error Fetching Profile");
        }
    }
);
