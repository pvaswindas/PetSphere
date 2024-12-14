import React, { useState } from "react";
import PasswordInput from "../../forms/PasswordInput";
import Button from "../../forms/Button";
import GoogleButton from "./GoogleButton";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setEmail } from "../../../redux/slices/ProfileSlice"
import EmailInput from "../../forms/EmailInput";

function SignUpFormPanel() {
    const [formData, setFormData] = useState({
        password: '',
        email: '',
    });

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
            const response = await axios.post(`${apiBaseUrl}accounts/user-data-store/`, {
                user_data: formData,
                email: formData.email,
            });
            if (response.status === 201) {
                dispatch(setEmail(formData.email));
                const response_otp = await axios.post(`${apiBaseUrl}accounts/sendotp/`, {
                    email: formData.email,
                });
                if (response_otp.status === 200) {
                    navigate('/signup/otp');
                } else {
                    setError('Failed to send OTP, please try again.');
                }
            } else {
                setError("Failed to create account, please try again.");
            }
        } catch (error) {
            setError("An error occurred. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };
    

    return (
        <div className="w-full h-90 p-6 flex flex-col justify-center items-center">
            {/* Form Wrapper */}
            <form onSubmit={handleSubmit} className="space-y-4 w-full lg:w-3/4 ">
                {/* Heading Section */}
                <div className="items-left">
                    <h1 className="text-2xl text-labelGreen lg:text-4xl font-bold mt-4 lg:mt-6">Create an Account</h1>
                    <h4 className="text-lightGreen mb-4 lg:mb-9">Sign up to get started</h4>
                </div>

                {/* Email Input */}
                <EmailInput 
                    label="Email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(value) => handleChange('email', value)}
                    errorMessage="Email is required"
                />

                {/* Password Input */}
                <PasswordInput
                    label="Password"
                    id="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(value) => handleChange("password", value)}
                />

                {/* Error Message */}
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                {/* Submit Button */}
                <Button
                    type="submit"
                    text="Sign Up"
                    isLoading={isLoading}
                    loadingText="Creating account..."
                    className="w-full"
                />

                {/* Login Link */}
                <div className="flex justify-center mt-4">
                    <p className="text-sm text-lightGreen text-center">
                        Already have an account?{" "}
                        <a href="/login" className="text-labelGreen hover:text-lightGreen font-semibold">
                            Log In
                        </a>
                    </p>
                </div>

                <GoogleButton />

            </form>
        </div>
    );
}

export default SignUpFormPanel;
