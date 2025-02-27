import React, { useEffect, useState } from "react";
import { getAnnouncements } from "../../../api/announcements";
import AlertSnackbar from "../../Snackbar/AlertSnackbar";
import Shimmer from "../../Shimmer/Shimmer";

function AnnouncementsPanel({ setAnnouncementsAvailable }) {
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [alertType, setAlertType] = useState("error");

    const [isLoading, setIsLoading] = useState(true);
    const [announcements, setAnnouncements] = useState([]);

    const limitedData = announcements?.slice(0, 4);

    useEffect(() => {
        const fetchUpdates = async () => {
            setIsLoading(true);
            try {
                const response = await getAnnouncements();
                setAnnouncements(response.results);
                setAnnouncementsAvailable(response.results.length > 0)
            } catch (error) {
                setSnackbarMessage("Error fetching announcements");
                setAlertType("error");
                setSnackbarOpen(true);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUpdates();
    }, [setAnnouncementsAvailable]);

    return (
        <div className="news-panel flex flex-col gap-2 my-5 overflow-hidden">
            <AlertSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                alert_type={alertType}
                onClose={() => setSnackbarOpen(false)}
            />
            <h2 className="text-sm font-medium text-blackOpacity85">Updates</h2>
            <hr className="border border-lightTextGreyOpacity30" />

            {/* Show shimmer when loading */}
            {isLoading ? (
                <div className="flex flex-col gap-4">
                    {[...Array(2)].map((_, index) => (
                        <div key={index} className="flex items-center space-x-4">
                            <Shimmer className="w-10 h-10 rounded-full" />
                            <div className="flex flex-col space-y-2">
                                <Shimmer className="w-32 h-4 rounded" />
                                <Shimmer className="w-48 h-3 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : announcements?.length === 0 ? (
                <div className="flex items-center justify-center h-[160px]">
                    <p className="text-center text-sm text-darkDenimBlue">
                        Currently there are no announcements available.
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-7 h-[350px] py-2 px-1 overflow-y-auto">
                    <ul className="space-y-5 my-2">
                        {limitedData?.map((item) => (
                            <li key={item?.id} className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={item?.icon}
                                        alt={`${item?.title} icon`}
                                        className="w-10 h-10 rounded-full object-cover border border-gray-300"
                                    />
                                    <div>
                                        <p className="font-medium text-sm">{item?.title}</p>
                                        <p className="text-xs text-gray-500 max-w-[160px] break-words">
                                            {item?.content}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default AnnouncementsPanel;
