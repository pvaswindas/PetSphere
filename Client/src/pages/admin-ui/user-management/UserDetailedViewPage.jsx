import React, { useState } from 'react'
import AdminLayout from '../../../components/admin/AdminLayout'
import UserView from '../../../components/admin/manage-users/UserView'

function UserDetailedViewPage() {
    const [activeIcon, setActiveIcon] = useState("manage-users")
    
    return (
        <AdminLayout activeIcon={activeIcon} setActiveIcon={setActiveIcon}>
            <UserView />
        </AdminLayout>
    )
}

export default UserDetailedViewPage