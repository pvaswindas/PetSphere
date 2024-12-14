import React, { useState } from 'react'
import PasswordInput from '../../forms/PasswordInput'
import TextFieldInput from '../../forms/TextInput'
import Button from '../../forms/Button'
import symbolLogo from "../../../assets/logo/symbol-logo.png"
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setEmail, setProfile } from '../../../redux/slices/ProfileSlice'
import AlertSnackbar from '../../Snackbar/AlertSnackbar'

const LoginForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!formData.username || !formData.password) {
            setSnackbarMessage("Username and password are required.");
            setSnackbarOpen(true)
            return;
        }
    
        try {
            setIsLoading(true);
            const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
            const response = await axios.post(`${apiBaseUrl}accounts/login/`, formData);

            if (response.status === 400) {
                setSnackbarMessage("Invalid credentials for a staff account.")
                setSnackbarOpen(true)
                return
            }
    
            const { access, refresh, profile } = response.data;
            if (!profile.user.is_staff) {
                setSnackbarMessage("Invalid credentials for a staff account.");
                setSnackbarOpen(true)
                return
            } else {
                localStorage.setItem('ACCESS_TOKEN', access);
                localStorage.setItem('REFRESH_TOKEN', refresh);
                dispatch(setProfile({ profile_data : profile }));
                dispatch(setEmail({ email: profile.user.email }));
                navigate('/admin')
            }
        } catch (err) {
            setSnackbarMessage("Login failed. Please try again.");
            setSnackbarOpen(true)
            return
        } finally {
            setIsLoading(false);
        }
    }

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };


    return (
        <div className="flex items-center w-full py-10 justify-center">
            <AlertSnackbar 
                open={snackbarOpen}
                message={snackbarMessage}
                alert_type="error"
                onClose={() => setSnackbarOpen(false)}
            />

            <div className="bg-blackOpacity30 p-6 rounded-2xl shadow-lg w-full max-w-sm sm:py-6 md:w-2/3">
                <div className="flex flex-col items-center">
                    <img src={symbolLogo} alt="Symbol Logo" className="w-24"/>
                    <h2 className="text-lg font-semibold text-white text-center">PetSphere Admin Login</h2>
                    <p className="font-light text-sm text-whiteOpacity05">Connect and manage platform responsibilities</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <TextFieldInput 
                        borderRadius="rounded-md"
                        labelColor="text-white"
                        borderColor="focus:ring-borderGreen"
                        mainBackground="bg-blackOpacity30"
                        focusBorderColor="focus:ring-borderGreen"
                        validationPattern={/.+/}
                        errorNull={true}
                        errorMessage="This field is required"
                        textColor="text-whiteOpacity05"
                        value={formData.username}
                        margin="my-5"
                        onChange={(value) => handleChange('username', value)}
                    />

                    <PasswordInput 
                        borderRadius="rounded-md"
                        mainBackground="bg-blackOpacity30"
                        labelColor="text-white"
                        borderColor="border-gray-300"
                        textColor="text-whiteOpacity05"
                        focusBorderColor="focus:ring-borderGreen"
                        validationPattern={/.{8,}/}
                        errorMessage="Password must be at least 8 characters"
                        value={formData.password}
                        margin="my-5"
                        onChange={(value) => handleChange("password", value)}
                    />


                    <Button 
                        type="submit"
                        text={isLoading ? "Logging in..." : "Login"}
                        isLoading={isLoading}
                        textColor="text-white"
                        rounded="rounded-md"
                        paddingx="px-4"
                        paddingy="py-2"
                        className="w-full my-8"
                        backgroundColor="bg-blackOpacity40"
                        isLoadingBackground="bg-blackOpacity30"
                        hoverBackgroundColor="hover:bg-blackOpacity30"
                    />
                </form>
            </div>
        </div>
    )
}

export default LoginForm
