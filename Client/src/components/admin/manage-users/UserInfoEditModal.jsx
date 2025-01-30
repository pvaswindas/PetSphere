import React from "react";

function UserInfoEditModal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            {/* Modal Content */}
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                    <button
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        onClick={onClose}
                    >
                        &#x2715;
                    </button>
                </div>

                {/* Dynamic Content */}
                <div className="mt-4">{children}</div>

                {/* Footer */}
                <div className="mt-6 flex justify-end space-x-2">
                    <button
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserInfoEditModal;
