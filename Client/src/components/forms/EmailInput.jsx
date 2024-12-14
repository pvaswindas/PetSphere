import React, { useState } from "react";
import * as Yup from "yup";

function EmailInput({
    label = "Email",
    id = "email",
    name = "email",
    placeholder = "Enter your email address",
    borderRadius = "rounded-full",
    labelColor = "text-labelGreen",
    borderColor = "focus:ring-borderGreen",
    mainBackground = "bg-white",
    focusBorderColor = "focus:ring-borderGreen",
    errorMessage = "Invalid email address",
    textColor = "text-labelGreen",
    value = "",
    margin = "my-3",
    onChange,
}) {
    const [isValid, setIsValid] = useState(true);
    const [errorText, setErrorText] = useState("");

    const emailValidationSchema = Yup.string()
        .required("Email is required")
        .email("Enter a valid email address");

    const handleChange = async (e) => {
        const inputValue = e.target.value;

        try {
            await emailValidationSchema.validate(inputValue);
            setIsValid(true);
            setErrorText("");
        } catch (err) {
            setIsValid(false);
            setErrorText(err.message);
        }

        onChange(inputValue);
    };

    return (
        <div className={`flex flex-col space-y-2 ${margin}`}>
            <label htmlFor={id} className={`text-sm font-medium ${labelColor}`}>
                {label}
            </label>
            <input
                type="email"
                id={id}
                name={name}
                placeholder={placeholder}
                value={value}
                autoComplete="off"
                onChange={handleChange}
                className={`px-4 py-2 ${borderColor} ${borderRadius} ${textColor} ${mainBackground} shadow-sm focus:outline-none
                    focus:ring-1 ${focusBorderColor} ${!isValid ? "border-red-700" : ""}`}
            />
            {/* Error message when validation fails */}
            {!isValid && (
                <p className="text-sm text-red-700">{errorText || errorMessage}</p>
            )}
        </div>
    );
}

export default EmailInput;
