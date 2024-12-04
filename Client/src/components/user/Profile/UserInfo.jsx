import React, { useState } from 'react';
import Button from '../../forms/Button';
import { useSelector } from 'react-redux';
import EditModal from './EditModal';

const UserInfo = () => {
    const profile = useSelector((state) => state.profile.profile_data);
    const user = profile ? profile.user : null;

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEditProfile = () => {
        setIsModalOpen(true);
    }

    const handleShareProfile = () => {
    }

    const closeModal = () => {
        setIsModalOpen(false);
    }

    const handleSaveChanges = (event) => {
        event.preventDefault();
        closeModal();
    }

    return (
        <div className="pt-16 px-4 lg:px-8">
            {/* Header Section */}
            <div className="flex items-start justify-between">
                <div className='w-full lg:w-0'>
                    <h2 className="text-lg sm:text-lg md:text-xl font-bold text-gray-800">
                        {user?.name || "Anonymous User"}
                    </h2>
                    <p className="text-sm sm:text-base md:text-sm text-gray-500 mt-1">
                        @{user?.username}
                    </p>
                    <div className='flex gap-3 mt-4 lg:hidden'>
                        <Button 
                            type="button"
                            text="Edit Profile"
                            rounded="rounded"
                            paddingx="px-3"
                            paddingy="py-1"
                            onClick={handleEditProfile}
                            className="text-xs lg:text-sm flex-1"
                            backgroundColor="bg-lightTextGreyOpacity20"
                            textColor="text-blackOpacity85"
                            hoverBackgroundColor="hover:bg-lightTextGreyOpacity30"
                        />
                        <Button
                            type="button"
                            text="Share Profile"
                            rounded="rounded"
                            paddingx="px-3"
                            paddingy="py-1"
                            className="text-xs lg:text-sm flex-1"
                            onClick={handleShareProfile}
                            backgroundColor="bg-lightTextGreyOpacity20"
                            textColor="text-blackOpacity85"
                            hoverBackgroundColor="hover:bg-lightTextGreyOpacity30"
                        />
                    </div>
                </div>
                <div className="space-x-4 hidden lg:flex">
                    <Button 
                        type="button"
                        text="Edit Profile"
                        rounded="rounded"
                        paddingx="px-4"
                        paddingy="py-1"
                        onClick={handleEditProfile}
                        className="text-xs lg:text-sm"
                        backgroundColor="bg-lightTextGreyOpacity20"
                        textColor="text-blackOpacity85"
                        hoverBackgroundColor="hover:bg-lightTextGreyOpacity30"
                    />
                    <Button
                        type="button"
                        text="Share Profile"
                        rounded="rounded"
                        paddingx="px-4"
                        paddingy="py-1"
                        className="text-xs lg:text-sm"
                        onClick={handleShareProfile}
                        backgroundColor="bg-lightTextGreyOpacity20"
                        textColor="text-blackOpacity85"
                        hoverBackgroundColor="hover:bg-lightTextGreyOpacity30"
                    />
                </div>
            </div>
            {/* Bio Section */}
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-4">{profile?.bio}</p>

            {/* Modal for Editing Profile */}
            <EditModal
                isOpen={isModalOpen}
                closeModal={closeModal}
                user={user}
                profile={profile}
                handleSaveChanges={handleSaveChanges}
            />
        </div>
    );
}

export default UserInfo;
