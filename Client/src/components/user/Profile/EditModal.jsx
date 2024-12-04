import React from 'react';
import Button from '../../forms/Button';

const EditModal = ({ isOpen, closeModal, user, profile, handleSaveChanges }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-3/4 lg:w-1/2">
                <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
                <form onSubmit={handleSaveChanges}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            defaultValue={user?.name || ""}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="bio" className="block text-gray-700">Bio</label>
                        <textarea
                            id="bio"
                            name="bio"
                            defaultValue={profile?.bio || ""}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            text="Cancel"
                            rounded="rounded"
                            paddingx="px-4"
                            paddingy="py-2"
                            onClick={closeModal}
                            backgroundColor="bg-gray-300"
                            textColor="text-black"
                        />
                        <Button
                            type="submit"
                            text="Save Changes"
                            rounded="rounded"
                            paddingx="px-4"
                            paddingy="py-2"
                            backgroundColor="bg-blue-500"
                            textColor="text-white"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditModal;
