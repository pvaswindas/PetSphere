import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../../axios/axiosinstance";
import { useDispatch } from "react-redux";
import { setProfile } from "../../../redux/slices/ProfileSlice";

const EditFieldCard = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { field, data } = location.state || {}

    const [value, setValue] = useState(data)

    let label = field.charAt(0).toUpperCase() + field.slice(1)
    if (label === "Mobile_no") {
        label = "Mobile Number"
    }

    const handleSave = async () => {
        const formData = new FormData();
        formData.append(field, value);
    
        try {
            let response;
            if (["name", "mobile_no"].includes(field)) {
                response = await axiosInstance.patch('accounts/user-profile/', formData);
            } else {
                response = await axiosInstance.patch('user/profile/', formData);
            }
    
            if (response.status === 200) {
                dispatch(setProfile({ profile_data: response.data }));
                navigate(-1);
            }
        } catch (error) {
            console.error("Error updating profile:", error.response || error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-start w-full min-h-screen">
            <div className="w-full bg-white p-6 lg:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300">
                <h1 className="text-lg lg:text-2xl font-semibold text-gray-800 mt-4 mb-8 text-start">Edit {label}</h1>

                {/* Input Field */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">{label}</label>
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder={`Enter your ${field}`}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-5 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-5 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditFieldCard;
