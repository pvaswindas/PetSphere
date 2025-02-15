import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AlertSnackbar from "../../../Snackbar/AlertSnackbar";
import userAvatar from "../../../../assets/icon/user-avatar.svg";
import { fetchFollowers, fetchFollowings } from "../../../../redux/thunks/FetchRelationsThunk";

const Friends = ({ username }) => {
    const [active, setActive] = useState("followers");

    const followers = useSelector((state) => state.users.followers);
    const followings = useSelector((state) => state.users.followings);

    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!username) return;

        const fetchData = async () => {
            try {
                if (active === "followers") {
                    await dispatch(fetchFollowers(username)).unwrap();
                } else {
                    await dispatch(fetchFollowings(username)).unwrap();
                }
            } catch (error) {
                setSnackbarMessage("Error fetching friends");
                setSnackbarOpen(true);
            }
        };

        fetchData();
    }, [active, username, dispatch]);

    return (
        <div className="flex flex-col mt-2 mb-10 lg:mb-2 w-full justify-center">
            <AlertSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                alert_type="error"
                onClose={() => setSnackbarOpen(false)}
            />

            {/* Toggle Buttons */}
            <div className="flex gap-10 justify-center lg:justify-start lg:mx-12 w-full">
                <button
                    className={`w-24 px-2 py-1 text-sm rounded-full ${
                        active === "followers" ? "bg-gray-400 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-700"
                    }`}
                    onClick={() => setActive("followers")}
                >
                    Followers
                </button>
                <button
                    className={`w-24 px-2 py-1 text-sm rounded-full ${
                        active === "followings" ? "bg-gray-400 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-700"
                    }`}
                    onClick={() => setActive("followings")}
                >
                    Followings
                </button>
            </div>

            {/* Grid View */}
            <div className="mt-4 px-4">
                {active === "followers" ? (
                    followers.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {followers.map((follower) => (
                                <div key={follower.user.username} className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-sm">
                                    <img
                                        src={follower?.profile_picture ? follower?.profile_picture : userAvatar}
                                        alt="Profile"
                                        className="w-16 h-16 rounded-full"
                                    />
                                    <span className="mt-2 text-gray-800 font-medium">{follower.user.username}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">No followers found</p>
                    )
                ) : (
                    followings.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {followings.map((following) => (
                                <div key={following.user.username} className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-sm">
                                    <img
                                        src={following?.profile_picture ? following?.profile_picture : userAvatar}
                                        alt="Profile"
                                        className="w-16 h-16 rounded-full"
                                    />
                                    <span className="mt-2 text-gray-800 font-medium">{following.user.username}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">No followings found</p>
                    )
                )}
            </div>
        </div>
    );
};

export default Friends;
