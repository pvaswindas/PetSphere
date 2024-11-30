import React, { useState } from "react";
import Button from "../../forms/Button";
import TextFieldInput from "../../forms/TextInput";

function CreateUsernameForm() {
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateUsername = (username) => {
        if (username.length < 3) {
        return "Username must be at least 3 characters long.";
        }
        if (username.length > 15) {
        return "Username must not exceed 15 characters.";
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return "Username can only contain letters, numbers, and underscores.";
        }
        return "";
    };

    // Check if the username meets all the expectations
    const isFormValid = () => {
        return !validateUsername(username.trim());
    };

    const handleChange = (value) => {
        setUsername(value);
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateUsername(username.trim());
        if (validationError) {
        setError(validationError);
        return;
        }

        setIsSubmitting(true);
        try {
        console.log("Username submitted:", username);

        const isUsernameAvailable = await mockCheckUsernameAvailability(username);
        if (!isUsernameAvailable) {
            setError("Username is already taken. Please choose another.");
            return;
        }

        console.log("Username successfully created:", username);
        } catch (err) {
        setError("An unexpected error occurred. Please try again.");
        } finally {
        setIsSubmitting(false);
        }
    };

    const mockCheckUsernameAvailability = async (username) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return username !== "taken";
    };

    return (
        <div className="w-full h-full p-6 flex flex-col justify-center items-center">
        <form onSubmit={handleSubmit} className="w-full lg:w-3/4">
            {/* Header Section */}
            <div className="text-left">
            <h1 className="text-2xl text-labelGreen lg:text-4xl font-bold mt-4 lg:mt-6">
                Create Your Username
            </h1>
            <h4 className="text-lightGreen mt-2 mb-4 lg:mb-9">
                Please choose a unique username for your account.
            </h4>
            </div>

            {/* Username Input */}
            <TextFieldInput
            label="Username"
            id="username"
            name="username"
            placeholder="Enter your username"
            value={username}
            onChange={(value) => handleChange(value)}
            errorMessage={error}
            />

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

            {/* Submit Button */}
            <Button
            type="submit"
            text="Continue"
            isLoading={isSubmitting}
            loadingText="Creating..."
            backgroundColor="bg-labelGreen"
            hoverBackgroundColor="hover:bg-hoverGreen"
            disabled={!isFormValid() || isSubmitting}
            className="w-full mt-4"
            />
        </form>
        </div>
    );
}

export default CreateUsernameForm;
