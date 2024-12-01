import React, { useState } from "react";
import OtpInput from "../../forms/OtpInput";
import Button from "../../forms/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function OtpVerification() {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const navigate = useNavigate();
    const email = useSelector((state) => state.auth.email);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");
        setSuccessMessage("");
        try {
            const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
            const verify_response = await axios.post(`${apiBaseUrl}accounts/verifyotp/`, {
                email,
                otp,
            });

            if (verify_response.status === 200) {
                navigate('/signup/username/');
            } else {
                setError("OTP verification failed. Please check your OTP.");
            }
        } catch (error) {
            console.error("OTP verification error:", error.response || error);
            setError(error.response?.data?.error || "An unexpected error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendOtp = async () => {
        setIsResending(true);
        setError("");
        setSuccessMessage("");
        try {
            const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
            const resend_response = await axios.post(`${apiBaseUrl}accounts/resendotp/`, { email });

            if (resend_response.status === 200) {
                setSuccessMessage("OTP resent successfully. Please check your email.");
            } else {
                setError("Failed to resend OTP. Please try again.");
            }
        } catch (error) {
            console.error("OTP resend error:", error.response || error);
            setError(error.response?.data?.error || "An unexpected error occurred. Please try again.");
        } finally {
            setIsResending(false);
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

                {/* Success Message */}
                {successMessage && <p className="text-labelGreen text-sm text-center">{successMessage}</p>}

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

                {/* Resend OTP Section */}
                <p className="text-sm text-center mt-4">
                    Didn't receive the OTP?{" "}
                    <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isResending}
                        className="text-labelGreen hover:underline disabled:text-gray-400"
                    >
                        {isResending ? "Resending..." : "Resend OTP"}
                    </button>
                </p>
            </form>
        </div>
    );
}

export default OtpVerification;
