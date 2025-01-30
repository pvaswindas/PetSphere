import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosinstance";
import { setFollowers, setFollowings, setOtherUser } from "../slices/UsersSlice";


export const fetchFollowers = createAsyncThunk(
    "relations/fetchFollowers",
    async(_, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/api/socials/followers");
            dispatch(setFollowers(response.data));
        } catch (error) {
            return rejectWithValue(error)
        }
    } 
)


export const fetchFollowings = createAsyncThunk(
    "relations/fetchFollowings",
    async(_, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/api/socials/followings");
            dispatch(setFollowings(response.data));
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const fetchOtherUser = createAsyncThunk(
    "relations/fetchOtherUser",
    async(id, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/user/profile/${id}/`);
                dispatch(setOtherUser(response.data));
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)