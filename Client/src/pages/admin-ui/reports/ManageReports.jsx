import React, { useState } from 'react'
import AdminLayout from '../../../components/admin/AdminLayout'

function ManageReports() {
    const activeIcon = "manage-reports";
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    return (
        <AdminLayout
            activeIcon={activeIcon}
            pageTitle={"Reports & Flags"}
            pageDescription={"Review and manage user-reported content to ensure community guidelines are upheld."}
        >

        </AdminLayout>
    )
}

export default ManageReports