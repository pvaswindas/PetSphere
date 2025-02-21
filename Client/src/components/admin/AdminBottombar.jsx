import React from 'react'
import { LayoutDashboard, Users, Newspaper, Flag, UserCog  } from "lucide-react"
import { useNavigate } from 'react-router-dom'

function AdminBottombar({ activeIcon }) {
    const navigate = useNavigate()

    const getIconClasses = (icon) =>
        `w-5 h-5 ${
            activeIcon === icon ? "text-blackOpacity70" : "text-gray-400"
        }`

    return (
        <div className='lg:hidden fixed bottom-0 left-0 right-0 h-10 sm:h-11 md:h-16 px-2 bg-white border-t border-gray-200'>
            <div className="flex justify-between items-center h-full px-4">
                <LayoutDashboard
                    className={getIconClasses("dashboard")}
                    onClick={() => navigate('/admin')}
                />
                <Users
                    className={getIconClasses("manage-users")}
                    onClick={() => navigate('/admin/manage/users')}
                />
                <Newspaper
                    className={getIconClasses("manage-updates")}
                    onClick={() => navigate('/admin/manage/updates')}
                />
                <Flag
                    className={getIconClasses("manage-reports")}
                    onClick={() => navigate('/admin')}
                />
                <UserCog
                    className={getIconClasses("admin-profile")}
                    onClick={() => navigate('/admin')}
                />
            </div>
        </div>
    )
}

export default AdminBottombar