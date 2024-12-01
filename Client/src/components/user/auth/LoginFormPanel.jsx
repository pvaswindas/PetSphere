import React, { useState } from "react";
import TextFieldInput from "../../forms/TextInput";
import PasswordInput from "../../forms/PasswordInput";
import Button from "../../forms/Button";
import GoogleButton from "./GoogleButton";
import axios from "axios";

function LoginFormPanel() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

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
            const apiBaseUrl = process.env.REACT_APP_API_BASE_URL
            const response = await axios.post(`${apiBaseUrl}accounts/login/`, formData);

            const { access, refresh, user } = response.data;

            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('user', JSON.stringify(user));

            console.log('Logged in user : ', user);
        } catch (error) {
            const errorMsg = error.response?.data?.detail || 'Failed to login. Please try again.';
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
                    <h1 className="text-2xl text-labelGreen lg:text-4xl font-bold mt-4 lg:mt-6">Welcome Back!</h1>
                    <h4 className="text-lightGreen mb-4 lg:mb-9">Sign in to your account</h4>
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

                {/* Password Input */}
                <PasswordInput
                    label="Password"
                    id="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(value) => handleChange("password", value)}
                />

                {/* Forgot Password link */}
                <div className="flex justify-end">
                    <a href="/forgot-password" className="text-lightGreen hover:text-labelGreen text-sm">
                        Forgot Password?
                    </a>
                </div>

                {/* Error Message */}
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                {/* Submit Button */}
                <Button
                    type="submit"
                    text="Login"
                    isLoading={isLoading}
                    loadingText="Logging in..."
                    className="w-full"
                />

                {/* OR Separator */}
                <div className="flex items-center justify-center space-x-2">
                    <span className="h-px w-1/2 bg-lineGreen"></span>
                    <span className="text-lineTextGreen">OR</span>
                    <span className="h-px w-1/2 bg-lineGreen"></span>
                </div>

                <GoogleButton />

                {/* Sign Up Link */}
                <div className="flex justify-center">
                    <p className="text-sm text-lightGreen text-center">
                        Don’t have an account?{" "}
                        <a href="/signup" className="text-labelGreen hover:text-lightGreen font-semibold">
                            Sign Up
                        </a>
                    </p>
                </div>
            </form>
        </div>
    );
}

export default LoginFormPanel;
