import React from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import AnnouncementContent from "../../../components/admin/manage-updates/AnnouncementContent";


const AnnouncementsManager = () => {
    const activeIcon = "manage-updates"
    
    return (
        <AdminLayout
            activeIcon={activeIcon}
            pageTitle={"Manage Feed Announcements"}
            pageDescription={"Add announcements for users to stay engaged and informed."}
        >
            <AnnouncementContent />
        </AdminLayout>
    )
}

export default AnnouncementsManager