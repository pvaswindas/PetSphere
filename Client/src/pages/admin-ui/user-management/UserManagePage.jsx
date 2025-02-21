import React, { useState } from 'react'
import AdminLayout from '../../../components/admin/AdminLayout'
import UserManager from '../../../components/admin/manage-users/UserManager'

function UserManagePage() {
    const activeIcon = "manage-users"
    const [buttonText, setButtonText] = useState("Admins")
    const [handleButton, setHandleButton] = useState(null)
    
    return (
        <AdminLayout
            activeIcon={activeIcon}
            pageTitle={"Manage Accounts"}
            pageDescription={"Manage accounts, roles, and permissions effortlessly."}
            actionButton={buttonText}
            buttonAction={handleButton}
        >
            <UserManager setButtonText={setButtonText} setHandleButton={setHandleButton} />
        </AdminLayout>
    )
}

export default UserManagePage