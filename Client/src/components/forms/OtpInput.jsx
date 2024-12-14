import React, { useState } from "react";

function OtpInput({ length = 6, onChange }) {
    const [otp, setOtp] = useState(new Array(length).fill(""));

    const handleChange = (value, index) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        onChange(newOtp.join(""));

        if (value && index < length - 1) {
            document.getElementById(`otp-input-${index + 1}`).focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            document.getElementById(`otp-input-${index - 1}`).focus();
        }
    };

    return (
        <div className="flex justify-center space-x-2 mt-6 mb-6">
            {otp.map((digit, index) => (
                <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-10 h-10 text-center text-lg border border-gray-300 rounded focus:outline-none
                    focus:ring-2 focus:ring-hoverGreen sm:w-14 sm:h-14 md:w-15 md:h-15"
                    aria-label={`OTP input ${index + 1}`}
                />
            ))}
        </div>
    );
}

export default OtpInput;
