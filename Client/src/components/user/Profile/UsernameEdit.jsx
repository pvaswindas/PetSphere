import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiCheck, FiX } from "react-icons/fi";
import { checkUsername } from "../../../utils/checkUsername";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../../axios/axiosinstance";
import { setProfile } from "../../../redux/slices/ProfileSlice";

const UsernameEdit = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { data } = location.state || {};
    const user = useSelector((state) => state.profile.profile_data.user);
    
    const [username, setUsername] = useState(data || "");
    const [isAvailable, setIsAvailable] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const field = "username"
    
    const handleUsernameChange = async (username) => {
        setIsLoading(true);
        try {
            const result = await checkUsername(username);
            setIsAvailable(result.available);
        } catch (error) {
            console.error("Error checking username availability:", error);
            setIsAvailable(false);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (username) {
            handleUsernameChange(username);
        } else {
            setIsAvailable(null);
        }
    }, [username]);

    const handleSave = async () => {
        const formData = new FormData()
        formData.append(field, username)
        try {
            const response = await axiosInstance.patch('accounts/user-profile/', formData);
    
            if (response.status === 200) {
                dispatch(setProfile({ profile_data: response.data }));
                navigate(-1);
            }
        } catch (error) {
            console.error("Error updating profile:", error.response || error);
        }
        navigate("/profile");
    };

    const isUsernameTooShort = username.length < 3;

    return (
        <div className="flex flex-col items-center justify-start w-full min-h-screen">
            <div className="w-full bg-white p-6 lg:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300">
                <h1 className="text-lg lg:text-2xl font-semibold text-gray-800 mt-4 mb-8 text-start">Edit Username</h1>

                {/* Username Input */}
                <div className="flex flex-col mb-6">
                    <label htmlFor="username" className="text-md text-gray-600 mb-1">
                        New Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="p-2 border rounded-md text-sm text-gray-800"
                        placeholder="Enter new username"
                    />

                    {/* Display availability status */}
                    {username && username !== user?.username && isUsernameTooShort === false && (
                        <div className="mt-2 text-sm">
                            {isLoading ? (
                                <p className="text-gray-600">Checking availability...</p>
                            ) : isAvailable === null ? (
                                <p className="text-gray-600">Enter a username to check availability</p>
                            ) : isAvailable ? (
                                <p className="text-green-600 flex items-center">
                                    <FiCheck className="mr-1" />
                                    Username is available!
                                </p>
                            ) : (
                                <p className="text-red-600 flex items-center">
                                    <FiX className="mr-1" />
                                    Username is already taken
                                </p>
                            )}
                        </div>
                    )}

                    {/* Error message for short username */}
                    {isUsernameTooShort && (
                        <p className="text-red-600 text-sm mt-2">Username must be at least 3 characters long</p>
                    )}
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    disabled={isAvailable === false || isLoading || isUsernameTooShort}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600 disabled:bg-gray-400"
                >
                    Save Username
                </button>
            </div>
        </div>
    );
};

export default UsernameEdit;
