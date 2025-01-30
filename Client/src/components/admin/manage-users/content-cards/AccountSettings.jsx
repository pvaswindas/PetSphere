import React from 'react';
import { Switch } from '@headlessui/react';
import { updateAccountDetails } from '../../../../utils/admin-utils/accountRetrieveUpdate';

function AccountSettings({
    profile,
    setSnackbarMessage,
    setSnackbarOpen,
    setSnackbarAlertType,
    fetchUser
}) {
    const handleSellerStatusChange = async () => {
        try {
            await updateAccountDetails(profile.user.id, {IsSeller: !profile.IsSeller});
            fetchUser();
            setSnackbarMessage("Seller status updated!")
            setSnackbarAlertType("success")
            setSnackbarOpen(true)
        } catch (error) {
            setSnackbarMessage("Failed to change seller status");
            setSnackbarAlertType("error")
            setSnackbarOpen(true);
        }
    };

    const handleDeactivateChange = async () => {
        try {
            await updateAccountDetails(profile.user.id, {is_active: !profile.user.is_active});
            fetchUser();
            if (profile.user.is_active) {
                setSnackbarMessage("Account has been deactivated");
            } else {
                setSnackbarMessage("Account has been reactivated");
            }
            setSnackbarAlertType("success")
            setSnackbarOpen(true);
        } catch (error) {
            setSnackbarMessage("Failed to change seller status");
            setSnackbarAlertType("error")
            setSnackbarOpen(true);
        }
    };

    return (
        <div className="bg-softSkyBlue lg:bg-white lg:shadow-lg rounded-xl p-4 h-64 lg:hover:shadow-xl transition-shadow duration-300">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-md font-semibold text-gray-800">
                    Account Settings
                </h2>
            </div>
            <div className="text-sm space-y-4">
                {/* Privacy Row */}
                <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-600">Privacy:</span>
                    <p>
                        {profile?.is_private ? "Private" : "Public"}
                    </p>
                </div>

                {/* Seller Status Row */}
                <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-600">Seller Status:</span>
                    <Switch
                        checked={profile?.IsSeller}
                        onChange={() => handleSellerStatusChange(profile.user)}
                        className="group relative flex h-5 w-8 cursor-pointer rounded-full bg-softSkyBlue
                            p-1 transition-colors duration-200 ease-in-out focus:outline-none 
                            data-[focus]:outline-1 data-[focus]:outline-softSkyBlue 
                            data-[checked]:bg-pastelBlue"
                    >
                        <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block size-3 translate-x-0 rounded-full
                                ${profile.IsSeller ? "bg-softSkyBlue" : "bg-pastelBlue"} ring-0 shadow-lg transition
                                duration-200 ease-in-out group-data-[checked]:translate-x-3`}
                        />
                    </Switch>
                </div>

                {/* Account Status Row */}
                <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-600">Account Status:</span>
                    <Switch
                        checked={profile?.user.is_active}
                        onChange={() => handleDeactivateChange(profile.user)}
                        className="group relative flex h-5 w-8 cursor-pointer rounded-full bg-softSkyBlue
                            p-1 transition-colors duration-200 ease-in-out focus:outline-none 
                            data-[focus]:outline-1 data-[focus]:outline-softSkyBlue 
                            data-[checked]:bg-pastelBlue"
                    >
                        <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block size-3 translate-x-0 rounded-full
                                ${profile?.user.is_active ? "bg-softSkyBlue" : "bg-pastelBlue"} ring-0 shadow-lg transition
                                duration-200 ease-in-out group-data-[checked]:translate-x-3`}
                        />
                    </Switch>
                </div>
            </div>
        </div>
    );
}

export default AccountSettings;
