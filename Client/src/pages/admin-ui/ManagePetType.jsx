import React, { useState } from "react"
import AdminLayout from "../../components/admin/AdminLayout"
import FlexiCard from "./FlexiCard"

const ManagePetType = () => {
    const [activeIcon, setActiveIcon] = useState("manage-pet-type")

    return (
        <AdminLayout activeIcon={activeIcon} setActiveIcon={setActiveIcon}>
            {/* Content Section */}
            <div className="flex flex-col my-4">
                <h1 className="text-xl lg:text-2xl font-medium text-midnightBlue">Manage Pet Types</h1>
                <p className="text-xs mb-2 text-midnightBlue opacity-50">
                    Organize pet types and breeds for accurate listings and easy navigation.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FlexiCard />
                <FlexiCard />
            </div>
        </AdminLayout>
    )
}

export default ManagePetType
