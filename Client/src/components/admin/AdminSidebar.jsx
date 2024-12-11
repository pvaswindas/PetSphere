import React from "react"
import symbolLogo from "../../assets/logo/symbol-logo.png"
import adminLogoutIcon from "../../assets/icon/logout-icon.svg"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import axiosInstance from "../../axios/axiosinstance"
import { clearAdminProfile } from "../../redux/slices/AdminProfileSlice"

const AdminSidebar = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const email = useSelector((state) => state.admin.email)

    const handleLogout = async () => {
        const refresh_token = localStorage.getItem("ST_REFRESH_TOKEN")
        const response = await axiosInstance.post('accounts/logout/', { refresh_token, email })
        if (response.status === 200) {
            dispatch(clearAdminProfile())
            localStorage.removeItem("ST_ACCESS_TOKEN")
            localStorage.removeItem("ST_REFRESH_TOKEN")
            navigate('/admin/login')
        }
    }

    return (
        <div className="h-[650px] w-[80px] bg-deepOceanBlue hover:bg-deep-ocean-blue-gradient rounded-3xl flex flex-col items-center py-5">
            {/* Logo */}
            <div className="mb-6">
                <img src={symbolLogo} alt="petsphere" className="w-16"/>
            </div>

            {/* Navigation Icons */}
            <div className="flex-1 flex flex-col items-center space-y-6">

            </div>

            {/* Separator */}
            <hr className="w-12 mb-5" />

            {/* Logout Icon */}
            <button onClick={handleLogout} className="my-5">
                <img src={adminLogoutIcon} alt="" className="w-4" />
            </button>
        </div>
    )
}

export default AdminSidebar
