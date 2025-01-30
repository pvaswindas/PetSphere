import React, { useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import AnnouncementContent from "../../../components/admin/manage-updates/AnnouncementContent";


const AnnouncementsManager = () => {
    const [activeIcon, setActiveIcon] = useState("manage-updates")
    
    return (
        <AdminLayout activeIcon={activeIcon} setActiveIcon={setActiveIcon}>
            <AnnouncementContent />
        </AdminLayout>
    )
}

export default AnnouncementsManager