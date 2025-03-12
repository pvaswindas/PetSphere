import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import editIcon from "../../../assets/icon/edit-icon.svg";
import axiosInstance from '../../../axios/axiosinstance';
import { setProfile } from '../../../redux/slices/ProfileSlice';
import userAvatar from "../../../assets/icon/user-avatar.svg";
import adminAvatar from "../../../assets/admin/admin-avatar.svg"
import { convertToBase64 } from '../../../utils/convertToBase64';

const ProfileHeader = ({ profile=null, isCurrentUser=null, isAdmin=false }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [showConfirmCard, setShowConfirmCard] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch();

    const handleImageSelection = (event) => {
        const file = event.target.files[0];
        if (file) {
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

    return (
        <div className="relative">
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

            {/* Profile Image */}
            <div className={`absolute ${isAdmin ? "left-1/2 transform -translate-x-1/2 bottom-[-33px]" : "bottom-[-50px] left-4 lg:left-8"}`}>
                <img
                    src={profile?.profile_picture || (isAdmin ? adminAvatar : userAvatar)}
                    alt="Profile"
                    className={`rounded-full object-cover ${isAdmin ?  "w-[65px] h-[65px]" : "w-[120px] h-[120px] lg:w-[150px] lg:h-[150px]"}`}
                />
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