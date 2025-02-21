import React from 'react'
import AdminLayout from '../../../components/admin/AdminLayout'
import UserView from '../../../components/admin/manage-users/UserView'

function UserDetailedViewPage() {
    const activeIcon = "manage-users"
    
    return (
        <AdminLayout activeIcon={activeIcon} >
            <UserView />
        </AdminLayout>
    )
}

export default UserDetailedViewPage