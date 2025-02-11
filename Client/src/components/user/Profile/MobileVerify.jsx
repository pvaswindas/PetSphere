import React, { useState, useEffect } from 'react';
import AlertSnackbar from '../../Snackbar/AlertSnackbar';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../../axios/axiosinstance';
import { useDispatch } from 'react-redux';
import { setProfile } from '../../../redux/slices/ProfileSlice';

function MobileVerify() {
    const [resendTimer, setResendTimer] = useState(() => {
        const savedResendTime = localStorage.getItem('resendTime');
        if (savedResendTime) {
            const remainingTime = Math.max(0, Math.floor((parseInt(savedResendTime, 10) - Date.now()) / 1000));
            return remainingTime;
        }
        return 0;
    });
    const [canResend, setCanResend] = useState(resendTimer === 0);

    const navigate = useNavigate();
    const dispatch = useDispatch()

    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const phoneData = JSON.parse(localStorage.getItem('mobileNumber'));

    const { register, handleSubmit, formState: { errors } } = useForm();

    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => {
                const savedResendTime = localStorage.getItem('resendTime');
                const remainingTime = Math.max(0, Math.floor((parseInt(savedResendTime, 10) - Date.now()) / 1000));
                setResendTimer(remainingTime);

                if (remainingTime === 0) {
                    setCanResend(true);
                    localStorage.removeItem('resendTime');
                }
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    useEffect(() => {
        if (!phoneData) {
            navigate('/profile/edit');
        }
    }, [phoneData, navigate]);

    const handleResendOtp = async () => {
        if (canResend) {
            setIsResending(true);

            try {
                const response = await axiosInstance.post('accounts/verify-phone-number/', phoneData);
                if (response.status === 200) {
                    const twoMinutesInMilliseconds = 2 * 60 * 1000;
                    const newResendTime = Date.now() + twoMinutesInMilliseconds;

                    setResendTimer(120);
                    setCanResend(false);
                    localStorage.setItem('resendTime', newResendTime.toString());
                }
            } catch (error) {
                setSnackbarMessage("Unable to process your request right now.");
                setSnackbarOpen(true);
            } finally {
                setIsResending(false);
            }
        }
    };

    const handleVerify = async (data) => {
        if (!data.otp || data.otp.length !== 6) {
            setSnackbarMessage('Please enter a valid 6-digit OTP');
            setSnackbarOpen(true);
            return;
        }

        const updatedData = {
            ...phoneData,
            otp: data.otp
        };

        setIsVerifying(true);

        try {
            const response = await axiosInstance.post('/accounts/verify-mobile-otp/', updatedData);
            if (response.status === 200) {
                const { profile } = response.data
                dispatch(setProfile({ profile_data: profile }));
                navigate('/profile/edit');
                localStorage.removeItem('mobileNumber')
                localStorage.removeItem('resendTime')
                localStorage.removeItem('resendStartTime')
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setSnackbarMessage('Invalid OTP!');
            } else {
                setSnackbarMessage('Unable to verify!');
            }
            setSnackbarOpen(true);
        } finally {
            setIsVerifying(false);
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
            <div className="flex flex-col md:flex-row w-full bg-white lg:shadow-lg lg:rounded-lg overflow-hidden">
                <div className="md:w-1/2 bg-ad-preview-gradient text-white p-6 flex flex-col justify-center">
                    <h2 className="text-2xl font-bold mb-4">Mobile Verification</h2>
                    <p>To complete the verification process, please enter the OTP sent to your mobile number.</p>
                </div>
                <div className="w-full md:w-1/2 p-6 flex flex-col justify-between flex-grow">
                    <form onSubmit={handleSubmit(handleVerify)} className="flex flex-col h-full">
                        <div className='flex-grow'>
                            <h3 className="text-xl font-semibold mb-4">Enter OTP</h3>
                            <input
                                type="text"
                                maxLength="6"
                                {...register('otp', { required: 'OTP is required', minLength: { value: 6, message: 'OTP must be 6 digits' }, maxLength: { value: 6, message: 'OTP must be 6 digits' } })}
                                placeholder="Enter 6-digit OTP"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.otp && <span className="text-red-500 text-sm">{errors.otp.message}</span>}
                        </div>
                        <div>
                            <button
                                type="submit"
                                className={`w-full mt-4 px-4 py-2 bg-orange-400 text-white font-semibold rounded-lg hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isVerifying ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isVerifying}
                            >
                                {isVerifying ? 'Verifying...' : 'Verify'}
                            </button>
                            <button
                                onClick={handleResendOtp}
                                className={`w-full mt-4 px-4 py-2 font-semibold rounded-lg focus:outline-none focus:ring-2 ${canResend ? 'bg-rose-500 text-white hover:bg-orange-400' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} ${isResending ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isResending || !canResend}
                            >
                                {isResending ? 'Resending...' : canResend ? `Resend OTP` : `Resend in ${resendTimer}s`}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default MobileVerify;
