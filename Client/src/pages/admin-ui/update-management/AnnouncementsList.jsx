import React, { useCallback, useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { ChevronLeft, ChevronRight, SquarePen, Trash } from "lucide-react";
import { deleteAnnouncement, getAnnouncements, updateAnnouncement } from "../../../api/announcements";
import AlertSnackbar from "../../../components/Snackbar/AlertSnackbar";
import { formatDateTime } from "../../../utils/admin-utils/formatDate";
import { useSelector } from "react-redux";
import ConfirmModal from "../../../components/admin/common/ConfirmModal";
import EditModal from "../../../components/admin/common/EditModal";
import Shimmer from "../../../components/Shimmer/Shimmer";


const AnnouncementsList = () => {
    const activeIcon = "manage-updates"

    const search = useSelector((state) => state.adminSearch.search)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [alertType, setAlertType] = useState("error")

    const [page, setPage] = useState(1)

    const [currentUpdate, setCurrentUpdate] = useState(null)

    const [nextLink, setNextLink] = useState(null)
    const [previousLink, setPreviousLink] = useState(null)

    const [announcements, setAnnouncements] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const toggleConfirmModal = (update=null) => {
        setIsModalOpen((prev) => !prev)
        setCurrentUpdate(update)
    }

    const toggleEditModal = (update=null) => {
        setIsEditModalOpen((prev) => !prev);
        setCurrentUpdate(update);
    };

    const handleEditAnnouncement = async (updatedData) => {
        try {
            await updateAnnouncement(currentUpdate.id, updatedData);
            fetchUpdates();
            setSnackbarMessage("Successfully updated announcement");
            setAlertType("success");
            setSnackbarOpen(true);
        } catch (error) {
            setSnackbarMessage("Error updating announcement");
            setAlertType("error");
            setSnackbarOpen(true);
        }
    };

    const setResponses = (response) => {
        setNextLink(response.next)
        setPreviousLink(response.previous)
        setAnnouncements(response.results);
    }

    const fetchUpdates = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getAnnouncements(null, search !== "" ? search : null);
            setResponses(response);
        } catch (error) {
            setSnackbarMessage("Error fetching announcements");
            setAlertType("error");
            setSnackbarOpen(true);
        } finally {
            setIsLoading(false);
        }
    }, [search]);

    useEffect(() => {
        fetchUpdates();
    }, [fetchUpdates]);

    const nextPage = async () => {
        if (!nextLink) return;
        setIsLoading(true);
        try {
            const response = await getAnnouncements(nextLink);
            setPage(page + 1);
            setResponses(response);
        } catch (error) {
            setSnackbarMessage("Error fetching next page");
            setAlertType("error");
            setSnackbarOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    const previousPage = async () => {
        if (!previousLink) return;
        setIsLoading(true);
        try {
            const response = await getAnnouncements(previousLink);
            setPage(page - 1);
            setResponses(response);
        } catch (error) {
            setSnackbarMessage("Error fetching previous page");
            setAlertType("error");
            setSnackbarOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAnnouncement = async () => {
        if (!currentUpdate) return
        try {
            await deleteAnnouncement(currentUpdate.id)
            fetchUpdates()
            setSnackbarMessage("Succesfully deleted announcement")
            setAlertType("success")
            setSnackbarOpen(true)
        } catch (error) {
            setSnackbarMessage("Error deleting announcement")
            setAlertType("error")
            setSnackbarOpen(true)
        }
    }

    return (
        <AdminLayout
            activeIcon={activeIcon}
            pageTitle={"Manage Feed Announcements"}
            pageDescription={"Add or change announcements for users to stay engaged and informed."}
        >
            <div className="pb-10 lg:pb-0">
                <AlertSnackbar
                    open={snackbarOpen}
                    message={snackbarMessage}
                    alert_type={alertType}
                    onClose={() => setSnackbarOpen(false)}
                />
                {isLoading ? (
                    <div className="flex flex-col gap-4">
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className="flex items-center space-x-4">
                                <Shimmer className="w-10 h-10 rounded-full" />
                                <div className="flex flex-col space-y-2">
                                    <Shimmer className="w-32 h-4 rounded" />
                                    <Shimmer className="w-48 h-3 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : announcements.length > 0 ? (
                    <div>
                        <table className="min-w-full border-separate text-sm text-darkDenimBlue70" style={{ borderSpacing: "0 10px" }}>
                            <thead className="bg-white shadow-sm font-light overflow-x-auto rounded-lg">
                                <tr>
                                    <th className="px-6 py-2 text-left rounded-l-lg">Announcement</th>
                                    <th className="px-6 py-2 text-left">Created Date</th>
                                    <th className="px-6 py-2 text-center rounded-r-lg"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {announcements?.map((update, index) => (
                                    <tr key={index} className="rounded-lg shadow-sm bg-gray-50">
                                        <td className="flex items-start gap-2 px-6 py-3">
                                            <img src={update?.icon} alt={update?.title} className="w-10 h-10 rounded-full" />
                                            <div>
                                                <p className="font-medium text-sm">{update?.title}</p>
                                                <p className="text-xs text-gray-500 max-w-[250px] break-words">{update?.content}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 align-middle">
                                            <p className="font-medium text-midnightBlue">{formatDateTime(update?.created_at)}</p>
                                        </td>
                                        <td className="flex gap-2 px-6 py-3 align-middle">
                                            <SquarePen className="w-4 h-4 cursor-pointer text-gray-700" onClick={() => toggleEditModal(update)} />
                                            <Trash className="w-4 h-4 cursor-pointer text-red-700" onClick={() => toggleConfirmModal(update)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-sm mt-40 text-darkDenimBlue">No announcements available.</p>
                )}
                <ConfirmModal
                    isOpen={isModalOpen} 
                    onClose={toggleConfirmModal}
                    onConfirm={handleDeleteAnnouncement}
                    title={"Delete Announcement"}
                    description={"Are you sure you want to delete this announcement?"}
                    actionText={"Delete"}
                />
                <EditModal
                    isOpen={isEditModalOpen}
                    onClose={toggleEditModal}
                    onSave={handleEditAnnouncement}
                    announcement={currentUpdate} 
                />
            </div>
        </AdminLayout>
    )
}

export default AnnouncementsList