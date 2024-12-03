import React, { useState } from "react"
import Button from "../../forms/Button"
import TextFieldInput from "../../forms/TextInput"
import { checkUsername } from "../../../utils/checkUsername"
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { setAuthData } from "../../../redux/slices/authSlice"
import { setProfile } from "../../../redux/slices/ProfileSlice"
import { useNavigate } from 'react-router-dom'

function CreateUsernameForm() {
    const [username, setUsername] = useState("")
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(null)

    const email = useSelector((state) => state.auth.email)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const validateUsername = (username) => {
        if (username.length < 3) {
            return "Username must be at least 3 characters long"
        }
        if (username.length > 15) {
            return "Username must not exceed 15 characters"
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return "Username can only contain letters, numbers, and underscores"
        }
        return ""
    }

    const handleChange = async (value) => {
        setUsername(value)
        setError("")
        setIsUsernameAvailable(null)

        const validationError = validateUsername(value.trim())
        if (validationError) {
            setError(validationError)
            return
        }

        try {
            const data = await checkUsername(value.trim())
            setIsUsernameAvailable(data.available)
        } catch (err) {
            setError(err.message)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const validationError = validateUsername(username.trim())
        if (validationError) {
            setError(validationError)
            return
        }

        if (!isUsernameAvailable) {
            setError("The username is unavailable. Please choose another")
            return
        }

        setIsSubmitting(true)
        try {
            const apiBaseUrl = process.env.REACT_APP_API_BASE_URL
            const reg_response = await axios.post(`${apiBaseUrl}accounts/register/`, {
                email: email,
                username: username.trim(),
            })

            if (reg_response.status === 201) {
                const { access, refresh, user, profile } = reg_response.data
                dispatch(setAuthData({ user_data: user }))
                dispatch(setProfile({ profile_data: profile }))

                localStorage.setItem('ACCESS_TOKEN', access)
                localStorage.setItem('REFRESH_TOKEN', refresh)
                navigate('/profile')
                
            } else {
                setError("Registration failed. Please try again.")
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="w-full h-full p-6 flex flex-col justify-center items-center">
            <form onSubmit={handleSubmit} className="w-full lg:w-3/4">
                <div className="text-left">
                    <h1 className="text-2xl text-labelGreen lg:text-4xl font-bold mt-4 lg:mt-6">
                        Create Your Username
                    </h1>
                    <h4 className="text-lightGreen mt-2 mb-4 lg:mb-9">
                        Please choose a unique username for your account
                    </h4>
                </div>

                <TextFieldInput
                    label="Username"
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(value) => handleChange(value)}
                    errorMessage={null}
                />

                {/* Availability Status */}
                {isUsernameAvailable === true && (
                    <p className="text-green-500 text-sm text-center mt-2">Username is available!</p>
                )}
                {isUsernameAvailable === false && (
                    <p className="text-red-500 text-center text-sm mt-2">Username is unavailable</p>
                )}

                {/* Error Messages */}
                {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

                <Button
                    type="submit"
                    text="Continue"
                    isLoading={isSubmitting}
                    loadingText="Creating..."
                    backgroundColor="bg-labelGreen"
                    hoverBackgroundColor="hover:bg-hoverGreen"
                    disabled={!username.trim() || isSubmitting || !isUsernameAvailable}
                    className="w-full mt-4"
                />
            </form>
        </div>
    )
}

export default CreateUsernameForm
