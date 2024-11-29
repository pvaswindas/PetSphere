import React, { useState } from "react";
import OtpInput from "../../forms/OtpInput";
import Button from "../../forms/Button";

function OtpVerification() {
    const [otp, setOtp] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        console.log("Submitted OTP:", otp);
        setTimeout(() => setIsSubmitting(false), 2000);
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
