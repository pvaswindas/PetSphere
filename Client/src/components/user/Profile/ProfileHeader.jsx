import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import editIcon from "../../../assets/icon/edit-icon.svg";
import axiosInstance from '../../../axios/axiosinstance';
import { setProfile } from '../../../redux/slices/ProfileSlice';
import userAvatar from "../../../assets/icon/user-avatar.svg";
import adminAvatar from "../../../assets/admin/admin-avatar.svg"
import { convertToBase64 } from '../../../utils/convertToBase64';
import AlertSnackbar from '../../Snackbar/AlertSnackbar';

const ProfileHeader = ({ profile=null, isCurrentUser=null, isAdmin=false }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [showConfirmCard, setShowConfirmCard] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch();

    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [alertType, setAlertType] = useState("error");

    const validateImageFile = (file) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        
        // Maximum file size (2MB)
        const maxSizeInBytes = 2 * 1024 * 1024;

        // Check file type
        if (!allowedTypes.includes(file.type)) {
            setSnackbarMessage("Invalid file type. Please upload JPEG, PNG, GIF, or WebP images.");
            setAlertType("error");
            setSnackbarOpen(true);
            return false;
        }

        if (file.size > maxSizeInBytes) {
            setSnackbarMessage("File size exceeds 2MB. Please upload a smaller image.");
            setAlertType("error");
            setSnackbarOpen(true);
            return false;
        }

        return true;
    };


    const handleImageSelection = (event) => {
        const file = event.target.files[0];
        if (file && validateImageFile(file)) {
            setSelectedImage(file);
            setPreviewImage(URL.createObjectURL(file));
            setShowConfirmCard(true);
        }
    };


    const handleSaveImage = async () => {
        setIsLoading(true)
        try {
            // Convert file to base64
            const base64Image = await convertToBase64(selectedImage);
            
            // Send base64 image to the API
            const response = await axiosInstance.patch('/user/profile/', {
                cover_image: base64Image
            });

            if (response.status === 200) {
                setShowConfirmCard(false);
                setPreviewImage(null);
                setSelectedImage(null);
                dispatch(setProfile({ profile_data: response.data }));
            }
        } catch (error) {
        } finally {
            setIsLoading(false)
        }
    };

    const handleCancel = () => {
        setPreviewImage(null)
        setShowConfirmCard(false)
    }

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!validateImageFile(file)) {
            return;
        }

        setIsLoading(true)
        try {
            const base64Image = await convertToBase64(file);
            
            const response = await axiosInstance.patch("user/profile/", {
                profile_picture: base64Image
            });
            
            if (response.status === 200) {
                dispatch(setProfile({ profile_data: response.data }));
                setSnackbarMessage("Profile picture updated successfully!");
                setAlertType("success");
                setSnackbarOpen(true);
            }
        } catch (error) {
            setSnackbarMessage("Failed to update profile picture");
            setAlertType("error");
            setSnackbarOpen(true);
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <div className="relative">
            <AlertSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                alert_type={alertType}
                onClose={() => setSnackbarOpen(false)}
            />
            {/* Cover Image */}
            {profile?.cover_image || previewImage ? (
                <img
                    src={previewImage || profile.cover_image}
                    alt="Cover"
                    className={`object-cover ${isAdmin ? "w-full h-[100px] lg:h-[110px] rounded-2xl" : "w-full h-[130px] lg:h-[280px]"}`}
                />
            ) : (
                <div className={`${isAdmin ? "w-full h-[100px] lg:h-[110px] bg-deepRoyalBlue rounded-2xl" : "w-full h-[130px] lg:h-[280px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"}`}></div>
            )}

            {/* Edit Icon - Only for current user */}
            {isCurrentUser && (
                <div className={`absolute cursor-pointer ${isAdmin ? "top-2 right-2" : "top-4 right-4"}`}>
                    <label>
                        <img src={editIcon} alt="Edit" className={`${isAdmin ? "w-5 h-5" : "w-4 h-4 lg:w-6 lg:h-6 cursor-pointer"}`} />
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageSelection}
                        />
                    </label>
                </div>
            )}

            {/* Profile Image Container */}
            <div className={`absolute ${isAdmin ? "left-1/2 transform -translate-x-1/2 bottom-[-33px]" : "bottom-[-45px] lg:bottom-[-55px] left-4 lg:left-8"}`}>
                {/* Profile Image with File Upload */}
                <div className="relative">
                    <img
                        src={profile?.profile_picture || (isAdmin ? adminAvatar : userAvatar)}
                        alt="ProfilePicture"
                        className={`rounded-full object-cover ${isAdmin ?  "w-[65px] h-[65px]" : "w-[90px] h-[90px] lg:w-[120px] lg:h-[120px]"}`}
                    />
                    
                    {/* Edit Profile Picture - Only for current user */}
                    {isCurrentUser && (
                        <div className="absolute bottom-0 right-0">
                            <label className="cursor-pointer">
                                <img 
                                    src={editIcon} 
                                    alt="Edit Profile" 
                                    className={`${isAdmin ? "w-4 h-4" : "w-6 h-6"} bg-white rounded-full p-1 shadow-md`} 
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                />
                            </label>
                        </div>
                    )}
                </div>
            </div>

            {/* Confirm Card */}
            {showConfirmCard && (
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-4 z-50">
                    <h4 className="text-lg font-semibold">Confirm Image</h4>
                    <div className="mt-2">
                        <img src={previewImage} alt="Preview" className="w-full h-[100px] object-cover rounded-md" />
                    </div>
                    <div className="flex justify-end mt-4 space-x-4">
                        <button 
                            onClick={handleCancel} 
                            className={`px-4 py-2 rounded-md ${isLoading ? "bg-gray-300 cursor-not-allowed opacity-50" : "bg-gray-200 hover:bg-gray-300"}`} 
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSaveImage} 
                            className="px-4 py-2 bg-og-gradient text-white rounded-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed" 
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                "Save"
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileHeader;