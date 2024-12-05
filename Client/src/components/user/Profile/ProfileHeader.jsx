import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import editIcon from "../../../assets/icon/edit-icon.svg"
import axiosInstance from '../../../axios/axiosinstance'
import { setProfile } from '../../../redux/slices/ProfileSlice'

const ProfileHeader = () => {
    const profile = useSelector((state) => state.profile.profile_data)
    const [selectedImage, setSelectedImage] = useState(null)
    const [previewImage, setPreviewImage] = useState(null)
    const [showConfirmCard, setShowConfirmCard] = useState(false)
    const dispatch = useDispatch()

    const handleImageSelection = (event) => {
        const file = event.target.files[0]
        if (file) {
            setSelectedImage(file)
            setPreviewImage(URL.createObjectURL(file))
            setShowConfirmCard(true)
        }
    }

    const handleSaveImage = async () => {
        const formData = new FormData()
        formData.append("cover_image", selectedImage)
    
        try {
            const response = await axiosInstance.patch('/user/profile/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            if (response.status === 200) {
                setShowConfirmCard(false)
                setPreviewImage(null)
                setSelectedImage(null)
                dispatch(setProfile({ profile_data: response.data }))
            } else {
                console.error("Failed to upload image")
            }
        } catch (error) {
            console.error("Error uploading image:", error)
        }
    }

    const handleCancel = () => {
        setShowConfirmCard(false)
        setPreviewImage(null)
        setSelectedImage(null)
    }

    return (
        <div className="relative">
            {/* Cover Image */}
            {profile?.cover_image || previewImage ? (
                <img
                    src={previewImage || profile.cover_image}
                    alt="Cover"
                    className="w-full h-[130px] lg:h-[280px] object-cover"
                />
            ) : (
                <div className="w-full h-[130px] lg:h-[280px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            )}

            {/* Edit Icon */}
            <div className="absolute top-4 right-4 cursor-pointer">
                <label>
                    <img
                        src={editIcon}
                        alt="Edit"
                        className="w-4 h-4 lg:w-6 lg:h-6"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageSelection}
                    />
                </label>
            </div>

            {/* Profile Image */}
            <div className="absolute bottom-[-50px] left-4 lg:left-8">
                {profile?.profile_picture ? (
                    <img
                        src={profile.profile_picture}
                        alt="Profile"
                        className="w-[100px] h-[100px] rounded-full border-4 border-white object-cover"
                    />
                ) : (
                    <div className="w-[100px] h-[100px] lg:w-[110px] lg:h-[110px] rounded-full border-4 border-white bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 font-bold text-lg"></span>
                    </div>
                )}
            </div>

            {/* Confirm Card */}
            {showConfirmCard && (
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-4 z-50">
                    <h4 className="text-lg font-semibold">Confirm Image</h4>
                    <div className="mt-2">
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="w-full h-[100px] object-cover rounded-md"
                        />
                    </div>
                    <div className="flex justify-end mt-4 space-x-4">
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 bg-gray-200 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveImage}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        >
                            Save
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProfileHeader
