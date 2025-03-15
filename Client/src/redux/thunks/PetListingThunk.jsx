import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosinstance";
import { setCurrentPetListing, clearCurrentPetListing, setPetListings, clearsetPetListings } from "../slices/PetListingSlice";

export const fetchPetListings = createAsyncThunk(
    "posts/fetchPetListings",
    async (username, { dispatch, rejectWithValue }) => {
        try {
            const params = username ? {username} : {}
            const response = await axiosInstance.get("posts/petlistings-list/", {params})
            if (response.status === 204) {
                dispatch(clearsetPetListings())
            } else if (response.status === 200) {
                dispatch(setPetListings({ petListings: response.data }))
            } else {
                return rejectWithValue("No PetListing found. Create one now!")
            }
        } catch (error) {
            return rejectWithValue("Unable to load PetListings. Please try later.")
        }
    }
)


export const fetchPetListing = createAsyncThunk(
    "post/fetchListing",
    async (slug, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`posts/petlisting/${slug}/`)
            if (response.status === 200) {
                dispatch(setCurrentPetListing({ petListing: response.data }))
            } else {
                return rejectWithValue("This PetListing seems to be missing.")
            }
        } catch (error) {
            return rejectWithValue("Something went wrong. Please try again.")
        }
    }
)


export const updatePetListing = createAsyncThunk(
    "post/updatePetListing",
    async ({ slug, description }, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(`posts/petlisting/${slug}/`, { description })
            if (response.status === 200) {
                dispatch(setCurrentPetListing({ petListing: response.data }))
            } else {
                return rejectWithValue("Couldn't update PetListing. Please retry.")
            }
        } catch (error) {
            return rejectWithValue("Unable to make changes right now. Please try later.")
        }
    }
)


export const deletePetListing = createAsyncThunk(
    "post/deletePetListing",
    async (slug, {dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`posts/petlisting/${slug}/`,)
            if (response.status === 204) {
                dispatch(clearCurrentPetListing())
            } else {
                return rejectWithValue("Couldn't delete PetListing. Try again.")
            }
        } catch (error) {
            return rejectWithValue("Couldn’t complete the action. Please try later.")
        }
    }
)