import React from "react";

const ActionsModal = ({ isOpen, onClose, children, width="w-72", }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className={`bg-softSkyBlue rounded-lg py-2 ${width}`}>
                {children}
                <button
                    className="w-full text-center p-3 text-red-500 hover:text-red-700"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default ActionsModal;
