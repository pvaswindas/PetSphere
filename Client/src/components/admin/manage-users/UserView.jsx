import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { retrieveAccountDetails } from "../../../utils/admin-utils/accountRetrieveUpdate";
import AlertSnackbar from "../../Snackbar/AlertSnackbar";
import PersonalInfo from "./content-cards/PersonalInfo";
import AccountSettings from "./content-cards/AccountSettings";
import ActivityOverview from "./content-cards/ActivityOverview";
import OtherDetails from "./content-cards/OtherDetails";

function UserView() {
    const { userId } = useParams();

    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarAlertType, setSnackbarAlertType] = useState("error");

    const [profile, setProfile] = useState(null);

    const fetchUser = useCallback(async () => {
        try {
            const response = await retrieveAccountDetails(userId);
            setProfile(response.data);
        } catch (error) {
            setSnackbarMessage("Error fetching user data");
            snackbarAlertType("error")
            setSnackbarOpen(true);
        }
    }, [userId, snackbarAlertType]);

    useEffect(() => {
        fetchUser();
    }, [userId, fetchUser]);

    return (
        <div className="px-4 lg:px-6 py-6">
            <AlertSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                alert_type={snackbarAlertType}
                onClose={() => setSnackbarOpen(false)}
            />
            {profile ? (
                <div className="max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-5 mx-auto">
                    {/* Personal & Contact Information */}
                    <PersonalInfo 
                        profile={profile} 
                        setSnackbarMessage={setSnackbarMessage} 
                        setSnackbarOpen={setSnackbarOpen}
                        setSnackbarAlertType={setSnackbarAlertType}
                        fetchUser={fetchUser}
                    />

                    {/* Account Settings */}
                    <AccountSettings
                        profile={profile} 
                        setSnackbarMessage={setSnackbarMessage} 
                        setSnackbarOpen={setSnackbarOpen}
                        setSnackbarAlertType={setSnackbarAlertType}
                        fetchUser={fetchUser}
                    />

                    {/* Activity Overview */}
                    <ActivityOverview profile={profile} />

                    {/* Other Details */}
                    <OtherDetails profile={profile} />
                </div>
            ) : (
                <div className="flex h-96 justify-center items-center text-md font-medium text-gray-500">
                    <p>User data not found</p>
                </div>
            )}
        </div>
    );
}

export default UserView;
