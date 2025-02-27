import React from "react";
import { formatDate } from "../../../utils/admin-utils/formatDate";
import { MoreVertical } from "lucide-react";

const AdminManagementTable = ({ superusers }) => {

    return (
        <div className="min-h-[440px]">
            <table className="min-w-full border-separate text-sm text-darkDenimBlue70" style={{ borderSpacing: "0 10px" }}>
                <thead className="bg-white shadow-sm font-light overflow-x-auto rounded-lg">
                    <tr>
                        <th className="px-6 py-2 text-left rounded-l-lg">Name</th>
                        <th className="px-6 py-2 hidden lg:flex text-left">Role</th>
                        <th className="px-6 py-2 text-left">Staff Since</th>
                    </tr>
                </thead>
                <tbody>
                    {superusers?.map((profile, index) => (
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
                                {profile.user.is_superuser && (
                                    <span
                                        className="bg-red-100 border-2 border-red-300 text-red-500
                                        px-4 py-1 rounded-full font-medium me-1"
                                    >
                                        Admin
                                    </span>
                                )}
                                <span
                                    className="bg-blue-100 border-2 border-blue-300 text-blue-500
                                        px-4 py-1 rounded-full font-medium"
                                >
                                    Staff
                                </span>
                            </td>
                            <td className="px-6 py-3 align-middle">
                                {formatDate(profile.user.date_joined)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminManagementTable;