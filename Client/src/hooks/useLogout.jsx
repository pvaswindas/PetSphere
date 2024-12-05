import { useDispatch, useSelector } from "react-redux"
import axiosInstance from "../axios/axiosinstance"
import { useNavigate } from "react-router-dom"
import { clearProfile } from "../redux/slices/ProfileSlice"

export const useLogout = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const email = useSelector((state) => state.profile.email)
    const refresh_token = localStorage.getItem("REFRESH_TOKEN")

    const logout = async () => {
        try {
            if (!refresh_token) {
                throw new Error("Refresh token is missing")
            }
            if (!email) {
                throw new Error("Email is missing")
            }

            await axiosInstance.post('accounts/logout/', { refresh_token, email })
            dispatch(clearProfile())
            localStorage.removeItem("ACCESS_TOKEN")
            localStorage.removeItem("REFRESH_TOKEN")
            navigate('/login')
        } catch (error) {
            console.error("Logout failed:", error.message)
        }
    }

    return logout
}

