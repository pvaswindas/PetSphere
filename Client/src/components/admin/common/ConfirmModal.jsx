import React from "react";

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, description, actionText="Confirm", width="w-72" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className={`bg-softSkyBlue80 rounded-lg py-6 px-4 ${width}`}>
                {/* Title */}
                <h3 className="text-xl font-semibold text-center text-gray-900">{title}</h3>
                
                {/* Description */}
                <p className="text-center text-gray-700 mt-3">{description}</p>

                <div className="mt-6 flex justify-around">
                    {/* Cancel Button */}
                    <button
                        className="w-1/3 py-2 bg-red-500 text-white/80 rounded-full hover:text-white"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    {/* Confirm Button */}
                    <button
                        className="w-1/3 py-2 bg-darkDenimBlue70 text-white rounded-full hover:bg-darkDenimBlue"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        {actionText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
