import React, { useEffect, useState } from "react";
import DashboardWelcome from "../../../assets/admin/dashboardcard.svg";
import { TrendingUp, TrendingDown } from "lucide-react";
import AlertSnackbar from "../../Snackbar/AlertSnackbar";
import defaultAvatar from "../../../assets/icon/user-avatar.svg";
import { getLatestTeamMembers } from "../../../api/insights";
import Shimmer from "../../Shimmer/Shimmer";

const InsightCard = () => {
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [teamMembers, setTeamMembers] = useState([]);

    useEffect(() => {
        const fetchLatestTeamMembers = async () => {
            setIsLoading(true);
            try {
                const response = await getLatestTeamMembers();
                setTeamMembers(response.data || []);
            } catch (error) {
                setSnackbarMessage("Error fetching latest team members!");
                setSnackbarOpen(true);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLatestTeamMembers();
    }, []);

    return (
        <div className="bg-softSkyBlue shadow-lg flex flex-col items-center justify-center rounded-3xl p-4 w-full">
            <AlertSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                alert_type="error"
                onClose={() => setSnackbarOpen(false)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-4 w-full max-w-5xl">
                {/* Reports Card */}
                <div className="bg-white w-full max-w-xs rounded-3xl flex flex-col justify-between transition-transform duration-300 hover:scale-105 p-4">
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="text-blue-500 font-medium">
                                <h1 className="text-sm md:text-base">Suspicious</h1>
                                <p className="text-xs text-gray-400">Scam Listings</p>
                            </div>
                            {isLoading ? (
                                <Shimmer className="w-10 h-6 rounded-full" />
                            ) : (
                                <span className="bg-blue-100 text-blue-500 px-3 py-1 text-xs font-medium rounded-full">
                                    14
                                </span>
                            )}
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-purple-500 font-medium">
                                <h1 className="text-sm md:text-base">Plagiarism</h1>
                                <p className="text-xs text-gray-400">Copied Stories</p>
                            </div>
                            {isLoading ? (
                                <Shimmer className="w-10 h-6 rounded-full" />
                            ) : (
                                <span className="bg-purple-100 text-purple-500 px-3 py-1 text-xs font-medium rounded-full">
                                    6
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* New Team Members Card */}
                <div
                    className="w-full max-w-xs rounded-3xl bg-cover bg-center transition-transform duration-300 hover:scale-105 relative p-3"
                    style={{ backgroundImage: `url(${DashboardWelcome})` }}
                >
                    <div className="flex -space-x-2">
                        {isLoading ? (
                            [...Array(4)].map((_, index) => (
                                <Shimmer key={index} className="w-10 h-10 rounded-full" />
                            ))
                        ) : (
                            teamMembers?.slice(0, 4).map((member, index) => (
                                <span
                                    key={member.id || `member-${index}`}
                                    className="w-10 h-10 rounded-full"
                                    style={{
                                        left: `${index * 30}px`,
                                        backgroundImage: `url(${member?.profile_picture ? member?.profile_picture : defaultAvatar})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                ></span>
                            ))
                        )}
                    </div>
                    <div className="text-white mt-3 text-xs font-medium">
                        New Faces, New Energy, Welcome Aboard!
                    </div>
                </div>

                {/* Active Users Card */}
                <div className="bg-white w-full max-w-xs rounded-3xl flex flex-col justify-between transition-transform duration-300 hover:scale-105 p-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-sm md:text-base font-medium text-deepOceanBlue">Active Users</h1>
                        {isLoading ? (
                            <Shimmer className="w-16 h-5 rounded-full" />
                        ) : (
                            <span className="text-xs font-medium text-white bg-deepOceanBlue px-3 py-1 rounded-full animate-pulse">
                                567M
                            </span>
                        )}
                    </div>
                    <hr />
                    <div className="flex justify-between">
                        {isLoading ? (
                            <>
                                <Shimmer className="w-16 h-5 my-2 rounded-full" />
                                <Shimmer className="w-16 h-5 my-2 rounded-full" />
                            </>
                        ) : (
                            <>
                                <div className="text-center">
                                    <p className="flex items-center text-sm font-medium text-deepOceanBlue">
                                        5K <TrendingDown size={15} className="text-red-700 ml-1" />
                                    </p>
                                    <p className="text-xs text-gray-400">Last Month</p>
                                </div>
                                <div className="text-center">
                                    <p className="flex items-center text-sm font-medium text-deepOceanBlue">
                                        7K <TrendingUp size={15} className="text-green-700 ml-1" />
                                    </p>
                                    <p className="text-xs text-gray-400">This Month</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Revenue Card */}
                <div className="bg-pastelBlue w-full max-w-xs rounded-3xl flex flex-col justify-between transition-transform duration-300 hover:scale-105 p-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-sm md:text-base font-medium text-white">Revenue</h1>
                        {isLoading ? (
                            <Shimmer className="w-12 h-4 rounded-full" />
                        ) : (
                            <p className="text-xs text-white/70">+ $500</p>
                        )}
                    </div>
                    <hr />
                    <div className="flex justify-between">
                        {isLoading ? (
                            <>
                                <Shimmer className="w-16 h-5 my-2 rounded-full" />
                                <Shimmer className="w-16 h-5 my-2 rounded-full" />
                            </>
                        ) : (
                            <>
                                <div className="text-center">
                                    <p className="text-sm font-medium text-white">$454.5K</p>
                                    <p className="text-xs text-white/50">Last Month</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium text-white">$397.1K</p>
                                    <p className="text-xs text-white/50">This Month</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InsightCard;
