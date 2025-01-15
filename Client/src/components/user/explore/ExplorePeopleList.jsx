import React, { useEffect, useState } from "react";
import userAvatar from "../../../assets/icon/user-avatar.svg";
import { useSelector } from "react-redux";
import AlertSnackbar from "../../Snackbar/AlertSnackbar";
import axiosInstance from "../../../axios/axiosinstance";
import { fetchPeople } from "../../../utils/exploreFetch";
import Shimmer from "../../Shimmer/Shimmer";

export function ExplorePeopleList() {
    const [loading, setLoading] = useState(true);
    const my_profile = useSelector((state) => state.profile.profile_data);
    const query = useSelector((state) => state.globalSearch.search);

    const [searchPeople, setSearchPeople] = useState([]);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const [buttonState, setButtonState] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await fetchPeople(query);
                setSearchPeople(data);
            } catch (error) {
                setSnackbarMessage("Unable to fetch Users");
                setSnackbarOpen(true);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [query]);

    const handleFollow = async (userId) => {
        setButtonState((prevState) => ({ ...prevState, [userId]: "loading" }));
        try {
            const response = await axiosInstance.post(`socials/follow-user/${userId}`);
            if (response.status === 201) {
                fetchPeople(query);
                setButtonState((prevState) => ({ ...prevState, [userId]: "success" }));
            }
        } catch (error) {
            setSnackbarMessage("Unable to follow user");
            setSnackbarOpen(true);
            setButtonState((prevState) => ({ ...prevState, [userId]: "error" }));
        }
    };

    const handleUnfollow = async (userId) => {
        setButtonState((prevState) => ({ ...prevState, [userId]: "loading" }));
        try {
            const response = await axiosInstance.post(`socials/unfollow-user/${userId}`);
            if (response.status === 200) {
                fetchPeople(query);
                setButtonState((prevState) => ({ ...prevState, [userId]: "success" }));
            }
        } catch (error) {
            setSnackbarMessage("Unable to unfollow user");
            setSnackbarOpen(true);
            setButtonState((prevState) => ({ ...prevState, [userId]: "error" }));
        }
    };

    const getButtonClass = (state) => {
        switch (state) {
            case "loading":
                return "border-blue-500 hover:border-blue-700 transform scale-105";
            case "success":
                return "border-og-gradient hover:border-green-700 transform scale-105";
            case "error":
                return "border-red-500 hover:border-red-700 transform scale-105";
            default:
                return "border-gray-300 hover:border-gray-500 transform scale-100";
        }
    };

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AlertSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                alert_type="error"
                onClose={() => setSnackbarOpen(false)}
            />
            {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                    <div
                        key={index}
                        className="p-4 border border-gray-300 rounded-lg shadow-sm"
                    >
                        <div className="flex items-center gap-4">
                            <Shimmer className="h-12 w-12 rounded-full" />
                            <div className="flex-1">
                                <Shimmer className="h-4 w-1/2 mb-2" />
                                <Shimmer className="h-4 w-1/3" />
                            </div>
                            <Shimmer className="h-8 w-20 rounded-md" />
                        </div>
                    </div>
                ))
            ) : searchPeople.length === 0 ? (
                <div className="col-span-full text-center text-gray-500">
                    No users found matching your search.
                </div>
            ) : (
                searchPeople?.map((profile) => (
                    <div key={profile?.id} className="p-4 border border-gray-300 rounded-lg shadow-sm">
                        <div className="flex items-center gap-4">
                            <img
                                src={profile?.profile_picture || userAvatar}
                                alt={profile?.user.name}
                                className="h-12 w-12 rounded-full object-cover"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold">{profile?.user.name}</h3>
                                <p className="text-sm text-gray-500">{profile?.user.username}</p>
                                {profile?.mutualFriends > 0 && (
                                    <p className="text-sm text-gray-500">{profile?.mutualFriends} mutual friends</p>
                                )}
                            </div>
                            {my_profile?.user.username !== profile.user.username && (
                                <button
                                    className={`px-3 py-1 border rounded-lg text-sm transition duration-300 ${getButtonClass(
                                        buttonState[profile.user.id]
                                    )}`}
                                    onClick={() =>
                                        profile?.isFollowing
                                            ? handleUnfollow(profile.user.id)
                                            : handleFollow(profile.user.id)
                                    }
                                >
                                    {profile?.isFollowing ? "Unfollow" : "Follow"}
                                </button>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
