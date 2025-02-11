import { useSelector } from "react-redux"
import axiosInstance from "../axios/axiosinstance"
import { clearStore } from "../redux/store"

export const useLogout = () => {
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
            clearStore()
            localStorage.removeItem("ACCESS_TOKEN")
            localStorage.removeItem("REFRESH_TOKEN")
            return { success: true }
        } catch (error) {
            clearStore( )
            localStorage.removeItem("ACCESS_TOKEN")
            localStorage.removeItem("REFRESH_TOKEN")
            return { success: true }
        }
    }

    return logout
}

