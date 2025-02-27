import React, { useEffect, useState } from "react";
import DashboardWelcome from "../../../assets/admin/dashboardcard.svg";
import { TrendingUp, TrendingDown } from "lucide-react";
import AlertSnackbar from "../../Snackbar/AlertSnackbar";
import defaultAvatar from "../../../assets/icon/user-avatar.svg";
import { fetchActiveUsers, fetchLatestTeamMembers, fetchRevenue } from "../../../api/insights";
import Shimmer from "../../Shimmer/Shimmer";
import { formatNumber } from "../../../utils/formatTime";

const InsightCard = () => {
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [teamMembers, setTeamMembers] = useState([]);

    const [activeUsers, setActiveUsers] = useState(0)
    const [newUsersThisMonth, setNewUsersThisMonth] = useState(0)
    const [newUsersLastMonth, setNewUsersLastMonth] = useState(0)

    const [totalRevenue, setTotalRevenue] = useState(0)
    const [revenueThisMonth, setRevenueThisMonth] = useState(0)
    const [revenueLastMonth, setRevenueLastMonth] = useState(0)


    const fetchInsights = async () => {
        setIsLoading(true)
        try {
            const getLatestTeamMembers = await fetchLatestTeamMembers();
            setTeamMembers(getLatestTeamMembers.data || []);

            const getActiveUsers = await fetchActiveUsers()
            setActiveUsers(getActiveUsers.active_users || 0)
            setNewUsersThisMonth(getActiveUsers.users_this_month || 0)
            setNewUsersLastMonth(getActiveUsers.users_last_month || 0)

            const getRevenue = await fetchRevenue()
            setTotalRevenue(getRevenue.total_revenue || 0)
            setRevenueThisMonth(getRevenue.revenue_this_month || 0)
            setRevenueLastMonth(getRevenue.revenue_last_month || 0)
            console.log(getRevenue)
        } catch (error) {
            setSnackbarMessage("Error fetching insights!");
            setSnackbarOpen(true);
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchInsights();
    }, []);

    const TrendIndicator = ({ value, comparison, label }) => {
        const getTrendIcon = () => {
            if (value > comparison) return <TrendingUp size={15} className="text-green-700 ml-1" />;
            if (value < comparison) return <TrendingDown size={15} className="text-red-700 ml-1" />;
        };
    
        return (
            <div className="text-center">
                <p className="flex items-center justify-start text-sm font-medium text-deepOceanBlue">
                    {formatNumber(value) || 0}
                    {getTrendIcon()}
                </p>
                <p className="text-xs text-gray-400">{label}</p>
            </div>
        );
    };

    return (
        <div className="bg-softSkyBlue shadow-lg flex flex-col items-center justify-center rounded-3xl p-4 w-full">
            <AlertSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                alert_type="error"
                onClose={() => setSnackbarOpen(false)}
            />

            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 w-full max-w-5xl items-center justify-center py-3 lg:py-0">
                {/* Reports Card */}
                <div className="bg-white w-full max-w-xs rounded-3xl flex flex-col justify-between transition-transform duration-300 hover:scale-105 p-4 min-h-[120px]">
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
                    className="w-full max-w-xs rounded-3xl bg-cover bg-center transition-transform duration-300 hover:scale-105 relative p-3 min-h-[120px]"
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
                    <div className="text-white mt-3 text-xs font-medium animate-pulse">
                        New Faces, New Energy, Welcome Aboard!
                    </div>
                </div>

                {/* Active Users Card */}
                <div className="bg-white w-full max-w-xs rounded-3xl flex flex-col justify-between transition-transform duration-300 hover:scale-105 p-4 min-h-[120px]">
                    <div className="flex items-center justify-between">
                        <h1 className="text-sm md:text-base font-medium text-deepOceanBlue">Active Users</h1>
                        {isLoading ? (
                            <Shimmer className="w-8 h-5 rounded-full" />
                        ) : (
                            <span className="text-xs font-medium text-white bg-deepOceanBlue px-3 py-1 rounded-full animate-pulse">
                                {activeUsers && activeUsers}
                            </span>
                        )}
                    </div>
                    <hr  className="my-2" />
                    <div className="flex justify-between">
                        {isLoading ? (
                            <>
                                <Shimmer className="w-16 h-5 my-2 rounded-full" />
                                <Shimmer className="w-16 h-5 my-2 rounded-full" />
                            </>
                        ) : (
                            <>
                                <TrendIndicator value={newUsersLastMonth} comparison={newUsersThisMonth} label="Last Month" />
                                <TrendIndicator value={newUsersThisMonth} comparison={newUsersLastMonth} label="This Month" />
                            </>
                        )}
                    </div>
                </div>

                {/* Revenue Card */}
                <div className="bg-pastelBlue w-full max-w-xs rounded-3xl flex flex-col justify-between transition-transform duration-300 hover:scale-105 p-4 min-h-[120px]">
                    <div className="flex items-center justify-between">
                        <h1 className="text-sm md:text-base font-medium text-white">Revenue</h1>
                        {isLoading ? (
                            <Shimmer className="w-12 h-4 rounded-full" />
                        ) : (
                            <p className="text-xs text-white/70">${formatNumber(totalRevenue)}</p>
                        )}
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between">
                        {isLoading ? (
                            <>
                                <Shimmer className="w-16 h-5 my-2 rounded-full" />
                                <Shimmer className="w-16 h-5 my-2 rounded-full" />
                            </>
                        ) : (
                            <>
                                <div className="text-center">
                                    <p className="text-sm font-medium text-white">${formatNumber(revenueLastMonth)}</p>
                                    <p className="text-xs text-white/50">Last Month</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium text-white">${formatNumber(revenueThisMonth)}</p>
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
