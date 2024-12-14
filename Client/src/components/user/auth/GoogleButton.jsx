import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setEmail, setProfile } from "../../../redux/slices/ProfileSlice";
import AlertSnackbar from "../../Snackbar/AlertSnackbar";

function GoogleButton() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

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
            setSnackbarMessage("Login Failed, Please try again")
            setSnackbarOpen(true)
        }
    };    

    const handleLoginFailure = (error) => {
        setSnackbarMessage("Google Login Failed, Please try again")
        setSnackbarOpen(true)
    };
    return (
        <div>
            <AlertSnackbar 
                open={snackbarOpen}
                message={snackbarMessage}
                alert_type="error"
                onClose={() => setSnackbarOpen(false)}
            />

            <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginFailure}
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                useOneTap
                shape="pill"
            >
            </GoogleLogin>
        </div>
        
    );
}

export default GoogleButton;
