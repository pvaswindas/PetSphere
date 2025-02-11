import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import AlertSnackbar from "../../Snackbar/AlertSnackbar";
import axiosInstance from "../../../axios/axiosinstance";
import { fetchPeople } from "../../../utils/exploreFetch";
import Shimmer from "../../Shimmer/Shimmer";
import userAvatar from "../../../assets/icon/user-avatar.svg";
import { FiUsers } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export function ExplorePeopleList() {
    const [loading, setLoading] = useState(true);
    const my_profile = useSelector((state) => state.profile.profile_data);
    const query = useSelector((state) => state.globalSearch.search);

    const navigate = useNavigate()

    const [searchPeople, setSearchPeople] = useState([]);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const fetchData = useCallback(async () => {
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
    }, [query]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleFollow = async (userId) => {
        try {
            const response = await axiosInstance.post(`socials/follow-user/${userId}`);
            if (response.status === 201) {
                setSearchPeople((prevPeople) =>
                    prevPeople.map((person) =>
                        person.user.id === userId ? { ...person, isFollowing: true } : person
                    )
                );
            }
        } catch (error) {
            setSnackbarMessage("Unable to follow user");
            setSnackbarOpen(true);
        }
    };

    const handleUnfollow = async (userId) => {
        try {
            const response = await axiosInstance.post(`socials/unfollow-user/${userId}`);
            if (response.status === 200) {
                setSearchPeople((prevPeople) =>
                    prevPeople.map((person) =>
                        person.user.id === userId ? { ...person, isFollowing: false } : person
                    )
                );
            }
        } catch (error) {
            setSnackbarMessage("Unable to unfollow user");
            setSnackbarOpen(true);
        }
    };

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AlertSnackbar open={snackbarOpen} message={snackbarMessage} alert_type="error" onClose={() => setSnackbarOpen(false)} />
            {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                    <motion.div
                        key={index}
                        className="p-4 border border-gray-300 rounded-lg shadow-sm bg-white"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex items-center gap-4">
                            <Shimmer className="h-12 w-12 rounded-full" />
                            <div className="flex-1">
                                <Shimmer className="h-4 w-1/2 mb-2" />
                                <Shimmer className="h-4 w-1/3" />
                            </div>
                            <Shimmer className="h-8 w-20 rounded-md" />
                        </div>
                    </motion.div>
                ))
            ) : searchPeople.length === 0 ? (
                <div className="col-span-full text-center text-gray-500 flex flex-col items-center gap-2 p-4">
                    <FiUsers className="text-4xl text-gray-400" />
                    <p>{query ? "No users found, Try a different search!" : "No user suggestions available at the moment."}</p>
                </div>
            ) : (
                searchPeople.map((profile) => (
                    <motion.div
                        key={profile?.id}
                        className="p-4 lg:border lg:border-gray-300 lg:rounded-lg lg:shadow-sm bg-white lg:hover:shadow-md transition-transform transform hover:scale-[1.02]"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex items-center gap-4">
                            <img
                                src={profile?.profile_picture || userAvatar}
                                alt={profile?.user.name}
                                className="h-12 w-12 rounded-full object-cover"
                            />
                            <div className="flex-1">
                                <h3 
                                    className="font-semibold cursor-pointer"
                                    onClick={() => navigate(`/profile/${profile?.user.username}`)}
                                >
                                    {profile?.user.name}
                                </h3>
                                <p className="text-sm text-gray-500">{profile?.user.username}</p>
                                {profile?.mutualFriends > 0 && (
                                    <p className="text-sm text-gray-500">{profile?.mutualFriends} mutual friends</p>
                                )}
                            </div>
                            {my_profile?.user.username !== profile.user.username && (
                                <motion.button
                                    className={`px-3 py-1 border rounded-lg text-sm transition duration-300 font-medium lg:shadow-md lg:hover:shadow-lg ${
                                        profile?.isFollowing
                                            ? "border-gray-200 hover:bg-gray-100"
                                            : "border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                                    }`}
                                    onClick={() =>
                                        profile?.isFollowing ? handleUnfollow(profile.user.id) : handleFollow(profile.user.id)
                                    }
                                    whileTap={{ scale: 0.9 }}
                                >
                                    {profile?.isFollowing ? "Unfollow" : "Follow"}
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                ))
            )}
        </div>
    );
}
