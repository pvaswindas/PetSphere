import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import AlertSnackbar from '../../Snackbar/AlertSnackbar';
import Button from '../../forms/Button';
import axios from 'axios';

function ForgotPasswordForm() {
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarAlertType, setSnackbarAlertType] = useState("error");
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        const currentSearch = window.location.search
        const reset_password_url = localStorage.getItem('reset_password_url')
        if (!reset_password_url || reset_password_url !== currentSearch) {
            navigate('/')
        }
    })

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError
    } = useForm()

    const onSubmit = async (data) => {
        const { password, confirm_password } = data;

        if (password !== confirm_password) {
            setSnackbarMessage("Passwords do not match");
            setSnackbarOpen(true);
            setError("confirm_password", {
                type: "manual",
                message: "Passwords do not match"
            });
            return;
        }

        const params = new URLSearchParams(window.location.search);
        const uid = params.get('uid');
        const token = params.get('token')

        const payload = {
            uid: uid,
            token: token,
            new_password: password
        }

        try {
            setIsLoading(true)

            const baseUrl = process.env.REACT_APP_API_BASE_URL
            const endpoint = "accounts/reset-password/"
            const url = `${baseUrl}${endpoint}`

            const response = await axios.post(url, payload)

            if (response.status === 200) {
                setSnackbarMessage("Password reset successful!");
                setSnackbarAlertType("success");
                setSnackbarOpen(true);
                setTimeout(() => {
                    navigate("/login");
                    localStorage.removeItem("reset_password_url");
                }, 3000);
            } else if (response.status === 408) {
                console.log("TIMEOUT");
                setSnackbarMessage("Reset Password Link Expired!");
                setSnackbarAlertType("error");
                setSnackbarOpen(true);
                setTimeout(() => {
                    navigate("/login");
                    localStorage.removeItem("reset_password_url");
                }, 3000);
            }            
        } catch (error) {
            if (error.status === 408) {
                console.log("TIMEOUT");
                setSnackbarMessage("Reset Password Link Expired!");
                setSnackbarAlertType("error");
                setSnackbarOpen(true);
                setTimeout(() => {
                    navigate("/login");
                    localStorage.removeItem("reset_password_url");
                }, 3000);
            }        
        } finally {
            setTimeout(() => {
                setIsLoading(false)
            }, 3000);
        }
    }

    return (
        <div className="w-full h-full p-6 flex flex-col justify-center items-center">
            <AlertSnackbar 
                open={snackbarOpen}
                message={snackbarMessage}
                alert_type={snackbarAlertType}
                onClose={() => setSnackbarOpen(false)}
            />
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full lg:w-3/4">
                <div className="items-left">
                    <h1 className="text-2xl text-labelGreen lg:text-4xl font-bold mt-4 lg:mt-6">Reset Password</h1>
                    <h4 className="text-lightGreen mb-4 lg:mb-9">Sign in to your account</h4>
                </div>
                <div className='flex flex-col space-y-4'>
                    <div className='flex flex-col gap-2'>
                        <input
                            type="text"
                            id='username'
                            name="username"
                            autoComplete="username"
                            style={{ display: "none" }}
                        />

                        <label htmlFor="password" className='text-sm font-medium text-labelGreen'>New Password</label>
                        <input 
                            id='password'
                            type="password"
                            placeholder='Enter New Password'
                            autoComplete="new-password"
                            className='p-2 rounded-full text-labelGreen bg-white
                                        shadow-sm focus:outline-none focus:ring-1 focus:ring-borderGreen'
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least 8 characters long",
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                    message: "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
                                }
                            })}
                        /> 
                        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label htmlFor="confirm_password" className='text-sm font-medium text-labelGreen'>Confirm New Password</label>
                        <input 
                            id='confirm_password'
                            type="password"
                            placeholder='Confirm New Password'
                            autoComplete="new-password"
                            className='p-2 rounded-full text-labelGreen bg-white
                                        shadow-sm focus:outline-none focus:ring-1 focus:ring-borderGreen'
                            {...register("confirm_password", {
                                required: "Password confirmation is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least 8 characters long",
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                    message: "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
                                }
                            })}
                        />
                        {errors.confirm_password && <p className="text-red-500">{errors.confirm_password.message}</p>}
                    </div>
                    <Button
                        type="submit"
                        text="Reset Password"
                        isLoading={isLoading}
                        loadingText="Logging in..."
                        className="w-full"
                    />
                </div>
            </form>
        </div>
    )
}

export default ForgotPasswordForm
