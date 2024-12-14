import React from "react"
import WelcomeImage from "../../../assets/admin/admin-dashboard-welcome-card.svg"
import { useSelector } from "react-redux"

const WelcomeCard = () => {
    const admin = useSelector((state) => state.profile.profile_data)

    return (
        <div className="relative w-full h-24 lg:h-28 flex items-center justify-start bg-gray-100 my-4 lg:my-6 rounded-[2.5rem] shadow-md overflow-hidden">
            <div className="absolute inset-0">
                <img
                    src={WelcomeImage}
                    alt="Welcome Card"
                    className="w-full h-full object-cover object-center"
                    style={{ objectPosition: "center 45%" }}
                />
            </div>
            <div className="absolute text-blue-300 lg:text-white text-start ml-10">
                <h1 className="text-base lg:text-2xl font-bold">
                    Welcome Back, {admin?.user.name || "Admin"}!
                </h1>
                <p className="text-xs lg:text-sm">Here's what's happening in the platform</p>
            </div>
        </div>
    )
}

export default WelcomeCard
