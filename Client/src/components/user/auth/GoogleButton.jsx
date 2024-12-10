import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setEmail, setProfile } from "../../../redux/slices/ProfileSlice";

function GoogleButton() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleLoginSuccess = async (response) => {
        try {
            const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
            const { credential } = response;
    
            const result = await axios.post(`${apiBaseUrl}accounts/google-login/`, { token: credential });
    
            const { access, refresh, profile, email } = result.data;
    
            localStorage.setItem('ACCESS_TOKEN', access);
            localStorage.setItem('REFRESH_TOKEN', refresh);
            dispatch(setProfile({ profile_data: profile }));
            dispatch(setEmail(email))
    
            navigate('/profile/');
        } catch (error) {
            console.error('Login failed:', error);
            alert("Login failed.");
        }
    };    

    const handleLoginFailure = (error) => {
        console.error("Google login failed:", error);
    };

    return (
        <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginFailure}
            useOneTap
        >
        </GoogleLogin>
    );
}

export default GoogleButton;
