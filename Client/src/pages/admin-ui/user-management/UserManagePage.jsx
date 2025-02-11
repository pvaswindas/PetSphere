import React, { useState } from 'react'
import AdminLayout from '../../../components/admin/AdminLayout'
import UserManager from '../../../components/admin/manage-users/UserManager'

function UserManagePage() {
    const [activeIcon, setActiveIcon] = useState("manage-users")
    
    return (
        <AdminLayout activeIcon={activeIcon} setActiveIcon={setActiveIcon}>
            <UserManager />
        </AdminLayout>
    )
}

export default UserManagePage