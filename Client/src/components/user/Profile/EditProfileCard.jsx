import React, { useRef } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FiEdit, FiTrash } from "react-icons/fi";
import axiosInstance from "../../../axios/axiosinstance";
import { setProfile } from "../../../redux/slices/ProfileSlice";
import adminAvatar from "../../../assets/icon/user-avatar.svg"

const EditProfileCard = () => {
    const profile = useSelector((state) => state.profile.profile_data);
    const user = profile ? profile.user : null;
    const dispatch = useDispatch();
    const fileInputRef = useRef();
    const navigate = useNavigate();

    const formData = {
        username: user?.username,
        email: user?.email,
        name: user?.name || "",
        bio: profile?.bio || "",
        mobile_no: user?.mobile_no || "",
        profile_picture: profile?.profile_picture || null,
    };

    const handleEditClick = (field) => {
        navigate(`/edit`, { state: { field, data: formData[field] } });
    };

    const handleEditUsername = (field) => {
        navigate(`/edit-username`, { state: { data: formData[field] } });
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("profile_picture", file);

        try {
            const response = await axiosInstance.patch("user/profile/", formData);
            if (response.status === 200) {
                dispatch(setProfile({ profile_data: response.data }));
                Swal.fire({
                    icon: 'success',
                    title: 'Profile picture updated successfully!',
                    showConfirmButton: true,
                    confirmButtonText: 'Okay',
                    width: window.innerWidth < 1024 ? '95%' : '30%',
                    padding: '20px',
                    customClass: {
                        popup: 'popup-responsive',
                    },
                    showCloseButton: true,
                    backdrop: true,
                    timer: 5000,
                    timerProgressBar: true,
                });             
            }
        } catch (error) {
            console.error("Error updating profile picture:", error.response || error);
        }
    };

    const handleDeletePicture = async () => {
        const formData = new FormData();
        formData.append("profile_picture", "")
    
        try {
            const response = await axiosInstance.patch("user/profile/", formData);
            if (response.status === 200) {
                dispatch(setProfile({ profile_data: response.data }));
                Swal.fire({
                    icon: 'success',
                    title: 'Profile picture deleted successfully!',
                    showConfirmButton: true,
                    confirmButtonText: 'Okay',
                    width: window.innerWidth < 1024 ? '95%' : '30%',
                    padding: '20px',
                    customClass: {
                        popup: 'popup-responsive',
                    },
                    showCloseButton: true,
                    backdrop: true,
                    timer: 5000,
                    timerProgressBar: true,
                });               
            }
        } catch (error) {
            console.error("Error deleting profile picture:", error.response || error);
        }
    };
    

    return (
        <div className="flex flex-col items-center justify-start w-full min-h-screen">
            <div className="w-full bg-white p-6 lg:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300">
                <h1 className="text-lg lg:text-2xl font-semibold text-gray-800 mt-4 mb-8 text-start">
                    Edit Profile
                </h1>

                {/* Profile Picture */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative group">
                        <img
                            src={formData?.profile_picture || adminAvatar}
                            alt="Profile"
                            className="w-36 h-36 lg:w-40 lg:h-40 rounded-full border-4 border-white object-cover hover:scale-105 transition-all duration-300"
                        />

                        {/* Edit Icon */}
                        <FiEdit
                            className="absolute bottom-0 right-12 mb-2 mr-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full p-2 w-8 h-8 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            onClick={() => fileInputRef.current.click()}
                        />
                        {/* Delete Icon */}
                        {formData.profile_picture && (
                            <FiTrash
                                className="absolute bottom-0 right-0 mb-2 mr-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full p-2 w-8 h-8 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                onClick={handleDeletePicture}
                            />
                        )}
                    </div>
                    <h5 className="mt-2 text-sm text-gray-600">Tap to Edit or Delete Profile Picture</h5>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={handleFileUpload}
                />

                {/* Username Field */}
                <div className="flex flex-col mb-6">
                    <label htmlFor="username" className="text-md text-gray-600 mb-1">
                        Username
                    </label>
                    <div className="flex items-center justify-between">
                        <p
                            id="username"
                            className="text-sm text-gray-800 cursor-pointer flex-1 hover:text-blue-600"
                            onClick={() => handleEditUsername("username")}
                        >
                            {formData.username || "No username set"}
                        </p>
                        <FiEdit
                            className="text-gray-500 w-5 h-5 cursor-pointer hover:text-blue-500"
                            onClick={() => handleEditUsername("username")}
                        />
                    </div>
                </div>

                {/* Additional Fields */}
                {["name", "bio", "mobile_no"].map((field) => (
                    <div key={field} className="flex flex-col mb-6">
                        <label htmlFor={field} className="text-md text-gray-600 mb-1">
                            {field === "mobile_no" ? "Mobile Number" : field.charAt(0).toUpperCase() + field.slice(1).replace("_", " ")}
                        </label>
                        <div className="flex items-center justify-between">
                            <p
                                id={field}
                                className="text-sm text-gray-800 cursor-pointer flex-1 hover:text-blue-600"
                                onClick={() => handleEditClick(field)}
                            >
                                {formData[field] || `No ${field.replace("_", " ")} set`}
                            </p>
                            <FiEdit
                                className="text-gray-500 w-5 h-5 cursor-pointer hover:text-blue-500"
                                onClick={() => handleEditClick(field)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EditProfileCard;
