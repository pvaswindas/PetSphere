import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosinstance";
import Swal from "sweetalert2";
import { setCurrentPetListing, clearCurrentPetListing, setPetListings, clearsetPetListings } from "../slices/PetListingSlice";

export const fetchPetListings = createAsyncThunk(
    "posts/fetchPawstories",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("posts/petlisting")
            if (response.status === 204) {
                dispatch(clearsetPetListings())
            } else if (response.status === 200) {
                dispatch(setPetListings({ petListings: response.data }))
            } else {
                return rejectWithValue("No PetListing found. Create one now!")
            }
        } catch (error) {
            return rejectWithValue("Unable to load PawStories. Please try later.")
        }
    }
)


export const fetchCurrentPetListing = createAsyncThunk(
    "post/fetchPawstory",
    async (slug, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`posts/${slug}/`)
            if (response.status === 200) {
                dispatch(setCurrentPetListing({ currentPawstory: response.data }))
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "This PawStory seems to be missing.",
                    position: "top",
                    toast: true,
                    timer: 3000,
                    showConfirmButton: false,
                    customClass: {
                        popup: "swal-popup",
                    },
                })
                return rejectWithValue("This PawStory seems to be missing.")
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong. Please try again.",
                position: "top",
                toast: true,
                timer: 3000,
                showConfirmButton: false,
                customClass: {
                    popup: "swal-popup",
                },
            })
            return rejectWithValue("Something went wrong. Please try again.")
        }
    }
)


export const updateCurrentPetListing = createAsyncThunk(
    "post/updatePawstory",
    async ({ slug, content }, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(`posts/${slug}/`, { content })
            if (response.status === 200) {
                dispatch(setCurrentPetListing({ currentPawstory: response.data }))
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Couldn't update PawStory. Please retry.",
                    position: "top",
                    toast: true,
                    timer: 3000,
                    showConfirmButton: false,
                    customClass: {
                        popup: "swal-popup",
                    },
                });
                return rejectWithValue("Couldn't update PawStory. Please retry.")
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Unable to make changes right now. Please try later.",
                position: "top",
                toast: true,
                timer: 3000,
                showConfirmButton: false,
                customClass: {
                    popup: "swal-popup",
                },
            });
            return rejectWithValue("Unable to make changes right now. Please try later.")
        }
    }
)


export const deleteCurrentPetListing = createAsyncThunk(
    "post/deletePawstory",
    async (slug, {dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`posts/${slug}/`,)
            if (response.status === 204) {
                dispatch(clearCurrentPetListing())
                Swal.fire({
                    icon: "success",
                    title: "Post deleted",
                    text: "PawStory deleted successfully.",
                    position: "top",
                    toast: true,
                    timer: 3000,
                    showConfirmButton: false,
                    customClass: {
                        popup: "swal-popup",
                    },
                })
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Couldn't delete PawStory. Try again.",
                    position: "top",
                    toast: true,
                    timer: 3000,
                    showConfirmButton: false,
                    customClass: {
                        popup: "swal-popup",
                    },
                })
                return rejectWithValue("Couldn't delete PawStory. Try again.")
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Couldn’t complete the action. Please try later.",
                position: "top",
                toast: true,
                timer: 3000,
                showConfirmButton: false,
                customClass: {
                    popup: "swal-popup",
                },
            })
            return rejectWithValue("Couldn’t complete the action. Please try later.")
        }
    }
)