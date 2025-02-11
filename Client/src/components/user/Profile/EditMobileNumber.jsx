import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Phone } from 'lucide-react';
import axiosInstance from '../../../axios/axiosinstance';
import { useNavigate } from 'react-router-dom';
import AlertSnackbar from '../../Snackbar/AlertSnackbar';

function EditMobileNumber() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

    const onSubmit = async (data) => {
        setIsLoading(true)

        try {
            const response = await axiosInstance.post('accounts/verify-phone-number/', data);
            if (response.status === 200) {
                const twoMinutesInMilliseconds = 2 * 60 * 1000;
                const resendTime = Date.now() + twoMinutesInMilliseconds;

                localStorage.setItem('mobileNumber', JSON.stringify(data));
                localStorage.setItem('resendTime', resendTime.toString());
                localStorage.setItem('resendStartTime', Date.now().toString());
                navigate('/profile/verify-mobile-number');
            }
        } catch (error) {
            if (error.status === 400) {
                setSnackbarMessage("Please provide proper Mobile Number.");
                setSnackbarOpen(true);
            } else {
                setSnackbarMessage("Unable to process your request right now.");
                setSnackbarOpen(true);
            }
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <div className="flex w-full min-h-[610px]">
            <AlertSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                alert_type="error"
                onClose={() => setSnackbarOpen(false)}
            />
            <div className="flex flex-col md:flex-row w-full bg-white lg:shadow-lg lg:rounded-lg">
                <div className="md:w-1/2 bg-ad-preview-gradient text-white p-6 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold mb-4">Add New Mobile Number</h2>
                    <p className="text-lg mb-6">
                        Update your contact information easily. Enter your mobile number along with your country code to ensure you receive important updates.
                    </p>
                    <Phone className="w-16 h-16 mx-auto text-white" />
                </div>

                <div className="md:w-1/2 p-6">
                    <h2 className="text-2xl font-bold mb-4">Update Number</h2>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6 flex lg:min-h-[510px] flex-col justify-between"
                    >
                        <div className="flex flex-row md:items-center space-x-4">
                            <div className="flex flex-col w-1/3">
                                <label htmlFor="countryCode" className="font-medium mb-2">
                                    Country Code
                                </label>
                                <select
                                    id="countryCode"
                                    {...register('countryCode', { required: 'Country code is required' })}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select</option>
                                    <option value="+1">+1 (USA)</option>
                                    <option value="+91">+91 (India)</option>
                                    <option value="+44">+44 (UK)</option>
                                    <option value="+61">+61 (Australia)</option>
                                    <option value="+81">+81 (Japan)</option>
                                </select>
                                <div className="h-5 mt-1">
                                    {errors.countryCode && (
                                        <span className="text-red-500 text-sm">
                                            {errors.countryCode.message}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col w-2/3">
                                <label htmlFor="mobileNumber" className="font-medium mb-2">
                                    Mobile Number
                                </label>
                                <input
                                    id="mobileNumber"
                                    type="text"
                                    {...register('mobileNumber', {
                                        required: 'Mobile number is required',
                                        pattern: {
                                            value: /^[0-9]{10}$/,
                                            message: 'Enter a valid 10-digit mobile number',
                                        },
                                    })}
                                    placeholder="Enter your mobile number"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <div className="h-5 mt-1">
                                    {errors.mobileNumber && (
                                        <span className="text-red-500 text-sm">
                                            {errors.mobileNumber.message}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`w-full px-4 py-2 bg-orange-400 text-white font-semibold rounded-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-rose-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span>Sending OTP...</span>
                            ) : (
                                'Submit'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditMobileNumber;
