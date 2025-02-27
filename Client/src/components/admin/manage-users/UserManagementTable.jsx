import React, { useState } from "react";
import { formatDate } from "../../../utils/admin-utils/formatDate";
import { MoreVertical } from "lucide-react";
import { Switch } from "@headlessui/react";
import ActionsModal from "../common/ActionsModal";
import ConfirmModal from "../common/ConfirmModal";
import { useNavigate } from "react-router-dom";

const UserManagementTable = (
    { users, setEditUser, editUser, handleSuspendUser }
) => {
    const [showModal, setShowModal] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewUser, setViewUser] = useState(null)


    const navigate = useNavigate()


    const toggleActionModal = (userId) => {
        (showModal ?
            setViewUser(null)
            :
            setViewUser(userId)
        )
        setShowModal((prev) => !prev);
    }
    const toggleConfirmModal = () => {
        setIsModalOpen((prev) => !prev)
    }


    const handleSwitchChange = (user) => {
        setEditUser(user);
        toggleConfirmModal();
    }

    return (
        <div className="min-h-[440px] pb-24 lg:pb-16">
            <table className="min-w-full border-separate text-sm text-darkDenimBlue70" style={{ borderSpacing: "0 10px" }}>
                <thead className="bg-white shadow-sm font-light overflow-x-auto rounded-lg">
                    <tr>
                        <th className="px-6 py-2 text-left rounded-l-lg">Name</th>
                        <th className="px-6 py-2 hidden lg:flex text-left">Role</th>
                        <th className="px-6 py-2 text-left">Joined Date</th>
                        <th className="px-6 py-2 text-left">Suspend</th>
                        <th className="px-6 py-2 text-center rounded-r-lg"></th>
                    </tr>
                </thead>
                <tbody>
                    {users?.map((profile, index) => (
                        <tr
                            key={index}
                            className="rounded-lg shadow-sm bg-gray-50"
                        >
                            <td className="px-6 py-3">
                                <div className="flex flex-col p-0 m-0">
                                    <span className="font-medium text-midnightBlue">{profile.user.name}</span>
                                    <span className="text-xs">@{profile.user.username}</span>
                                </div>
                            </td>
                            <td className="px-6 py-3 hidden lg:flex">
                                {profile.IsSeller && (
                                    <span
                                        className="bg-amber-100 border-2 border-amber-300 text-amber-500
                                        px-4 py-1 rounded-full font-medium me-1"
                                    >
                                        Seller
                                    </span>
                                )}
                                {profile.IsSubscribed ? 
                                    (
                                        <span
                                            className="bg-teal-100 border-2 border-teal-300 text-teal-500
                                                px-4 py-1 rounded-full font-medium"
                                        >
                                            Subscriber
                                        </span>
                                    ) : (
                                        <span
                                            className="bg-purple-100 border-2 border-purple-300 text-purple-500
                                                px-4 py-1 rounded-full font-medium"
                                        >
                                            User
                                        </span>
                                    )
                                }
                                    
                            </td>
                            <td className="px-6 py-3 align-middle">
                                {formatDate(profile.user.date_joined)}
                            </td>
                            <td className="px-6 py-3 align-middle">
                                <Switch
                                    checked={profile.user.is_suspended}
                                    onChange={() => handleSwitchChange(profile.user)}
                                    className="group relative flex h-6 w-11 cursor-pointer rounded-full bg-softSkyBlue
                                        p-1 transition-colors duration-200 ease-in-out focus:outline-none 
                                        data-[focus]:outline-1 data-[focus]:outline-softSkyBlue 
                                        data-[checked]:bg-pastelBlue"
                                >
                                    <span
                                        aria-hidden="true"
                                        className={`pointer-events-none inline-block size-4 translate-x-0 rounded-full
                                            ${profile.user.is_suspended ? "bg-softSkyBlue" : "bg-pastelBlue"} ring-0 shadow-lg transition
                                            duration-200 ease-in-out group-data-[checked]:translate-x-5`}
                                    />
                                </Switch>
                            </td>
                            <td className="px-6 py-3 align-middle flex justify-center items-center">
                                <MoreVertical 
                                    className="w-4 h-4 cursor-pointer"
                                    onClick={() => toggleActionModal(profile.user.id)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ActionsModal isOpen={showModal} onClose={toggleActionModal}>
                <ul className="text-center text-darkDenimBlue70">
                    <li
                        className="hover:text-darkDenimBlue p-3 rounded cursor-pointer"
                        onClick={() => navigate(`/admin/manage/users/view/${viewUser}`)}
                    >
                        View
                    </li>
                </ul>
            </ActionsModal>
            <ConfirmModal
                isOpen={isModalOpen} 
                onClose={toggleConfirmModal}
                onConfirm={handleSuspendUser}
                title={editUser?.is_suspended ? "Reinstate User" : "Suspend User"}
                description={
                    editUser?.is_suspended
                        ? "Are you sure you want to reinstate this user?"
                        : "Are you sure you want to suspend this user?"
                }
                actionText={editUser?.is_suspended ? "Reinstate" : "Suspend"}
            />
        </div>
    );
};

export default UserManagementTable;

