import React, { useState } from "react";
import TextFieldInput from "../../forms/TextInput";
import PasswordInput from "../../forms/PasswordInput";
import Button from "../../forms/Button";
import GoogleButton from "./GoogleButton";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setEmail, setProfile } from "../../../redux/slices/ProfileSlice";
import { useDispatch } from "react-redux";
import AlertSnackbar from "../../Snackbar/AlertSnackbar";

function LoginFormPanel() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };


    const isFormValid = 
        formData.username.trim().length >= 3 && 
        formData.password.length >= 8;

    const handleLogin = async (e) => {
        e.preventDefault();
        setSnackbarMessage('');
        setIsLoading(true);
    
        try {
            const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
            const response = await axios.post(`${apiBaseUrl}accounts/login/`, formData);
    
            const { access, refresh, profile } = response.data;
    
            if (profile.user.is_staff) {
                setSnackbarMessage("Invalid credentials");
                setSnackbarOpen(true);
                return;
            } else {
                localStorage.setItem('ACCESS_TOKEN', access);
                localStorage.setItem('REFRESH_TOKEN', refresh);
                dispatch(setProfile({ profile_data: profile }));
                dispatch(setEmail({ email: profile.user.email }));
    
                navigate('/feed');
            }
        } catch (error) {
            let message = "Login Failed, Please try again";

            if (error.response) {
                const { status, data } = error.response;

                if (status === 400) {
                    message = "Invalid credentials";
                } else if (status === 403) {
                    if (data.error.includes("pending approval")) {
                        message = "Your account is pending approval.";
                    } else if (data.error.includes("suspended")) {
                        message = "Your account has been suspended.";
                    } else if (data.error.includes("deactivated")) {
                        message = "Your account has been deactivated.";
                    } else {
                        message = "Access denied.";
                    }
                } else {
                    message = "An unexpected error occurred. Please try again.";
                }
            } else if (error.message.includes("Network Error")) {
                message = "Network error. Please check your connection.";
            }

            setSnackbarMessage(message);
    
            setSnackbarOpen(true);
        } finally {
            setIsLoading(false);
        }
    };        

    return (
        <div className="w-full h-full p-6 flex flex-col justify-center items-center">
            <AlertSnackbar 
                open={snackbarOpen}
                message={snackbarMessage}
                alert_type="error"
                onClose={() => setSnackbarOpen(false)}
            />

            <form onSubmit={handleLogin} className="space-y-4 w-full lg:w-3/4">
                <div className="items-left">
                    <h1 className="text-2xl text-labelGreen lg:text-4xl font-bold mt-4 lg:mt-6">Welcome Back!</h1>
                    <h4 className="text-lightGreen mb-4 lg:mb-9">Sign in to your account</h4>
                </div>

                <TextFieldInput
                    label="Username"
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={(value) => handleChange('username', value)}
                    errorMessage="Username is required"
                />

                <PasswordInput
                    label="Password"
                    id="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(value) => handleChange("password", value)}
                />

                <div className="flex justify-end">
                    <a href="/find-your-account" className="text-lightGreen hover:text-labelGreen text-sm">
                        Forgot Password?
                    </a>
                </div>


                <Button
                    type="submit"
                    text="Login"
                    isLoading={isLoading}
                    loadingText="Logging in..."
                    className="w-full"
                    disabled={!isFormValid}
                />

                <div className="flex items-center justify-center space-x-2">
                    <span className="h-px w-1/2 bg-lineGreen"></span>
                    <span className="text-lineTextGreen">OR</span>
                    <span className="h-px w-1/2 bg-lineGreen"></span>
                </div>

                <GoogleButton />

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
