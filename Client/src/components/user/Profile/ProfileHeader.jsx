import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import editIcon from "../../../assets/icon/edit-icon.svg"
import axiosInstance from '../../../axios/axiosinstance'
import { setProfile } from '../../../redux/slices/ProfileSlice'
import userAvatar from "../../../assets/icon/user-avatar.svg"
import { FiEdit, FiTrash } from "react-icons/fi";

const ProfileHeader = ({ profile=null, isCurrentUser=null, isAdmin=false }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [showConfirmCard, setShowConfirmCard] = useState(false);
    const dispatch = useDispatch();

    const user = profile ? profile.user : null;

    const handleImageSelection = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewImage(URL.createObjectURL(file));
            setShowConfirmCard(true);
        }
    };

    const formData = {
        username: user?.username,
        email: user?.email,
        name: user?.name || "",
        bio: profile?.bio || "",
        mobile_no: user?.mobile_no || "",
        profile_picture: profile?.profile_picture || null,
    };

    const handleSaveImage = async () => {
        const formData = new FormData();
        formData.append("cover_image", selectedImage);

        try {
            const response = await axiosInstance.patch('/user/profile/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 200) {
                setShowConfirmCard(false);
                setPreviewImage(null);
                setSelectedImage(null);
                dispatch(setProfile({ profile_data: response.data }));
            }
        } catch (error) {
            return
        }
    };

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
                    src={profile?.profile_picture || userAvatar}
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
                        <button onClick={() => setShowConfirmCard(false)} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
                        <button onClick={handleSaveImage} className="px-4 py-2 bg-blue-500 text-white rounded-md">Save</button>
                    </div>
                </div>
            )}
        </div>
    );
};


export default ProfileHeader
