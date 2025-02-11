import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosinstance";
import Swal from "sweetalert2";
import { clearCurrentPawstory, setCurrentPawstory, setPosts } from "../slices/PostSlice";

export const fetchPawstories = createAsyncThunk(
    "posts/fetchPawstories",
    async (username, { dispatch, rejectWithValue }) => {
        try {
            const params = username ? {username} : {}
            const response = await axiosInstance.get("posts/", {params})
            if (response.status === 204) {
                dispatch(setPosts({ pawstories: [] }))
            } else if (response.status === 200) {
                dispatch(setPosts({ pawstories: response.data }))
            } else {
                return rejectWithValue("No PawStories found. Create one now!")
            }
        } catch (error) {
            return rejectWithValue("Unable to load PawStories. Please try later.")
        }
    }
)


export const fetchPawstory = createAsyncThunk(
    "post/fetchPawstory",
    async (slug, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`posts/${slug}/`)
            if (response.status === 200) {
                dispatch(setCurrentPawstory({ currentPawstory: response.data }))
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

export const ClearCurrentPawStoryThunk = createAsyncThunk(
    "post/ClearCurrentPawStory",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            dispatch(clearCurrentPawstory)
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)


export const updatePawstory = createAsyncThunk(
    "post/updatePawstory",
    async ({ slug, data }, { dispatch, rejectWithValue }) => {
        console.log(data);
        
        try {
            const response = await axiosInstance.patch(`posts/${slug}/`, data)
            if (response.status === 200) {
                dispatch(setCurrentPawstory({ currentPawstory: response.data }))
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


export const deletePawstory = createAsyncThunk(
    "post/deletePawstory",
    async (slug, {dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`posts/${slug}/`,)
            if (response.status === 204) {
                dispatch(clearCurrentPawstory())
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