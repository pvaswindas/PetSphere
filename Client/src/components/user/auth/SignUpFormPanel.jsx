import React, { useState } from "react";
import TextFieldInput from "../../forms/TextInput";
import PasswordInput from "../../forms/PasswordInput";
import Button from "../../forms/Button";
import GoogleButton from "./GoogleButton";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SignUpFormPanel() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
    });

    const navigate = useNavigate()

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
            const response = await axios.post('http://localhost:8000/api/accounts/register/', formData);

            const { access, refresh, user } = response.data;

            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('user', JSON.stringify(user));
            navigate('/feed')
            
        } catch (error) {
            const errorMsg = error.response?.data?.detail || 'Failed to sign up. Please try again.';
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full h-full p-6 flex flex-col justify-center items-center">
            {/* Form Wrapper */}
            <form onSubmit={handleSubmit} className="space-y-4 w-full lg:w-3/4 ">
                {/* Heading Section */}
                <div className="items-left">
                    <h1 className="text-2xl text-labelGreen lg:text-4xl font-bold mt-4 lg:mt-6">Create an Account</h1>
                    <h4 className="text-lightGreen mb-4 lg:mb-9">Sign up to get started</h4>
                </div>
                
                {/* Username Input */}
                <TextFieldInput
                    label="Username"
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={(value) => handleChange('username', value)}
                    errorMessage="Username is required"
                />

                {/* Email Input */}
                <TextFieldInput
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
