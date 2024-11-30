import React, { useState } from "react";
import OtpInput from "../../forms/OtpInput";
import Button from "../../forms/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthData } from "../../../redux/slices/authSlice";

function OtpVerification() {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const email = useSelector((state) => state.auth.email)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
            const verify_response = await axios.post(`${apiBaseUrl}accounts/verifyotp/`, {
                email: email,
                otp: otp,
            });
            
            if (verify_response.status === 200) {
                const reg_response = await axios.post(`${apiBaseUrl}accounts/register/`, {
                    email: email,
                });
                if (reg_response.status === 201) {
                    const { access, refresh, user } = reg_response.data;
                    dispatch(setAuthData({
                        user_data: user,
                        email: email,
                    }));
                    localStorage.setItem('access_token', access);
                    localStorage.setItem('refresh_token', refresh);
                    localStorage.setItem('user', JSON.stringify(user));
                    navigate('/feed');
                } else {
                    setError("Registration failed. Please try again.");
                }
            } else {
                setError("OTP verification failed. Please check your OTP.");
            }
        } catch (error) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };
    


    return (
        <div className="w-full h-full p-6 flex flex-col justify-center items-center">
                {/* Form Section */}
                <form onSubmit={handleSubmit} className="w-full lg:w-3/4">
                    {/* Header Section */}
                    <div className="items-left">
                        <h1 className="text-2xl text-labelGreen lg:text-4xl font-bold mt-4 lg:mt-6">
                            Verify OTP
                        </h1>
                        <h4 className="text-lightGreen mt-2 mb-4 lg:mb-9">
                            Enter the 6-digit OTP sent to your registered email address to verify your account.
                        </h4>
                    </div>
                    <OtpInput length={6} onChange={(value) => setOtp(value)} />
                    
                    {/* Error Message */}
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <Button
                        type="submit"
                        text="Verify OTP"
                        isLoading={isSubmitting}
                        loadingText="Verifying..."
                        backgroundColor="bg-labelGreen"
                        hoverBackgroundColor="hover:bg-hoverGreen"
                        disabled={otp.length !== 6 || isSubmitting}
                        className="w-full"
                    />
                </form>
        </div>
    );
}

export default OtpVerification;
