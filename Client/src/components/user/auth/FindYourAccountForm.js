import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import AlertSnackbar from '../../Snackbar/AlertSnackbar';
import axios from 'axios';

function FindYourAccountForm() {
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarAlertType, setSnackbarAlertType] = useState("error");
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        const input = data.email_username;
        const isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(input);

        const payload = isEmail
            ? { email: input }
            : { username: input }

        try {
            setIsLoading(true);

            const baseUrl = process.env.REACT_APP_API_BASE_URL
            const endpoint = "accounts/find-account/"
            const url = `${baseUrl}${endpoint}`
            const response = await axios.post(url, JSON.stringify(payload))

            if (response.status === 200) {
                setIsLoading(false)
                const reset_password_url = response.data.reset_password_url
                localStorage.setItem('reset_password_url', reset_password_url)
                setSnackbarMessage("Account found, Check email for reset password link!");
                setSnackbarAlertType("success");
                setSnackbarOpen(true);
            } else {
                setIsLoading(false)
                setSnackbarMessage("Unable to find account");
                setSnackbarAlertType("error");
                setSnackbarOpen(true);
            }
        } catch (error) {
            if (error.status === 404) {
                setIsLoading(false)
                setSnackbarMessage("Unable to find account");
                setSnackbarAlertType("error");
                setSnackbarOpen(true);
            } else {
                setSnackbarMessage("An error occurred");
                setSnackbarAlertType("error");
                setSnackbarOpen(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

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
                    <h1 className="text-2xl text-labelGreen lg:text-4xl font-bold mt-4 lg:mt-6">Find Your Account</h1>
                    <h4 className="text-lightGreen mb-4 lg:mb-9">Enter your email address or username</h4>
                </div>
                <div className='flex flex-col space-y-4'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="email_username" className='text-sm font-medium text-labelGreen'>Email or Username</label>
                        <input 
                            id='email_username'
                            type="text"
                            placeholder='Enter your email or username'
                            className='p-2 rounded-full text-labelGreen bg-white
                                        shadow-sm focus:outline-none focus:ring-1 focus:ring-borderGreen'
                            {...register("email_username", {
                                required: "Email or Username is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9_]+$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Please enter a valid email or username"
                                }
                            })}
                        />
                        {errors.email_username && <p className="text-red-500">{errors.email_username.message}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full p-2 bg-labelGreen text-white rounded-full hover:bg-hoverGreen focus:outline-none"
                        disabled={isLoading}
                    >
                        {isLoading ? "Verifying..." : "Next"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default FindYourAccountForm;
