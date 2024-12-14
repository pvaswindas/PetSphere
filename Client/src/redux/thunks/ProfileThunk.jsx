import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosinstance";
import Swal from "sweetalert2";
import { setProfile } from "../slices/ProfileSlice";

export const fetchProfile = createAsyncThunk(
    "profile/fetchProfile",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("user/profile/")
            if (response.status === 200) {
                dispatch(setProfile({ profile_data: response.data }))
            } else {
                throw new Error("Failed to fetch profile")
            }
            } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Error Fetching Profile",
                position: "top",
                toast: true,
                timer: 3000,
                showConfirmButton: false,
                customClass: {
                popup: "swal-popup",
                },
            })
            return rejectWithValue("Error Fetching Profile")
        }
    }
)