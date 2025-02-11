import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosinstance";
import { setFollowers, setFollowings } from "../slices/UsersSlice";


export const fetchFollowers = createAsyncThunk(
    "relations/fetchFollowers",
    async(username, { dispatch, rejectWithValue }) => {
        try {
            const params = username ? {username} : {}
            const response = await axiosInstance.get("/api/socials/followers", {params});
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
            const params = username ? {username} : {}
            const response = await axiosInstance.get("/api/socials/followings", {params});
            dispatch(setFollowings(response.data));
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)