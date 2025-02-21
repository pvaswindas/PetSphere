import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosinstance";
import { setFollowers, setFollowings } from "../slices/UsersSlice";


export const fetchFollowers = createAsyncThunk(
    "relations/fetchFollowers",
    async(username, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`socials/followers?username=${username}`);
            dispatch(setFollowers(response.data));
        } catch (error) {
            return rejectWithValue(error)
        }
    } 
)


export const fetchFollowings = createAsyncThunk(
    "relations/fetchFollowings",
    async(username, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`socials/followings?username=${username}`);
            dispatch(setFollowings(response.data));
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)