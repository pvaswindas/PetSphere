import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setEmail, setProfile } from "../../../redux/slices/ProfileSlice";
import AlertSnackbar from "../../Snackbar/AlertSnackbar";

function GoogleButton() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleLoginSuccess = async (response) => {
        try {
            const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
            const { credential } = response;

            const result = await axios.post(
                `${apiBaseUrl}accounts/google-login/`,
                { token: credential }
            );

            const { access, refresh, profile, email } = result.data;

            if (!email) {
                throw new Error("Email missing from response");
            }

            localStorage.setItem("ACCESS_TOKEN", access);
            localStorage.setItem("REFRESH_TOKEN", refresh);
            dispatch(setProfile({ profile_data: profile }));
            dispatch(setEmail(email));

            navigate("/feed");
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
        }
    };

    const handleLoginFailure = () => {
        setSnackbarMessage("Google Login Failed, Please try again");
        setSnackbarOpen(true);
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
            />
        </div>
    );
}

export default GoogleButton;
