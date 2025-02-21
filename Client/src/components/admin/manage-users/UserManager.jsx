import React, { useCallback, useEffect, useState } from 'react';
import AlertSnackbar from '../../Snackbar/AlertSnackbar';
import UserManagementTable from './UserManagementTable';
import { fetchAdminAccounts, fetchUserAccounts } from '../../../utils/admin-utils/retrieveAccounts';
import AdminManagementTable from './AdminManagementTable';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { reinstateUserAccount, suspendUserAccount } from '../../../utils/admin-utils/userActions';

function UserManager({ setButtonText, setHandleButton }) {
    const [currentSection, setCurrentSection] = useState("users");

    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [alertType, setAlertType] = useState("error");
    const [users, setUsers] = useState([]);
    const [staffs, setStaffs] = useState([]);

    const [nextLink, setNextLink] = useState(null)
    const [previousLink, setPreviousLink] = useState(null)

    const [editUser, setEditUser] = useState(null);

    const [page, setPage] = useState(1);
    
    const pageSize = 10

    const toggleSection = () => {
        setCurrentSection((prev) => (prev === "admins" ? "users" : "admins"));
        setPage(1);
    };

    useEffect(() => {
        setButtonText(currentSection === "users" ? "Admins" : "Users")
        setHandleButton(() => toggleSection)
    }, [currentSection, setButtonText, setHandleButton])

    const fetchUsers = useCallback(async (query) => {
        try {
            const response = await fetchUserAccounts(query, page, pageSize)
            setNextLink(response.links.next)
            setPreviousLink(response.links.previous)
            setUsers(response.results)
        } catch (error) {
            setSnackbarMessage("Error fetching users")
            setAlertType("error")
            setSnackbarOpen(true)
        }
    }, [page, pageSize])

    const fetchStaffs = useCallback(async (query) => {
        try {
            const response = await fetchAdminAccounts(query, page, pageSize)
            setNextLink(response.links.next)
            setPreviousLink(response.links.previous)
            setStaffs(response.results)
        } catch (error) {
            setSnackbarMessage("Error fetching users")
            setAlertType("error")
            setSnackbarOpen(true)
        }
    }, [page, pageSize])

    const handleSuspendUser = async () => {
        try {
            if (editUser.is_suspended) {
                await reinstateUserAccount(editUser.id)
            } else {
                await suspendUserAccount(editUser.id)
            }
            await fetchUsers()
            setSnackbarMessage("Action is successful")
            setAlertType("success")
            setSnackbarOpen(true)
        } catch (error) {
            snackbarMessage("Error suspending user!")
            setAlertType("error")
            setSnackbarOpen(true)
        } finally {
            setEditUser(null)
        }
    }

    useEffect(() => {
        if (currentSection === "users") {
            fetchUsers();
        } else {
            fetchStaffs();
        }
    }, [currentSection, fetchUsers, fetchStaffs]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    }

    return (
        <div>
            <AlertSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                alert_type={alertType}
                onClose={() => setSnackbarOpen(false)}
            />
            {/* Content Section */}

            {currentSection === "users" && (
                <UserManagementTable
                    users={users}
                    setEditUser={setEditUser}
                    editUser={editUser}
                    handleSuspendUser={handleSuspendUser}
                />
            )}

            {currentSection === "admins" && <AdminManagementTable superusers={staffs} />}

            {/* Pagination Controls */}
            {(previousLink || nextLink) && (
                <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center justify-between w-full max-w-xs mx-auto">
                        {previousLink ? (
                            <button
                                type="button"
                                className="p-2 rounded bg-gray-200 hover:bg-gray-300"
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                            >
                                <ChevronLeft size={15} />
                            </button>
                        ) : (
                            <div className="w-8"></div>
                        )}
                        <span className="flex-grow text-center text-sm text-deepOceanBlue">Page {page}</span>

                        {nextLink ? (
                            <button
                                type="button"
                                className="p-2 rounded bg-gray-200 hover:bg-gray-300"
                                onClick={() => handlePageChange(page + 1)}
                            >
                                <ChevronRight size={15} />
                            </button>
                        ) : (
                            <div className="w-8"></div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserManager;
